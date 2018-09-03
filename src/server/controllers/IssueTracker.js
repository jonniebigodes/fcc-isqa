import 'babel-polyfill'
import express from 'express'
import Cache from 'memory-cache'
import mongoose from 'mongoose'
import {validationResult, query, param, body} from 'express-validator/check'
import logger from '../logger'

const IssueTrackerController = express.Router()

// #region model
/* eslint-disable */
const IssuesModel =
  process.env.NODE_ENV !== 'production'
    ? require('../models/Issues.model').default
    : require('./Issues.model').default
const ProjectIssuesModel =
  process.env.NODE_ENV !== 'production'
    ? require('../models/Projects.model').default
    : require('./Projects.model').default
const issuedatamodel = mongoose.model('issue')
const issueprojectmodel = mongoose.model('project_issue')
/* eslint-enable */
// #endregion

// #region middleware
IssueTrackerController.use((req, res, next) => {
  const sender = req.headers['x-forwarded-for'] || req.connection.remoteAddress
  logger.info(
    `issues date=>${new Date()}\n method=>${req.method}\n url=>${req.baseUrl}${
      req.path
    } sender:${sender === ':::1' ? 'localhost' : sender}`
  )
  next() // make sure we go to the next routes and don't stop here
})

IssueTrackerController.use(async (req, res, next) => {
  try {
    if (req.method==="GET"){
      logger.info(`updating issue cache=>${req.method}\n url=>${req.baseUrl}`)
      const itemscache = Cache.keys().filter(item => item.startsWith('issue_'))
      itemscache.map(item=>Cache.del(item))

      const allinfo = await Promise.all([
        issueprojectmodel.find({}),
        issuedatamodel.find({}).select('-__v')
      ])
      if (allinfo.length) {
        /* eslint-disable */
        const dataprojects = JSON.parse(JSON.stringify(allinfo[0]))
        const issuesdata = JSON.parse(JSON.stringify(allinfo[1]))
        dataprojects.map(item =>
          Cache.put(`issue_${item._id}`, {
            cachedtitle: item.title,
            cachedate: new Date(),
            cachedissues: issuesdata.filter(y=>y.project===item._id)
          })
        )
        /* eslint-enable */
      }
    }
    next()
  } catch (error) {
    logger.info(`IssueTracker issue get error: ${error}`)
    return res.status(500).json({message: 'Something really bad happened'})
    
  }
})
// #endregion

// #region cache items

IssueTrackerController.get('/icache', async (req, res) => {
  const itemscache = Cache.keys().filter(item => item.startsWith('issue_'))
  return res
    .status(200)
    .json({issuesdata: itemscache.map(item => Cache.get(item))})
})
// #endregion

// #region search multiple items db
/**
 * async fat arrow function to return data from db based on multiple items
 * @param {String} valueproject project id
 * @param {Object} valuereq  request query object
 * @returns {Array} result of the query
 * @throws {Error} with information of what happened
 */
const searchMultipleDb = async (valueproject, valuereq) => {
  try {
    const searchitems = Object.keys(valuereq).map(item => {
      if (item === 'open') {
        const isopen = valuereq.open === 'true'
        return {open: isopen}
      }
      if (item === 'issue_title') {
        return {issuetitle: valuereq[item]}
      }
      return {[item]: valuereq[item]}
    })
    const dbresults = await issuedatamodel
      .find(
        {project: valueproject},
        'issuecreated issuecreated open issuetitle text creator assigned status'
      )
      .or(searchitems)
    return dbresults
  } catch (error) {
    logger.info(`IssueTracker searchMultipleDb: ${error}`)
    throw new Error(`Search Multiple db error=>${error}`)
  }
}
// #endregion

// #region search single item db
/**
 * async fat arrow function to return data from db based on single items
 * @param {String} valueproject project id
 * @param {Object} valuereq Object containing the query object
 * @throws {Error} error with information
 * @returns {Object} with result of the query
 */
const searchSingleDb = async (valueproject, valuereq) => {
  try {
    if (valuereq.open) {
      const isopen = valuereq.open === 'true'
      return await issuedatamodel.find(
        {project: valueproject, open: isopen},
        'issuecreated issuecreated open issuetitle text creator assigned status'
      )
    }
    if (valuereq.issue_title) {
      return await issuedatamodel.find(
        {project: valueproject, issuetitle: valuereq.isopen},
        'issuecreated issuecreated open issuetitle text creator assigned status'
      )
    }

    return await issuedatamodel.find(
      {project: valueproject, valuereq},
      'issuecreated issuecreated open issuetitle text creator assigned status'
    )
  } catch (error) {
    logger.info(`IssueTracker searchSingleDb: ${error}`)
    throw new Error(`Search single db error=>${error}`)
  }
}
// #endregion

