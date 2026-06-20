import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/device.dart';
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
    _socketService.onDeviceList((data) {
      if (mounted) {
        final provider = context.read<AppProvider>();
        final myId = provider.currentDeviceId;
        final List rawList = data is List ? data : [];
        final devices = rawList
            .where((d) => d is Map && d['id'] != myId)
            .map((d) => Device.fromJson(Map<String, dynamic>.from(d)))
            .toList();
        provider.updateDeviceList(devices);
      }
    });

    _socketService.requestDeviceList();

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
    return Consumer<AppProvider>(
      builder: (context, appProvider, _) {
        final hasSelectedPeer = appProvider.selectedPeerId != null;
        
        final selectedDeviceIndex = hasSelectedPeer ? appProvider.connectedDevices.indexWhere(
          (d) => d.id == appProvider.selectedPeerId,
        ) : -1;
        
        final selectedDevice = selectedDeviceIndex >= 0 
            ? appProvider.connectedDevices[selectedDeviceIndex] 
            : null;

        return Scaffold(
          backgroundColor: Colors.white,
          appBar: AppBar(
            backgroundColor: Colors.white,
            elevation: 1,
            shadowColor: Colors.black12,
            leading: hasSelectedPeer
                ? IconButton(
                    icon: const Icon(Icons.arrow_back),
                    onPressed: () => appProvider.selectPeer(null), // Go back to list
                  )
                : null,
            title: Column(
              crossAxisAlignment: hasSelectedPeer ? CrossAxisAlignment.start : CrossAxisAlignment.center,
              children: [
                Text(
                  hasSelectedPeer 
                      ? (selectedDevice?.name ?? 'Chat')
                      : 'LocalShare',
                  style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
                ),
                if (!hasSelectedPeer)
                  Text(
                    'Connected',
                    style: TextStyle(
                      fontSize: 12,
                      color: Colors.green[600],
                      fontWeight: FontWeight.normal,
                    ),
                  ),
                if (hasSelectedPeer && selectedDevice != null)
                  Text(
                    selectedDevice.type,
                    style: TextStyle(
                      fontSize: 12,
                      color: Colors.grey[600],
                      fontWeight: FontWeight.normal,
                    ),
                  ),
              ],
            ),
            actions: [
              if (!hasSelectedPeer)
                IconButton(
                  icon: const Icon(Icons.logout, color: Colors.red),
                  onPressed: _handleDisconnect,
                ),
            ],
          ),
          body: hasSelectedPeer
              ? Column(
                  children: [
                    Expanded(child: const ChatBoxWidget()),
                    const MessageInputWidget(),
                  ],
                )
              : Column(
                  children: [
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                      decoration: BoxDecoration(
                        color: Colors.grey[50],
                        border: Border(bottom: BorderSide(color: Colors.grey[200]!)),
                      ),
                      child: Text(
                        'DEVICES (${appProvider.connectedDevices.length})',
                        style: TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                          color: Colors.grey[600],
                          letterSpacing: 1.2,
                        ),
                      ),
                    ),
                    Expanded(child: const DeviceListWidget()),
                  ],
                ),
        );
      },
    );
  }

  @override
  void dispose() {
    _socketService.disconnect();
    super.dispose();
  }
}

