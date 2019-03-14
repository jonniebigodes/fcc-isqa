/**
 * Module to handle the request and responses inbound for the project issue tracker
 * @module ProjectIssueTrackerController
 *
 */
import '@babel/polyfill'
import express from 'express'
import Cache from 'memory-cache'
import mongoose from 'mongoose'
import {validationResult, param, body} from 'express-validator/check'

const logger =
  process.env.NODE_ENV !== 'production'
    ? require('../logger').default
    : require('./logger').default // eslint-disable-line

const ProjectIssueTrackerController = express.Router()

// #region model
/* eslint-disable */
const ProjectIssuesModel =
  process.env.NODE_ENV !== 'production'
    ? require('../models/Projects.model').default
    : require('./Projects.model').default
const IssuesModel =
  process.env.NODE_ENV !== 'production'
    ? require('../models/Issues.model').default
    : require('./Issues.model').default
const projectdatamodel = mongoose.model('project_issue')
const issuedatamodel = mongoose.model('issue')
// #endregion

// #region middleware
ProjectIssueTrackerController.use((req, res, next) => {
  if (process.env.NODE_ENV !== 'test') {
    const sender =
      req.headers['x-forwarded-for'] || req.connection.remoteAddress
    logger.info(
      `issues projects date=>${new Date()}\n method=>${req.method}\n url=>${
        req.baseUrl
      }${req.path} sender:${sender === ':::1' ? 'localhost' : sender}`
    )
  }

  next() // make sure we go to the next routes and don't stop here
})
ProjectIssueTrackerController.use(async (req, res, next) => {
  try {
    if (req.method === 'GET') {
      if (process.env.NODE_ENV !== 'test') {
        logger.info(`updating issue cache=>${req.method}\n url=>${req.baseUrl}`)
      }

      const itemscache = Cache.keys().filter(item => item.startsWith('issue_'))
      itemscache.map(item => Cache.del(item))

      const allinfo = await Promise.all([
        projectdatamodel.find({}),
        issuedatamodel.find({}).select('-__v')
      ])
      if (allinfo.length) {
        /* eslint-disable */
        const dataprojects = JSON.parse(JSON.stringify(allinfo[0]))
        const issuesdata = JSON.parse(JSON.stringify(allinfo[1]))
        dataprojects.map(item =>
          Cache.put(`issue_${item._id}`, {
            cachedid: item._id,
            cachedtitle: item.title,
            cachedate: new Date(),
            cachedissues: issuesdata.filter(y => y.project === item._id)
          })
        )
        /* eslint-enable */
      }
    }
    next()
  } catch (error) {
    logger.info(`IssueTracker project issues get error: ${error}`)
    return res.status(500).json({message: 'Something really bad happened'})
  }
})
// #endregion

// #region cached_projects
ProjectIssueTrackerController.get('/cprojects', async (req, res) => {
  const itemscache = Cache.keys().filter(item => item.startsWith('issue_'))
  const result = itemscache.map(item => {
    const data = Cache.get(item)
    const projectid = item.slice(item.indexOf('_') + 1)
    return {
      id: projectid,
      title: data.cachedtitle,
      creationdate: data.cachedate,
      issues: data.cachedissues.length
    }
  })
  return res.status(200).json({projects: result})
})
// #endregion

// #region issueprojects
ProjectIssueTrackerController.route('/')
  .get(async (req, res) => {
    try {
      const itemscache = Cache.keys().filter(item => item.startsWith('issue_'))
      if (itemscache.length) {
        return res.status(200).json({
          data: itemscache.map(item => {
            const projectinfo = Cache.get(item)
            return {
              idproject: projectinfo.cachedid,
              title: projectinfo.cachedtitle,
              creationDate: projectinfo.cachedate,
              issues: []
            }
          })
        })
      }
      return res.status(200).json({data: []})
    } catch (error) {
      logger.info(`Project issue tracker get error: ${error}`)
      return res.status(500).json({message: 'Something really bad happened'})
    }
  })
  .post([body('title').exists()], async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()})
      }

      const itemExists = await projectdatamodel.findOne({title: req.body.title})

      if (itemExists) {
        return res
          .status(422)
          .json({message: 'a project with a similar title was already created'})
      }
      const newProject = await projectdatamodel.create({
        title: req.body.title
      })

      /* eslint-disable */

      return res.status(201).json({
        idproject: newProject._id,
        title: req.body.title,
        issues: []
      })
      /* eslint-enable */
    } catch (error) {
      logger.info(`Project issue tracker post error: ${error}`)
      return res.status(500).json({message: 'Something really bad happened'})
    }
  })
ProjectIssueTrackerController.delete(
  '/:project',
  [
    param('project')
      .exists()
      .isMongoId()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()})
      }

      const resultdelete = await Promise.all([
        projectdatamodel.findByIdAndRemove(req.params.project),
        issuedatamodel.deleteMany({project: req.params.project})
      ])
      if (resultdelete.length) {
        return res
          .status(200)
          .json({message: `project ${req.params.project} deleted`})
      }
      return res
        .status(422)
        .json({message: `project ${req.params.project} not found`})
    } catch (error) {
      logger.info(`Project issue tracker delete error: ${error}`)
      return res.status(500).json({message: 'Something really bad happened'})
    }
  }
)
// #endregion

/** Issue tracker module  */
export default ProjectIssueTrackerController
