import chai from 'chai';
import chaiHttp from 'chai-http';
import mongoose from 'mongoose';
import { it,describe,before,after } from 'mocha';
import server from '../server';

chai.use(chaiHttp)
chai.should()
/* eslint-disable */
import ProjectIssuesModel from '../models/Issues.model'
/* eslint-enable */
let issueIdentifier=''
const projectID="5b86a61e5ecb141184849fa1"
// #region before testing issues
before(done=>{
     /* eslint-disable */
  console.log('====================================')
  console.log('clearing projects content')
  console.log('====================================')
  /* eslint-enable */
  mongoose.connect('mongodb://localhost:27017/fcc_isqa',{
    autoIndex: false, // Don't build indexes
    reconnectTries: 100, // Never stop trying to reconnect
    reconnectInterval: 2000, // Reconnect every 2000ms
    poolSize: 10, // Maintain up to 10 socket connections
    // If not connected, return errors immediately rather than waiting for reconnect
    bufferMaxEntries: 0,
    bufferCommands: false
  }).then(() => {
    const testcontentprojects = mongoose.model('issue')
    testcontentprojects.deleteMany({project:projectID}).then(() => {
        done()
    }).catch((err) => {
        done(err)
    });
  }).catch((err) => {
    done(err)
  });
})
// #endregion


describe(`/GET issues for project ${projectID}`,()=>{
    it('should return empty array of projects',done=>{
        chai.request(server)
        .get(`/api/issues/${projectID}`)
        .end((err,res)=>{
            if (err){
                done(err)
            }
            res.should.have.status(200)
            res.should.have.status(200)
            res.body.should.have.property('data').that.is.an('array')
            res.body.should.have.property('data').to.be.lengthOf(0)
            done()
        })

    })
})

