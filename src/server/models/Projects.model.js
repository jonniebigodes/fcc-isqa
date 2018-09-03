import mongoose from 'mongoose'

const ProjectIssuesSchema = mongoose.Schema({
  title: {type: String, required: true},
  created: {type: Date, default: new Date()}
})

const ProjectIssuesModel = mongoose.model('project_issue', ProjectIssuesSchema)

export default ProjectIssuesModel
