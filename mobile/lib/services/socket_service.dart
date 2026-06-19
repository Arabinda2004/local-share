import 'package:socket_io_client_alt/socket_io_client_alt.dart' as IO;

class SocketService {
  static final SocketService _instance = SocketService._internal();
  late IO.Socket socket;
  bool _connected = false;

  factory SocketService() {
    return _instance;
  }

  SocketService._internal();

  bool get isConnected => _connected;

  Future<void> connect(String url) async {
    try {
      socket = IO.io(url, <String, dynamic>{
        'transports': ['websocket'],
        'autoConnect': false,
      });

      socket.connect();

      socket.on('connect', (_) {
        print('Connected to backend');
        _connected = true;
      });

      socket.on('disconnect', (_) {
        print('Disconnected from backend');
        _connected = false;
      });

      socket.on('error', (error) {
        print('Socket error: $error');
      });
    } catch (e) {
      print('Connection error: $e');
      rethrow;
    }
  }

  void registerDevice(String name, String type) {
    socket.emit('device:register', {
      'name': name,
      'type': type,
    });
  }

  void onDeviceList(Function(dynamic) callback) {
    socket.on('device:list', callback);
  }

  void onMessageReceived(Function(dynamic) callback) {
    socket.on('message:received', callback);
  }

  void sendMessage(String toDeviceId, String content) {
    socket.emit('message:send', {
      'to': toDeviceId,
      'content': content,
    });
  }

  void disconnect() {
    socket.disconnect();
    _connected = false;
  }
}
