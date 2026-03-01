const express = require("express");
const router = express.Router();
const {
  buyStock,
  sellStock,
  getPortfolio,
} = require("../controllers/portfolioController");

const { protect } = require("../middleware/authMiddleware");

router.post("/buy", protect, buyStock);
router.post("/sell", protect, sellStock);
router.get("/", protect, getPortfolio);

module.exports = router;