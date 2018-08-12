import mongoose from 'mongoose'

const PersonalLibrarySchema = mongoose.Schema({
  title: {type: String, required: true},
  created: {type: Date, default: new Date()},
  comments: [
    {
      commentText: {type: String},
      dateadded: {type: Date, default: new Date()}
    }
  ]
})
const PersonalLibraryModel = mongoose.model(
  'personalcontent',
  PersonalLibrarySchema
)
export default PersonalLibraryModel
