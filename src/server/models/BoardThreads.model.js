import mongoose from 'mongoose'

const BoardThreadSchema = mongoose.Schema({
  thread_text: {type: String, required: true},
  board_id: {type: String, required: true},
  created_on: {type: Date, default: new Date()},
  bumped_on: {type: Date, default: new Date()},
  reported: {type: Boolean, default: false},
  thread_delete_password: {type: String, required: true},
  replies: [
    {
      reply_text: {type: String},
      dateadded: {type: Date},
      reportedreply: {type: Boolean},
      reply_delete_password: {type: String}
    }
  ]
})
const BoardThreadModel = mongoose.model('boardthread', BoardThreadSchema)
export default BoardThreadModel
