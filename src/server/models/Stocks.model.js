import mongoose from 'mongoose'

const LikesSchema = mongoose.Schema(
  {
    likedby: {type: String}
  },
  {_id: false}
)

const StocksSchema = mongoose.Schema({
  stockTick: {type: String, required: true},
  stockPrice: {type: Number, required: true},
  likes: [LikesSchema]
})

const StockModel = mongoose.model('stock', StocksSchema)

export default StockModel
