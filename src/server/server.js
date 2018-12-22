import path from 'path'
import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import mongoose from 'mongoose'
import logger from './logger'

/* eslint-disable */
const DataConversionController =
  process.env.NODE_ENV !== 'production'
    ? require('./controllers/DataConverter').default
    : require('./DataConverter').default
const PersonalLibraryController =
  process.env.NODE_ENV !== 'production'
    ? require('./controllers/PersonalLibrary').default
    : require('./PersonalLibrary').default

const PriceCheckerController =
  process.env.NODE_ENV !== 'production'
    ? require('./controllers/PriceChecker').default
    : require('./PriceChecker').default
const IssueTrackerController =
  process.env.NODE_ENV !== 'production'
    ? require('./controllers/IssueTracker').default
    : require('./IssueTracker').default
const ProjectIssueTrackerController =
  process.env.NODE_ENV !== 'production'
    ? require('./controllers/IssueTrackerProject').default
    : require('./IssueTrackerProject').default
const AnonBardsController =
  process.env.NODE_ENV !== 'production'
    ? require('./controllers/MessageBoard').default
    : require('./MessageBoard').default
const BoardThreadsController =
  process.env.NODE_ENV !== 'production'
    ? require('./controllers/MessageBoardThreads').default
    : require('./MessageBoardThreads').default
const BoardRepliesController =
  process.env.NODE_ENV !== 'production'
    ? require('./controllers/MessageBoardReplies').default
    : require('./MessageBoardReplies').default
const SinglePriceCheckerController =
  process.env.NODE_ENV !== 'production'
    ? require('./controllers/SinglePriceChecker').default
    : require('./SinglePriceChecker').default
const MultiplePriceCheckerController =
  process.env.NODE_ENV !== 'production'
    ? require('./controllers/MultiplePriceChecker').default
    : require('./MultiplePriceChecker').default
/* eslint-enable */

const app = express()

app.set('port', process.env.PORT || 5000)
app.use(compression())
app.use(express.static(path.join(__dirname, '../dist')))

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
    },
    noSniff: true
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
app.use('/api/convert', DataConversionController)
app.use('/api/books', PersonalLibraryController)
app.use('/api/boards', AnonBardsController)
app.use('/api/threads', BoardThreadsController)
app.use('/api/replies', BoardRepliesController)
app.use('/api/projects', ProjectIssueTrackerController)
app.use('/api/issues', IssueTrackerController)
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
app.get('*', (req, res) => {
  res.sendFile('index.html', {
    root: path.join(
      __dirname,
      process.env.NODE_ENV !== 'production' ? '../../dist/' : '../dist/'
    )
  })
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
