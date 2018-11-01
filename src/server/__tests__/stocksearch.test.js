import chai from 'chai'
import chaiHttp from 'chai-http'
import mongoose from 'mongoose'
import {before, it, describe, after} from 'mocha'
import server from '../server'

import StockModel from '../models/Stocks.model' /* eslint-disable-line */

chai.use(chaiHttp)
chai.should()

describe('testing stock price checker', () => {
  before(done => {
    console.log('====================================')
    console.log('clearing stocks content')
    console.log('====================================')
    mongoose
      .connect(
        'mongodb://localhost:27017/fcc_isqa',
        {
          autoIndex: false, // Don't build indexes
          reconnectTries: 100, // Never stop trying to reconnect
          reconnectInterval: 2000, // Reconnect every 2000ms
          poolSize: 10, // Maintain up to 10 socket connections
          // If not connected, return errors immediately rather than waiting for reconnect
          bufferMaxEntries: 0,
          bufferCommands: false
        }
      )
      .then(() => {
        const testStock = mongoose.model('stock')
        testStock
          .remove({})
          .then(() => {
            done()
          })
          .catch(err => {
            done(err)
          })
      })
      .catch(err => {
        done(err)
      })
  })
  describe('/GET singlestock', () => {
    it('should return error without any params', done => {
      chai
        .request(server)
        .get('/api/stock-prices')
        .end((err, res) => {
          if (err) {
            done(err)
          }
          const expectedResult = {
            errors: [
              {
                location: 'query',
                param: 'stock',
                msg: 'Invalid value'
              }
            ]
          }
          res.should.have.status(422)
          res.body.should.include.keys('errors')
          res.body.should.deep.equal(expectedResult)
          done()
        })
    })
    it('should return error invalid stock ticker', done => {
      chai
        .request(server)
        .get(`/api/stock-prices?stock=xpto`)
        .end((err, res) => {
          if (err) {
            done(err)
          }
          res.should.have.status(500)
          res.body.should.have
            .property('message')
            .eql('Something really bad happened')
          done()
        })
    })
    it('should fetch a single valid stock', done => {
      chai
        .request(server)
        .get('/api/stock-prices?stock=fb')
        .end((err, res) => {
          if (err) {
            done(err)
          }
          res.should.have.status(200)
          res.body.should.have.property('stockData')
          res.body.stockData.should.include.keys('stock')
          res.body.stockData.should.include.keys('price')
          res.body.stockData.should.include.keys('likes')

          done()
        })
    })
    it('should fetch a single valid stock with like', done => {
      chai
        .request(server)
        .get('/api/stock-prices?stock=fb&like=true')
        .end((err, res) => {
          if (err) {
            done(err)
          }
          res.should.have.status(200)
          res.body.should.have.property('stockData')
          res.body.stockData.should.have.property('likes').eql(1)
          done()
        })
    })
    it('should fetch a stock with like and should not update likes', done => {
      chai
        .request(server)
        .get('/api/stock-prices?stock=fb&like=true')
        .end((err, res) => {
          if (err) {
            done(err)
          }
          res.should.have.status(200)
          res.body.should.have.property('stockData')
          res.body.stockData.should.have.property('likes').eql(1)
          done()
        })
    })
    it('should fetch a stock with like and should update likes', done => {
      chai
        .request(server)
        .get('/api/stock-prices?stock=fb&like=true')
        .set('x-forwarded-for', '192.168.1.22')
        .end((err, res) => {
          if (err) {
            done(err)
          }
          res.should.have.status(200)
          res.body.should.have.property('stockData')
          res.body.stockData.should.have.property('likes').eql(2)
          done()
        })
    })
  })
  describe('/GET multiple stocks', () => {
    it('should fetch two non existing tickers no like', done => {
      chai
        .request(server)
        .get('/api/stock-prices?stock=csco&stock=adbe')
        .end((err, res) => {
          if (err) {
            done(err)
          }
          res.should.have.status(200)
          res.body.should.have.property('stockData')
          res.body.should.have.property('stockData').that.is.an('array')
          res.body.should.have.property('stockData').to.be.lengthOf(2)
          done()
        })
    })
    it('should fetch two cached tickers', done => {
      chai
        .request(server)
        .get('/api/stock-prices?stock=csco&stock=adbe')
        .end((err, res) => {
          if (err) {
            done(err)
          }
          res.should.have.status(200)
          res.body.should.have.property('stockData')
          res.body.should.have.property('stockData').that.is.an('array')
          res.body.should.have.property('stockData').to.be.lengthOf(2)
          done()
        })
    })
    it('should fetch two cached tickers with like', done => {
      chai
        .request(server)
        .get('/api/stock-prices?stock=csco&stock=adbe&like=true')
        .end((err, res) => {
          if (err) {
            done(err)
          }
          res.should.have.status(200)
          res.body.should.have.property('stockData')
          res.body.should.have.property('stockData').that.is.an('array')
          res.body.should.have.property('stockData').to.be.lengthOf(2)
          const firstItem = res.body.stockData[0]
          const secondItem = res.body.stockData[1]
          firstItem.should.have.property('rel_likes').eql(0)
          secondItem.should.have.property('rel_likes').eql(0)
          done()
        })
    })
  })

  after(done => {
    console.log('====================================')
    console.log('bye bye stocks')
    console.log('====================================')
    mongoose.disconnect()
    done()
  })
})
