const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  chatId: { type: String, required: true },
  username: String,
  firstName: String,
  alertEnabled: { type: Boolean, default: true },
  priceDropThreshold: { type: Number, default: 0 },
  priceRiseThreshold: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  lastActiveAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);
