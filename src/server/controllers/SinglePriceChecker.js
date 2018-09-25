import 'babel-polyfill'
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
  logger.info(
    `nasdaq single date=>${new Date()}\n method=>${
      req.method
    }\n url=>${JSON.stringify(req.query)}\nsender:${req.ip}`
  )
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
    logger.error(`error fetching single data :${error}`)
    throw new Error(`error ticker data\n:${error} `)
  }
}
// #endregion

// #region db cache creator
/**
 * fat arrow function to inject ticker data in the collection and cache
 * @param {string} ticker stock ticker to add
 * @param {Number} price price of the stock ticker
 * @param {boolean} like user likes this stock
 * @param {string} user ip of the person liking the ticker
 * @return {Promise}
 * @throws {Error}
 */
const dataInjector = async (ticker, price, like, user) => {
  try {
    // const stockModel = mongoose.model('stock')
    await dataModel.create({
      stockTick: ticker,
      stockprice: price,
      likes: like ? [{likedby: user}] : []
    })

    Cache.put(
      `stock_${ticker}`,
      {
        cachestockTick: ticker,
        cachestockprice: price,
        cachedlikes: like ? [{likedby: user}] : []
      },
      18000000
    )
    return true
  } catch (error) {
    logger.error(`error injector :${error}`)
    throw new Error(`error dataUpdater\n:${error} `)
  }
}
// #endregion

// #region db cache updater
/**
 * async fat arrow function to update the ticker information
 * @param {*} ticker the stock ticker to be updated
 * @param {*} user  the ip of the person liking the stock
 * @returns {Promise} with result of the operation
 * @throws {Error}
 */
const dataUpdater = async (ticker, user) => {
  try {
    // const stockModel = mongoose.model('stock')
    const updatedStock = await dataModel.findOneAndUpdate(
      {stockTick: ticker},
      {
        $push: {
          likes: {
            likedby: user
          }
        }
      },
      {new: true}
    )
    const {likes, stockprice} = updatedStock
    Cache.del(`stock_${ticker}`)
    Cache.put(
      `stock_${ticker}`,
      {
        cachestockTick: ticker,
        cachestockprice: stockprice,
        cachedlikes: likes
      },
      18000000
    )
    return {
      stockData: {
        stock: ticker,
        price: stockprice,
        likes: likes.length
      }
    }
  } catch (error) {
    logger.error(`error dataUpdater :${error}`)
    throw new Error(`error dataUpdater\n:${error} `)
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
    const ticker = req.query.stock
    const itemCached = Cache.get(`stock_${ticker}`)
    const originreq =
      req.headers['x-forwarded-for'] || req.connection.remoteAddress

    // const stockModel = mongoose.model('stock')
    if (itemCached) {
      const {cachedlikes, cachestockprice, cachestockTick} = itemCached
      if (!req.query.like) {
        return res.status(200).json({
          stockData: {
            stock: cachestockTick,
            price: cachestockprice,
            likes: cachedlikes.length
          }
        })
      }

      const userLiked = cachedlikes.find(x => x.likedby === originreq)

      if (userLiked) {
        return res.status(200).json({
          stockData: {
            stock: cachestockTick,
            price: cachestockprice,
            likes: cachedlikes.length
          }
        })
      }
      const updateDataResult = await dataUpdater(ticker, originreq)
      if (updateDataResult) {
        return res.status(200).json(updateDataResult)
      }
    }

    const dbStock = await dataModel.findOne({stockTick: ticker})

    if (dbStock) {
      const {likes, stockprice} = dbStock
      if (!req.query.like) {
        Cache.put(
          `stock_${ticker}`,
          {
            cachestockTick: ticker,
            cachestockprice: stockprice,
            cachedlikes: likes
          },
          18000000
        )
        return res.status(200).json({
          stockData: {
            stock: ticker,
            price: stockprice,
            likes: likes.length
          }
        })
      }
      const ipExists = likes.find(x => x.likedby === originreq)

      if (ipExists) {
        Cache.put(
          `stock_${ticker}`,
          {
            cachestockTick: ticker,
            cachestockprice: stockprice,
            cachedlikes: likes
          },
          18000000
        )
        return res.status(200).json({
          stockData: {
            stock: ticker,
            price: stockprice,
            likes: likes ? likes.length : 0
          }
        })
      }
      const tickerupdateresult = await dataUpdater(ticker, originreq)
      if (dataUpdater) {
        return res.status(200).json(tickerupdateresult)
      }
    }
    const getTickerPrice = await fetchSingle(req.query.stock)
    await dataInjector(ticker, getTickerPrice, req.query.like, originreq)
    return res.status(200).json({
      stockData: {
        stock: ticker,
        price: getTickerPrice,
        likes: req.query.like ? 1 : 0
      }
    })
  } catch (error) {
    logger.info(`nasdaq error: ${error}`)
    return res.status(500).json({message: 'Something really bad happened'})
  }
})
// #endregion

export default SinglePriceCheckerController
