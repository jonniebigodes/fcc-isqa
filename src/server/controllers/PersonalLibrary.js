import 'babel-polyfill'
import express from 'express'
import Cache from 'memory-cache'
import mongoose from 'mongoose'
import {body, param, validationResult} from 'express-validator/check'

const logger =
  process.env.NODE_ENV !== 'production'
    ? require('../logger').default
    : require('./logger').default // eslint-disable-line

const PersonalLibraryController = express.Router()

// #region library model
/* eslint-disable */
const PersonalLibraryModel =
  process.env.NODE_ENV !== 'production'
    ? require('../models/PersonalLibrary.model').default
    : require('./PersonalLibrary.model').default
const contentLibrary = mongoose.model('personalcontent')

/* eslint-enable */
// #endregion

// #region middleware

PersonalLibraryController.use((req, res, next) => {
  if (process.env.NODE_ENV !== 'test') {
    const sender =
      req.headers['x-forwarded-for'] || req.connection.remoteAddress
    logger.info(
      `library date=>${new Date()}\n method=>${req.method}\n url=>${
        req.baseUrl
      }${req.path} sender:${sender === ':::1' ? 'localhost' : sender}`
    )
  }

  next() // make sure we go to the next routes and don't stop here
})

// #endregion

PersonalLibraryController.route('/pcache').get(async (req, res) => {
  const itemscache = Cache.keys().filter(item => item.startsWith('personal_'))
  return res.status(200).json({data: itemscache.map(item => Cache.get(item))})
})
// #region getalldata
PersonalLibraryController.route('/alldata').get(async (req, res) => {
  try {
    const itemscache = Cache.keys().filter(item => item.startsWith('personal_'))
    if (itemscache.length === 0) {
      // get data from db
      const datacontent = await contentLibrary.find({})

      /* eslint-disable  */
      datacontent.map(item =>
        Cache.put(
          `personal_${item._id}`,
          {
            id: item._id,
            title: item.title,
            comments: item.comments
          },
          18000000
        )
      )
      return res.status(200).json({
        bookdata: datacontent.map(item => {
          return {
            id: item._id,
            title: item.title,
            comments: item.comments
          }
        })
      })
      /* eslint-enable  */
    }
    return res
      .status(200)
      .json({bookdata: itemscache.map(item => Cache.get(item))})
  } catch (error) {
    logger.info(`PersonalLibraryController remove book error: ${error}`)
    return res.status(500).json({message: 'Something really bad happened'})
  }
})
// #endregion

// #region no params
PersonalLibraryController.route('/')
  .get(async (req, res) => {
    try {
      if (Cache.size() === 0) {
        // get data from db
        const datacontent = await contentLibrary.find({})

        /* eslint-disable  */
        datacontent.map(item =>
          Cache.put(
            `personal_${item._id}`,
            {
              id: item._id,
              title: item.title,
              comments: item.comments
            },
            18000000
          )
        )
        return res.status(200).json({
          bookdata: datacontent.map(item => {
            return {
              id: item._id,
              title: item.title,
              commentcount: item.comments.length
            }
          })
        })
        /* eslint-enable  */
      }
      const cacheKeys = Cache.keys().filter(item =>
        item.startsWith('personal_')
      )
      return res
        .status(200)
        .json({bookdata: cacheKeys.map(item => Cache.get(item))})
    } catch (error) {
      logger.info(`PersonalLibraryController error: ${error}`)
      return res.status(500).json({message: 'Something really bad happened'})
    }
  })
  .post([body('title').exists()], async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()})
      }

      // get data from db
      const datacontent = await contentLibrary.findOne({title: req.body.title})

      if (datacontent) {
        return res
          .status(500)
          .json({message: `Book ${req.body.title} was already added`})
      }
      const newBook = await contentLibrary.create({
        title: req.body.title,
        created: new Date(),
        comments: []
      })
      /* eslint-disable  */
      Cache.put(
        `personal_${newBook._id}`,
        {
          id: newBook._id,
          title: newBook.title,
          comments: []
        },
        18000000
      )
      return res.status(201).json({id: newBook._id, title: req.body.title})
      /* eslint-enable  */
    } catch (error) {
      logger.info(`PersonalLibraryController error: ${error}`)
      return res.status(500).json({message: 'Something really bad happened'})
    }
  })
  .delete(async (req, res) => {
    try {
      if (Cache.size) {
        Cache.clear()
      }

      // get data from db
      await contentLibrary.remove({})
      return res.status(200).json({message: 'complete delete successful'})
    } catch (error) {
      logger.info(`PersonalLibraryController del error: ${error}`)
      return res
        .status(500)
        .json({message: 'Something really bad happened clearing the data'})
    }
  })
