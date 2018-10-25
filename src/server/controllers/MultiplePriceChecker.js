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

const MultiplePriceCheckerController = express.Router()
const endPoint = 'https://www.quandl.com/api/v3/datasets/WIKI/'

// #region middleware
MultiplePriceCheckerController.use((req, res, next) => {
  if (process.env.NODE_ENV !== 'test') {
    logger.info(
      `nasdaq multiple date=>${new Date()}\n method=>${
        req.method
      }\n url=>${JSON.stringify(req.query)}\nsender:${req.ip}`
    )
  }

  next() // make sure we go to the next routes and don't stop here
})
// #endregion

// #region fetch multiple
/**
 * async fat arrow function to fetch the ticker information for both tickers
 * @param {string} firstticker
 * @param {string} secondticker
 * @returns {Promise} with an object containing the ticker price
 * @throws {Error}
 */
const fetchMultiple = (firstticker, secondticker) => {
  return new Promise((resolve, reject) => {
    axios
      .all([
        axios.get(`${endPoint}${firstticker.toUpperCase()}.json`, {
          params: {
            api_key: process.env.STOCKKEY,
            limit: 1
          }
        }),
        axios.get(`${endPoint}${secondticker.toUpperCase()}.json`, {
          params: {
            api_key: process.env.STOCKKEY,
            limit: 1
          }
        })
      ])
      .then(
        axios.spread((priceinfoone, priceinfotwo) => {
          if (priceinfoone.data.quandl_error) {
            reject(new Error('Incorrect stock ticker'))
          }
          if (priceinfotwo.data.quandl_error) {
            reject(new Error('Incorrect stock ticker'))
          }
          const quandldataOne = priceinfoone.data.dataset.data[0]
          const quandldataTwo = priceinfotwo.data.dataset.data[0]
          resolve({
            firstTickerPrice: quandldataOne[4],
            secondTickerPrice: quandldataTwo[4]
          })
        })
      )
      .catch(error => {
        logger.error(`error fetching multiple data :${error}`)
        reject(new Error(`error ticker data\n:${error} `))
      })
  })
}
// #endregion

// #region fetch single
/**
 * fat arrow function to fetch information about a single ticker
 * @param {string} value contains the ticker
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

// #region multiple stock tickers
MultiplePriceCheckerController.get('/', async (req, res) => {
  try {
    const originreq =
      req.headers['x-forwarded-for'] || req.connection.remoteAddress
    const firststock = req.query.stock[0]
    const secondstock = req.query.stock[1]

    const firstCached = Cache.get(`stock_${firststock}`)
    const secondCached = Cache.get(`stock_${secondstock}`)

    if (firstCached && secondCached) {
      if (req.query.like) {
        const ipPresentfirstStock = firstCached.cachedLikes.findIndex(
          x => x.likedby === originreq
        )
        const ipPresentsecondStock = secondCached.cachedLikes.findIndex(
          x => x.likedby === originreq
        )
        let numFirstLikes = firstCached.cachedLikes.length
        let numSecondLikes = secondCached.cachedLikes.length

        if (ipPresentfirstStock < 0) {
          await dataModel.findOneAndUpdate(
            {stockTick: firststock},
            {
              $push: {
                likes: {
                  likedby: originreq
                }
              }
            }
          )
          numFirstLikes += 1
        }
        if (ipPresentsecondStock < 0) {
          await dataModel.findOneAndUpdate(
            {stockTick: secondstock},
            {
              $push: {
                likes: {
                  likedby: originreq
                }
              }
            }
          )
          numSecondLikes += 1
        }
        return res.status(200).json({
          stockData: [
            {
              stock: firststock,
              price: firstCached.cachedPrice,
              rel_likes: numFirstLikes - numSecondLikes
            },
            {
              stock: secondstock,
              price: secondCached.cachedPrice,
              rel_likes: numSecondLikes - numFirstLikes
            }
          ]
        })
      }
      return res.status(200).json({
        stockData: [
          {
            stock: firststock,
            price: firstCached.cachedPrice,
            rel_likes:
              firstCached.cachedLikes.length - secondCached.cachedLikes.length
          },
          {
            stock: secondstock,
            price: secondCached.cachedPrice,
            rel_likes:
              secondCached.cachedLikes.length - firstCached.cachedLikes.length
          }
        ]
      })
    }
    // checks if first is present fetch info on second

    if (firstCached) {
      const {cachedLikes} = firstCached
      const secondLike = req.query.like ? 1 : 0
      let cachedTickerLikes = cachedLikes.length

      const tickerPrice = await fetchSingle(secondstock)
      await dataModel.create({
        stockTick: secondstock,
        stockPrice: tickerPrice,
        likes: req.query.like ? [{likedby: originreq}] : []
      })

      if (req.query.like) {
        const existsIp = cachedLikes.findIndex(x => x.likedby === originreq)
        if (existsIp < 0) {
          await dataModel.findOneAndUpdate(
            {stockTick: firststock},
            {
              $push: {
                likes: {
                  likedby: originreq
                }
              }
            }
          )
          cachedTickerLikes += 1
        }
      }
      return res.status(200).json({
        stockData: [
          {
            stock: firststock,
            price: firstCached.cachedPrice,
            rel_likes: cachedTickerLikes - secondLike
          },
          {
            stock: secondstock,
            price: tickerPrice,
            rel_likes: secondLike - cachedTickerLikes
          }
        ]
      })
    }
    //
    // checks if second is present fetch info on first

    if (secondCached) {
      const firstLike = req.query.like ? 1 : 0
      const {cachedLikes} = secondCached
      let cachedTickerLikes = cachedLikes.length
      const tickerPrice = await fetchSingle(firststock)
      await dataModel.create({
        stockTick: firststock,
        stockPrice: tickerPrice,
        likes: req.query.like ? [{likedby: originreq}] : []
      })

      if (req.query.like) {
        const ipIsPresent = cachedLikes.findIndex(x => x.likedby === originreq)
        if (ipIsPresent < 0) {
          await dataModel.findOneAndUpdate(
            {stockTick: secondstock},
            {
              $push: {
                likes: {
                  likedby: originreq
                }
              }
            }
          )
          cachedTickerLikes += 1
        }
      }
      return res.status(200).json({
        stockData: [
          {
            stock: firststock,
            price: tickerPrice,
            rel_likes: firstLike - cachedTickerLikes
          },
          {
            stock: secondstock,
            price: secondCached.cachedPrice,
            rel_likes: cachedTickerLikes - firstLike
          }
        ]
      })
    }

    const multipleFetchResult = await fetchMultiple(firststock, secondstock)
    const {firstTickerPrice, secondTickerPrice} = multipleFetchResult

    await dataModel.create([
      {
        stockTick: firststock,
        stockPrice: firstTickerPrice,
        likes: req.query.like ? [{likedby: originreq}] : []
      },
      {
        stockTick: secondstock,
        stockPrice: secondTickerPrice,
        likes: req.query.like ? [{likedby: originreq}] : []
      }
    ])
    return res.status(200).json({
      stockData: [
        {stock: firststock, price: firstTickerPrice, rel_likes: 0},
        {stock: secondstock, price: secondTickerPrice, rel_likes: 0}
      ]
    })
  } catch (error) {
    logger.info(`nasdaq error: ${error}`)
    return res.status(500).json({message: 'Something really bad happened'})
  }
})
// #endregion
export default MultiplePriceCheckerController
