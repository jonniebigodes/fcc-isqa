import 'babel-polyfill'
import express from 'express'
import axios from 'axios'
import Cache from 'memory-cache'
import mongoose from 'mongoose'
import logger from '../logger'

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
  logger.info(
    `nasdaq multiple date=>${new Date()}\n method=>${
      req.method
    }\n url=>${JSON.stringify(req.query)}\nsender:${req.ip}`
  )
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
            priceOne: quandldataOne[4],
            priceTwo: quandldataTwo[4]
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

// #region cacheItems
/**
 * async fat arrow function to handle caching of multiple items
 * @param {Object} value object containing both items to be cached
 */
const cacheMultipleItems = async value => {
  try {
    const {itemOne, itemTwo} = value
    const firsttickerincache = Cache.get(`stock_${itemOne.ticker}`)
    const secondtickerincache = Cache.get(`stock_${itemTwo.ticker}`)
    if (firsttickerincache) {
      Cache.del(`stock_${itemOne.ticker}`)
    }
    if (secondtickerincache) {
      Cache.del(`stock_${itemTwo.ticker}`)
    }
    Cache.put(
      `stock_${itemOne.ticker}`,
      {
        cachestockTick: itemOne.ticker,
        cachestockprice: itemOne.tickerprice,
        cachedlikes: itemOne.likes
      },
      18000000
    )
    Cache.put(
      `stock_${itemTwo.ticker}`,
      {
        cachestockTick: itemTwo.ticker,
        cachestockprice: itemTwo.tickerprice,
        cachedlikes: itemTwo.likes
      },
      18000000
    )
    return true
  } catch (error) {
    logger.info(`nasdaq error cacheMultipleItems: ${error}`)
    throw new Error(`error cacheMultipleItems data\n:${error} `)
  }
}
// #endregion

// #region singledatacreator
const singledatacreator = async value => {
  try {
    const result = await dataModel.create({
      stockTick: value.ticker,
      stockprice: value.price,
      likes: value.likes
    })
    return result
  } catch (error) {
    logger.info(`nasdaq error singledatacreator: ${error}`)
    throw new Error(`error singledatacreator data:${error} `)
  }
}
// #endregion

// #region multipledatacreator
/**
 * async fat arrow function for creating multiple stocks and add them to the cache
 * @param {Object} value containing the data to be injected
 * @return {Promise} with the result of the operation
 * @throws {Error} containg information about type of error
 */

const multipledatacreator = async value => {
  try {
    const {
      firstticker,
      firstprice,
      secondticker,
      secondprice,
      tickerliked,
      user
    } = value

    await dataModel.insertMany([
      {
        stockTick: firstticker,
        stockprice: firstprice,
        likes: tickerliked ? [{likedby: user}] : []
      },
      {
        stockTick: secondticker,
        stockprice: secondprice,
        likes: tickerliked ? [{likedby: user}] : []
      }
    ])

    return true
  } catch (error) {
    logger.error(`error multipledatacreator:${error}`)
    throw new Error(`error multipledatacreator:${error} `)
  }
}
// #endregion

// #region multiple
MultiplePriceCheckerController.get('/', async (req, res) => {
  try {
    const originreq =
      req.headers['x-forwarded-for'] || req.connection.remoteAddress
    logger.info(`origin: ${JSON.stringify(originreq, null, 2)}`)
    const firststock = req.query.stock[0]
    const secondstock = req.query.stock[1]
    // const firstInCache = Cache.get(`stock_${firststock}`)
    // const secondInCache = Cache.get(`stock_${secondstock}`)

    const dataStored = await dataModel.find({
      stockTick: {
        $in: [firststock, secondstock]
      }
    })
    const storedtickers = dataStored.length

    if (storedtickers === 2) {
      const firstLikes = dataStored[0].likes
      const secondLikes = dataStored[1].likes
      const firstprice = dataStored[0].stockprice
      const secondprice = dataStored[1].stockprice
      if (!req.query.like) {
        // call cache multiple
        await cacheMultipleItems({
          itemOne: {
            ticker: firststock,
            tickerprice: firstprice,
            likes: firstLikes
          },
          itemTwo: {
            ticker: secondstock,
            tickerprice: secondprice,
            likes: secondLikes
          }
        })
        //
        return res.status(200).json({
          stockData: [
            {
              stock: dataStored[0].stockTick,
              price: dataStored[0].stockprice,
              rel_likes: firstLikes.length - secondLikes.length
            },
            {
              stock: dataStored[1].stockTick,
              price: dataStored[1].stockprice,
              rel_likes: secondLikes.length - firstLikes.length
            }
          ]
        })
      }
      const injectmultipledata = await updateAndCacheMultiple()
      return res.status(200).json('multiple db data')
    }
    if (storedtickers === 0) {
      const dataFetch = await fetchMultiple(firststock, secondstock)
      console.log('====================================')
      console.log(`result fetch=>${JSON.stringify(dataFetch, null, 2)}`)
      console.log('====================================')
      await multipledatacreator({
        firstticker: firststock,
        firstprice: dataFetch.priceOne,
        secondticker: secondstock,
        secondprice: dataFetch.priceTwo,
        tickerliked: req.query.like,
        user: originreq
      })
      await cacheMultipleItems({
        itemOne: {
          ticker: firststock,
          tickerprice: dataFetch.priceOne,
          likes: req.query.like ? [{likedby: originreq}] : []
        },
        itemTwo: {
          ticker: secondstock,
          tickerprice: dataFetch.priceTwo,
          likes: req.query.like ? [{likedby: originreq}] : []
        }
      })
      return res.status(200).json({
        stockData: [
          {
            stock: firststock,
            price: dataFetch.priceOne,
            rel_likes: 0
          },
          {
            stock: secondstock,
            price: dataFetch.priceTwo,
            rel_likes: 0
          }
        ]
      })
    }
    if (storedtickers === 1) {
      const savedData = dataStored[0]
      const tickerPrice = await fetchSingle(
        savedData.stockTick === firststock ? secondstock : firststock
      )

      const oneinjectresult = await singledatacreator({
        ticker: savedData.stockTick === firststock ? secondstock : firststock,
        price: tickerPrice,
        likes: req.query.like ? [{likedby: originreq}] : []
      })
      if (!req.query.like) {
        return res.status(200).json({
          stockData: [
            {
              stock:
                savedData.stockTick === firststock ? secondstock : firststock,
              price: tickerPrice,
              rel_likes: 0
            },
            {
              stock:
                savedData.stockTick === firststock ? secondstock : firststock,
              price: tickerPrice,
              rel_likes: 0
            }
          ]
        })
      }
    }
    return res
      .status(500)
      .json({message: 'something awfull happened to get to these here parts'})
  } catch (error) {
    logger.info(`nasdaq error: ${error}`)
    return res.status(500).json({message: 'Something really bad happened'})
  }
})
// #endregion
export default MultiplePriceCheckerController
