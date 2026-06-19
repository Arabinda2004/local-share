import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/device.dart';
import '../providers/app_provider.dart';

class AppProvider extends ChangeNotifier {
  String? _currentDeviceId;
  String? _currentDeviceName;
  bool _isConnected = false;
  List<Device> _connectedDevices = [];
  String? _selectedPeerId;
  Map<String, List<Map<String, dynamic>>> _messages = {};

  // Getters
  String? get currentDeviceId => _currentDeviceId;
  String? get currentDeviceName => _currentDeviceName;
  bool get isConnected => _isConnected;
  List<Device> get connectedDevices => _connectedDevices;
  String? get selectedPeerId => _selectedPeerId;
  Map<String, List<Map<String, dynamic>>> get messages => _messages;

  // Device lifecycle
  void setDeviceRegistered(Device device) {
    _currentDeviceId = device.id;
    _currentDeviceName = device.name;
    _isConnected = true;
    notifyListeners();
  }

  void setConnectionStatus(bool connected) {
    _isConnected = connected;
    notifyListeners();
  }

  // Device management
  void updateDeviceList(List<Device> devices) {
    _connectedDevices = devices;
    notifyListeners();
  }

  void selectPeer(String deviceId) {
    _selectedPeerId = deviceId;
    notifyListeners();
  }

  // Message handling
  void addMessage(String from, String to, String content) {
    final key = [from, to]..sort();
    final messageKey = key.join('-');
    
    if (!_messages.containsKey(messageKey)) {
      _messages[messageKey] = [];
    }

    _messages[messageKey]!.add({
      'from': from,
      'to': to,
      'content': content,
      'timestamp': DateTime.now(),
      'delivered': false,
    });

    notifyListeners();
  }

  void loadMessageHistory(String deviceId, List<Map<String, dynamic>> history) {
    final key = [_currentDeviceId, deviceId]..sort();
    final messageKey = key.join('-');
    _messages[messageKey] = history;
    notifyListeners();
  }

  List<Map<String, dynamic>> getMessagesWithPeer(String deviceId) {
    final key = [_currentDeviceId, deviceId]..sort();
    final messageKey = key.join('-');
    return _messages[messageKey] ?? [];
  }

  void disconnect() {
    _currentDeviceId = null;
    _currentDeviceName = null;
    _isConnected = false;
    _connectedDevices = [];
    _selectedPeerId = null;
    _messages = {};
    notifyListeners();
  }
}
