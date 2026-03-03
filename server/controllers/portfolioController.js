const Portfolio = require("../models/Portfolio");
const Transaction = require("../models/Transaction");

/**
 * @desc Add Stock (BUY)
 * @route POST /api/portfolio/buy
 * @access Private
 */
exports.buyStock = async (req, res) => {
  try {
    const { symbol, quantity, price } = req.body;

    if (!symbol || !quantity || !price) {
      return res.status(400).json({ message: "All fields are required" });
    }

    let portfolio = await Portfolio.findOne({ user: req.user._id });

    if (!portfolio) {
      portfolio = await Portfolio.create({
        user: req.user._id,
        holdings: [],
      });
    }

    const existingStock = portfolio.holdings.find(
      (stock) => stock.symbol === symbol.toUpperCase()
    );

    if (existingStock) {
      const totalQuantity = existingStock.quantity + quantity;
      const totalCost =
        existingStock.averagePrice * existingStock.quantity +
        price * quantity;

      existingStock.quantity = totalQuantity;
      existingStock.averagePrice = totalCost / totalQuantity;
    } else {
      portfolio.holdings.push({
        symbol: symbol.toUpperCase(),
        quantity,
        averagePrice: price,
      });
    }

    await portfolio.save();

    await Transaction.create({
      user: req.user._id,
      symbol,
      type: "BUY",
      quantity,
      price,
    });

    res.status(201).json({ message: "Stock purchased successfully", portfolio });

  } catch (error) {
    console.error("BUY ERROR:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};


/**
 * @desc Sell Stock
 * @route POST /api/portfolio/sell
 * @access Private
 */
exports.sellStock = async (req, res) => {
  try {
    const { symbol, quantity, price } = req.body;

    const portfolio = await Portfolio.findOne({ user: req.user._id });

    if (!portfolio) {
      return res.status(404).json({ message: "Portfolio not found" });
    }

    const existingStock = portfolio.holdings.find(
      (stock) => stock.symbol === symbol.toUpperCase()
    );

    if (!existingStock || existingStock.quantity < quantity) {
      return res.status(400).json({ message: "Insufficient shares" });
    }

    existingStock.quantity -= quantity;

    if (existingStock.quantity === 0) {
      portfolio.holdings = portfolio.holdings.filter(
        (stock) => stock.symbol !== symbol.toUpperCase()
      );
    }

    await portfolio.save();

    await Transaction.create({
      user: req.user._id,
      symbol,
      type: "SELL",
      quantity,
      price,
    });

    res.status(200).json({ message: "Stock sold successfully", portfolio });

  } catch (error) {
    console.error("SELL ERROR:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};


/**
 * @desc Get Portfolio
 * @route GET /api/portfolio
 * @access Private
 */
exports.getPortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ user: req.user._id });

    if (!portfolio) {
      return res.status(200).json({ holdings: [] });
    }

    res.status(200).json(portfolio);

  } catch (error) {
    console.error("PORTFOLIO ERROR:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};
const { getLivePrice } = require("../services/stockService");

/**
 * @desc Get Portfolio Summary (Live P/L)
 * @route GET /api/portfolio/summary
 * @access Private
 */
exports.getPortfolioSummary = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ user: req.user._id });

    if (!portfolio || portfolio.holdings.length === 0) {
      return res.status(200).json({
        totalInvestment: 0,
        currentValue: 0,
        totalProfitLoss: 0,
        percentageReturn: 0,
        holdings: [],
      });
    }

    let totalInvestment = 0;
    let currentValue = 0;

    const updatedHoldings = [];

    for (const stock of portfolio.holdings) {
  let livePrice;

  try {
    livePrice = await getLivePrice(stock.symbol);
  } catch (err) {
    console.log("Skipping invalid stock:", stock.symbol);
    continue; // 🔥 skip this stock
  }

  const investment = stock.quantity * stock.averagePrice;
  const currentStockValue = stock.quantity * livePrice;
  const profitLoss = currentStockValue - investment;

  totalInvestment += investment;
  currentValue += currentStockValue;

  updatedHoldings.push({
    symbol: stock.symbol,
    quantity: stock.quantity,
    averagePrice: stock.averagePrice,
    currentPrice: livePrice,
    investment,
    currentValue: currentStockValue,
    profitLoss,
  });
}

    const totalProfitLoss = currentValue - totalInvestment;

    const percentageReturn =
      totalInvestment > 0
        ? (totalProfitLoss / totalInvestment) * 100
        : 0;

    res.status(200).json({
      totalInvestment,
      currentValue,
      totalProfitLoss,
      percentageReturn,
      holdings: updatedHoldings,
    });

  } catch (error) {
    console.error("SUMMARY ERROR:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};