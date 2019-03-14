import '@babel/polyfill'
import express from 'express'
import Cache from 'memory-cache'
import mongoose from 'mongoose'
import {body, param, query, validationResult} from 'express-validator/check'

const logger =
  process.env.NODE_ENV !== 'production'
    ? require('../logger').default
    : require('./logger').default // eslint-disable-line

const BoardRepliesController = express.Router()

// #region model
/* eslint-disable */
const threadModel =
  process.env.NODE_ENV !== 'production'
    ? require('../models/BoardThreads.model').default
    : require('./BoardThreads.model').default
const tModel = mongoose.model('boardthread')
const bModel = mongoose.model('board')
/* eslint-enable */
// #endregion

// #region middleware
BoardRepliesController.use((req, res, next) => {
  if (process.env.NODE_ENV !== 'test') {
    const sender =
      req.headers['x-forwarded-for'] || req.connection.remoteAddress
    logger.info(
      `messageboard replies date=>${new Date()}\n method=>${
        req.method
      }\n url=>${req.baseUrl}${req.path} sender:${
        sender === ':::1' ? 'localhost' : sender
      }`
    )
  }

  next() // make sure we go to the next routes and don't stop here
})
BoardRepliesController.use(async (req, res, next) => {
  try {
    if (req.method === 'GET') {
      if (process.env.NODE_ENV !== 'test') {
        logger.info(
          `updating replies cache date=>${new Date()}\n method=>${
            req.method
          }\n url=>${req.baseUrl}${req.path}`
        )
      }

      const itemscache = Cache.keys().filter(item =>
        item.startsWith('messageboards_')
      )
      itemscache.map(item => Cache.del(item))
      const alldata = await Promise.all([
        bModel.find({}).select('-__v'),
        tModel.find({}).select('-__v')
      ])
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
    logger.info(`Message boards replies cache update get error: ${error}`)
    return res.status(500).json({message: 'Something really bad happened'})
  }
})
// #endregion

// #region cachedreplies
BoardRepliesController.route('/cachedreplies/:board').get(
  [
    param('board')
      .exists()
      .isMongoId(),
    query('thread')
      .exists()
      .isMongoId()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()})
      }
      const dataCached = Cache.get(`messageboards_${req.params.board}`)
      if (dataCached) {
        const {cachedthreads} = dataCached
        const threadData = cachedthreads.findIndex(
          // eslint-disable-next-line no-underscore-dangle
          x => x._id === req.query.thread
        )
        return res.status(200).json({
          title: dataCached.cachedtitle,
          creationdate: dataCached.cacheddate,
          thread: cachedthreads[threadData]
        })
      }
      return res.status(204)
    } catch (error) {
      logger.info(`MessageBoardReplies cached error: ${error}`)
      return res.status(500).json({message: 'Something really bad happened'})
    }
  }
)
// #endregion

