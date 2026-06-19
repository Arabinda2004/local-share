import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/device.dart';
import '../providers/app_provider.dart';
import '../services/socket_service.dart';
import '../utils/validators.dart';
import '../widgets/connection_form.dart';
import '../widgets/qr_scanner_widget.dart';

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

      if (mounted) {
        final device = Device(
          id: 'mobile-${DateTime.now().millisecondsSinceEpoch}',
          name: _deviceName,
          type: 'mobile',
        );

        _socketService.registerDevice(_deviceName, 'mobile');

        if (mounted) {
          context.read<AppProvider>().setDeviceRegistered(device);
        }
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
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              Colors.blue[500]!,
              Colors.purple[600]!,
            ],
          ),
        ),
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24.0),
            child: Card(
              elevation: 8,
              child: Padding(
                padding: const EdgeInsets.all(24.0),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(
                      'LocalShare',
                      style: Theme.of(context).textTheme.headlineLarge,
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Offline File Sharing',
                      style: Theme.of(context).textTheme.bodyMedium,
                    ),
                    const SizedBox(height: 24),
                    if (_error != null)
                      Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: Colors.red[100],
                          border: Border.all(color: Colors.red[400]!),
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: Text(
                          _error!,
                          style: TextStyle(color: Colors.red[700]),
                        ),
                      ),
                    const SizedBox(height: 16),
                    Form(
                      key: _formKey,
                      child: Column(
                        children: [
                          TextFormField(
                            initialValue: _deviceName,
                            decoration: InputDecoration(
                              labelText: 'Device Name',
                              border: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(8),
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
                              border: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(8),
                              ),
                            ),
                            validator: (value) {
                              if (!validateIP(value ?? '')) {
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
                              border: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(8),
                              ),
                            ),
                            validator: (value) {
                              if (!validatePort(value ?? '')) {
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
                    const SizedBox(height: 24),
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton(
                        onPressed: _loading ? null : _handleConnect,
                        child: Padding(
                          padding: const EdgeInsets.symmetric(vertical: 12.0),
                          child: Text(
                            _loading ? 'Connecting...' : 'Connect',
                            style: const TextStyle(fontSize: 16),
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),
                    Text(
                      'Or scan QR code (coming soon)',
                      style: Theme.of(context).textTheme.bodySmall,
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  @override
  void dispose() {
    _socketService.disconnect();
    super.dispose();
  }
}
