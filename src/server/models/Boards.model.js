import mongoose from 'mongoose'

const BoardSchema = mongoose.Schema({
  title: {type: String, required: true},
  created: {type: Date, default: new Date()}
})

const BoardModel = mongoose.model('board', BoardSchema)

export default BoardModel
