import 'babel-polyfill'
import express from 'express'
import Cache from 'memory-cache'
import {query, validationResult} from 'express-validator/check'
import logger from '../logger'

// #region model
/* eslint-disable */
const StockModel =
  process.env.NODE_ENV !== 'production'
    ? require('../models/Stocks.model').default
    : require('./Stocks.model').default
/* eslint-enable */
// #endregion

const PriceCheckerController = express.Router()

// #region middleware
PriceCheckerController.use((req, res, next) => {
  logger.info(
    `nasdaq date=>${new Date()}\n method=>${req.method}\n url=>${JSON.stringify(
      req.query
    )}\nsender:${req.ip}`
  )
  logger.info(`cache items: ${JSON.stringify(Cache.size(), null, 2)}`)
  next() // make sure we go to the next routes and don't stop here
})
// #endregion

// #region for testing purposes remove before deploy
PriceCheckerController.get('/cacheitems', async (req, res) => {
  const cacheKeys = Cache.keys()
  return res.status(200).json({data: cacheKeys.map(item => Cache.get(item))})
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
