const { formatRupiah, formatDate } = require("../utils/formatters");

class AlertService {
  constructor(bot) {
    this.bot = bot;
  }

  async sendAlert(chatId, alertData) {
    const { type, changePercent, oldPrice, newPrice, goldData } = alertData;

    const emoji = type === "drop" ? "📉" : "📈";
    const direction = type === "drop" ? "turun" : "naik";

    const message = `
${emoji} *ALERT HARGA EMAS!*

Harga emas ${direction} sebesar *${Math.abs(changePercent).toFixed(2)}%*

💰 Harga Sebelum: ${formatRupiah(oldPrice)}
💰 Harga Sekarang: ${formatRupiah(newPrice)}
📊 Perubahan: ${formatRupiah(newPrice - oldPrice)}

⚖️ Per Gram (24K): ${formatRupiah(goldData.priceGram)}
🕐 Waktu: ${formatDate(goldData.timestamp)}
    `.trim();

    try {
      await this.bot.telegram.sendMessage(chatId, message, {
        parse_mode: "Markdown",
      });
      return true;
    } catch (error) {
      console.error(`Error sending alert to ${chatId}:`, error.message);
      return false;
    }
  }
}

module.exports = AlertService;
