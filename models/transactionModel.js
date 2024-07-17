// models/transactionModel.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  symbol: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['buy', 'sell'],
    required: true
  },
  transactionPrice: {
    type: Number,
    required: true
  },
  numberOfShares: {
    type: Number,
    required: true
  },
  transactionDate: {
    type: Date,
    required: true
  },
  date: {
    type: Date,
    default: Date.now,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
