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
        final selectedPeer = appProvider.selectedPeerId;

        if (devices.isEmpty) {
          return Center(
            child: Text(
              'No devices connected',
              style: Theme.of(context).textTheme.bodySmall,
            ),
          );
        }

        return ListView.builder(
          itemCount: devices.length,
          itemBuilder: (context, index) {
            final device = devices[index];
            final isSelected = selectedPeer == device.id;

            return ListTile(
              selected: isSelected,
              selectedTileColor: Colors.blue[100],
              onTap: () => appProvider.selectPeer(device.id),
              title: Text(device.name),
              subtitle: Text(device.type),
              trailing: device.trusted ? const Icon(Icons.check) : null,
            );
          },
        );
      },
    );
  }
}
