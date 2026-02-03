class AlertService {
  constructor(bot) {
    this.bot = bot;
  }

  async sendAlert(chatId, alertData) {
    const { type, changePercent, oldPrice, newPrice, goldData } = alertData;

    const emoji = type === "drop" ? "📉" : "📈";
    const direction = type === "drop" ? "turun" : "naik";

    const message = `
${emoji} *GOLD PRICE ALERT!*

Harga emas ${direction} sebesar *${Math.abs(changePercent).toFixed(2)}%*

💰 Harga Sebelum: $${oldPrice.toFixed(2)}
💰 Harga Sekarang: $${newPrice.toFixed(2)}
📊 Perubahan: $${(newPrice - oldPrice).toFixed(2)}

⚖️ Per Gram (24K): $${goldData.priceGram.toFixed(2)}
🕐 Waktu: ${goldData.timestamp.toLocaleString("id-ID")}
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
