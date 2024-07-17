// models/portfolioModel.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const portfolioSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  totalValue: {
    type: Number,
    required: true,
    default: 0
  },
  holdings: [{
    symbol: String,
    quantity: Number,
    averagePrice: Number
  }]
}, { timestamps: true });

module.exports = mongoose.model('Portfolio', portfolioSchema);
