const axios = require("axios");

// ===============================
// FETCH USD → IDR RATE
// ===============================
const fetchUsdToIdrRate = async () => {
  try {
    const res = await axios.get("https://open.er-api.com/v6/latest/USD");
    return res.data.rates.IDR;
  } catch (error) {
    console.error("Error fetching USD-IDR rate:", error.message);
    return null;
  }
};

// ===============================
// FETCH GOLD PRICE (RAW NUMBER)
// ===============================
const fetchGoldPrice = async () => {
  const apikey = process.env.GOLD_API_KEY;
  const url = "https://www.goldapi.io/api/XAU/USD";
  const OUNCE_TO_GRAM = 31.1035;

  try {
    const response = await axios.get(url, {
      headers: {
        "x-access-token": apikey,
        "Content-Type": "application/json",
      },
    });

    const usdToIdr = await fetchUsdToIdrRate();
    if (!usdToIdr) return null;

    return {
      pricePerOunce: response.data.price * usdToIdr,
      priceGram: response.data.price_gram_24k * usdToIdr,
      changePerOunce: response.data.ch * usdToIdr,
      changeGram: (response.data.ch * usdToIdr) / OUNCE_TO_GRAM,
      changePercent: response.data.chp,
      timestamp: response.data.timestamp,
    };
  } catch (error) {
    console.error("Error fetching gold price:", error.message);
    return null;
  }
};

module.exports = { fetchGoldPrice };
