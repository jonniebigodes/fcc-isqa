import mongoose from 'mongoose'

const IssuesSchema = mongoose.Schema({
  project: {type: String, required: true},
  issuecreated: {type: Date, default: new Date()},
  issueupdated: {type: Date, default: new Date()},
  open: {type: Boolean, default: true},
  issuetitle: {type: String},
  text: {type: String},
  creator: {type: String},
  assigned: {type: String},
  status: {type: String}
})
const IssuesModel = mongoose.model('issue', IssuesSchema)

export default IssuesModel
