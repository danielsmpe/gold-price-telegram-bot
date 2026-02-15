const goldApi = require("./goldApi");
const priceHistoryService = require("./priceHistoryService");
const userService = require("./userService");
const AlertService = require("./alertService");

class MonitorService {
  constructor(bot) {
    this.bot = bot;
    this.alertService = new AlertService(bot);
    this.isRunning = false;
  }

  async monitorGoldPrice() {
    const goldData = await goldApi.fetchGoldPrice();

    if (!goldData) return;

    const currentPrice = goldData.priceGram;

    // Save to history
    await priceHistoryService.savePriceHistory(goldData);

    // Get last price from DB
    const lastPrice = await priceHistoryService.getLastPrice();

    // Check for alerts
    if (lastPrice && lastPrice !== currentPrice) {
      const changePercent = ((currentPrice - lastPrice) / lastPrice) * 100;

      const activeUsers = await userService.getAllActiveUsers();

      for (const user of activeUsers) {
        // Check drop alert
        if (changePercent <= -user.priceDropThreshold) {
          await this.alertService.sendAlert(user.chatId, {
            type: "drop",
            changePercent,
            oldPrice: lastPrice,
            newPrice: currentPrice,
            goldData,
          });
        }

        // Check rise alert
        if (changePercent >= user.priceRiseThreshold) {
          await this.alertService.sendAlert(user.chatId, {
            type: "rise",
            changePercent,
            oldPrice: lastPrice,
            newPrice: currentPrice,
            goldData,
          });
        }
      }
    }
  }

  async start(intervalMs = 60000) {
    if (this.isRunning) {
      console.log("⚠️ Monitor is already running");
      return;
    }

    this.isRunning = true;
    console.log("🚀 Starting gold price monitoring...");

    while (this.isRunning) {
      try {
        await this.monitorGoldPrice();
        await this.delay(intervalMs);
      } catch (error) {
        console.error("Monitoring error:", error);
        await this.delay(intervalMs);
      }
    }
  }

  stop() {
    this.isRunning = false;
    console.log("🛑 Stopping gold price monitoring...");
  }

  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

module.exports = MonitorService;
