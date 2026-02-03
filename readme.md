# Gold Price Telegram Bot

Bot Telegram untuk monitoring harga emas real-time dengan notifikasi otomatis saat terjadi perubahan harga signifikan.

## Features

- 💰 Real-time gold price tracking
- 📊 Custom alert thresholds per user
- 📈 Price history tracking
- ⚙️ User preferences management
- 🔔 Automatic notifications

## Tech Stack

- Node.js
- Telegraf (Telegram Bot Framework)
- MongoDB (Database)
- GoldAPI.io (Gold Price Data)

## Setup

### 1. Clone Repository

```bash
git clone <your-repo-url>
cd gold-price-telegram-bot
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup MongoDB

**Option A: Using Docker (Recommended)**

```bash
docker-compose up -d
```

**Option B: Local MongoDB**

Install MongoDB dan jalankan service.

### 4. Environment Variables

Copy `.env.example` ke `.env` dan isi dengan credentials Anda:

```bash
cp .env.example .env
```

Edit `.env`:

```env
TelegramBotToken=YOUR_TELEGRAM_BOT_TOKEN
GOLD_API_KEY=YOUR_GOLDAPI_KEY
MONGODB_URI=mongodb://localhost:27017/goldbot
```

### 5. Run Bot

```bash
npm start
```

Untuk development:

```bash
npm run dev
```

## Bot Commands

- `/start` - Mulai bot
- `/price` - Cek harga emas saat ini
- `/alert` - Toggle notifikasi on/off
- `/settings` - Lihat pengaturan alert
- `/setdrop <persen>` - Set threshold penurunan
- `/setrise <persen>` - Set threshold kenaikan
- `/history` - Lihat 5 harga terakhir
- `/stats` - Statistik bot
- `/help` - Bantuan

## Project Structure

```
.
├── src/
│   ├── commands/       # Bot commands
│   ├── config/         # Configuration files
│   ├── models/         # MongoDB models
│   └── services/       # Business logic services
├── index.js            # Main entry point
├── docker-compose.yml  # Docker configuration
└── package.json        # Dependencies
```

## License

MIT
