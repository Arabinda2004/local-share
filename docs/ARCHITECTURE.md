# System Architecture

## Overview

LocalShare uses a **peer-to-peer** architecture with a shared backend for device discovery and message coordination:

```
┌──────────────────────────────────────────────────────┐
│           Local Network (Wi-Fi / LAN)                │
├──────────────────────────────────────────────────────┤
│                                                      │
│  ┌────────────────────────────────────────────────┐ │
│  │ Web UI (React/Vite)                            │ │
│  │ - Connection Form                              │ │
│  │ - Chat Interface                               │ │
│  │ - Device List                                  │ │
│  └──────────┬─────────────────────────────────────┘ │
│             │                                        │
│             │ WebSocket (Socket.IO)                 │
│             │                                        │
│  ┌──────────▼─────────────────────────────────────┐ │
│  │ Backend Server (Express + Socket.IO)           │ │
│  │ ├── Device Registry (in-memory)                │ │
│  │ ├── Message Router                             │ │
│  │ ├── WebSocket Event Handler                    │ │
│  │ └── REST API Endpoints                         │ │
│  └──────────┬─────────────────────────────────────┘ │
│             │                                        │
│             │ SQLite Database                        │
│             │ ├── devices                            │
│             │ ├── messages                           │ │
│             │ └── transfer_history                   │
│             │                                        │
│  ┌──────────┬─────────────────────────────────────┐ │
│  │ Mobile UI (Flutter)                            │ │
│  │ - Connection Screen                            │ │
│  │ - Chat Screen                                  │ │
│  │ - Device List                                  │ │
│  └──────────────────────────────────────────────────┘ │
│             │                                        │
│             │ WebSocket (Socket.IO)                 │
│             │                                        │
└─────────────┼────────────────────────────────────────┘
```

## Component Responsibilities

### Backend (Node.js/Express)

1. **Device Registry**: Track connected devices (in-memory store)
2. **WebSocket Handler**: Real-time bidirectional communication
3. **Message Routing**: Deliver messages from sender to recipient
4. **Database Persistence**: Store messages and pairing history
5. **QR Code Generation**: Generate connection strings as QR codes
6. **REST API**: Device management and health checks

### Web Frontend (React)

1. **Connection Management**: Manual IP entry and QR code scanning
2. **Chat Interface**: Send/receive messages
3. **Device List**: Display connected devices
4. **State Management**: Track connection status and messages
5. **UI Components**: Forms, buttons, chat bubbles

### Mobile Frontend (Flutter)

1. **Connection Management**: Manual IP entry and QR code scanning
2. **Chat Interface**: Send/receive messages
3. **Device List**: Display connected devices
4. **State Management**: Track connection status
5. **Local Storage**: Cache messages and trusted devices

## Data Flow

### User Journey: Connection & Messaging

```
Step 1: Device Discovery
┌──────────────────────────────────────────┐
│ User opens Web app                        │
│ User enters backend IP (or scans QR)      │
│ Web app connects to backend via WebSocket │
│ Backend stores web device in registry     │
│ Backend broadcasts: "Device connected"    │
│ Mobile app receives notification          │
│ Both apps show each other in device list  │
└──────────────────────────────────────────┘

Step 2: Message Exchange
┌──────────────────────────────────────────┐
│ User in Web app selects Mobile device     │
│ User types message and sends              │
│ Web app emits: message:send event         │
│ Backend receives message                  │
│ Backend stores in SQLite                  │
│ Backend routes to Mobile via WebSocket    │
│ Mobile receives message                   │
│ Mobile displays in chat UI                │
│ Same process in reverse for reply         │
└──────────────────────────────────────────┘

Step 3: Message Persistence
┌──────────────────────────────────────────┐
│ All messages stored in SQLite             │
│ Web app refreshed → retrieves history     │
│ Mobile app closed & reopened → history    │
│ User can view full conversation history   │
└──────────────────────────────────────────┘
```

## Database Schema

### devices table

```sql
id (TEXT PRIMARY KEY)         - Unique device identifier
name (TEXT)                   - Device name
type (TEXT)                   - 'web' or 'mobile'
ip_address (TEXT)             - Device IP address
port (INTEGER)                - Connection port
trusted (BOOLEAN)             - Trust status
last_pairing (DATETIME)       - Last connection time
created_at (DATETIME)         - First registration
```

### messages table

```sql
id (INTEGER PRIMARY KEY)      - Message ID
from_device_id (TEXT)         - Sender device ID
to_device_id (TEXT)           - Recipient device ID
content (TEXT)                - Message text
timestamp (DATETIME)          - Send time
delivered (BOOLEAN)           - Delivery status
```

### transfer_history table

```sql
id (INTEGER PRIMARY KEY)      - Transfer ID
from_device (TEXT)            - Sender device ID
to_device (TEXT)              - Recipient device ID
file_name (TEXT)              - File name
size (INTEGER)                - File size in bytes
status (TEXT)                 - pending/in_progress/completed/failed
timestamp (DATETIME)          - Transfer time
```

## Communication Protocols

### WebSocket Events (Socket.IO)

**Client → Server Events**:

- `device:register` - Register new device
- `message:send` - Send message to another device
- `message:list` - Request message history
- `device:trust` - Mark device as trusted
- `device:disconnect` - Notify disconnection

**Server → Client Events**:

- `device:list` - Updated device list
- `message:received` - Incoming message
- `device:disconnected` - Device went offline

### REST API Endpoints

| Method | Endpoint              | Purpose               |
| ------ | --------------------- | --------------------- |
| GET    | /api/health           | Server health check   |
| POST   | /api/devices/register | Register new device   |
| GET    | /api/devices/list     | Get connected devices |
| DELETE | /api/devices/:id      | Unregister device     |
| GET    | /api/qr?deviceId=X    | Generate QR code      |

## Message Flow Diagram

```
Web App                        Backend                    Mobile App
   │                              │                            │
   │─── device:register ──────────>                            │
   │                              │─── Stored in registry      │
   │                              │                            │
   │                              <── device:list ────────     │
   │<─────────── device:list ─────┤                      ──────>│
   │                              │<─── device:register ───────│
   │                              │                            │
   │                              └──── Broadcast all devices ──>│
   │<────────── device:list ────────────────────────────────────│
   │                              │                            │
   │─── message:send (to mobile) ─>                            │
   │                              │─── Stored in SQLite        │
   │                              │── message:received ───────>│
   │                              │                            │
   │<─────── message:received ────── (from mobile)             │
   │                              │<─── message:send ──────────│
   │                              │─── Stored in SQLite        │
   │                              │                            │
```

## Security Considerations

1. **Local Network Only**: All communication stays within LAN
2. **Device Verification**: Devices can be marked as "trusted"
3. **No Authentication Required** (MVP): All devices on same network can connect
4. **Optional Encryption** (Future): Can add encryption layer
5. **No Cloud Storage**: Messages never leave local network

## Scalability Notes

- **Current**: Single backend server handles multiple devices
- **In-memory device store**: Sufficient for MVP (10-100 devices)
- **SQLite persistence**: Suitable for MVP, can migrate to PostgreSQL if needed
- **WebSocket connections**: Socket.IO handles scalability automatically

## Future Enhancements

1. **File Transfer**: Chunked transfers with progress tracking
2. **End-to-End Encryption**: Encrypt messages in transit
3. **Auto-Discovery**: UDP broadcast discovery (no manual IP entry)
4. **Multi-Device Groups**: Send to multiple devices at once
5. **Media Support**: Share images and media files
6. **Cloud Sync**: Optional cloud backup for messages
