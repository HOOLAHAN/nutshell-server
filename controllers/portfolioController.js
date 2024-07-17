const Portfolio = require('../models/portfolioModel');
const PortfolioHistory = require('../models/portfolioHistoryModel');
const { fetchHistoricalPrices } = require('../middleware/fetchHistoricalPrices');

const calculateTotalValue = (holdings, prices) => {
  let totalValue = 0;
  holdings.forEach(holding => {
    const price = prices.close;
    totalValue += holding.quantity * price;
  });
  return totalValue;
};

const updatePortfolioHistory = async (userId, symbol, type, quantity, transactionPrice, transactionDate) => {
  const endDate = new Date().toISOString().split('T')[0];
  const historicalPrices = await fetchHistoricalPrices(symbol, transactionDate, endDate);

  let currentHoldings = [];

  for (const date in historicalPrices) {
    let portfolioHistory = await PortfolioHistory.findOne({ user: userId, date });

    if (!portfolioHistory) {
      portfolioHistory = new PortfolioHistory({ user: userId, date, holdings: [], totalValue: 0 });
    }

    currentHoldings = portfolioHistory.holdings;

    // Update holdings
    const holding = currentHoldings.find(h => h.symbol === symbol);
    if (holding) {
      if (type === 'buy') {
        holding.quantity += quantity;
        holding.averagePrice = ((holding.averagePrice * holding.quantity) + (transactionPrice * quantity)) / (holding.quantity + quantity);
      } else {
        holding.quantity -= quantity;
        if (holding.quantity === 0) {
          currentHoldings = currentHoldings.filter(h => h.symbol !== symbol);
        }
      }
    } else if (type === 'buy') {
      currentHoldings.push({ symbol, quantity, averagePrice: transactionPrice });
    }

    portfolioHistory.holdings = currentHoldings;
    portfolioHistory.totalValue = calculateTotalValue(currentHoldings, historicalPrices[date]);
    await portfolioHistory.save();
  }
};

const getPortfolioHistory = async (req, res) => {
  const userId = req.user._id;
  const { startDate, endDate } = req.query;

  try {
    const history = await PortfolioHistory.find({
      user: userId,
      date: { $gte: new Date(startDate), $lte: new Date(endDate) }
    }).sort({ date: 1 });

    res.status(200).json(history);
  } catch (error) {
    console.error('Error fetching portfolio history:', error.message);
    res.status(500).json({ error: 'Unable to fetch portfolio history' });
  }
};

module.exports = { updatePortfolioHistory, getPortfolioHistory };
