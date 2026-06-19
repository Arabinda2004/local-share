# Mobile Setup Guide

## Prerequisites

- Flutter SDK 3.0+ ([Download](https://flutter.dev/docs/get-started/install))
- Android SDK (included with Android Studio) or Xcode (for iOS)
- A running backend server (see BACKEND_SETUP.md)
- Git

## Installation Steps

### 1. Navigate to Mobile Directory

```bash
cd mobile
```

### 2. Get Flutter Dependencies

```bash
flutter pub get
```

This will install all dependencies from `pubspec.yaml`:

- `qr_flutter` - QR code generation
- `qr_code_scanner` - QR code scanning
- `socket_io_client_alt` - WebSocket client
- `sqflite` - Local database
- `permission_handler` - Request app permissions
- `path_provider` - File system paths

### 3. Configure Backend URL (Optional)

Edit `mobile/lib/services/socket_service.dart` (created in Phase 4) and set backend URL:

```dart
const String BACKEND_URL = 'http://192.168.1.X:3000';  // Your backend IP
```

For local testing on emulator, use your computer's local IP (not localhost).

### 4. Run on Emulator

**Android Emulator**:

```bash
# Start Android emulator first (via Android Studio)
flutter run
```

**iOS Simulator** (macOS only):

```bash
flutter run -d 'iPhone 14'
```

### 5. Run on Physical Device

Connect your Android phone via USB with debugging enabled:

```bash
flutter run
```

You should see the LocalShare app launch on your device.

## Project Structure

```
mobile/
├── lib/
│   ├── main.dart              # App entry point
│   ├── screens/
│   │   ├── connection_screen.dart      # Connection UI (Phase 4)
│   │   ├── qr_scanner_screen.dart      # QR scanner (Phase 4)
│   │   ├── chat_screen.dart            # Chat list (Phase 4)
│   │   ├── chat_detail_screen.dart     # Chat messages (Phase 4)
│   │   └── devices_screen.dart         # Device mgmt (Phase 4)
│   ├── services/
│   │   ├── socket_service.dart         # WebSocket client (Phase 4)
│   │   ├── qr_service.dart             # QR handling (Phase 4)
│   │   └── permission_service.dart     # Permissions (Phase 4)
│   ├── models/
│   │   ├── device.dart                 # Device model (Phase 4)
│   │   └── message.dart                # Message model (Phase 4)
│   ├── widgets/
│   │   ├── connection_status_widget.dart   # Status UI (Phase 4)
│   │   ├── device_tile.dart                # Device list item (Phase 4)
│   │   └── message_bubble.dart             # Message UI (Phase 4)
│   ├── providers/
│   │   └── app_provider.dart           # State management (Phase 4)
│   └── utils/
│       └── validators.dart             # Input validation (Phase 4)
├── android/                   # Android project files
├── ios/                       # iOS project files
├── web/                       # Web support (optional)
├── pubspec.yaml               # Dependencies
├── pubspec.lock               # Locked versions
├── analysis_options.yaml      # Lint rules
└── .gitignore                 # Git ignore rules
```

## Available Flutter Commands

```bash
flutter run              # Run on connected device/emulator
flutter run -v           # Run with verbose logging
flutter build apk        # Build Android APK
flutter build aab        # Build Android App Bundle
flutter clean            # Clean build files
flutter pub get          # Update dependencies
flutter doctor           # Check environment setup
```

## Device Setup

### Android Emulator

1. Open Android Studio
2. Go to: Tools → Device Manager
3. Create or select a virtual device
4. Start the emulator
5. Run: `flutter run`

### Physical Android Device

1. Enable USB Debugging:
   - Settings → Developer Options → USB Debugging (enable)
   - Connect via USB
2. Verify connection:
   ```bash
   flutter devices
   ```
3. Run:
   ```bash
   flutter run
   ```

### iOS Simulator (macOS only)

1. Open Xcode
2. Simulator → Select iPhone model
3. Run: `flutter run`

## Permissions

The app requires:

- **Camera**: For QR code scanning
- **File Access**: For receiving files (Phase 7)

These are handled automatically via `permission_handler` package.

## Troubleshooting

### Flutter Not Found

Ensure Flutter is in your PATH:

```bash
flutter --version
```

If not found, add Flutter SDK to PATH as per [official guide](https://flutter.dev/docs/get-started/install).

### Android SDK Issues

```bash
flutter doctor -v
```

Install missing components as suggested by `flutter doctor`.

### Emulator Not Starting

- Restart Android Studio
- Create new virtual device
- Ensure you have 2GB+ RAM allocated to emulator

### App Crashes on Connect

- Ensure backend is running
- Check backend URL in `socket_service.dart`
- Verify firewall allows connection

### QR Scanner Not Working

- Grant camera permission when prompted
- Ensure device has camera
- Test with physical device if emulator lacks camera

### Dependency Conflicts

```bash
# Update dependencies
flutter pub upgrade
flutter pub get
flutter clean
flutter run
```

## Building for Release

### Android APK

```bash
flutter build apk --release
# Output: build/app/outputs/flutter-apk/app-release.apk
```

### Android App Bundle (for Play Store)

```bash
flutter build appbundle --release
# Output: build/app/outputs/bundle/release/app-release.aab
```

## Connecting to Backend

Once running, the mobile app will:

1. Show connection page
2. Allow manual IP entry or QR scanning
3. Connect to backend via WebSocket
4. Show connected devices
5. Enable messaging

## Development Tips

1. **Hot Reload**: Press 'r' in terminal to hot reload
2. **Full Restart**: Press 'R' in terminal for full app restart
3. **Debugging**: Use `print()` or `debugPrint()` for logs
4. **DevTools**: Run `flutter pub global activate devtools && devtools`

## Next Steps

1. ✅ Backend is running
2. ✅ Web app is running
3. ✅ Mobile app is running
4. 🔗 Connect web and mobile to backend
5. 💬 Test messaging between devices
