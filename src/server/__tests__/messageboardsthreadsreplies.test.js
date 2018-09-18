import chai from 'chai'
import chaiHttp from 'chai-http'
import mongoose from 'mongoose'
import {it, describe, before, after} from 'mocha'
import server from '../server'

/* eslint-disable */
import BoardModel from '../models/Boards.model'
import BoardThreadModel from '../models/BoardThreads.model'
const storeddata = mongoose.model('board')
const testmessageboardthread = mongoose.model('boardthread')
let MessageboardThreads = []
let MessageBoardId = ''
/* eslint-enable */
chai.use(chaiHttp)
chai.should()

describe('testing replies', () => {
  before(done => {
    /* eslint-disable */
    console.log('====================================')
    console.log('getting data ready for replies')
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
          .findOne({title: 'mbtesting'})
          .then(result => {
            const parsedData = JSON.parse(JSON.stringify(result))
            /* eslint-disable */
            MessageBoardId = parsedData._id 
            testmessageboardthread
              .find({board_id: parsedData._id})
              .then(resultthreads => {
                MessageboardThreads = JSON.parse(JSON.stringify(resultthreads))

                done()
              })
              .catch(errorfind => {
                done(errorfind)
              })
              /* eslint-enable */
          })
          .catch(err => {
            done(err)
          })
      })
      .catch(err => {
        done(err)
      })
  })
  // #region post
  describe('/POST replies', () => {
    describe('tests invalid params or missing replies args', () => {
      it('should not allow injection of a new thread without params', done => {
        chai
          .request(server)
          .post('/api/replies/5b8ebfd50fd549227470548b')
          .send({})
          .end((err, res) => {
            if (err) {
              done(err)
            }
            const expectedResult = {
              errors: [
                {
                  location: 'body',
                  param: 'thread_id',
                  msg: 'Invalid value'
                },
                {
                  location: 'body',
                  param: 'thread_id',
                  msg: 'Invalid value'
                },
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
      it('should not inject the new reply non existing messageboard', done => {
        chai
          .request(server)
          .post('/api/replies/5b8ebfd50fd549227470548b')
          .send({
            thread_id: '5b8ebfd50fd549227470548b',
            text: 'ssssss',
            delete_password: 'dddddd'
          })
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
      it('should not inject the new reply non existing thread in messageboard', done => {
        chai
          .request(server)
          .post(`/api/replies/${MessageBoardId}`)
          .send({
            thread_id: '5b8ebfd50fd549227470548b',
            text: 'ssssss',
            delete_password: 'dddddd'
          })
          .end((err, res) => {
            if (err) {
              done(err)
            }

            res.should.have.status(204)
            done()
          })
      })
    })
    describe('testing adition of replies', () => {
      it('should allow injection of a reply to a thread 1', done => {
        chai
          .request(server)
          .post(`/api/replies/${MessageBoardId}`)
          .send({
            thread_id: MessageboardThreads[0]._id, // eslint-disable-line
            text: 'testing reply 1',
            delete_password: 'delete1'
          })
          .end((err, res) => {
            if (err) {
              done(err)
            }
            res.should.have.status(201)
            res.body.should.have.property('message').eql('your reply was added')
            done()
          })
      })
      it('should allow injection of a reply to a thread 1', done => {
        chai
          .request(server)
          .post(`/api/replies/${MessageBoardId}`)
          .send({
            thread_id: MessageboardThreads[0]._id, // eslint-disable-line
            text: 'testing reply 2',
            delete_password: 'delete2'
          })
          .end((err, res) => {
            if (err) {
              done(err)
            }
            res.should.have.status(201)
            res.body.should.have.property('message').eql('your reply was added')
            done()
          })
      })
      it('should allow injection of a reply to a thread 1', done => {
        chai
          .request(server)
          .post(`/api/replies/${MessageBoardId}`)
          .send({
            thread_id: MessageboardThreads[0]._id, // eslint-disable-line
            text: 'testing reply 3',
            delete_password: 'delete3'
          })
          .end((err, res) => {
            if (err) {
              done(err)
            }
            res.should.have.status(201)
            res.body.should.have.property('message').eql('your reply was added')
            done()
          })
      })
      it('should allow injection of a reply to another thread 2', done => {
        chai
          .request(server)
          .post(`/api/replies/${MessageBoardId}`)
          .send({
            thread_id: MessageboardThreads[1]._id, // eslint-disable-line
            text: 'testing reply 4',
            delete_password: 'delete4'
          })
          .end((err, res) => {
            if (err) {
              done(err)
            }
            res.should.have.status(201)
            res.body.should.have.property('message').eql('your reply was added')
            done()
          })
      })
      it('should allow injection of another reply to another thread 2', done => {
        chai
          .request(server)
          .post(`/api/replies/${MessageBoardId}`)
          .send({
            thread_id: MessageboardThreads[1]._id, // eslint-disable-line
            text: 'testing reply 5',
            delete_password: 'delete5'
          })
          .end((err, res) => {
            if (err) {
              done(err)
            }
            res.should.have.status(201)
            res.body.should.have.property('message').eql('your reply was added')
            done()
          })
      })
      it('should allow injection of another reply to another thread 2', done => {
        chai
          .request(server)
          .post(`/api/replies/${MessageBoardId}`)
          .send({
            thread_id: MessageboardThreads[1]._id, // eslint-disable-line
            text: 'testing reply 6',
            delete_password: 'delete6'
          })
          .end((err, res) => {
            if (err) {
              done(err)
            }
            res.should.have.status(201)
            res.body.should.have.property('message').eql('your reply was added')
            done()
          })
      })
      it('should allow injection of another reply to another thread 3', done => {
        chai
          .request(server)
          .post(`/api/replies/${MessageBoardId}`)
          .send({
            thread_id: MessageboardThreads[2]._id, // eslint-disable-line
            text: 'testing reply 7',
            delete_password: 'delete7'
          })
          .end((err, res) => {
            if (err) {
              done(err)
            }
            res.should.have.status(201)
            res.body.should.have.property('message').eql('your reply was added')
            done()
          })
      })
      it('should allow injection of another reply to another thread 3', done => {
        chai
          .request(server)
          .post(`/api/replies/${MessageBoardId}`)
          .send({
            thread_id: MessageboardThreads[2]._id, // eslint-disable-line
            text: 'testing reply 8',
            delete_password: 'delete8'
          })
          .end((err, res) => {
            if (err) {
              done(err)
            }
            res.should.have.status(201)
            res.body.should.have.property('message').eql('your reply was added')
            done()
          })
      })
    })
  })
  // #endregion

  // #region get
  describe('/GET replies', () => {
    describe('invalid params or missing args', () => {
      it('should return error no board and thread provided', done => {
        chai
          .request(server)
          .get('/api/replies/')
          .end((err, res) => {
            if (err) {
              done(err)
            }
            res.should.have.status(404)
            done()
          })
      })
      it('should return error no thread provided', done => {
        chai
          .request(server)
          .get(`/api/replies/${MessageBoardId}`)
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
      it('should return error non existing board', done => {
        chai
          .request(server)
          .get(
            '/api/replies/5b8ebfd50fd549227470548b?thread_id=5b8ebfd50fd549227470548b'
          )
          .end((err, res) => {
            if (err) {
              done(err)
            }
            res.should.have.status(204)
            done()
          })
      })
      it('should return error non existing thread', done => {
        chai
          .request(server)
          .get(
            `/api/replies/${MessageBoardId}?thread_id=5b8ebfd50fd549227470548b`
          )
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
      it('should return a valid thread (0) and all its replies', done => {
        chai
          .request(server)
          .get(
            `/api/replies/${MessageBoardId}?thread_id=${
              MessageboardThreads[0]._id // eslint-disable-line
            }`
          )
          .end((err, res) => {
            if (err) {
              done(err)
            }
            res.should.have.status(200)
            res.body.should.have.property('threadtext').eql('testthread')
            res.body.should.have.property('replies').that.is.an('array')
            res.body.should.have.property('replies').to.be.lengthOf(3)
            done()
          })
      })
      it('should return another valid thread (1) and all its replies', done => {
        chai
          .request(server)
          .get(
            `/api/replies/${MessageBoardId}?thread_id=${
              MessageboardThreads[1]._id // eslint-disable-line
            }`
          )
          .end((err, res) => {
            if (err) {
              done(err)
            }
            res.should.have.status(200)
            res.body.should.have.property('threadtext').eql('testthread2')
            res.body.should.have.property('replies').that.is.an('array')
            res.body.should.have.property('replies').to.be.lengthOf(3)
            done()
          })
      })
    })
  })
  // #endregion
  // #region put
  describe('/PUT replies', () => {
    describe('invalid arguments', () => {
      it('should not allow empty query params for thread and reply', done => {
        chai
          .request(server)
          .put(`/api/replies/${MessageBoardId}`)
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
                },
                {
                  location: 'query',
                  param: 'reply_id',
                  msg: 'Invalid value'
                },
                {
                  location: 'query',
                  param: 'reply_id',
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
      it('should not allow to send empty query reply', done => {
        chai
          .request(server)
          .put(
            `/api/replies/${MessageBoardId}?thread_id=5b8ebfd50fd549227470548b`
          )
          .end((err, res) => {
            if (err) {
              done(err)
            }
            const expectedResult = {
              errors: [
                {
                  location: 'query',
                  param: 'reply_id',
                  msg: 'Invalid value'
                },
                {
                  location: 'query',
                  param: 'reply_id',
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
      it('should not allow report to non existing messageboard', done => {
        chai
          .request(server)
          .put(
            `/api/replies/5b8ebfd50fd549227470548b?thread_id=5b8ebfd50fd549227470548b&reply_id=5b8ebfd50fd549227470548b`
          )
          .end((err, res) => {
            if (err) {
              done(err)
            }
            res.should.have.status(204)
            done()
          })
      })
      it('should not allow report on non existing thread', done => {
        chai
          .request(server)
          .put(
            `/api/replies/${MessageBoardId}?thread_id=5b8ebfd50fd549227470548b&reply_id=5b8ebfd50fd549227470548b`
          )
          .end((err, res) => {
            if (err) {
              done(err)
            }

            res.should.have.status(204)
            done()
          })
      })
      it('should not allow report on non existing reply', done => {
        chai
          .request(server)
          .put(
            `/api/replies/${MessageBoardId}?thread_id=${
              MessageboardThreads[0]._id // eslint-disable-line
            }&reply_id=5b8ebfd50fd549227470548b`
          )
          .end((err, res) => {
            if (err) {
              done(err)
            }
            res.should.have.status(204)
            done()
          })
      })
    })
    describe('valid arguments', () => {
      before(done => {
        testmessageboardthread
          .find({board_id: MessageBoardId})
          .then(resultthreads => {
            MessageboardThreads = JSON.parse(JSON.stringify(resultthreads))
            done()
          })
          .catch(errorfind => {
            done(errorfind)
          })
      })
      it('should allow report the reply', done => {
        const dataThread = MessageboardThreads[0]
        const {_id, replies} = dataThread
        chai
          .request(server)
          .put(
            `/api/replies/${MessageBoardId}?thread_id=${_id}&reply_id=${
              replies[0]._id // eslint-disable-line
            }`
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
      it('should allow report another reply', done => {
        const thread = MessageboardThreads[0]
        const {_id, replies} = thread
        chai
          .request(server)
          .put(
            `/api/replies/${MessageBoardId}?thread_id=${_id}&reply_id=${
              replies[1]._id // eslint-disable-line
            }`
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

  // #endregion

  // #region del
  describe('/DEL replies', () => {
    describe('invalid arguments or missing arguments', () => {
      it('should not allow empty query params for thread and reply', done => {
        chai
          .request(server)
          .del(`/api/replies/${MessageBoardId}`)
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
                },
                {
                  location: 'query',
                  param: 'reply_id',
                  msg: 'Invalid value'
                },
                {
                  location: 'query',
                  param: 'reply_id',
                  msg: 'Invalid value'
                },
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
      it('should not allow to send empty query reply', done => {
        chai
          .request(server)
          .del(
            `/api/replies/${MessageBoardId}?thread_id=5b8ebfd50fd549227470548b&delete_password=1`
          )
          .end((err, res) => {
            if (err) {
              done(err)
            }
            const expectedResult = {
              errors: [
                {
                  location: 'query',
                  param: 'reply_id',
                  msg: 'Invalid value'
                },
                {
                  location: 'query',
                  param: 'reply_id',
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
      it('should not allow delete reply on non existing messageboard', done => {
        chai
          .request(server)
          .del(
            `/api/replies/5b8ebfd50fd549227470548b?thread_id=5b8ebfd50fd549227470548b&reply_id=5b8ebfd50fd549227470548b&delete_password=1`
          )
          .end((err, res) => {
            if (err) {
              done(err)
            }
            res.should.have.status(204)
            done()
          })
      })
      it('should not allow delete on non existing thread', done => {
        chai
          .request(server)
          .del(
            `/api/replies/${MessageBoardId}?thread_id=5b8ebfd50fd549227470548b&reply_id=5b8ebfd50fd549227470548b&delete_password=1`
          )
          .end((err, res) => {
            if (err) {
              done(err)
            }

            res.should.have.status(204)
            done()
          })
      })
      it('should not allow delete on non existing reply', done => {
        chai
          .request(server)
          .del(
            `/api/replies/${MessageBoardId}?thread_id=${
              MessageboardThreads[0]._id // eslint-disable-line
            }&reply_id=5b8ebfd50fd549227470548b&delete_password=1`
          )
          .end((err, res) => {
            if (err) {
              done(err)
            }
            res.should.have.status(204)
            done()
          })
      })
      it('should not allow delete reply with a wrong password', done => {
        const dataThread = MessageboardThreads[0]
        const {_id, replies} = dataThread
        const datareply = replies[0]._id // eslint-disable-line
        chai
          .request(server)
          .del(
            `/api/replies/${MessageBoardId}?thread_id=${_id}&reply_id=${datareply}&delete_password=1`
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
    describe('valid arguments', () => {
      it('should delete from thread 1 reply 1', done => {
        const dataThread = MessageboardThreads[0]
        const {_id, replies} = dataThread
        const datareply = replies[0]._id // eslint-disable-line
        const pwd = replies[0].reply_delete_password
        chai
          .request(server)
          .del(
            `/api/replies/${MessageBoardId}?thread_id=${_id}&reply_id=${datareply}&delete_password=${pwd}`
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
      it('should delete from thread 1 reply 2', done => {
        const dataThread = MessageboardThreads[0]
        const {_id, replies} = dataThread
        const datareply = replies[1]._id // eslint-disable-line
        const pwd = replies[1].reply_delete_password
        chai
          .request(server)
          .del(
            `/api/replies/${MessageBoardId}?thread_id=${_id}&reply_id=${datareply}&delete_password=${pwd}`
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
      it('should delete from thread 2 reply 1', done => {
        const dataThread = MessageboardThreads[1]
        const {_id, replies} = dataThread
        const datareply = replies[0]._id // eslint-disable-line
        const pwd = replies[0].reply_delete_password
        chai
          .request(server)
          .del(
            `/api/replies/${MessageBoardId}?thread_id=${_id}&reply_id=${datareply}&delete_password=${pwd}`
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
      it('should delete from thread 2 reply 2', done => {
        const dataThread = MessageboardThreads[1]
        const {_id, replies} = dataThread
        const datareply = replies[1]._id // eslint-disable-line
        const pwd = replies[1].reply_delete_password
        chai
          .request(server)
          .del(
            `/api/replies/${MessageBoardId}?thread_id=${_id}&reply_id=${datareply}&delete_password=${pwd}`
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

  // #endregion
  after(done => {
    /* eslint-disable */
    console.log('====================================')
    console.log('bye bye replies')
    console.log('====================================')
    /* eslint-enable */
    mongoose.disconnect()
    done()
  })
})
