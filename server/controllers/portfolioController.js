const Portfolio = require("../models/Portfolio");
const Transaction = require("../models/Transaction");
const { getLivePrice } = require("../services/stockService");

/**
 * @desc Buy Stock
 * @route POST /api/portfolio/buy
 */
exports.buyStock = async (req, res) => {
  try {
    const { symbol, quantity, price } = req.body;

    if (!symbol || !quantity || !price) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (quantity <= 0 || !Number.isInteger(Number(quantity))) {
      return res.status(400).json({ message: "Quantity must be a positive whole number" });
    }
    if (price <= 0) {
      return res.status(400).json({ message: "Price must be positive" });
    }

    let portfolio = await Portfolio.findOne({ user: req.user._id });
    if (!portfolio) {
      portfolio = await Portfolio.create({ user: req.user._id, holdings: [] });
    }

    const existingStock = portfolio.holdings.find(
      (stock) => stock.symbol === symbol.toUpperCase()
    );

    if (existingStock) {
      const totalQuantity = existingStock.quantity + quantity;
      const totalCost = existingStock.averagePrice * existingStock.quantity + price * quantity;
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
      symbol: symbol.toUpperCase(),
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
 */
exports.sellStock = async (req, res) => {
  try {
    const { symbol, quantity, price } = req.body;

    if (!symbol || !quantity || !price) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (quantity <= 0 || !Number.isInteger(Number(quantity))) {
      return res.status(400).json({ message: "Quantity must be a positive whole number" });
    }

    const portfolio = await Portfolio.findOne({ user: req.user._id });

    if (!portfolio) {
      return res.status(404).json({ message: "Portfolio not found" });
    }

    const existingStock = portfolio.holdings.find(
      (stock) => stock.symbol === symbol.toUpperCase()
    );

    if (!existingStock) {
      return res.status(400).json({ message: `You don't own any ${symbol.toUpperCase()} shares` });
    }

    if (existingStock.quantity < quantity) {
      return res.status(400).json({
        message: `Insufficient shares. You own ${existingStock.quantity} share(s) of ${symbol.toUpperCase()}`
      });
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
      symbol: symbol.toUpperCase(),
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
 * @desc Get Portfolio Holdings
 * @route GET /api/portfolio
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


/**
 * @desc Get Portfolio Summary with Live P/L
 * @route GET /api/portfolio/summary
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

    const updatedHoldings = await Promise.all(portfolio.holdings.map(async (stock) => {
      try {
        const livePrice = await getLivePrice(stock.symbol);
        const investment = stock.quantity * stock.averagePrice;
        const currentStockValue = stock.quantity * livePrice;
        const profitLoss = currentStockValue - investment;

        return {
          symbol: stock.symbol,
          quantity: stock.quantity,
          averagePrice: stock.averagePrice,
          currentPrice: livePrice,
          investment,
          currentValue: currentStockValue,
          profitLoss,
        };
      } catch {
        console.log("Skipping invalid stock:", stock.symbol);
        return null;
      }
    }));

    const validHoldings = updatedHoldings.filter(Boolean);

    const totalInvestment = validHoldings.reduce(
      (total, stock) => total + stock.investment,
      0
    );
    const currentValue = validHoldings.reduce(
      (total, stock) => total + stock.currentValue,
      0
    );

    const totalProfitLoss = currentValue - totalInvestment;
    const percentageReturn = totalInvestment > 0
      ? (totalProfitLoss / totalInvestment) * 100
      : 0;

    res.status(200).json({
      totalInvestment,
      currentValue,
      totalProfitLoss,
      percentageReturn,
      holdings: validHoldings,
    });

  } catch (error) {
    console.error("SUMMARY ERROR:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};


/**
 * @desc Get live price for a single symbol
 * @route GET /api/portfolio/price/:symbol
 */
exports.getLivePriceForSymbol = async (req, res) => {
  try {
    const { symbol } = req.params;
    if (!symbol) {
      return res.status(400).json({ message: "Symbol is required" });
    }

    const price = await getLivePrice(symbol.toUpperCase());

    if (!price) {
      return res.status(404).json({ message: "Price not found for symbol" });
    }

    res.status(200).json({ symbol: symbol.toUpperCase(), price });

  } catch (error) {
    console.error("PRICE FETCH ERROR:", error.message);
    res.status(404).json({ message: "Could not fetch price for this symbol" });
  }
};


/**
 * @desc Get all transactions for logged in user
 * @route GET /api/portfolio/transactions
 */
exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id })
      .sort({ createdAt: -1 }); // newest first

    res.status(200).json(transactions);

  } catch (error) {
    console.error("TRANSACTIONS ERROR:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};
