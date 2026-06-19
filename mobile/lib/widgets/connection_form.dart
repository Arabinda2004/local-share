import 'package:flutter/material.dart';

class ConnectionFormWidget extends StatefulWidget {
  final Function(String ip, String port, String deviceName) onConnect;
  final bool loading;

  const ConnectionFormWidget({
    Key? key,
    required this.onConnect,
    required this.loading,
  }) : super(key: key);

  @override
  State<ConnectionFormWidget> createState() => _ConnectionFormWidgetState();
}

class _ConnectionFormWidgetState extends State<ConnectionFormWidget> {
  late TextEditingController _ipController;
  late TextEditingController _portController;
  late TextEditingController _deviceNameController;

  @override
  void initState() {
    super.initState();
    _ipController = TextEditingController(text: 'localhost');
    _portController = TextEditingController(text: '3000');
    _deviceNameController = TextEditingController(text: 'My Mobile Device');
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        TextField(
          controller: _deviceNameController,
          enabled: !widget.loading,
          decoration: InputDecoration(
            labelText: 'Device Name',
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8),
            ),
          ),
        ),
        const SizedBox(height: 16),
        TextField(
          controller: _ipController,
          enabled: !widget.loading,
          decoration: InputDecoration(
            labelText: 'Backend IP',
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8),
            ),
          ),
        ),
        const SizedBox(height: 16),
        TextField(
          controller: _portController,
          enabled: !widget.loading,
          keyboardType: TextInputType.number,
          decoration: InputDecoration(
            labelText: 'Port',
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8),
            ),
          ),
        ),
        const SizedBox(height: 24),
        SizedBox(
          width: double.infinity,
          child: ElevatedButton(
            onPressed: widget.loading
                ? null
                : () => widget.onConnect(
                      _ipController.text,
                      _portController.text,
                      _deviceNameController.text,
                    ),
            child: Padding(
              padding: const EdgeInsets.symmetric(vertical: 12.0),
              child: Text(
                widget.loading ? 'Connecting...' : 'Connect',
                style: const TextStyle(fontSize: 16),
              ),
            ),
          ),
        ),
      ],
    );
  }

  @override
  void dispose() {
    _ipController.dispose();
    _portController.dispose();
    _deviceNameController.dispose();
    super.dispose();
  }
}
