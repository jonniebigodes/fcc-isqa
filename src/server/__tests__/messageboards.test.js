import chai from 'chai'
import chaiHttp from 'chai-http'
import mongoose from 'mongoose'
import {it, describe, before, after} from 'mocha'
import server from '../server'

/* eslint-disable */
import BoardModel from '../models/Boards.model'
/* eslint-enable */
chai.use(chaiHttp)
chai.should()
let boardidentifier = ''

describe('test messageboards', () => {
  before(done => {
    /* eslint-disable */
    console.log('====================================')
    console.log('clearing messageboards content')
    console.log('====================================')
    /* eslint-enable */
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
        const testcontentboards = mongoose.model('board')
        testcontentboards
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
  describe('/GET messageboards', () => {
    it('should return array of stored messageboards', done => {
      chai
        .request(server)
        .get('/api/boards')
        .end((err, res) => {
          if (err) {
            done(err)
          }
          res.should.have.status(200)
          res.body.should.have.property('boards').that.is.an('array')
          res.body.should.have.property('boards').to.be.lengthOf(0)
          done()
        })
    })
  })
  describe('/POST messageboards', () => {
    describe('testing with invalid args', () => {
      it('should not allow creation of a new messageboard without title', done => {
        chai
          .request(server)
          .post('/api/boards')
          .send({})
          .end((err, res) => {
            if (err) {
              done(err)
            }
            const expectedResult = {
              errors: [
                {
                  location: 'body',
                  param: 'title',
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
    })
    describe('testing with ok params and args', () => {
      it('should allow creation of a new messageboard', done => {
        chai
          .request(server)
          .post('/api/boards')
          .send({title: 'testmessageboard'})
          .end((err, res) => {
            if (err) {
              done(err)
            }
            res.should.have.status(201)
            res.body.should.have.property('title').eql('testmessageboard')
            res.body.should.have.property('created')
            res.body.should.have.property('threads')
            done()
          })
      })
      it('should not allow creation of a new messageboard with the same title', done => {
        chai
          .request(server)
          .post('/api/boards')
          .send({title: 'testmessageboard'})
          .end((err, res) => {
            if (err) {
              done(err)
            }
            res.should.have.status(422)
            res.body.should.have.property('message').eql('board already exists')
            done()
          })
      })
      it('should allow creation of a new board with title testmessageboard2', done => {
        chai
          .request(server)
          .post('/api/boards')
          .send({title: 'testmessageboard2'})
          .end((err, res) => {
            if (err) {
              done(err)
            }

            const {id} = res.body
            boardidentifier = id

            res.should.have.status(201)
            res.body.should.have.property('title').eql('testmessageboard2')
            res.body.should.have.property('created')
            res.body.should.have.property('threads')
            done()
          })
      })
    })
  })
  describe('/DEL messageboard', () => {
    describe('testing del with invalid args', () => {
      it('should return error with non existing messageboard', done => {
        chai
          .request(server)
          .del('/api/boards/5b8ebfd50fd549227470548b')
          .end((err, res) => {
            if (err) {
              done(err)
            }
            res.should.have.status(422)
            res.body.should.have
              .property('message')
              .eql('no board was stored with that arg 5b8ebfd50fd549227470548b')
            done()
          })
      })
    })
    describe('testing valid args and params', () => {
      it('should allow removing a previously created', done => {
        chai
          .request(server)
          .del(`/api/boards/${boardidentifier}`)
          .end((err, res) => {
            if (err) {
              done(err)
            }
            res.should.have.status(200)
            res.body.should.have.property('message').eql('board was removed')
            done()
          })
      })
    })
  })
  after(done => {
    /* eslint-disable */
    console.log('====================================')
    console.log('bye bye boards')
    console.log('====================================')
    /* eslint-enable */
    mongoose.disconnect()
    done()
  })
})
