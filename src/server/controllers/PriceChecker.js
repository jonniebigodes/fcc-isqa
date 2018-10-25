import 'babel-polyfill'
import express from 'express'
import mongoose from 'mongoose'
import Cache from 'memory-cache'
import {query, validationResult} from 'express-validator/check'

const logger =
  process.env.NODE_ENV !== 'production'
    ? require('../logger').default
    : require('./logger').default // eslint-disable-line

// #region model
/* eslint-disable */
const StockModel =
  process.env.NODE_ENV !== 'production'
    ? require('../models/Stocks.model').default
    : require('./Stocks.model').default
/* eslint-enable */
const dataModel = mongoose.model('stock')
// #endregion

const PriceCheckerController = express.Router()

// #region middleware
PriceCheckerController.use((req, res, next) => {
  if (process.env.NODE_ENV !== 'test') {
    logger.info(
      `nasdaq date=>${new Date()}\n method=>${
        req.method
      }\n url=>${JSON.stringify(req.query)}\nsender:${req.ip}`
    )
  }

  next() // make sure we go to the next routes and don't stop here
})
PriceCheckerController.use(async (req, res, next) => {
  try {
    if (process.env.NODE_ENV !== 'test') {
      logger.info(
        `update stocks cache date=>${new Date()}\n method=>${
          req.method
        }\n url=>${req.baseUrl}${req.path}`
      )
    }

    const itemscache = Cache.keys().filter(item => item.startsWith('stock_'))
    itemscache.map(item => Cache.del(item))
    const savedData = await dataModel.find({})

    savedData.map(item =>
      Cache.put(`stock_${item.stockTick}`, {
        cachedPrice: item.stockPrice,
        cachedLikes: item.likes
      })
    )

    next()
  } catch (error) {
    logger.info(`stocks cache update get error: ${error}`)
    return res.status(500).json({message: 'Something really bad happened'})
  }
})
// #endregion

// #region for testing purposes remove before deploy
PriceCheckerController.get('/stcache', async (req, res) => {
  const cacheKeys = Cache.keys().filter(item => item.startsWith('stock_'))
  return res.status(200).json({
    data: cacheKeys.map(item => {
      const tickername = item.slice(item.indexOf('_') + 1)
      return {
        ticker: tickername,
        ...Cache.get(item)
      }
    })
  })
})
// #endregion

// #region entry point middleware
PriceCheckerController.get('/', [query('stock').exists()], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({errors: errors.array()})
    }
    if (typeof req.query.stock === 'string') {
      if (req.query.like) {
        return res.redirect(
          `/api/stock-prices/single?stock=${req.query.stock}&like=true`
        )
      }
      return res.redirect(`/api/stock-prices/single/?stock=${req.query.stock}`)
    }
    // handles equal tickers
    if (req.query.stock[0] === req.query.stock[1]) {
      return res
        .status(422)
        .json({message: 'same tickers provided, change one of them'})
    }
    //

    if (req.query.like) {
      res.redirect(
        `/api/stock-prices/multiple?stock=${req.query.stock[0]}&stock=${
          req.query.stock[1]
        }&like=true`
      )
    } else {
      res.redirect(
        `/api/stock-prices/multiple?stock=${req.query.stock[0]}&stock=${
          req.query.stock[1]
        }`
      )
    }
  } catch (error) {
    logger.info(`StockPrice check error: ${error}`)
    return res.status(500).json({message: 'Something really bad happened'})
  }
})
// #endregion
export default PriceCheckerController
