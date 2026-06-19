import 'package:flutter/material.dart';

class QRScannerWidget extends StatefulWidget {
  final Function(String qrData) onScan;
  final Function() onClose;

  const QRScannerWidget({
    Key? key,
    required this.onScan,
    required this.onClose,
  }) : super(key: key);

  @override
  State<QRScannerWidget> createState() => _QRScannerWidgetState();
}

class _QRScannerWidgetState extends State<QRScannerWidget> {
  @override
  Widget build(BuildContext context) {
    return Dialog(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              'Scan QR Code',
              style: Theme.of(context).textTheme.titleLarge,
            ),
            const SizedBox(height: 16),
            Container(
              width: 250,
              height: 250,
              color: Colors.black,
              child: Center(
                child: Text(
                  'Camera Scanner\n(Coming in Phase 4.5)',
                  textAlign: TextAlign.center,
                  style: TextStyle(color: Colors.white),
                ),
              ),
            ),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: widget.onClose,
              child: const Text('Close'),
            ),
          ],
        ),
      ),
    );
  }
}
