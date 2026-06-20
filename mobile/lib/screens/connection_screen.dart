import 'dart:async';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/device.dart';
import '../providers/app_provider.dart';
import '../services/socket_service.dart';
import '../utils/validators.dart';

class ConnectionScreen extends StatefulWidget {
  const ConnectionScreen({Key? key}) : super(key: key);

  @override
  State<ConnectionScreen> createState() => _ConnectionScreenState();
}

class _ConnectionScreenState extends State<ConnectionScreen> {
  final _formKey = GlobalKey<FormState>();
  String _ip = 'localhost';
  String _port = '3000';
  String _deviceName = 'My Mobile Device';
  bool _loading = false;
  String? _error;
  final _socketService = SocketService();

  void _handleConnect() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() {
      _loading = true;
      _error = null;
    });

    try {
      final url = 'http://$_ip:$_port';
      await _socketService.connect(url);

      // Set up a completer to wait for the server to confirm registration
      final completer = Completer<Device>();

      _socketService.onDeviceRegistered((data) {
        if (!completer.isCompleted) {
          final deviceData = Map<String, dynamic>.from(data as Map);
          final device = Device(
            id: deviceData['id'] as String,
            name: deviceData['name'] as String,
            type: deviceData['type'] as String,
          );
          completer.complete(device);
        }
      });

      // Register device on the server
      _socketService.registerDevice(_deviceName, 'mobile');

      // Wait for server to confirm with the actual device ID
      final device = await completer.future.timeout(
        const Duration(seconds: 5),
        onTimeout: () => throw TimeoutException('Registration timed out'),
      );

      if (mounted) {
        context.read<AppProvider>().setDeviceRegistered(device);
      }
    } catch (err) {
      setState(() {
        _error = err.toString();
        _loading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24.0),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Icon(
                  Icons.share_rounded,
                  size: 48,
                  color: Color(0xFF2563eb),
                ),
                const SizedBox(height: 16),
                Text(
                  'LocalShare',
                  style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                        fontWeight: FontWeight.bold,
                        color: Colors.black87,
                      ),
                ),
                const SizedBox(height: 8),
                Text(
                  'Secure offline file sharing',
                  style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                        color: Colors.black54,
                      ),
                ),
                const SizedBox(height: 32),
                if (_error != null)
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(12),
                    margin: const EdgeInsets.only(bottom: 24),
                    decoration: BoxDecoration(
                      color: Colors.red[50],
                      border: Border.all(color: Colors.red[100]!),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Row(
                      children: [
                        Icon(Icons.error_outline, color: Colors.red[400], size: 20),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Text(
                            _error!,
                            style: TextStyle(color: Colors.red[700], fontSize: 14),
                          ),
                        ),
                      ],
                    ),
                  ),
                Form(
                  key: _formKey,
                  child: Column(
                    children: [
                      TextFormField(
                        initialValue: _deviceName,
                        decoration: InputDecoration(
                          labelText: 'Device Name',
                          prefixIcon: const Icon(Icons.smartphone),
                          filled: true,
                          fillColor: Colors.grey[50],
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: BorderSide(color: Colors.grey[200]!),
                          ),
                          enabledBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: BorderSide(color: Colors.grey[200]!),
                          ),
                        ),
                        validator: (value) {
                          if (!validateDeviceName(value ?? '')) {
                            return 'Device name required (1-50 chars)';
                          }
                          return null;
                        },
                        onChanged: (value) => _deviceName = value,
                        enabled: !_loading,
                      ),
                      const SizedBox(height: 16),
                      TextFormField(
                        initialValue: _ip,
                        decoration: InputDecoration(
                          labelText: 'Backend IP or Hostname',
                          prefixIcon: const Icon(Icons.router),
                          filled: true,
                          fillColor: Colors.grey[50],
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: BorderSide(color: Colors.grey[200]!),
                          ),
                          enabledBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: BorderSide(color: Colors.grey[200]!),
                          ),
                        ),
                        validator: (value) {
                          if (validateIP(value ?? '').isNotEmpty) {
                            return 'Invalid IP address';
                          }
                          return null;
                        },
                        onChanged: (value) => _ip = value,
                        enabled: !_loading,
                      ),
                      const SizedBox(height: 16),
                      TextFormField(
                        initialValue: _port,
                        decoration: InputDecoration(
                          labelText: 'Port',
                          prefixIcon: const Icon(Icons.numbers),
                          filled: true,
                          fillColor: Colors.grey[50],
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: BorderSide(color: Colors.grey[200]!),
                          ),
                          enabledBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: BorderSide(color: Colors.grey[200]!),
                          ),
                        ),
                        validator: (value) {
                          if (validatePort(value ?? '').isNotEmpty) {
                            return 'Invalid port (1-65535)';
                          }
                          return null;
                        },
                        onChanged: (value) => _port = value,
                        enabled: !_loading,
                        keyboardType: TextInputType.number,
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 32),
                SizedBox(
                  width: double.infinity,
                  height: 50,
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF2563eb),
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                      elevation: 0,
                    ),
                    onPressed: _loading ? null : _handleConnect,
                    child: _loading
                        ? const SizedBox(
                            width: 24,
                            height: 24,
                            child: CircularProgressIndicator(
                              color: Colors.white,
                              strokeWidth: 2,
                            ),
                          )
                        : const Text(
                            'Connect',
                            style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                          ),
                  ),
                ),
                const SizedBox(height: 24),
                TextButton(
                  onPressed: () {},
                  child: Text(
                    'Scan QR Code',
                    style: TextStyle(color: const Color(0xFF2563eb)),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  @override
  void dispose() {
    // Don't disconnect here — the socket stays alive for ChatScreen
    super.dispose();
  }
}
