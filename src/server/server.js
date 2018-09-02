import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import mongoose from 'mongoose'
import logger from './logger'
import PriceCheckerController from './controllers/PriceChecker'
import PersonalLibraryController from './controllers/PersonalLibrary'
import IssueTrackerController from './controllers/IssueTracker'
import ProjectIssueTrackerController from './controllers/IssueTrackerProject'
import AnonBardsController from './controllers/MessageBoard'
import BoardThreadsController from './controllers/MessageBoardThreads'
import BoardRepliesController from './controllers/MessageBoardReplies'
import SinglePriceCheckerController from './controllers/SinglePriceChecker'
import MultiplePriceCheckerController from './controllers/MultiplePriceChecker'

const app = express()

app.set('port', process.env.PORT || 5000)
app.use(compression())
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'"],
        fontSrc: ["'self'"]
      }
    },
    referrerPolicy: {
      policy: 'same-origin'
    },
    hidePoweredBy: {
      setTo: 'PHP 4.2.0'
    },
    frameguard: {
      action: 'sameorigin'
    },
    dnsPrefetchControl: true,
    noCache: true,
    xssFilter: {
      setOnOldIE: true
    }
  })
)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cors())

/* eslint-disable */
if (process.env.NODE_ENV !== 'production') {
  const config = require('dotenv').config()
}
/* eslint-enable */

app.use('/api/books', PersonalLibraryController)
app.use('/api/boards', AnonBardsController)
app.use('/api/issues/projects', ProjectIssueTrackerController)
app.use('/api/issues', IssueTrackerController)
app.use('/api/threads', BoardThreadsController)
app.use('/api/replies', BoardRepliesController)
app.use('/api/stock-prices/single', SinglePriceCheckerController)
app.use('/api/stock-prices/multiple', MultiplePriceCheckerController)
app.use('/api/stock-prices', PriceCheckerController)
mongoose
  .connect(
    process.env.NODE_ENV === 'production'
      ? process.env.PROD_MONGODB
      : 'mongodb://localhost:27017/fcc_isqa',
    {
      reconnectTries: 100, // Never stop trying to reconnect
      reconnectInterval: 2000, // Reconnect every 2000ms
      poolSize: 10, // Maintain up to 10 socket connections
      // If not connected, return errors immediately rather than waiting for reconnect
      bufferMaxEntries: 0,
      bufferCommands: false
    }
  )
  .then(() => {
    logger.info(`connection established`)
  })
  .catch(err => {
    logger.error(`error fcc-isqa:${err}`)
  })

app.listen(app.get('port'), error => {
  if (error) {
    logger.error(`error fcc-isqa:${error}`)
  } else {
    logger.info(`fcc-isqa is running on port ${app.get('port')}`)
  }
})

process.on('SIGINT', () => {
  logger.info(`fcc-isqa is going down`)
  mongoose.disconnect()
  process.exit(0)
})
export default app
