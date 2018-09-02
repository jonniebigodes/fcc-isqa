import chai from 'chai'
import chaiHttp from 'chai-http'
import mongoose from 'mongoose'
import {before, it, describe, after} from 'mocha'
import server from '../server'

/* eslint-disable */
import PersonalLibraryModel from '../models/PersonalLibrary.model'
/* eslint-enable */
chai.use(chaiHttp)
chai.should()
let idbook = ''

before(done => {
  /* eslint-disable */
  console.log('====================================')
  console.log('clearing library content')
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
      const testcontentlibrary = mongoose.model('personalcontent')
      testcontentlibrary
        .remove({})
        .then(() => {
          done()
        })
        .catch(err => {
          done(err)
        })
    })
})

describe('/POST new book without title', () => {
  it('should return a message returning that no book can be created without title', done => {
    chai
      .request(server)
      .post('/api/books')
      .send()
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

describe('/POST new book', () => {
  it('should post a new book to the collection', done => {
    chai
      .request(server)
      .post('/api/books')
      .send({title: 'dummy'})
      .end((err, res) => {
        if (err) {
          done(err)
        }
        res.should.have.status(201)
        res.body.should.have.property('title').eql('dummy')
        res.body.should.have.property('id')
        done()
      })
  })
})
describe('/POST another new book', () => {
  it('should post a new book to the collection', done => {
    chai
      .request(server)
      .post('/api/books')
      .send({title: 'dummy2'})
      .end((err, res) => {
        if (err) {
          done(err)
        }
        const {id} = res.body
        idbook = id
        /* eslint-disable */
        console.log('====================================')
        console.log(`id=>${idbook}`)
        console.log('====================================')
        /* eslint-enable */
        res.should.have.status(201)
        res.body.should.have.property('title').eql('dummy2')
        res.body.should.have.property('id')
        done()
      })
  })
})
describe('/POST book already added', () => {
  it('should not post a new book to the collection and return error', done => {
    chai
      .request(server)
      .post('/api/books')
      .send({title: 'dummy'})
      .end((err, res) => {
        if (err) {
          done(err)
        }
        res.should.have.status(500)
        res.body.should.have
          .property('message')
          .eql('Book dummy was already added')
        done()
      })
  })
})

describe(`GET information about book dummy 2 with id=>${idbook}`, () => {
  it(`it should return information about book with id=>${idbook}`, done => {
    chai
      .request(server)
      .get(`/api/books/${idbook}`)
      .end((err, res) => {
        if (err) {
          done(err)
        }
        const expectedResult = {
          id: idbook,
          title: 'dummy2',
          comments: []
        }
        res.should.have.status(200)
        res.body.should.include.keys('book')
        res.body.book.should.deep.equal(expectedResult)
        done()
      })
  })
})
describe('/GET list of books added', () => {
  it('should get a list of books stored', done => {
    chai
      .request(server)
      .get('/api/books')
      .end((err, res) => {
        if (err) {
          done(err)
        }
        res.should.have.status(200)
        res.body.should.have.property('data')
        done()
      })
  })
})

describe('/POST book comment to existing book', () => {
  it('should post comment to the collection and return ok', done => {
    chai
      .request(server)
      .post(`/api/books/${idbook}`)
      .send({comment: 'dummycomment'})
      .end((err, res) => {
        if (err) {
          done(err)
        }
        res.should.have.status(200)
        res.body.book.should.have.property('comments').that.is.an('array')
        res.body.book.should.have.property('comments').to.be.lengthOf(1)
        done()
      })
  })
})
describe(`/DELETE deletes book with a provided id`, () => {
  it('should delete a provided book', done => {
    chai
      .request(server)
      .del(`/api/books/${idbook}`)
      .end((err, res) => {
        if (err) {
          done(err)
        }
        res.should.have.status(200)
        res.body.should.have.property('message').eql('book was removed')
        done()
      })
  })
})

describe('/POST book comment to non existing book', () => {
  it('should not post comment to the collection and return error', done => {
    chai
      .request(server)
      .post('/api/books/banana')
      .send({comment: 'dummy'})
      .end((err, res) => {
        if (err) {
          done(err)
        }

        const expectedResult = {
          errors: [
            {
              location: 'params',
              param: 'bookid',
              value: 'banana',
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
describe('/POST empty comment to book', () => {
  it('should not allow injection of empty comments', done => {
    chai
      .request(server)
      .post(`/api/books/${idbook}`)
      .send()
      .end((err, res) => {
        if (err) {
          done(err)
        }
        const expectedResult = {
          errors: [
            {
              location: 'body',
              param: 'comment',
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

describe(`/DELETE deletes book with a non existent id`, () => {
  it('should delete a provided book', done => {
    chai
      .request(server)
      .del('/api/books/banana')
      .end((err, res) => {
        if (err) {
          done(err)
        }
        const expectedResult = {
          errors: [
            {
              location: 'params',
              param: 'bookid',
              value: 'banana',
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

describe('/DELETE clears the list of the books', () => {
  it('should clear the collection and cache if any and return message', done => {
    chai
      .request(server)
      .del('/api/books')
      .end((err, res) => {
        if (err) {
          done(err)
        }
        res.should.have.status(200)
        res.body.should.have
          .property('message')
          .eql('complete delete successful')
        done()
      })
  })
})

after(done => {
  /* eslint-disable */
  console.log('====================================')
  console.log('bye bye personal content')
  console.log('====================================')
  /* eslint-enable */
  mongoose.disconnect()
  done()
})
