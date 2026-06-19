# Web Frontend Setup Guide

## Prerequisites

- Node.js 16+ ([Download](https://nodejs.org/))
- npm or yarn
- A running backend server (see BACKEND_SETUP.md)
- Git

## Installation Steps

### 1. Navigate to Web Directory

```bash
cd web
```

### 2. Install Dependencies

```bash
npm install
```

This will install:

- `react` - UI library
- `react-dom` - React DOM rendering
- `vite` - Build tool and dev server
- `socket.io-client` - WebSocket client
- `axios` - HTTP client
- `zustand` - State management
- `qrcode.react` - QR code display
- `jsqr` - QR code scanning
- `tailwindcss` - CSS framework

### 3. Configure Backend URL (Optional)

Edit `web/src/services/socketService.js` (created in Phase 2) and set backend URL:

```javascript
const BACKEND_URL = "http://localhost:3000";
```

### 4. Start Development Server

```bash
npm run dev
```

You should see:

```
  VITE v5.0.0  ready in 123 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

### 5. Open in Browser

Click the Local URL or open in your browser:

```
http://localhost:5173
```

You should see the LocalShare connection page.

## Project Structure

```
web/
├── src/
│   ├── main.jsx               # React entry point
│   ├── App.jsx                # Main app component
│   ├── index.css              # Global styles
│   ├── components/
│   │   ├── ConnectionForm.jsx    # IP input form (Phase 3)
│   │   ├── QRScanner.jsx         # QR code scanner (Phase 3)
│   │   ├── DeviceList.jsx        # Connected devices (Phase 3)
│   │   ├── ChatBox.jsx           # Message display (Phase 3)
│   │   ├── MessageInput.jsx      # Message input (Phase 3)
│   │   └── ConnectionStatus.jsx  # Status indicator (Phase 3)
│   ├── pages/
│   │   ├── ConnectionPage.jsx    # Connection UI (Phase 3)
│   │   ├── ChatPage.jsx          # Chat UI (Phase 3)
│   │   └── DevicesPage.jsx       # Device management (Phase 3)
│   ├── services/
│   │   └── socketService.js      # WebSocket client (Phase 2)
│   ├── stores/
│   │   └── appStore.js           # Zustand state (Phase 2)
│   └── utils/
│       ├── qrParser.js           # QR data parsing (Phase 3)
│       └── validators.js         # Input validation (Phase 3)
├── index.html                 # HTML template
├── vite.config.js             # Vite configuration
├── postcss.config.js          # Tailwind CSS config
├── package.json               # Dependencies
├── .gitignore                 # Git ignore rules
└── dist/                      # Build output (created after build)
```

## Available NPM Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
```

## Building for Production

```bash
npm run build
npm run preview
```

Build output will be in the `dist/` folder.

## Development Tips

1. **Hot Module Replacement**: Code changes auto-reload in browser
2. **Browser DevTools**: Open DevTools (F12) to debug
3. **Console Logs**: Check browser console for errors
4. **React DevTools**: Install React DevTools browser extension

## Troubleshooting

### Port Already in Use

If port 5173 is in use, Vite will auto-select next available port.

### Cannot Connect to Backend

1. Ensure backend is running: `http://localhost:3000/api/health`
2. Check `BACKEND_URL` in `socketService.js`
3. Check `CORS_ORIGIN` in backend `.env` includes `http://localhost:5173`

### Styling Issues

If Tailwind CSS not working:

```bash
# Reinstall dependencies
rm node_modules package-lock.json
npm install
npm run dev
```

### Build Errors

```bash
# Clear cache and rebuild
rm -rf dist node_modules
npm install
npm run build
```

## Connecting to Backend

Once running, the web app will:

1. Show connection page
2. Allow manual IP entry: `localhost:3000`
3. Display QR code scanner (Phase 3)
4. Connect via WebSocket
5. Show connected devices
6. Enable messaging

## Next Steps

1. ✅ Backend is running (http://localhost:3000)
2. ✅ Web app is running (http://localhost:5173)
3. 📲 Start the mobile app (see MOBILE_SETUP.md)
4. 🔗 Connect web to backend using connection page
5. 💬 Test messaging functionality
