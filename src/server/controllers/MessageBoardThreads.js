import 'babel-polyfill'
import express from 'express'
import Cache from 'memory-cache'
import mongoose from 'mongoose'
import {validationResult, query, param, body} from 'express-validator/check'
import logger from '../logger'

const BoardThreadsController = express.Router()

// #region model
/* eslint-disable */
const threadModel =
  process.env.NODE_ENV !== 'production'
    ? require('../models/BoardThreads.model').default
    : require('./BoardThreads.model').default

const BoardModel =
  process.env.NODE_ENV !== 'production'
    ? require('../models/Boards.model').default
    : require('./Boards.model').default
const bModel = mongoose.model('board')
const tModel = mongoose.model('boardthread')
/* eslint-enable */
// #endregion

// #region middleware
BoardThreadsController.use((req, res, next) => {
  if (process.env.NODE_ENV !== 'test') {
    const sender =
      req.headers['x-forwarded-for'] || req.connection.remoteAddress
    logger.info(
      `board threads date=>${new Date()}\n method=>${req.method}\n url=>${
        req.baseUrl
      }${req.path} sender:${sender === ':::1' ? 'localhost' : sender}`
    )
  }

  next() // make sure we go to the next routes and don't stop here
})
BoardThreadsController.use(async (req, res, next) => {
  try {
    if (req.method === 'GET') {
      if (process.env.NODE_ENV !== 'test') {
        logger.info(
          `updating threads cache date=>${new Date()}\n method=>${
            req.method
          }\n url=>${req.baseUrl}${req.path}`
        )
      }

      const itemscache = Cache.keys().filter(item =>
        item.startsWith('messageboards_')
      )
      itemscache.map(item => Cache.del(item))
      const alldata = await Promise.all([bModel.find({}), tModel.find({})])
      if (alldata.length) {
        const messageboards = JSON.parse(JSON.stringify(alldata[0]))
        const threadsreplies = JSON.parse(JSON.stringify(alldata[1]))
        /* eslint-disable */
        messageboards.map(item =>
          Cache.put(`messageboards_${item._id}`, {
            cachedid: item._id,
            cachedtitle: item.title,
            cacheddate: new Date(),
            cachedthreads: threadsreplies.filter(x => x.board_id === item._id)
          })
        )
        /* eslint-enable */
      }
    }
    next()
  } catch (error) {
    logger.info(`Message boards threads cache update get error: ${error}`)
    return res.status(500).json({message: 'Something really bad happened'})
  }
})
// #endregion