// #endregion

// #region params request
PersonalLibraryController.route('/:bookid')
  .get(
    [
      param('bookid')
        .exists()
        .isMongoId()
    ],
    async (req, res) => {
      try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
          return res.status(422).json({errors: errors.array()})
        }
        const dataincache = Cache.get(`personal_${req.params.bookid}`)

        if (dataincache) {
          return res.status(200).json({
            book: {
              id: req.params.bookid,
              title: dataincache.title,
              comments: dataincache.comments
            }
          })
        }

        // get data from db
        /* eslint-disable  */
        const datacontent = await contentLibrary.findById(req.params.bookid)
        if (datacontent) {
          Cache.put(
            `personal_${datacontent._id}`,
            {
              title: datacontent.title,
              comments: datacontent.comments
            },
            18000000
          )
          /* eslint-enable  */
          return res.status(200).json({
            book: {
              id: req.params.bookid,
              title: datacontent.title,
              comments: datacontent.comments ? datacontent.comments : []
            }
          })
        }
        return res
          .status(500)
          .json({message: `No book present with id: ${req.params.bookid}`})
      } catch (error) {
        logger.info(
          `PersonalLibraryController get book with id error: ${error}`
        )
        return res.status(500).json({message: 'Something really bad happened'})
      }
    }
  )
  .post(
    [
      param('bookid')
        .exists()
        .isMongoId(),
      body('comment').exists()
    ],
    async (req, res) => {
      try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
          return res.status(422).json({errors: errors.array()})
        }
        const dataincache = Cache.get(`personal_${req.params.bookid}`)
        const datastored = await contentLibrary.findByIdAndUpdate(
          req.params.bookid,
          {
            $push: {
              comments: {
                commentText: req.body.comment
              }
            }
          },
          {safe: true, new: true}
        )

        if (datastored) {
          if (dataincache) {
            /* const newComments= [...dataincache.comments,{comment: req.body.comment, dateadded: new Date()}]
          dataincache.comments=newComments; */
            Cache.del(`personal_${req.params.bookid}`)
          }
          Cache.put(
            `personal_${req.params.bookid}`,
            {
              title: datastored.title,
              comments: datastored.comments.map(item => {
                return {
                  commentText: item.commentText,
                  dateadded: item.dateadded
                }
              })
            },
            18000000
          )

          return res.status(200).json({
            book: {
              id: req.params.bookid,
              title: datastored.title,
              comments: datastored.comments.map(item => {
                return {
                  commentText: item.commentText,
                  dateadded: item.dateadded
                }
              })
            }
          })
        }
        return res
          .status(500)
          .json({message: `No book present with id: ${req.params.bookid}`})
      } catch (error) {
        logger.info(
          `PersonalLibraryController post comment book error: ${error}`
        )
        return res.status(500).json({message: 'Something really bad happened'})
      }
    }
  )
  .delete(
    [
      param('bookid')
        .exists()
        .isMongoId()
    ],
    async (req, res) => {
      try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
          return res.status(422).json({errors: errors.array()})
        }
        const cachedItem = Cache.get(`personal_${req.params.bookid}`)
        if (cachedItem) {
          Cache.del(`personal_${req.params.bookid}`)
        }
        const book = await contentLibrary.findByIdAndRemove(req.params.bookid)
        if (book) {
          return res.status(200).json({message: `book was removed`})
        }
        return res
          .status(500)
          .json({message: `no book was present for ${req.params.bookid}`})
      } catch (error) {
        logger.info(`PersonalLibraryController remove book error: ${error}`)
        return res.status(500).json({message: 'Something really bad happened'})
      }
    }
  )
// #endregion

export default PersonalLibraryController
