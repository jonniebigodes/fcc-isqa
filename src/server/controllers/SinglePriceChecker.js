import '@babel/polyfill'
import express from 'express'
import axios from 'axios'
import Cache from 'memory-cache'
import mongoose from 'mongoose'

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
const dataModel = mongoose.model('stock')
/* eslint-enable */
// #endregion

const SinglePriceCheckerController = express.Router()
const endPoint = 'https://www.quandl.com/api/v3/datasets/WIKI/'

// #region middleware
SinglePriceCheckerController.use((req, res, next) => {
  if (process.env.NODE_ENV !== 'test') {
    logger.info(
      `nasdaq single date=>${new Date()}\n method=>${
        req.method
      }\n url=>${JSON.stringify(req.query)}\nsender:${req.ip}`
    )
  }

  next() // make sure we go to the next routes and don't stop here
})
// #endregion

// #region fetch data
/**
 * async fat arrow function to fetch ticker information
 * @param {string} value contains the ticker to lookup
 * @returns {Promise} with the result of the fetch operation
 * @throws {Error}
 */
const fetchSingle = async value => {
  try {
    const response = await axios.get(`${endPoint}${value.toUpperCase()}.json`, {
      params: {
        api_key: process.env.STOCKKEY,
        limit: 1
      }
    })
    if (response.data.quandl_error) {
      throw new Error('Incorrect stock ticker')
    }
    const quandldata = response.data.dataset.data[0]
    return quandldata[4]
  } catch (error) {
    if (process.env.NODE_ENV !== 'test') {
      logger.error(`error fetching single data :${error}`)
    }

    throw new Error(`error ticker data\n:${error} `)
  }
}
// #endregion

// #region single
/**
 * entry point for the controller
 * @param {Request} req object containing the request information
 * @param {Response} res response object
 * @returns {Response}
 */
SinglePriceCheckerController.get('/', async (req, res) => {
  try {
    const stockTicker = req.query.stock
    const originreq =
      req.headers['x-forwarded-for'] || req.connection.remoteAddress
    const itemCached = Cache.get(`stock_${stockTicker}`)
    if (itemCached) {
      const {cachedPrice, cachedLikes} = itemCached
      if (!req.query.like) {
        return res.status(200).json({
          stockData: {
            stock: stockTicker,
            price: cachedPrice,
            likes: cachedLikes.length
          }
        })
      }
      const ipPresent = cachedLikes.findIndex(x => x.likedby === originreq)
      if (ipPresent >= 0) {
        return res.status(200).json({
          stockData: {
            stock: stockTicker,
            price: cachedPrice,
            likes: cachedLikes.length
          }
        })
      }
      await dataModel.findOneAndUpdate(
        {stockTick: stockTicker},
        {
          $push: {
            likes: {
              likedby: originreq
            }
          }
        }
      )
      return res.status(200).json({
        stockData: {
          stock: stockTicker,
          price: cachedPrice,
          likes: cachedLikes.length + 1
        }
      })
    }

    const tickerPrice = await fetchSingle(stockTicker)
    await dataModel.create({
      stockTick: stockTicker,
      stockPrice: tickerPrice,
      likes: req.query.like ? [{likedby: originreq}] : []
    })
    return res.status(200).json({
      stockData: {
        stock: stockTicker,
        price: tickerPrice,
        likes: req.query.like ? 1 : 0
      }
    })
  } catch (error) {
    if (process.env.NODE_ENV !== 'test') {
      logger.info(`nasdaq error: ${error}`)
    }

    return res.status(500).json({message: 'Something really bad happened'})
  }
})
// #endregion

export default SinglePriceCheckerController