// #region search cached items
/**
 *  fat arrow function to filter the stored cached issues
 * @param {Number} valueKeys
 * @param {Object} valueitem cached items
 * @param {Object} valuereq query passed
 * @returns {Array} with the filtered information
 */
const searchCache = (valueKeys, valueitem, valuereq) => {
  const {cachedissues} = valueitem
  if (valueKeys === 0) {
    return cachedissues
  }
  if (valuereq.open) {
    const isopen = valuereq.open === 'true'
    return cachedissues.filter(x => x.open === isopen)
  }
  if (valuereq.issue_title) {
    return cachedissues.filter(x => x.issuetitle === valuereq.issue_title)
  }
  if (valuereq.creator) {
    return cachedissues.filter(x => x.creator === valuereq.creator)
  }
  if (valuereq.assigned) {
    return cachedissues.filter(x => x.assigned === valuereq.assigned)
  }
  if (valuereq.status) {
    return cachedissues.filter(x => x.status === valuereq.status)
  }
  return cachedissues
}
// #endregion

// #region issues route
IssueTrackerController.route('/:project')
  .get(
    [
      param('project')
        .exists()
        .isMongoId()
    ],
    async (req, res) => {
      try {
        const projectInfo = await issueprojectmodel.findById(req.params.project)
        if (!projectInfo) {
          return res
            .status(422)
            .json({message: 'provided project does not exist'})
        }

        const numKeys = Object.keys(req.query).length
        const cacheItem = Cache.get(`issue_${req.params.project}`)
        if (cacheItem) {
          if (numKeys < 2) {
            return res
              .status(200)
              .json({data: searchCache(numKeys, cacheItem, req.query)})
          }
        }
        if (numKeys === 0) {
          const allissues = await issuedatamodel
            .find({project: req.params.project})
            .select('-__v')
          if (allissues) {
            Cache.put(`issue_${req.params.project}`, {
              cachedtitle: projectInfo.title,
              cachedate: new Date(),
              cachedissues: JSON.parse(JSON.stringify(allissues))
            })
          }
          return res.status(200).json({data: allissues.length ? allissues : []})
        }
        let dbresult = []
        if (numKeys === 1) {
          dbresult = await searchSingleDb(req.params.project, req.query)
        }
        if (numKeys >= 2) {
          dbresult = await searchMultipleDb(req.params.project, req.query)
        }
        return res.status(200).json({data: dbresult})
      } catch (error) {
        logger.info(`IssueTracker issue get error: ${error}`)
        return res.status(500).json({message: 'Something really bad happened'})
      }
    }
  )
  .post(
    [
      param('project')
        .exists()
        .isMongoId(),
      body('issue_title').exists(),
      body('issue_text').exists(),
      body('created_by').exists()
    ],
    async (req, res) => {
      try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
          return res.status(422).json({errors: errors.array()})
        }
        const projectinfo = await issueprojectmodel.findById(req.params.project)
        if (!projectinfo) {
          return res
            .status(422)
            .json({message: 'provided project does not exist'})
        }
        const storeddata = await issuedatamodel.create({
          issuecreated: new Date(),
          issueupdated: new Date(),
          project: req.params.project,
          open: true,
          issuetitle: req.body.issue_title,
          text: req.body.issue_text,
          creator: req.body.created_by,
          assigned: req.body.assigned ? req.body.assigned : '',
          status: req.body.status ? req.body.status : ''
        })

        if (storeddata) {
          const itemCached = Cache.get(`issue_${req.params.project}`)
          if (itemCached) {
            Cache.del(`issue_${req.params.project}`)
          }
           /*eslint-disable */
          const newIssue = JSON.parse(JSON.stringify(storeddata))
          delete newIssue.__v
          Cache.put(`issue_${req.params.project}`, {
            cachedtitle: projectinfo.title,
            cachedate: new Date(),
            cachedissues: itemCached
              ? [...itemCached.cachedissues, newIssue]
              : [newIssue]
          })

          return res.status(201).json({
            data: {
              _id: storeddata._id,
              issue_title: req.body.issue_title,
              issue_text: req.body.issue_text,
              created_by: req.body.created_by,
              assigned: req.body.assigned ? req.body.assigned : '',
              created_on: new Date(),
              updated_on: new Date(),
              open: true,
              status_text: req.body.status ? req.body.status : ''
            }
          })
        }
        /* eslint-enable */
        return res.status(422).json({
          message: `the intended project ${req.params.project} does not exist`
        })
      } catch (error) {
        logger.info(`IssueTracker issue post error: ${error}`)
        return res.status(500).json({message: 'Something really bad happened'})
      }
    }
  )
  .put(
    [
      param('project')
        .exists()
        .isMongoId(),
      query('issue')
        .exists()
        .isMongoId()
    ],
    async (req, res) => {
      try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
          return res.status(422).json({errors: errors.array()})
        }
        const projectinfo = await issueprojectmodel.findById(req.params.project)
        if (!projectinfo) {
          return res
            .status(422)
            .json({message: 'provided project does not exist'})
        }
        if (Object.keys(req.body).length === 0) {
          return res.status(422).json({message: 'no updated field sent'})
        }

        const updateobj = {
          $set: {
            issueupdated: new Date()
          }
        }
        if (req.body.issue_title) {
          updateobj.$set.issuetitle = req.body.issue_title
        }
        if (req.body.issue_text) {
          updateobj.$set.text = req.body.issue_text
        }
        if (req.body.created_by) {
          updateobj.$set.creator = req.body.created_by
        }
        if (req.body.assigned) {
          updateobj.$set.assigned = req.body.assigned
        }
        if (req.body.status) {
          updateobj.$set.status = req.body.status
        }
        if (req.body.open) {
          updateobj.$set.open = req.body.open === 'true'
        }
        const updatestoredData = await issuedatamodel.findByIdAndUpdate(
          req.query.issue,
          updateobj.$set,
          {new: true}
        )
        if (updatestoredData) {
          const issueCache = Cache.get(`issue_${req.params.project}`)
          const updatedIssue = JSON.parse(JSON.stringify(updatestoredData))
          /* eslint-disable */
          delete updatedIssue.__v
          if (issueCache) {
            const itempos = issueCache.cachedissues.findIndex(
              x => x._id === req.query.issue
            )
            /* eslint-enable */
            if (itempos >= 0) {
              Cache.del(`issue_${req.params.project}`)
              issueCache.cachedissues[itempos] = updatedIssue
              Cache.put(`issue_${req.params.project}`, {
                cachedtitle: updatestoredData.title,
                cachedate: new Date(),
                cachedissues: issueCache.cachedissues
              })
            }
          } else {
            Cache.put(`issue_${req.params.project}`, {
              cachedtitle: projectinfo.title,
              cachedate: new Date(),
              cachedissues: [updatedIssue]
            })
          }
          return res.status(200).json({message: `successfully updated`})
        }

        return res
          .status(204)
          .json({message: `could not update ${req.query.issue}`})
      } catch (error) {
        logger.info(`IssueTracker issue put error: ${error}`)
        return res.status(500).json({message: 'Something really bad happened'})
      }
    }
  )
  .delete(
    [
      param('project')
        .exists()
        .isMongoId(),
      query('issue')
        .exists()
        .isMongoId()
    ],
    async (req, res) => {
      try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
          return res.status(422).json({errors: errors.array()})
        }
        const storeddata = await issuedatamodel.findByIdAndRemove(
          req.query.issue
        )
        if (storeddata) {
          const itemCached = Cache.get(`issue_${req.params.project}`)
          if (itemCached) {
            Cache.del(`issue_${req.params.project}`)
            const {cachedissues} = itemCached
            /* eslint-disable */
            const newissues = cachedissues.filter(
              x => x._id !== req.query.issue
            )
            /* eslint-enable */
            Cache.put(`issue_${req.params.project}`, {
              cachedtitle: itemCached.cachedtitle,
              cachedissues: newissues
            })
          }
          return res.status(200).json({message: `deleted ${req.query.issue}`})
        }
        return res
          .status(422)
          .json({message: `deleted ${req.query.issue} failed`})
      } catch (error) {
        logger.info(`IssueTracker issue delete error: ${error}`)
        return res.status(500).json({message: 'Something really bad happened'})
      }
    }
  )
// #endregion
export default IssueTrackerController
