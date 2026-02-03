const axios = require("axios");

const fetchGoldPrice = async () => {
  const apikey = process.env.GOLD_API_KEY;
  const url = `https://www.goldapi.io/api/XAU/USD`;

  try {
    const response = await axios.get(url, {
      headers: {
        "x-access-token": apikey,
        "Content-Type": "application/json",
      },
    });
    console.log("Gold price data fetched:", response.data);
    return {
      price: response.data.price,
      priceGram: response.data.price_gram_24k,
      change: response.data.ch,
      changePercent: response.data.chp,
      timestamp: response.data.timestamp,
    };
  } catch (error) {
    console.error("Error fetching gold price:", error);
    return null;
  }
};
module.exports = { fetchGoldPrice };
