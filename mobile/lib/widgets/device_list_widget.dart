import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/app_provider.dart';

class DeviceListWidget extends StatelessWidget {
  const DeviceListWidget({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Consumer<AppProvider>(
      builder: (context, appProvider, _) {
        final devices = appProvider.connectedDevices;

        if (devices.isEmpty) {
          return Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(Icons.devices, size: 48, color: Colors.grey[300]),
                const SizedBox(height: 16),
                Text(
                  'No other devices found',
                  style: TextStyle(color: Colors.grey[500], fontSize: 16),
                ),
              ],
            ),
          );
        }

        return ListView.separated(
          itemCount: devices.length,
          separatorBuilder: (context, index) => const Divider(height: 1),
          itemBuilder: (context, index) {
            final device = devices[index];
            final initial = device.name.isNotEmpty ? device.name[0].toUpperCase() : '?';

            return ListTile(
              contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
              onTap: () => appProvider.selectPeer(device.id),
              leading: Stack(
                children: [
                  CircleAvatar(
                    backgroundColor: const Color(0xFF2563eb),
                    child: Text(
                      initial,
                      style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                    ),
                  ),
                  Positioned(
                    right: 0,
                    bottom: 0,
                    child: Container(
                      width: 12,
                      height: 12,
                      decoration: BoxDecoration(
                        color: Colors.green[500],
                        shape: BoxShape.circle,
                        border: Border.all(color: Colors.white, width: 2),
                      ),
                    ),
                  ),
                ],
              ),
              title: Text(
                device.name,
                style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 16),
              ),
              subtitle: Text(
                device.type,
                style: TextStyle(color: Colors.grey[600], fontSize: 13),
              ),
              trailing: const Icon(Icons.chevron_right, color: Colors.grey),
            );
          },
        );
      },
    );
  }
}