BoardRepliesController.route('/:boardid')
  .get(
    [
      param('boardid')
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

        const boardinCache = Cache.get(`messageboards_${req.params.boardid}`)

        if (boardinCache) {
          const {cachedthreads} = boardinCache
          const threadExists = cachedthreads.find(
            x => x._id === req.query.thread_id // eslint-disable-line
          )

          if (threadExists) {
            const {thread_text, created_on, bumped_on, replies} = threadExists // eslint-disable-line

            return res.status(200).json({
              threadtext: thread_text,
              createdOn: created_on,
              bumpedOn: bumped_on,
              replies: replies.map(item => {
                return {
                  reply: item.reply_text,
                  replyOn: item.dateadded
                }
              })
            })
          }
        }

        return res
          .status(204)
          .json({message: 'Specified thread does not exist'})
      } catch (error) {
        logger.info(`MessageBoardReplies error: ${error}`)
        return res.status(500).json({message: 'Something really bad happened'})
      }
    }
  )
  .post(
    [
      param('boardid')
        .exists()
        .isMongoId(),
      body('thread_id')
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
        const boardExists = await bModel.findById(req.params.boardid)
        if (!boardExists) {
          return res
            .status(422)
            .json({message: 'the specified board does not exist'})
        }
        const datastored = await tModel.findById(req.body.thread_id)

        if (datastored) {
          const createReply = await tModel.findByIdAndUpdate(
            req.body.thread_id,
            {
              $set: {
                bumped_on: new Date()
              },
              $push: {
                replies: {
                  reply_text: req.body.text,
                  dateadded: new Date(),
                  reportedreply: false,
                  reply_delete_password: req.body.delete_password
                }
              }
            },
            {new: true}
          )
          if (createReply) {
            const {replies} = createReply

            // const itemcached= Cache.get(`messageboards_${req.params.board}`)
            return res.status(201).json({
              // eslint-disable-next-line no-underscore-dangle
              result: replies[replies.length - 1]._id,
              message: 'your reply was added'
            })
          }
        }

        return res
          .status(204)
          .json({message: 'nothing was found with that information'})
      } catch (error) {
        logger.info(`MessageBoardReplies error: ${error}`)
        return res.status(500).json({message: 'Something really bad happened'})
      }
    }
  )
  .put(
    [
      param('boardid')
        .exists()
        .isMongoId(),
      query('thread_id')
        .exists()
        .isMongoId(),
      query('reply_id')
        .exists()
        .isMongoId()
    ],
    async (req, res) => {
      try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
          return res.status(422).json({errors: errors.array()})
        }
        const boardExists = await bModel.findById(req.params.boardid)
        if (!boardExists) {
          return res
            .status(204)
            .json({message: 'the specified board does not exist'})
        }
        const threadExists = await tModel.findById(req.query.thread_id)
        if (!threadExists) {
          return res
            .status(204)
            .json({message: 'the specified thread does not exist'})
        }
        const reportedresult = await tModel.findOneAndUpdate(
          {
            'replies._id': req.query.reply_id
          },
          {
            $set: {
              'replies.$.reportedreply': true
            }
          },
          {new: true}
        )
        if (reportedresult) {
          return res.status(200).json({message: 'success'})
        }
        return res
          .status(204)
          .json({message: 'nothing was found with that information'})
      } catch (error) {
        logger.info(`MessageBoardReplies error: ${error}`)
        return res.status(500).json({message: 'Something really bad happened'})
      }
    }
  )
  .delete(
    [
      param('boardid')
        .exists()
        .isMongoId(),
      query('thread_id')
        .exists()
        .isMongoId(),
      query('reply_id')
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
        const boardExists = await bModel.findById(req.params.boardid)
        if (!boardExists) {
          return res
            .status(204)
            .json({message: 'the specified board does not exist'})
        }
        const threadExists = await tModel.findById(req.query.thread_id)
        if (!threadExists) {
          return res
            .status(204)
            .json({message: 'the specified thread does not exist'})
        }
        const itemExists = await tModel.findOne({
          _id: req.query.thread_id,
          'replies._id': req.query.reply_id
        })
        if (itemExists) {
          const dataparsed = JSON.parse(JSON.stringify(itemExists))
          const {replies} = dataparsed
          const positionreply = replies.findIndex(
            x => x._id === req.query.reply_id // eslint-disable-line
          )
          if (positionreply >= 0) {
            if (
              replies[positionreply].reply_delete_password !==
              req.query.delete_password
            ) {
              return res.status(500).json({message: 'incorrect password'})
            }
            const reportedresult = await tModel.findOneAndUpdate(
              {
                'replies._id': req.query.reply_id
              },
              {
                $set: {
                  'replies.$.reply_text': '[deleted]'
                }
              },
              {new: true}
            )
            return res
              .status(reportedresult ? 200 : 500)
              .json({message: reportedresult ? 'success' : 'error delete'})
          }
        }
        return res
          .status(204)
          .json({message: 'nothing was found for the provided information'})
      } catch (error) {
        logger.info(`MessageBoardReplies error: ${error}`)
        return res.status(500).json({message: 'Something really bad happened'})
      }
    }
  )

export default BoardRepliesController
