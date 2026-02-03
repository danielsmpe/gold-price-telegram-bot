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

  // Alert toggle command
  bot.command("alert", async (ctx) => {
    const user = await userService.getUser(ctx.from.id);

    if (!user) {
      await userService.saveUser(ctx.from.id, ctx.chat.id);
      return ctx.reply("User belum terdaftar. Gunakan /start terlebih dahulu.");
    }

    const newStatus = !user.alertEnabled;

    await userService.updateUserSettings(ctx.from.id, {
      alertEnabled: newStatus,
    });

    const status = newStatus ? "✅ AKTIF" : "❌ NONAKTIF";
    await ctx.reply(`Alert sekarang ${status}`);
  });

  // Settings command
  bot.command("settings", async (ctx) => {
    const user = await userService.getUser(ctx.from.id);

    if (!user) {
      return ctx.reply("Gunakan /start terlebih dahulu.");
    }

    const message = `
⚙️ *PENGATURAN ALERT*

Status: ${user.alertEnabled ? "✅ Aktif" : "❌ Nonaktif"}
📉 Threshold Penurunan: ${user.priceDropThreshold}%
📈 Threshold Kenaikan: ${user.priceRiseThreshold}%

Untuk mengubah threshold, gunakan:
/setdrop <persen> - contoh: /setdrop 1.5
/setrise <persen> - contoh: /setrise 2.0
    `.trim();

    await ctx.reply(message, { parse_mode: "Markdown" });
  });

  // Set drop threshold
  bot.command("setdrop", async (ctx) => {
    const value = parseFloat(ctx.message.text.split(" ")[1]);

    if (isNaN(value) || value <= 0) {
      return ctx.reply("❌ Masukkan angka valid. Contoh: /setdrop 1.5");
    }

    await userService.updateUserSettings(ctx.from.id, {
      priceDropThreshold: value,
    });

    await ctx.reply(`✅ Threshold penurunan diset ke ${value}%`);
  });

  // Set rise threshold
  bot.command("setrise", async (ctx) => {
    const value = parseFloat(ctx.message.text.split(" ")[1]);

    if (isNaN(value) || value <= 0) {
      return ctx.reply("❌ Masukkan angka valid. Contoh: /setrise 2.0");
    }

    await userService.updateUserSettings(ctx.from.id, {
      priceRiseThreshold: value,
    });

    await ctx.reply(`✅ Threshold kenaikan diset ke ${value}%`);
  });

  // History command
  bot.command("history", async (ctx) => {
    const history = await priceHistoryService.getRecentPriceHistory(5);

    if (history.length === 0) {
      return ctx.reply("Belum ada data history.");
    }

    let message = "📊 *RIWAYAT HARGA (5 Terakhir)*\n\n";

    history.forEach((item, index) => {
      message += `${index + 1}. $${item.price.toFixed(2)} - ${item.timestamp.toLocaleString("id-ID")}\n`;
    });

    await ctx.reply(message, { parse_mode: "Markdown" });
    await userService.updateUserSettings(ctx.from.id, {});
  });

  // Stats command
  bot.command("stats", async (ctx) => {
    const { totalUsers, activeUsers } = await userService.getUserStats();
    const totalPrices = await priceHistoryService.getTotalRecords();

    const message = `
📊 *STATISTIK BOT*

👥 Total Users: ${totalUsers}
✅ Active Alerts: ${activeUsers}
📈 Price Records: ${totalPrices}
    `.trim();

    await ctx.reply(message, { parse_mode: "Markdown" });
  });
}
module.exports = registerCommands;
