# LocalShare - Offline Cross-Platform File Sharing System

LocalShare is an offline file-sharing application that enables seamless transfer of files between mobile devices and computers without requiring an active internet connection. The system utilizes local wireless communication technologies such as Wi-Fi, Local Hotspot, or LAN connectivity to establish secure peer-to-peer communication between devices.

## 📱 Project Structure

```
LocalShare/
├── backend/                 # Node.js/Express backend server
│   ├── src/
│   │   ├── db/             # Database layer
│   │   ├── handlers/       # WebSocket handlers
│   │   ├── routes/         # API endpoints
│   │   ├── services/       # Business logic
│   │   ├── middleware/     # Express middleware
│   │   └── utils/          # Helper utilities
│   ├── data/               # SQLite database storage
│   ├── package.json
│   └── .env.example
│
├── web/                     # React web application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page layouts
│   │   ├── services/       # API/Socket services
│   │   ├── stores/         # State management (Zustand)
│   │   ├── utils/          # Helper functions
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── mobile/                  # Flutter mobile app
│   ├── lib/
│   │   ├── screens/        # UI screens
│   │   ├── services/       # Business logic
│   │   ├── models/         # Data models
│   │   ├── widgets/        # Reusable widgets
│   │   ├── utils/          # Utilities
│   │   ├── providers/      # State management
│   │   └── main.dart
│   └── pubspec.yaml
│
├── docs/                    # Documentation
│   ├── ARCHITECTURE.md      # System design
│   ├── API.md              # API endpoints
│   ├── SETUP.md            # Setup instructions
│   ├── BACKEND_SETUP.md    # Backend guide
│   ├── WEB_SETUP.md        # Web guide
│   └── MOBILE_SETUP.md     # Mobile guide
│
└── README.md               # This file
```

## 🚀 Quick Start

### Prerequisites

- **Backend & Web**:
  - Node.js 16+
  - npm or yarn

- **Mobile**:
  - Flutter SDK (3.0+)
  - Android SDK (for Android development)

### Running Locally

#### 1. Backend Server

```bash
cd backend
npm install
npm run dev
# Server will run on http://localhost:3000
```

#### 2. Web Application

```bash
cd web
npm install
npm run dev
# Web app will run on http://localhost:5173
```

#### 3. Mobile App

```bash
cd mobile
flutter pub get
flutter run
# Runs on connected device/emulator
```

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────┐
│      Local Area Network                 │
├─────────────────────────────────────────┤
│                                         │
│  ┌──────────────┐     ┌──────────────┐ │
│  │   Web App    │     │  Mobile App  │ │
│  │  (React)     │     │  (Flutter)   │ │
│  └──────┬───────┘     └──────┬───────┘ │
│         │                    │         │
│         └────────┬───────────┘         │
│                  │ WebSocket           │
│          ┌───────▼──────────┐          │
│          │  Express Backend │          │
│          │  + Socket.IO     │          │
│          │  + SQLite        │          │
│          └──────────────────┘          │
│                                         │
└─────────────────────────────────────────┘
```

## 📋 MVP Features (Phase 1-5)

- ✅ Device discovery and pairing
- ✅ Bidirectional text messaging
- ✅ QR code connection
- ✅ Manual IP entry
- ✅ Message history persistence
- ✅ Device trust management

## 🔄 Development Phases

| Phase | Focus                 | Status         |
| ----- | --------------------- | -------------- |
| 1     | Project Scaffolding   | ✅ In Progress |
| 2     | Backend (Node.js)     | ⏳ Pending     |
| 3     | Web Frontend (React)  | ⏳ Pending     |
| 4     | Mobile App (Flutter)  | ⏳ Pending     |
| 5     | Integration & Testing | ⏳ Pending     |
| 6     | Code Quality & Docs   | ⏳ Pending     |
| 7     | File Transfer Feature | ⏳ Future      |

## 📚 Documentation

- [Architecture Documentation](./docs/ARCHITECTURE.md)
- [API Reference](./docs/API.md)
- [Backend Setup Guide](./docs/BACKEND_SETUP.md)
- [Web Setup Guide](./docs/WEB_SETUP.md)
- [Mobile Setup Guide](./docs/MOBILE_SETUP.md)

## 🔒 Security

- Local network communication only
- Device verification before transfer
- Optional encryption for sensitive data
- No cloud storage involvement
- No data leaves the local network

## 💻 Technology Stack

**Backend**:

- Node.js + Express.js
- Socket.IO for WebSocket
- SQLite3 for persistence
- CORS enabled

**Web Frontend**:

- React 18
- Vite (build tool)
- Zustand (state management)
- Tailwind CSS (styling)
- Socket.IO Client

**Mobile**:

- Flutter
- Dart
- Socket.IO Client
- SQLite (sqflite)
- QR Code scanning/generation

## 🤝 Contributing

This project is developed with agent-based code generation. All code is generated through AI assistants following a structured implementation plan.

## 📝 License

MIT

---

**Status**: Early Development (Phase 1)  
**Last Updated**: 2026-06-19
