import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/app_provider.dart';

class ChatBoxWidget extends StatelessWidget {
  const ChatBoxWidget({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Consumer<AppProvider>(
      builder: (context, appProvider, _) {
        final selectedPeerId = appProvider.selectedPeerId;
        final connectedDevices = appProvider.connectedDevices;

        if (selectedPeerId == null) {
          return Center(
            child: Text(
              'Select a device to start chatting',
              style: Theme.of(context).textTheme.bodyMedium,
            ),
          );
        }

        final selectedDevice = connectedDevices.firstWhere(
          (d) => d.id == selectedPeerId,
          orElse: () => null,
        );

        final messages = appProvider.getMessagesWithPeer(selectedPeerId);

        return Column(
          children: [
            // Header
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.grey[50],
                border: Border(
                  bottom: BorderSide(color: Colors.grey[300]!),
                ),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    selectedDevice?.name ?? selectedPeerId,
                    style: Theme.of(context).textTheme.titleMedium,
                  ),
                  Text(
                    selectedDevice?.type ?? '',
                    style: Theme.of(context).textTheme.bodySmall,
                  ),
                ],
              ),
            ),
            // Messages
            Expanded(
              child: messages.isEmpty
                  ? Center(
                      child: Text(
                        'No messages yet',
                        style: Theme.of(context).textTheme.bodySmall,
                      ),
                    )
                  : ListView.builder(
                      reverse: true,
                      itemCount: messages.length,
                      itemBuilder: (context, index) {
                        final message = messages[index];
                        final isOwn = message['from'] == appProvider.currentDeviceId;

                        return Align(
                          alignment: isOwn
                              ? Alignment.centerRight
                              : Alignment.centerLeft,
                          child: Container(
                            margin: const EdgeInsets.symmetric(
                              horizontal: 16,
                              vertical: 4,
                            ),
                            padding: const EdgeInsets.symmetric(
                              horizontal: 12,
                              vertical: 8,
                            ),
                            decoration: BoxDecoration(
                              color: isOwn
                                  ? Colors.blue[600]
                                  : Colors.grey[300],
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Text(
                                  message['content'],
                                  style: TextStyle(
                                    color: isOwn ? Colors.white : Colors.black,
                                  ),
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  message['timestamp'].toString().split('.')[0],
                                  style: TextStyle(
                                    fontSize: 10,
                                    color: isOwn
                                        ? Colors.white70
                                        : Colors.black54,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        );
                      },
                    ),
            ),
          ],
        );
      },
    );
  }
}
