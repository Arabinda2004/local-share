# Backend Setup Guide

## Prerequisites

- Node.js 16+ ([Download](https://nodejs.org/))
- npm or yarn
- Git

## Installation Steps

### 1. Navigate to Backend Directory

```bash
cd backend
```

### 2. Install Dependencies

```bash
npm install
```

This will install:

- `express` - Web server framework
- `socket.io` - WebSocket library
- `sqlite3` - Database
- `cors` - Cross-origin resource sharing
- `dotenv` - Environment variables
- `winston` - Logging
- `qrcode` - QR code generation
- `nodemon` - Development auto-reload (dev only)

### 3. Configure Environment Variables

Create a `.env` file in the `backend/` directory:

```bash
cp .env.example .env
```

Edit `.env` and set your configuration:

```
PORT=3000
HOST=localhost
LOG_LEVEL=debug
DB_PATH=./data/localshare.db
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
```

### 4. Start Development Server

```bash
npm run dev
```

You should see:

```
Backend server running on http://localhost:3000
Environment: development
```

### 5. Verify Server is Running

Open another terminal and test the health endpoint:

```bash
curl http://localhost:3000/api/health
```

Expected response:

```json
{
  "status": "ok",
  "timestamp": "2026-06-19T12:00:00.000Z",
  "uptime": 5.234
}
```

## Project Structure

```
backend/
├── src/
│   ├── server.js              # Express app entry point
│   ├── db/
│   │   ├── init.sql           # Database schema
│   │   └── database.js        # Database connection (Phase 2)
│   ├── handlers/
│   │   └── websocketHandler.js # Socket.IO event handlers (Phase 2)
│   ├── routes/
│   │   ├── devices.js         # Device endpoints (Phase 2)
│   │   ├── qr.js              # QR code endpoint (Phase 2)
│   │   └── health.js          # Health check (Phase 2)
│   ├── services/
│   │   └── deviceRegistry.js  # Device management (Phase 2)
│   ├── middleware/
│   │   └── errorHandler.js    # Error handling (Phase 2)
│   └── utils/
│       └── logger.js          # Logging setup (Phase 2)
├── data/
│   └── localshare.db          # SQLite database (created on startup)
├── package.json               # Dependencies
├── .env.example               # Environment template
└── .env                       # Your local configuration (git-ignored)
```

## Available NPM Scripts

```bash
npm run dev       # Start with auto-reload (development)
npm start         # Start server (production)
npm test          # Run tests (if configured)
```

## Database

The SQLite database is created automatically on startup. It contains:

- **devices**: Connected devices
- **messages**: Message history
- **transfer_history**: File transfer logs

Database file location: `backend/data/localshare.db`

### Reset Database

To reset the database:

```bash
# Stop the server (Ctrl+C)
rm backend/data/localshare.db
npm run dev
# New database will be created with fresh schema
```

## Troubleshooting

### Port Already in Use

If port 3000 is already in use, change it in `.env`:

```
PORT=3001
```

### Cannot Connect from Web App

Ensure `CORS_ORIGIN` in `.env` matches your web app URL:

```
CORS_ORIGIN=http://localhost:5173
```

### Database Errors

Delete the database and restart:

```bash
rm data/localshare.db
npm run dev
```

### Node Version Issues

Check your Node.js version:

```bash
node --version
```

Must be 16 or higher. Install latest LTS if needed.

## Next Steps

1. ✅ Backend is running
2. 📱 Start the web frontend (see WEB_SETUP.md)
3. 📲 Start the mobile app (see MOBILE_SETUP.md)
4. 🔗 Connect web and mobile to backend
5. 💬 Test messaging between devices
