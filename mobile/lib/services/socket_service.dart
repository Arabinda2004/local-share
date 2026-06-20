import 'dart:async';
import 'package:socket_io_client/socket_io_client.dart' as IO;

class SocketService {
  static final SocketService _instance = SocketService._internal();
  IO.Socket? _socket;
  bool _connected = false;

  factory SocketService() {
    return _instance;
  }

  SocketService._internal();

  bool get isConnected => _connected;
  IO.Socket? get socket => _socket;

  Future<void> connect(String url) async {
    // Disconnect existing socket if any
    if (_socket != null) {
      _socket!.disconnect();
      _socket!.dispose();
    }

    final completer = Completer<void>();

    try {
      _socket = IO.io(url, <String, dynamic>{
        'transports': ['websocket', 'polling'],
        'autoConnect': false,
        'reconnection': true,
        'reconnectionDelay': 1000,
        'reconnectionDelayMax': 5000,
        'reconnectionAttempts': 10,
        'timeout': 10000,
      });

      _socket!.on('connect', (_) {
        print('Connected to backend at $url');
        _connected = true;
        if (!completer.isCompleted) {
          completer.complete();
        }
      });

      _socket!.on('disconnect', (_) {
        print('Disconnected from backend');
        _connected = false;
      });

      _socket!.on('connect_error', (error) {
        print('Connection error: $error');
        _connected = false;
        if (!completer.isCompleted) {
          completer.completeError('Connection failed: $error');
        }
      });

      _socket!.on('error', (error) {
        print('Socket error: $error');
      });

      _socket!.connect();

      // Wait for connection with a timeout
      await completer.future.timeout(
        const Duration(seconds: 10),
        onTimeout: () {
          throw TimeoutException('Connection timed out after 10 seconds');
        },
      );
    } catch (e) {
      _connected = false;
      print('Connection error: $e');
      rethrow;
    }
  }

  void registerDevice(String name, String type) {
    _socket?.emit('device:register', {
      'name': name,
      'type': type,
    });
  }

  void onDeviceRegistered(Function(dynamic) callback) {
    _socket?.on('device:registered', callback);
  }

  void onDeviceList(Function(dynamic) callback) {
    _socket?.off('device:list');
    _socket?.on('device:list', callback);
  }

  void requestDeviceList() {
    _socket?.emit('device:list:request');
  }

  void onMessageReceived(Function(dynamic) callback) {
    _socket?.off('message:received');
    _socket?.on('message:received', callback);
  }

  void sendMessage(String toDeviceId, String content) {
    _socket?.emit('message:send', {
      'to': toDeviceId,
      'content': content,
    });
  }

  void disconnect() {
    _socket?.disconnect();
    _connected = false;
  }

  void dispose() {
    _socket?.dispose();
    _socket = null;
    _connected = false;
  }
}
