import chai from 'chai'
import chaiHttp from 'chai-http'
import {it, describe} from 'mocha'
import server from '../server'

chai.use(chaiHttp)
chai.should()

describe('Testing metric converter', () => {
  describe('testing valid arguments', () => {
    it('should query the server and return the conversion of 20 liters', done => {
      chai
        .request(server)
        .get('/api/convert')
        .query({input: '20L'})
        .end((err, res) => {
          if (err) {
            done(err)
          }
          const expectedResult = {
            initNum: 20,
            initUnit: 'l',
            returnNum: 5.283443537159779,
            returnUnit: 'gal',
            stringresult: '20 liters converts to 5.28344 gallons'
          }
          res.should.have.status(200)
          res.body.toString().should.equal(expectedResult.toString())
          done()
        })
    })
    it('should query the server and return the conversion of 100km', done => {
      chai
        .request(server)
        .get('/api/convert')
        .query({input: '100km'})
        .end((err, res) => {
          if (err) {
            done(err)
          }
          const expectedResult = {
            initNum: 100,
            initUnit: 'km',
            returnNum: 62.137273664980675,
            returnUnit: 'mi',
            stringresult: '100 kilometers converts to 62.13727 miles'
          }
          res.should.have.status(200)
          res.body.toString().should.equal(expectedResult.toString())
          done()
        })
    })
    it('should query the server and return the conversion of 32kg', done => {
      chai
        .request(server)
        .get('/api/convert')
        .query({input: '32kg'})
        .end((err, res) => {
          if (err) {
            done(err)
          }
          const expectedResult = {
            initNum: 32,
            initUnit: 'kg',
            returnNum: 70.54798144588088,
            returnUnit: 'lbs',
            stringresult: '32 kilograms converts to 70.54798 pounds'
          }
          res.should.have.status(200)
          res.body.toString().should.equal(expectedResult.toString())
          done()
        })
    })
  })
  describe('testing invalid arguments', () => {
    it('should query the server with empty query and return error', done => {
      chai
        .request(server)
        .get('/api/convert')
        .end((err, res) => {
          if (err) {
            done(err)
          }
          const expectedResult = {
            errors: [
              {
                location: 'query',
                param: 'input',
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
    it('should query the server and return invalid arguments (unit)(60g)', done => {
      chai
        .request(server)
        .get('/api/convert')
        .query({input: '60gxpto'})
        .end((err, res) => {
          if (err) {
            done(err)
          }
          res.should.have.status(200)
          res.body.should.eql('invalid unit')
          done()
        })
    })
    it('should query the server and return invalid arguments(number) (5/9.1/4kg)', done => {
      chai
        .request(server)
        .get('/api/convert')
        .query({input: '5/9.1/4kg'})
        .end((err, res) => {
          if (err) {
            done(err)
          }
          res.should.have.status(200)
          res.body.should.equal('invalid number')
          done()
        })
    })
    it('should query the server and return invalid arguments(number and unit)(5/9.1/4kilomegagram)', done => {
      chai
        .request(server)
        .get('/api/convert')
        .query({input: '5/9.1/4kilomegagram'})
        .end((err, res) => {
          if (err) {
            done(err)
          }

          res.should.have.status(200)
          // check by debug res.body.should.equal('invalid number and unit')
          res.body.should.equal('invalid number')
          done()
        })
    })
    it('should query the server and return a valid conversion without input only unit(kg no number)', done => {
      chai
        .request(server)
        .get('/api/convert')
        .query({input: 'kg'})
        .end((err, res) => {
          if (err) {
            done(err)
          }
          const expectedResult = {
            initNum: 1,
            initUnit: 'kg',
            returnNum: 2.2046244201837775,
            returnUnit: 'lbs',
            stringresult: '1 kilograms converts to 2.20462 pounds'
          }
          res.should.have.status(200)
          res.body.toString().should.equal(expectedResult.toString())
          done()
        })
    })
  })
})
