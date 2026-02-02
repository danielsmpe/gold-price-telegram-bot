const mongoose = require("mongoose");

const priceHistorySchema = new mongoose.Schema({
  price: { type: Number, required: true },
  priceGram: Number,
  change: Number,
  changePercent: Number,
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("PriceHistory", priceHistorySchema);
