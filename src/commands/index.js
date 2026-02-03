const goldApi = require("../services/goldApi");
const userService = require("../services/userService");
const priceHistoryService = require("../services/priceHistoryService");

function registerCommands(bot) {
  // Start command
  bot.start(async (ctx) => {
    const welcomeMessage = `
👋 Selamat datang di *Gold Price Alert Bot*!

Bot ini akan memberikan notifikasi real-time saat harga emas berubah signifikan.

📌 *Commands:*
/price - Cek harga emas saat ini
/alert - Aktifkan/nonaktifkan alert
/settings - Atur threshold alert
/history - Lihat riwayat harga
/stats - Statistik bot
/help - Bantuan
    `.trim();

    await ctx.reply(welcomeMessage, { parse_mode: "Markdown" });

    await userService.saveUser(ctx.from.id, ctx.chat.id, {
      username: ctx.from.username,
      firstName: ctx.from.first_name,
    });
  });

  // Price command
  bot.command("price", async (ctx) => {
    const goldData = await goldApi.fetchGoldPrice();

    if (!goldData) {
      return ctx.reply("❌ Gagal mengambil data harga emas. Coba lagi nanti.");
    }

    const changeEmoji = goldData.change >= 0 ? "📈" : "📉";

    const message = `
💰 *HARGA EMAS HARI INI*

💵 Harga per Ounce: *$${goldData.price.toFixed(2)}*
⚖️ Harga per Gram (24K): *$${goldData.priceGram.toFixed(2)}*

${changeEmoji} Perubahan: ${goldData.change >= 0 ? "+" : ""}$${goldData.change.toFixed(2)} (${goldData.changePercent >= 0 ? "+" : ""}${goldData.changePercent.toFixed(2)}%)

🕐 Update: ${goldData.timestamp.toLocaleString("id-ID")}
    `.trim();

    await ctx.reply(message, { parse_mode: "Markdown" });
    await userService.updateUserSettings(ctx.from.id, {});
  });

  // Help command
  bot.command("help", async (ctx) => {
    const helpMessage = `
📖 *BANTUAN*

/price - Cek harga emas terkini
/alert - Toggle notifikasi on/off
/settings - Lihat pengaturan
/setdrop <persen> - Set threshold penurunan
/setrise <persen> - Set threshold kenaikan
/history - Lihat 5 harga terakhir
/stats - Lihat statistik bot
/help - Tampilkan pesan ini

💡 *Tips:*
- Aktifkan alert dengan /alert
- Set threshold sesuai kebutuhan
- Bot akan kirim notifikasi otomatis saat harga berubah sesuai threshold
    `.trim();

    await ctx.reply(helpMessage, { parse_mode: "Markdown" });
  });
}

module.exports = registerCommands;