// #region post 
describe('/POST new issue without params',()=>{
    it('should not allow injection of content',done=>{
        chai.request(server)
        .post(`/api/issues/${projectID}`)
        .send({})
        .end((err,res)=>{
            if (err){
                done(err)
            }
            const expectedResult = {
                errors: [
                    {
                        location: "body",
                        param: "issue_title",
                        msg: "Invalid value"
                    },
                    {
                        location: "body",
                        param: "issue_text",
                        msg: "Invalid value"
                    },
                    {
                        location: "body",
                        param: "created_by",
                        msg: "Invalid value"
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
describe('/POST new issue with params',()=>{
    it('should allow injection of content',done=>{
        chai.request(server)
        .post(`/api/issues/${projectID}`)
        .send({
            issue_title:"dummyissueproject4issue1",
            issue_text:"dummyissueproject4issue1 test",
            created_by:"p4",
            assigned:"p4",
            status:"tbdadmin4"
        })
        .end((err,res)=>{
            if (err){
                done(err)
            }
            const {body}= res
            const {data}= body
            res.should.have.status(201)
            data.should.have.property('issue_title').eql('dummyissueproject4issue1')
            data.should.have.property('issue_text').eql('dummyissueproject4issue1 test')
            data.should.have.property('created_by').eql('p4')
            data.should.have.property('assigned').eql('p4')
            data.should.have.property('status_text').eql('tbdadmin4')
            done()
        })
    })
})
describe('/POST another new issue with params',()=>{
    it('should allow injection of some more',done=>{
        chai.request(server)
        .post(`/api/issues/${projectID}`)
        .send({
            issue_title:"dummyissueproject4issue2",
            issue_text:"dummyissueproject4issue2 test",
            created_by:"p42",
            assigned:"p42",
            status:"tbdadmin42"
        })
        .end((err,res)=>{
            if (err){
                done(err)
            }
            const {body}= res
            const {data}= body
            issueIdentifier= data._id
            res.should.have.status(201)
            data.should.have.property('issue_title').eql('dummyissueproject4issue2')
            data.should.have.property('issue_text').eql('dummyissueproject4issue2 test')
            data.should.have.property('created_by').eql('p42')
            data.should.have.property('assigned').eql('p42')
            data.should.have.property('status_text').eql('tbdadmin42')
            done()
        })
    })
})
describe("/POST new issue to non existing project",()=>{
    it('should not allow posting issues to non existing projects',done=>{
        chai.request(server)
        .post('/api/issues/5b86a61e5ecb141184849fb1')
        .send({
            issue_title:"dum dum",
            issue_text:"dum dum",
            created_by:"dum dum",
            assigned:"dum dum",
            status:"dum dum"
        })
        .end((err,res)=>{
            if (err){
                done(err)
            }
            res.should.have.status(422)
            res.body.should.have.property('message').eql('provided project does not exist')
            done()
        })
    })
})

// #endregion

// #region put
describe(`/PUT update issue=>${issueIdentifier} in project=>${projectID} without data`,()=>{
    it('should not allow change of issue without any data',done=>{
        chai.request(server)
        .put(`/api/issues/${projectID}?issue=${issueIdentifier}`)
        .send({})
        .end((err,res)=>{
            if (err){
                done(err)
            }
            res.should.have.status(422)
            res.body.should.have.property('message').eql('no updated field sent')
            done()
        })
    })
})

describe(`/PUT update issue non existing project`,()=>{
    it('does not update aything cause it does not exist',done=>{
        chai.request(server)
        .put(`/api/issues/5b86a61e5ecb141184849fb1?issue=${issueIdentifier}`)
        .send({})
        .end((err,res)=>{
            if (err){
                done(err)
            }
            res.should.have.status(422)
            res.body.should.have.property('message').eql('provided project does not exist')
            done()
        })
    })
})
describe(`/PUT update issue=>${issueIdentifier} in project=>${projectID} one prop`,()=>{
    it('should update specified property and return update sucess message',done=>{
        chai.request(server)
        .put(`/api/issues/${projectID}?issue=${issueIdentifier}`)
        .send({
            open:false
        })
        .end((err,res)=>{
            if (err){
                done(err)
            }
            res.should.have.status(200)
            res.body.should.have.property('message').eql('successfully updated')
            done()
        })
    })
})
describe(`/PUT update issue=>${issueIdentifier} in project=>${projectID} with 2 props`,()=>{
    it('should update both properties and return update sucess message',done=>{
        chai.request(server)
        .put(`/api/issues/${projectID}?issue=${issueIdentifier}`)
        .send({
            issue_title:"testput2props",
            issue_text:"update put with 2 props"
        })
        .end((err,res)=>{
            if (err){
                done(err)
            }
            res.should.have.status(200)
            res.body.should.have.property('message').eql('successfully updated')
            done()
        })
    })
})
describe(`/PUT update issue=>${issueIdentifier} in project=>${projectID} with 3 props`,()=>{
    it('should update 3 properties and return update sucess message',done=>{
        chai.request(server)
        .put(`/api/issues/${projectID}?issue=${issueIdentifier}`)
        .send({
            issue_title:"testput2props",
            issue_text:"update put with 2 props",
            created_by:"mocha chocolato"
        })
        .end((err,res)=>{
            if (err){
                done(err)
            }
            res.should.have.status(200)
            res.body.should.have.property('message').eql('successfully updated')
            done()
        })
    })
})
describe(`/PUT update issue=>${issueIdentifier} in project=>${projectID} with 3 props`,()=>{
    it('should update 4 properties and return update sucess message',done=>{
        chai.request(server)
        .put(`/api/issues/${projectID}?issue=${issueIdentifier}`)
        .send({
            issue_title:"testput2props",
            issue_text:"update put with 2 props",
            created_by:"mocha chocolato",
            assigned:"nom nom"
        })
        .end((err,res)=>{
            if (err){
                done(err)
            }
            res.should.have.status(200)
            res.body.should.have.property('message').eql('successfully updated')
            done()
        })
    })
})
describe(`/PUT update issue=>${issueIdentifier} in project=>${projectID} with 4 props`,()=>{
    it('should update 4 properties and return update sucess message',done=>{
        chai.request(server)
        .put(`/api/issues/${projectID}?issue=${issueIdentifier}`)
        .send({
            issue_title:"testput2props",
            issue_text:"update put with 2 props",
            created_by:"mocha chocolato",
            assigned:"nom nom"
        })
        .end((err,res)=>{
            if (err){
                done(err)
            }
            res.should.have.status(200)
            res.body.should.have.property('message').eql('successfully updated')
            done()
        })
    })
})
describe(`/PUT update issue=>${issueIdentifier} in project=>${projectID} with full update`,()=>{
    it('should update the entire object properties and return update sucess message',done=>{
        chai.request(server)
        .put(`/api/issues/${projectID}?issue=${issueIdentifier}`)
        .send({
            issue_title:"testput2props",
            issue_text:"update put with 2 props",
            created_by:"mocha chocolato",
            assigned:"nom nom",
            status:"testing out put",
            open:true
        })
        .end((err,res)=>{
            if (err){
                done(err)
            }
            res.should.have.status(200)
            res.body.should.have.property('message').eql('successfully updated')
            done()
        })
    })
})
// #endregion

// #region del
describe(`/DEL issue without params`,()=>{
    it('should return error 422 with invalid arguments',done=>{
        chai.request(server)
        .del(`/api/issues/`)
        .end((err,res)=>{
            if (err){
                done(err)
            }
            
            res.should.have.status(404)
            done()
        })
    })
})
describe(`/DEL issue without issue param`,()=>{
    it('should return error 422 with invalid arguments issue',done=>{
        chai.request(server)
        .del(`/api/issues/${projectID}`)
        .end((err,res)=>{
            if (err){
                done(err)
            }
            const expectedResult = {
                errors: [
                    {
                        location: "query",
                        param: "issue",
                        msg: "Invalid value"
                    },
                    {
                        location: "query",
                        param: "issue",
                        msg: "Invalid value"
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
describe(`/DEL to non existing issue`,()=>{
    it('should return error 422 without any deletion done',done=>{
        chai.request(server)
        .del(`/api/issues/${projectID}?issue=5b86a61e5ecb141184849fb1`)
        .end((err,res)=>{
            if (err){
                done(err)
            }
            res.should.have.status(422)
            res.body.should.have.property('message').eql('deleted 5b86a61e5ecb141184849fb1 failed')
            done()
        })
    })
})
describe(`/DEL issue=>${issueIdentifier}`,()=>{
    it('should return error 422 without any deletion done',done=>{
        chai.request(server)
        .del(`/api/issues/${projectID}?issue=${issueIdentifier}`)
        .end((err,res)=>{
            if (err){
                done(err)
            }
            res.should.have.status(200)
            res.body.should.have.property('message').eql(`deleted ${issueIdentifier}`)
            done()
        })
    })
})

// #endregion
// #region after testing issues
after(done => {
    /* eslint-disable */
    console.log('====================================')
    console.log('bye bye issues')
    console.log('====================================')
    /* eslint-enable */
    mongoose.disconnect()
    done()
})
// #endregion