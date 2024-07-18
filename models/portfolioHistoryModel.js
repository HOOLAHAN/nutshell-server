// models/portfolioHistoryModel.js
const mongoose = require('mongoose');

const portfolioHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  totalValue: {
    type: Number,
    required: true,
  },
  holdings: [
    {
      symbol: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      averagePrice: {
        type: Number,
        required: true,
      },
    },
  ],
}, { timestamps: true });

portfolioHistorySchema.pre('save', function(next) {
  console.log(`Saving PortfolioHistory for date ${this.date}:`, this);
  next();
});

module.exports = mongoose.model('PortfolioHistory', portfolioHistorySchema);
