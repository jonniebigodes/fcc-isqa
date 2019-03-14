import '@babel/polyfill'
import express from 'express'
import {validationResult, query} from 'express-validator/check'

const logger =
  process.env.NODE_ENV !== 'production'
    ? require('../logger').default
    : require('./logger').default // eslint-disable-line

const DataConversionController = express.Router()

const unitConverter = {
  gal: {
    entryUnit: 'gal',
    entryText: 'gallons',
    resultUnit: 'L',
    resultText: 'liters',
    value: 3.78541
  },
  l: {
    entryUnit: 'l',
    entryText: 'liters',
    resultUnit: 'gal',
    resultText: 'gallons',
    value: 3.78541
  },
  lbs: {
    entryUnit: 'lbs',
    entryText: 'pounds',
    resultUnit: 'kg',
    resultText: 'kilograms',
    value: 0.453592
  },
  kg: {
    entryUnit: 'kg',
    entryText: 'kilograms',
    resultUnit: 'lbs',
    resultText: 'pounds',
    value: 0.453592
  },
  mi: {
    entryUnit: 'mi',
    entryText: 'miles',
    resultUnit: 'km',
    resultText: 'kilometers',
    value: 1.60934
  },
  km: {
    entryUnit: 'km',
    entryText: 'kilometers',
    resultUnit: 'mi',
    resultText: 'miles',
    value: 1.60934
  }
}

const AlphaNumericTest = /[A-Za-z]+/g
const NumberTest = /\d+(\.\d+)?(\/\d+(\.\d+)?)?/g // eslint-disable-line

DataConversionController.use((req, res, next) => {
  if (process.env.NODE_ENV !== 'test') {
    const sender =
      req.headers['x-forwarded-for'] || req.connection.remoteAddress
    logger.info(
      `converter date=>${new Date()}\n method=>${req.method}\n url=>${
        req.baseUrl
      }${req.path} sender:${sender === ':::1' ? 'localhost' : sender}`
    )
  }
  next() // make sure we go to the next routes and don't stop here
})

const parseNumber = value => {
  const data = value.split(/[a-z]/)[0]
  if (data === '') {
    return 1
  }
  const dataMatch = data.match(NumberTest)

  if (dataMatch.length && dataMatch[0].length === data.length) {
    return data
  }
  return 'invalid number'
}
const parseUnit = value => {
  const unitpos = value.indexOf(value.match(AlphaNumericTest))
  return value.slice(unitpos)
}

const MakeConversion = async value => {
  try {
    const parseinputresult = parseNumber(value)
    const unit = parseUnit(value)

    if (
      !parseinputresult ||
      (parseinputresult === 'invalid number' && unit === 'invalid unit')
    ) {
      return 'invalid number and unit'
    }
    if (!parseinputresult || parseinputresult === 'invalid number') {
      return 'invalid number'
    }
    if (unit === 'invalid unit') {
      return 'invalid unit'
    }

    const dataConvert = unitConverter[unit]
    let operationResult = 0
    if (dataConvert) {
      const {entryUnit, entryText, resultUnit, resultText} = dataConvert
      if (entryUnit === 'gal' || entryUnit === 'lbs' || entryUnit === 'mi') {
        operationResult = parseinputresult * dataConvert.value
      } else {
        operationResult = parseinputresult / dataConvert.value
      }
      return {
        initNum: parseinputresult,
        initUnit: entryUnit,
        returnNum: operationResult,
        returnUnit: resultUnit,
        stringresult: `${parseinputresult} ${entryText} converts to ${Math.round(
          operationResult * 100000
        ) / 100000} ${resultText}`
      }
    }
    return 'invalid unit'
  } catch (error) {
    logger.info(`Conversion Handler error: ${error}`)
    throw new Error(`error converting data\n:${error} `)
  }
}

DataConversionController.get(
  '/',
  [query('input').exists()],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({errors: errors.array()})
    }
    try {
      const dataInput = req.query.input
        .trim()
        .toLowerCase()
        .replace(/\s*/g, '')

      const result = await MakeConversion(dataInput)
      return res.status(200).json(result)
    } catch (error) {
      logger.info(`conversion error: ${error}`)
      return res.status(500).json({message: 'Something really bad happened'})
    }
  }
)

export default DataConversionController
