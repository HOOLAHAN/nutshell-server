// models/portfolioHistoryModel.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const portfolioHistorySchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  totalValue: {
    type: Number,
    required: true
  },
  holdings: [{
    symbol: String,
    quantity: Number,
    averagePrice: Number
  }]
}, { timestamps: true });

module.exports = mongoose.model('PortfolioHistory', portfolioHistorySchema);
