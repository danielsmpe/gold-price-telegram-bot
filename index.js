require("dotenv").config();
const { Telegraf } = require("telegraf");
const connectDB = require("./src/config/database");
const registerCommands = require("./src/commands");
const MonitorService = require("./src/services/monitorService");

const bot = new Telegraf(process.env.TelegramBotToken);

// Connect to database
connectDB();

// Register commands
registerCommands(bot);

// Initialize monitor
const monitor = new MonitorService(bot);

// Launch bot
bot.launch().then(() => {
  console.log("✅ Bot started successfully!");
  monitor.start(60000); // Check every 1 minute
});

// Enable graceful stop
process.once("SIGINT", () => {
  monitor.stop();
  bot.stop("SIGINT");
});

process.once("SIGTERM", () => {
  monitor.stop();
  bot.stop("SIGTERM");
});
