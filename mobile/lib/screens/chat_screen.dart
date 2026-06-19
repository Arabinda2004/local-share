import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/app_provider.dart';
import '../services/socket_service.dart';
import '../widgets/device_list_widget.dart';
import '../widgets/chat_box_widget.dart';
import '../widgets/message_input_widget.dart';

class ChatScreen extends StatefulWidget {
  const ChatScreen({Key? key}) : super(key: key);

  @override
  State<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  final _socketService = SocketService();

  @override
  void initState() {
    super.initState();
    _setupSocketListeners();
  }

  void _setupSocketListeners() {
    _socketService.onDeviceList((devices) {
      if (mounted) {
        context.read<AppProvider>().updateDeviceList(devices);
      }
    });

    _socketService.onMessageReceived((msg) {
      if (mounted) {
        context.read<AppProvider>().addMessage(
          msg['from'],
          msg['to'],
          msg['content'],
        );
      }
    });
  }

  void _handleDisconnect() {
    _socketService.disconnect();
    if (mounted) {
      context.read<AppProvider>().disconnect();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('LocalShare'),
        elevation: 0,
      ),
      body: Row(
        children: [
          // Sidebar
          Container(
            width: 250,
            color: Colors.grey[50],
            child: Column(
              children: [
                Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'LocalShare',
                        style: Theme.of(context).textTheme.titleLarge,
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Connected',
                        style: TextStyle(
                          fontSize: 12,
                          color: Colors.green[600],
                        ),
                      ),
                    ],
                  ),
                ),
                Divider(height: 1),
                Expanded(
                  child: DeviceListWidget(),
                ),
                Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: SizedBox(
                    width: double.infinity,
                    child: ElevatedButton.icon(
                      onPressed: _handleDisconnect,
                      icon: const Icon(Icons.logout),
                      label: const Text('Disconnect'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.red,
                        foregroundColor: Colors.white,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
          // Chat area
          Expanded(
            child: Column(
              children: [
                Expanded(
                  child: ChatBoxWidget(),
                ),
                MessageInputWidget(),
              ],
            ),
          ),
        ],
      ),
    );
  }

  @override
  void dispose() {
    _socketService.disconnect();
    super.dispose();
  }
}
