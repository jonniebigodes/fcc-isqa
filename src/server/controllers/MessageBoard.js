/**
 * @module messageboardcontroller
 */
import 'babel-polyfill'
import express from 'express'
import Cache from 'memory-cache'
import mongoose from 'mongoose'
import {body, param, validationResult} from 'express-validator/check'

const logger =
  process.env.NODE_ENV !== 'production'
    ? require('../logger').default
    : require('./logger').default // eslint-disable-line

const AnonBardsController = express.Router()

// #region model
/* eslint-disable */
const BoardModel =
  process.env.NODE_ENV !== 'production'
    ? require('../models/Boards.model').default
    : require('./Boards.model').default

const threadModel =
  process.env.NODE_ENV !== 'production'
    ? require('../models/BoardThreads.model').default
    : require('./BoardThreads.model').default

const bModel = mongoose.model('board')
const tModel = mongoose.model('boardthread')
/* eslint-enable */
// #endregion

// #region middleware
AnonBardsController.use((req, res, next) => {
  if (process.env.NODE_ENV !== 'test') {
    const sender =
      req.headers['x-forwarded-for'] || req.connection.remoteAddress
    logger.info(
      `messageboard date=>${new Date()}\n method=>${req.method}\n url=>${
        req.baseUrl
      }${req.path} sender:${sender === ':::1' ? 'localhost' : sender}`
    )
  }
  next() // make sure we go to the next routes and don't stop here
})
AnonBardsController.use(async (req, res, next) => {
  try {
    if (req.method === 'GET') {
      if (process.env.NODE_ENV !== 'test') {
        logger.info(
          `update boards cache date=>${new Date()}\n method=>${
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
    logger.info(`Message boards cache update get error: ${error}`)
    return res.status(500).json({message: 'Something really bad happened'})
  }
})
// #endregion

// #region get cached items
AnonBardsController.route('/bcache').get(async (req, res) => {
  const itemscache = Cache.keys().filter(item =>
    item.startsWith('messageboards_')
  )
  return res.status(200).json({data: itemscache.map(item => Cache.get(item))})
})
// #endregion

// #region board routes
AnonBardsController.route('/')
  .get(async (req, res) => {
    try {
      const itemscache = Cache.keys().filter(item =>
        item.startsWith('messageboards_')
      )
      if (itemscache.length) {
        return res.status(200).json({
          boards: itemscache.map(item => {
            return {
              id: item.cachedid,
              title: item.cachedtitle,
              created: item.cacheddate,
              threads: []
            }
          })
        })
      }
      return res.status(200).json({boards: []})

      /* eslint-disable */
      /* const datacontent = await Promise.all([
        bModel.find({}).select(),
        tModel.find({}).select('-__v')
      ])
      const storedboards = datacontent[0]
      const threadsstored = JSON.parse(JSON.stringify(datacontent[1]))
     
      storedboards.map(item =>
        Cache.put(`messageboards_${item._id}`, {
          cachedid: item._id,
          cachedtitle: item.title,
          cacheddate: item.created,
          cachedthreads: threadsstored.filter(x => x.board_id === item._id)
        })
      )

      return res.status(200).json({
        boards: storedboards.map(item => {
          return {
            id: item._id,
            title: item.cachedtitle,
            created: item.title,
            threads: []
          }
        })
      }) */
      /* eslint-enable */
    } catch (error) {
      logger.info(`AnonBardsController error: ${error}`)
      return res.status(500).json({message: 'Something really bad happened'})
    }
  })
  .post([body('title').exists()], async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()})
      }

      const itemExists = await bModel.findOne({title: req.body.title})

      if (itemExists) {
        return res.status(422).json({message: 'board already exists'})
      }
      const newBoard = await bModel.create({title: req.body.title})

      /* eslint-disable */
      return res.status(201).json({
        id: newBoard._id,
        title: newBoard.title,
        created: newBoard.created,
        threads: []
      })
      /* eslint-enable */
    } catch (error) {
      logger.info(`AnonBardsController error: ${error}`)
      return res.status(500).json({message: 'Something really bad happened'})
    }
  })

AnonBardsController.delete(
  '/:board',
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
      const itemInCache = Cache.get(`messageboards_${req.params.board}`)

      if (itemInCache) {
        Cache.del(`messageboards_${req.params.board}`)
      }
      const datastored = await bModel.findByIdAndRemove(req.params.board)
      if (datastored) {
        await tModel.deleteMany({board_id: req.params.board})
        return res.status(200).json({message: `board was removed`})
      }
      return res.status(422).json({
        message: `no board was stored with that arg ${req.params.board}`
      })
    } catch (error) {
      logger.info(`AnonBardsController del error: ${error}`)
      return res.status(500).json({message: 'Something really bad happened'})
    }
  }
)
// #endregion
/** MessageBoardController */
export default AnonBardsController
