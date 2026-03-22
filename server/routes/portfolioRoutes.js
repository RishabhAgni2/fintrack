const express = require("express");
const router = express.Router();
const {
  buyStock,
  sellStock,
  getPortfolio,
  getPortfolioSummary,
  getLivePriceForSymbol,
  getTransactions,
} = require("../controllers/portfolioController");

const { protect } = require("../middleware/authMiddleware");

router.post("/buy", protect, buyStock);
router.post("/sell", protect, sellStock);
router.get("/", protect, getPortfolio);
router.get("/summary", protect, getPortfolioSummary);
router.get("/transactions", protect, getTransactions);
router.get("/price/:symbol", protect, getLivePriceForSymbol);

module.exports = router;
