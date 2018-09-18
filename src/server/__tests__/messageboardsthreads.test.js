import chai from 'chai'
import chaiHttp from 'chai-http'
import mongoose from 'mongoose'
import {it, describe, before, after} from 'mocha'
import server from '../server'

/* eslint-disable */
import BoardModel from '../models/Boards.model'
import BoardThreadModel from '../models/BoardThreads.model'
const testmessageboardthread = mongoose.model('boardthread')
const storeddata = mongoose.model('boardthread')
/* eslint-enable */
chai.use(chaiHttp)
chai.should()

let MessageboardId = ''
let threadstests = []
describe('testing threads', () => {
  before(done => {
    /* eslint-disable */
    console.log('====================================')
    console.log('clearing threads content')
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
        storeddata
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
  describe('/POST threads', () => {
    describe('tests with invalid params or missing args', () => {
      it('should not allow injection of a new thread without params', done => {
        chai
          .request(server)
          .post('/api/threads/5b8ebfd50fd549227470548b')
          .send({})
          .end((err, res) => {
            if (err) {
              done(err)
            }
            const expectedResult = {
              errors: [
                {
                  location: 'body',
                  param: 'delete_password',
                  msg: 'Invalid value'
                },
                {
                  location: 'body',
                  param: 'text',
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
      it('should not inject the new thread non existing messageboard', done => {
        chai
          .request(server)
          .post('/api/threads/5b8ebfd50fd549227470548b')
          .send({text: 'ssssss', delete_password: 'dddddd'})
          .end((err, res) => {
            if (err) {
              done(err)
            }
            res.should.have.status(422)
            res.body.should.have
              .property('message')
              .eql('the specified board does not exist')
            done()
          })
      })
    })
    describe('applies tests to the thread creation endpoint', () => {
      before(DoneInjectBoard => {
        const testmessageboardthread = mongoose.model('board')
        testmessageboardthread
          .create({title: 'mbtesting'})
          .then(result => {
            const dataparsed = JSON.parse(JSON.stringify(result))
            /* eslint-disable */
            MessageboardId = dataparsed._id
            /* eslint-enable */
            DoneInjectBoard()
          })
          .catch(err => {
            DoneInjectBoard(err)
          })
      })
      it('should allow the injection of a new thread', done => {
        chai
          .request(server)
          .post(`/api/threads/${MessageboardId}`)
          .send({text: 'testthread', delete_password: 'testdelpwd'})
          .end((err, res) => {
            if (err) {
              done(err)
            }
            res.should.have.status(201)
            res.body.should.have.property('id')
            res.body.should.have.property('text').eql('testthread')
            res.body.should.have.property('board').eql(MessageboardId)
            res.body.should.have.property('deletepassword').eql('testdelpwd')
            res.body.should.have.property('created')
            res.body.should.have.property('bumped')
            res.body.should.have.property('replies').that.is.an('array')
            res.body.should.have.property('replies').to.be.lengthOf(0)
            done()
          })
      })
      it('should allow injection of another thread same board', done => {
        chai
          .request(server)
          .post(`/api/threads/${MessageboardId}`)
          .send({text: 'testthread2', delete_password: 'testdelpwd2'})
          .end((err, res) => {
            if (err) {
              done(err)
            }
            res.should.have.status(201)
            res.body.should.have.property('id')
            res.body.should.have.property('text').eql('testthread2')
            res.body.should.have.property('board').eql(MessageboardId)
            res.body.should.have.property('deletepassword').eql('testdelpwd2')
            res.body.should.have.property('created')
            res.body.should.have.property('bumped')
            res.body.should.have.property('replies').that.is.an('array')
            res.body.should.have.property('replies').to.be.lengthOf(0)
            done()
          })
      })
    })
  })
  describe('/GET endpoint tests', () => {
    describe('invalid params or missing args', () => {
      it('should return error no board and thread provided', done => {
        chai
          .request(server)
          .get('/api/threads/')
          .end((err, res) => {
            if (err) {
              done(err)
            }
            res.should.have.status(404)
            done()
          })
      })

      it('should return error non existing board', done => {
        chai
          .request(server)
          .get('/api/threads/5b8ebfd50fd549227470548b')
          .end((err, res) => {
            if (err) {
              done(err)
            }
            res.should.have.status(204)
            done()
          })
      })
    })
    describe('valid args', () => {
      before(done => {
        testmessageboardthread
          .find({board_id: MessageboardId})
          .then(result => {
            threadstests = JSON.parse(JSON.stringify(result))
            done()
          })
          .catch(err => {
            done(err)
          })
      })
      it('should return a valid thread (0) and all its replies', done => {
        chai
          .request(server)
          .get(`/api/threads/${MessageboardId}`)
          .end((err, res) => {
            if (err) {
              done(err)
            }

            res.should.have.status(200)
            res.body.should.have.property('threads').that.is.an('array')
            res.body.should.have.property('threads').to.be.lengthOf(2)
            done()
          })
      })
    })
  })
  describe('/PUT endpoint tests', () => {
    before(DoneInjectThreads => {
      testmessageboardthread
        .insertMany([
          {
            thread_text: 'test1',
            board_id: MessageboardId,
            thread_delete_password: 'test1'
          },
          {
            thread_text: 'test2',
            board_id: MessageboardId,
            thread_delete_password: 'test2'
          },
          {
            thread_text: 'test3',
            board_id: MessageboardId,
            thread_delete_password: 'test3'
          },
          {
            thread_text: 'test4',
            board_id: MessageboardId,
            thread_delete_password: 'test4'
          }
        ])
        .then(result => {
          threadstests = JSON.parse(JSON.stringify(result))
          DoneInjectThreads()
        })
        .catch(err => {
          DoneInjectThreads(err)
        })
    })
    describe('tests with invalid options or args', () => {
      it('should return error non existing messageboard', done => {
        chai
          .request(server)
          .put(
            `/api/threads/5b8ebfd50fd549227470548b?thread_id=5b8ebfd50fd549227470548b`
          )
          .end((err, res) => {
            if (err) {
              done(err)
            }
            res.should.have.status(422)
            res.body.should.have
              .property('message')
              .eql('the specified board does not exist')
            done()
          })
      })
      it('should return error non existing thread', done => {
        chai
          .request(server)
          .put(
            `/api/threads/${MessageboardId}?thread_id=5b8ebfd50fd549227470548b`
          )
          .end((err, res) => {
            if (err) {
              done(err)
            }
            res.should.have.status(422)
            res.body.should.have
              .property('message')
              .eql('the specified thread does not exist')
            done()
          })
      })
    })
    describe('applies tests on reporting the threads', () => {
      it('should report a thread', done => {
        chai
          .request(server)
          .put(
            `/api/threads/${MessageboardId}?thread_id=${threadstests[0]._id}` // eslint-disable-line
          )
          .end((err, res) => {
            if (err) {
              done(err)
            }
            res.should.have.status(200)
            res.body.should.have.property('message').eql('success')
            done()
          })
      })
      it('should report another thread', done => {
        chai
          .request(server)
          .put(
            `/api/threads/${MessageboardId}?thread_id=${threadstests[1]._id}` // eslint-disable-line
          )
          .end((err, res) => {
            if (err) {
              done(err)
            }
            res.should.have.status(200)
            res.body.should.have.property('message').eql('success')
            done()
          })
      })
    })
  })
  describe('/DEL threads', () => {
    describe('tests applied with invalid arguments or missing data', () => {
      it('should return error reporting that the id of the thread does not exist', done => {
        chai
          .request(server)
          .del('/api/threads/5b8ebfd50fd549227470548b?delete_password=1')
          .end((err, res) => {
            if (err) {
              done(err)
            }
            const expectedResult = {
              errors: [
                {
                  location: 'query',
                  param: 'thread_id',
                  msg: 'Invalid value'
                },
                {
                  location: 'query',
                  param: 'thread_id',
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
      it('should return error reporting that the delete pwd does not exist', done => {
        chai
          .request(server)
          .del(
            '/api/threads/5b8ebfd50fd549227470548b?thread_id=5b8ebfd50fd549227470548b'
          )
          .end((err, res) => {
            if (err) {
              done(err)
            }
            const expectedResult = {
              errors: [
                {
                  location: 'query',
                  param: 'delete_password',
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
      it('should return error reporting that the messageboard does not exist', done => {
        chai
          .request(server)
          .del(
            '/api/threads/5b8ebfd50fd549227470548b?thread_id=5b8ebfd50fd549227470548b&delete_password=1'
          )
          .end((err, res) => {
            if (err) {
              done(err)
            }
            res.should.have.status(422)
            res.body.should.have
              .property('message')
              .eql('the board specified does not exist')
            done()
          })
      })
      it('should return error reporting that the thread does not exist', done => {
        chai
          .request(server)
          .del(
            `/api/threads/${MessageboardId}?thread_id=5b8ebfd50fd549227470548b&delete_password=1`
          )
          .end((err, res) => {
            if (err) {
              done(err)
            }
            res.should.have.status(422)
            res.body.should.have
              .property('message')
              .eql('the specified thread does not exist')
            done()
          })
      })
      it('should return error reporting password is wrong', done => {
        chai
          .request(server)
          .del(
            `/api/threads/${MessageboardId}?thread_id=${
              threadstests[2]._id // eslint-disable-line
            }&delete_password=1`
          )
          .end((err, res) => {
            if (err) {
              done(err)
            }
            res.should.have.status(500)
            res.body.should.have.property('message').eql('incorrect password')
            done()
          })
      })
    })
    describe('removing threads from message board', () => {
      it('should allow remove of a thread from message board', done => {
        chai
          .request(server)
          .del(
            `/api/threads/${MessageboardId}?thread_id=${
              threadstests[2]._id // eslint-disable-line
            }&delete_password=${threadstests[2].thread_delete_password}`
          )
          .end((err, res) => {
            if (err) {
              done(err)
            }
            res.should.have.status(200)
            res.body.should.have.property('message').eql('success')
            done()
          })
      })
      it('should allow remove of a thread from message board', done => {
        chai
          .request(server)
          .del(
            `/api/threads/${MessageboardId}?thread_id=${
              threadstests[3]._id // eslint-disable-line
            }&delete_password=${threadstests[3].thread_delete_password}`
          )
          .end((err, res) => {
            if (err) {
              done(err)
            }
            res.should.have.status(200)
            res.body.should.have.property('message').eql('success')
            done()
          })
      })
    })
  })
  after(done => {
    /* eslint-disable */
    console.log('====================================')
    console.log('bye bye threads')
    console.log('====================================')
    /* eslint-enable */
    mongoose.disconnect()
    done()
  })
})