BoardThreadsController.route('/:board')
  .get(
    [
      param('board')
        .exists()
        .isMongoId()
    ],
    async (req, res) => {
      try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
          return res.status(422).json({errors: errors.array()})
        }

        const cacheditem = Cache.get(`messageboards_${req.params.board}`)
        if (cacheditem) {
          const {cachedthreads} = cacheditem
          const filteredThreads = cachedthreads
            .sort((a, b) => {
              return new Date(b.bumped_on - new Date(a.bumped_on))
            })
            .slice(0, 10)
          const result = filteredThreads.map(item => {
            return {
              threadtext: item.thread_text,
              createdOn: item.created_on,
              bumpedOn: item.bumped_on,
              replies: item.replies
                .map(item => {
                  return {
                    reply: item.reply_text,
                    replyOn: item.dateadded
                  }
                })
                .sort((x, y) => {
                  return new Date(y.dateadded) - new Date(x.dateadded)
                })
                .slice(0, 3)
            }
          })
          return res.status(200).json({threads: result})
        }
        return res.status(204).json({message: 'no thread found'})
        /*  const boardExists = await bModel.findById(req.params.board)
        if (!boardExists) {
          return res
            .status(422)
            .json({message: 'the specified messageboard does not exist'})
        } 
        const findresult = await tModel
          .find({board_id: req.params.board})
          .sort({bumped_on: -1})
          .limit(10)
        if (findresult.length) {
          
          const datasend = findresult.map(item => {
            const {replies, thread_text, created_on, bumped_on} = item
            return {
              text: thread_text,
              created: created_on,
              bumped: bumped_on,
              thread_replies: replies
                .sort((a, b) => {
                  return new Date(b.dateadded) - new Date(a.dateadded)
                })
                .slice(0, 3)
            }
          })
          
          return res.status(200).json(datasend)
        }
        return res.status(200).json({message: 'nothing added yet'}) */
      } catch (error) {
        logger.info(`MessageBoardThreads error: ${error}`)
        return res.status(500).json({message: 'Something really bad happened'})
      }
    }
  )
  .post(
    [
      param('board')
        .exists()
        .isMongoId(),
      body('delete_password').exists(),
      body('text').exists()
    ],
    async (req, res) => {
      try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
          return res.status(422).json({errors: errors.array()})
        }

        const boardExists = await bModel.findById(req.params.board)
        if (!boardExists) {
          return res
            .status(422)
            .json({message: 'the specified board does not exist'})
        }
        const newThread = await tModel.create({
          thread_text: req.body.text,
          board_id: req.params.board,
          thread_delete_password: req.body.delete_password,
          thread_replies: []
        })
        /* eslint-disable */
        /* const cacheditem = Cache.get(`messageboards_${req.params.board}`)
        if (cacheditem) {
          Cache.del(`messageboards_${req.params.board}`)
        }
        /* Cache.put(`messageboards_${req.params.board}`, {
          title: boardExists.title,
          created: boardExists.created,
          cachedthreads: cacheditem.cachedthreads.length
            ? [
                ...cacheditem.cachedthreads,
                {
                  id: newThread._id,
                  text: req.body.text,
                  board: req.params.board,
                  deletepassword: req.body.delete_password,
                  created: newThread.created_on,
                  bumped: newThread.bumped_on,
                  reported: false,
                  cachedreplies: []
                }
              ]
            : [
                {
                  id: newThread._id,
                  text: req.body.text,
                  board: req.params.board,
                  deletepassword: req.body.delete_password,
                  created: newThread.created_on,
                  bumped: newThread.bumped_on,
                  reported: false,
                  cachedreplies: []
                }
              ]
        })*/

        return res.status(201).json({
          id: newThread._id,
          text: req.body.text,
          board: req.params.board,
          deletepassword: req.body.delete_password,
          created: newThread.created_on,
          bumped: newThread.bumped_on,
          replies: []
        })
        /* eslint-enable */
      } catch (error) {
        logger.info(`MessageBoardThreads error: ${error}`)
        return res.status(500).json({message: 'Something really bad happened'})
      }
    }
  )
  .put(
    [
      param('board')
        .exists()
        .isMongoId(),
      query('thread_id')
        .exists()
        .isMongoId()
    ],
    async (req, res) => {
      try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
          return res.status(422).json({errors: errors.array()})
        }
        const boardExists = await bModel.findById(req.params.board)
        if (!boardExists) {
          return res
            .status(422)
            .json({message: 'the specified board does not exist'})
        }
        const threadExists = await tModel.findById(req.query.thread_id)
        if (!threadExists) {
          return res
            .status(422)
            .json({message: 'the specified thread does not exist'})
        }
        const reportedresult = await tModel.findByIdAndUpdate(
          req.query.thread_id,
          {$set: {reported: true}},
          {new: true}
        )
        return res
          .status(reportedresult ? 200 : 500)
          .json({message: reportedresult ? 'success' : 'error reporting'})
        /* const iteminCache = Cache.get(`messageboards_${req.params.board}`)
        if (iteminCache) {
          const {cachedthreads} = iteminCache
          const posthread = cachedthreads.findIndex(
            x => x.id === req.query.thread_id
          )
          if (posthread) {
            cachedthreads[posthread].reported = true
          }

          Cache.del(`messageboards_${req.params.board}`)
          Cache.put(`messageboards_${req.params.board}`, {
            cachedtitle: iteminCache.cachedtitle,
            cachedcreated: iteminCache.cachedcreated,
            cachedthreads: iteminCache.cachedthreads
          })
        } */
      } catch (error) {
        logger.info(`MessageBoardThreads error: ${error}`)
        return res.status(500).json({message: 'Something really bad happened'})
      }
    }
  )
  .delete(
    [
      param('board')
        .exists()
        .isMongoId(),
      query('thread_id')
        .exists()
        .isMongoId(),
      query('delete_password').exists()
    ],
    async (req, res) => {
      try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
          return res.status(422).json({errors: errors.array()})
        }
        const boardExists = await bModel.findById(req.params.board)
        if (!boardExists) {
          return res
            .status(422)
            .json({message: 'the board specified does not exist'})
        }
        const threadExists = await tModel.findById(req.query.thread_id)
        if (!threadExists) {
          return res
            .status(422)
            .json({message: 'the specified thread does not exist'})
        }
        if (threadExists.thread_delete_password !== req.query.delete_password) {
          return res.status(500).json({message: 'incorrect password'})
        }
        const delresult = await tModel.findByIdAndRemove(req.query.thread_id)
        /* const iteminCache = Cache.get(`messageboards_${req.params.board}`)
        if (iteminCache) {
          const {cachedthreads} = iteminCache
          const newThreads = cachedthreads.filter(
            item => item.id !== req.query.thread_id
          )
          Cache.del(`messageboards_${req.params.board}`)
          Cache.put(`messageboards_${req.params.board}`, {
            cachedtitle: iteminCache.cachedtitle,
            cachedcreated: iteminCache.cachedcreated,
            cachedthreads: newThreads
          })
        } */
        return res.status(delresult ? 200 : 500).json({
          message: delresult
            ? 'success'
            : `error deleting thread ${req.query.thread_id}`
        })
      } catch (error) {
        logger.info(`MessageBoardThreads error: ${error}`)
        return res.status(500).json({message: 'Something really bad happened'})
      }
    }
  )

export default BoardThreadsController
