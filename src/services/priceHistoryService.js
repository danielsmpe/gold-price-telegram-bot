const { PriceHistory } = require("../models/PriceHistory");

const savePriceHistory = async (goldData) => {
  try {
    const priceRecord = new PriceHistory({
      price: goldData.price,
      priceGram: goldData.priceGram,
      change: goldData.change,
      changePercent: goldData.changePercent,
      timestamp: new Date(goldData.timestamp),
    });
    return await priceRecord.save();
  } catch (error) {
    console.error("Error saving price history:", error);
    throw error;
  }
};

const getRecentPriceHistories = async (limit = 5) => {
  try {
    return await PriceHistory.find().sort({ timestamp: -1 }).limit(limit);
  } catch (error) {
    console.error("Error retrieving recent price histories:", error);
    return [];
  }
};

const getLastPrice = async () => {
  try {
    const lastRecord = await PriceHistory.findOne().sort({ timestamp: -1 });
    return lastRecord ? lastRecord.price : null;
  } catch (error) {
    console.error("Error retrieving last price:", error);
    return null;
  }
};

const getTotalRecords = async () => {
  try {
    return await priceHistory.countDocuments();
  } catch (error) {
    console.error("Error retrieving total records:", error);
    return 0;
  }
};

module.exports = {
  savePriceHistory,
  getRecentPriceHistories,
  getLastPrice,
  getTotalRecords,
};
