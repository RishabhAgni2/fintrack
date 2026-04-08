const mongoose = require("mongoose");

const holdingSchema = new mongoose.Schema({
  symbol: {
    type: String,
    required: true,
    uppercase: true,
    trim: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  averagePrice: {
    type: Number,
    required: true,
  },
});

const portfolioSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    holdings: [holdingSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Portfolio", portfolioSchema);
