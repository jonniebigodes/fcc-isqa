import chai from 'chai'
import chaiHttp from 'chai-http'
import mongoose from 'mongoose'
import {it, describe, before, after} from 'mocha'
import server from '../server'

/* eslint-disable */
import ProjectIssuesModel from '../models/Projects.model'
/* eslint-enable */
chai.use(chaiHttp)
chai.should()

let projectidentifier = ''

describe('Testing project issues', () => {
  before(done => {
    /* eslint-disable */
    console.log('====================================')
    console.log('clearing projects content')
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
        const testcontentproject = mongoose.model('project_issue')
        testcontentproject
          .remove({})
          .then(() => {
            done()
          })
          .catch(err => {
            done(err)
          })
      })
  })
  describe('/GET projects', () => {
    it('should return array of stored projects', done => {
      chai
        .request(server)
        .get('/api/issues/projects')
        .end((err, res) => {
          if (err) {
            done(err)
          }

          res.should.have.status(200)
          res.body.should.have.property('data').that.is.an('array')
          res.body.should.have.property('data').to.be.lengthOf(0)
          done()
        })
    })
  })
  describe('/POST projects', () => {
    it('should allow creating a new project', done => {
      chai
        .request(server)
        .post('/api/issues/projects')
        .send({title: 'testproject'})
        .end((err, res) => {
          if (err) {
            done(err)
          }
          /* console.log('====================================')
          console.log(
            `res status=>${res.status} res body=>${JSON.stringify(
              res.body,
              null,
              2
            )}`
          )
          console.log('====================================') */
          res.should.have.status(201)
          res.body.should.have.property('title').eql('testproject')
          res.body.should.have.property('idproject')
          done()
        })
    })
    it('should return error not allowing to create a project without a title', done => {
      chai
        .request(server)
        .post('/api/issues/projects')
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
    it('should not allow the creation of a project with the same title', done => {
      chai
        .request(server)
        .post('/api/issues/projects')
        .send({title: 'testproject'})
        .end((err, res) => {
          if (err) {
            done(err)
          }
          res.should.have.status(422)
          res.body.should.have
            .property('message')
            .eql('a project with a similar title was already created')
          done()
        })
    })
    it('should allow creating a new project', done => {
      chai
        .request(server)
        .post('/api/issues/projects')
        .send({title: 'testproject2'})
        .end((err, res) => {
          if (err) {
            done(err)
          }
          const {idproject} = res.body
          projectidentifier = idproject
          /* eslint-disable */
          /*  console.log('====================================')
          console.log(`project id=>${projectidentifier}`)
          console.log('====================================') */
          /* eslint-enable */
          res.should.have.status(201)
          res.body.should.have.property('title').eql('testproject2')
          res.body.should.have.property('idproject')
          done()
        })
    })
  })
  describe('/DEL projects', () => {
    it('should allow deletion of a new project', done => {
      chai
        .request(server)
        .del(`/api/issues/projects/${projectidentifier}`)

        .send()
        .end((err, res) => {
          if (err) {
            done(err)
          }
          res.should.have.status(200)
          res.body.should.have
            .property('message')
            .eql(`project ${projectidentifier} deleted`)

          done()
        })
    })
  })
  after(done => {
    /* eslint-disable */
    console.log('====================================')
    console.log('bye bye project issues')
    console.log('====================================')
    /* eslint-enable */
    mongoose.disconnect()
    done()
  })
})
