# API Reference

## Backend Endpoints (Phase 2)

### Health Check

Check if backend is running.

**Request**:

```http
GET /api/health
```

**Response** (200 OK):

```json
{
  "status": "ok",
  "timestamp": "2026-06-19T12:00:00.000Z",
  "uptime": 5.234
}
```

---

## WebSocket Events (Socket.IO)

### Device Registration

Register a new device with the backend.

**Client Emits**:

```javascript
socket.emit("device:register", {
  name: "Alice",
  type: "web", // or 'mobile'
  ip: "192.168.1.10",
  port: 3000,
});
```

**Server Emits Back**:

```javascript
socket.on('device:list', [{
  id: 'web-1',
  name: 'Alice',
  type: 'web',
  lastSeen: '2026-06-19T12:00:00.000Z',
  trusted: false
}, ...])
```

---

### Send Message

Send a message to another device.

**Client Emits**:

```javascript
socket.emit("message:send", {
  to: "mobile-1",
  content: "Hello from Web",
});
```

**Server Stores**: Message saved to SQLite

**Server Emits to Recipient**:

```javascript
socket.on("message:received", {
  from: "web-1",
  fromName: "Alice",
  content: "Hello from Web",
  timestamp: "2026-06-19T12:00:00.000Z",
});
```

---

### Receive Device List

Get list of all connected devices.

**Client Emits**:

```javascript
socket.emit("device:list:request");
```

**Server Emits**:

```javascript
socket.on("device:list", [
  {
    id: "web-1",
    name: "Alice Web",
    type: "web",
    lastSeen: "2026-06-19T12:00:00.000Z",
    trusted: true,
  },
  {
    id: "mobile-1",
    name: "Bob Phone",
    type: "mobile",
    lastSeen: "2026-06-19T12:00:00.000Z",
    trusted: false,
  },
]);
```

---

### Get Message History

Retrieve messages between two devices.

**Client Emits**:

```javascript
socket.emit("message:history", {
  deviceId: "mobile-1",
});
```

**Server Emits**:

```javascript
socket.on("message:history:response", [
  {
    id: 1,
    from: "web-1",
    to: "mobile-1",
    content: "Hi there",
    timestamp: "2026-06-19T11:50:00.000Z",
  },
  {
    id: 2,
    from: "mobile-1",
    to: "web-1",
    content: "Hey!",
    timestamp: "2026-06-19T11:51:00.000Z",
  },
]);
```

---

### Trust Device

Mark a device as trusted.

**Client Emits**:

```javascript
socket.emit("device:trust", {
  deviceId: "mobile-1",
});
```

**Server Response**:

```javascript
socket.on("device:trusted", {
  deviceId: "mobile-1",
  success: true,
});
```

---

### Device Disconnect

Notify when disconnecting.

**Client Emits**:

```javascript
socket.emit("device:disconnect");
```

**Server Broadcasts to All**:

```javascript
socket.on("device:disconnected", {
  deviceId: "web-1",
  name: "Alice Web",
});
```

---

## REST API Endpoints (Phase 2)

### Register Device

```http
POST /api/devices/register
Content-Type: application/json

{
  "name": "My Device",
  "type": "web",
  "ip": "192.168.1.10",
  "port": 3000
}
```

**Response** (200 OK):

```json
{
  "deviceId": "web-1",
  "deviceName": "My Device",
  "connectedDevices": [{ "id": "mobile-1", "name": "Phone", "type": "mobile" }]
}
```

**Errors**:

- 400: Invalid input
- 500: Server error

---

### List Connected Devices

```http
GET /api/devices/list
```

**Response** (200 OK):

```json
[
  {
    "id": "web-1",
    "name": "Alice Web",
    "type": "web",
    "lastSeen": "2026-06-19T12:00:00.000Z",
    "trusted": true
  },
  {
    "id": "mobile-1",
    "name": "Bob Phone",
    "type": "mobile",
    "lastSeen": "2026-06-19T12:00:00.000Z",
    "trusted": false
  }
]
```

---

### Generate QR Code

```http
GET /api/qr?deviceId=web-1
```

**Response** (200 OK):

```
PNG image (binary)
```

**Or if SVG requested**:

```json
{
  "qr": "<svg>...</svg>"
}
```

---

### Unregister Device

```http
DELETE /api/devices/web-1
```

**Response** (200 OK):

```json
{
  "success": true,
  "message": "Device unregistered"
}
```

**Errors**:

- 404: Device not found
- 500: Server error

---

## Error Responses

### 400 Bad Request

```json
{
  "error": "Invalid device name",
  "code": "INVALID_INPUT",
  "details": "Device name must be 1-50 characters"
}
```

### 404 Not Found

```json
{
  "error": "Device not found",
  "code": "NOT_FOUND",
  "deviceId": "web-1"
}
```

### 500 Internal Server Error

```json
{
  "error": "Internal server error",
  "code": "SERVER_ERROR",
  "message": "Database connection failed"
}
```

---

## Implementation Status

| Endpoint             | REST | WebSocket | Status  |
| -------------------- | ---- | --------- | ------- |
| Health Check         | ✅   | -         | Phase 1 |
| Device Register      | ✅   | ✅        | Phase 2 |
| List Devices         | ✅   | ✅        | Phase 2 |
| Send Message         | -    | ✅        | Phase 2 |
| Receive Message      | -    | ✅        | Phase 2 |
| Message History      | -    | ✅        | Phase 2 |
| Trust Device         | -    | ✅        | Phase 2 |
| Disconnect           | -    | ✅        | Phase 2 |
| QR Generation        | ✅   | -         | Phase 2 |
| **File Transfer**    | -    | ✅        | Phase 7 |
| **Progress Updates** | -    | ✅        | Phase 7 |

---

## Integration Examples

### JavaScript/React Client

```javascript
import io from "socket.io-client";

const socket = io("http://localhost:3000");

// Register device
socket.emit("device:register", {
  name: "My Web App",
  type: "web",
  ip: "localhost",
  port: 5173,
});

// Listen for device list updates
socket.on("device:list", (devices) => {
  console.log("Connected devices:", devices);
});

// Send message
socket.emit("message:send", {
  to: "mobile-1",
  content: "Hello from web!",
});

// Receive message
socket.on("message:received", (msg) => {
  console.log(`From ${msg.fromName}: ${msg.content}`);
});
```

### Dart/Flutter Client

```dart
import 'package:socket_io_client_alt/socket_io_client_alt.dart' as IO;

final socket = IO.io('http://192.168.1.X:3000', <String, dynamic>{
  'transports': ['websocket'],
  'autoConnect': false,
});

socket.connect();

// Register device
socket.emit('device:register', {
  'name': 'My Mobile App',
  'type': 'mobile',
  'ip': '192.168.1.Y',
  'port': 3000
});

// Listen for device list
socket.on('device:list', (data) {
  print('Connected devices: $data');
});

// Send message
socket.emit('message:send', {
  'to': 'web-1',
  'content': 'Hello from mobile!'
});

// Receive message
socket.on('message:received', (data) {
  print('From ${data['fromName']}: ${data['content']}');
});
```

---

## Rate Limiting

- No rate limiting in MVP
- Future: Consider adding rate limits for production

## Authentication

- No authentication in MVP
- Future: Add device verification and optional password

## Notes

- All timestamps are in ISO 8601 format
- All IDs are unique across session
- Messages persist in SQLite
- WebSocket connection must be established for real-time events
- File transfer endpoints will be added in Phase 7
