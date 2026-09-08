import 'package:flutter/material.dart';
import 'package:qr_flutter/qr_flutter.dart';

class TicketQrScreen extends StatelessWidget {
  final String ticketCode;
  final String eventTitle;
  final String attendeeName;

  const TicketQrScreen({
    super.key,
    this.ticketCode = 'TKT-AI-2026-VIP-9941',
    this.eventTitle = 'EventSphere AI Global Keynote 2026',
    this.attendeeName = 'Dr. Sarah Jenkins',
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Digital Entry Badge'),
      ),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Card(
            child: Padding(
              padding: const EdgeInsets.all(24.0),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: QrImageView(
                      data: ticketCode,
                      version: QrVersions.auto,
                      size: 200.0,
                    ),
                  ),
                  const SizedBox(height: 20),
                  Text(
                    attendeeName,
                    style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Colors.white),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    eventTitle,
                    textAlign: TextAlign.center,
                    style: const TextStyle(fontSize: 14, color: Colors.grey),
                  ),
                  const SizedBox(height: 12),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                    decoration: BoxDecoration(
                      color: Colors.indigo.withOpacity(0.2),
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(color: Colors.indigo.withOpacity(0.4)),
                    ),
                    child: Text(
                      ticketCode,
                      style: const TextStyle(fontFamily: 'monospace', fontWeight: FontWeight.bold, color: Colors.indigoAccent),
                    ),
                  ),
                  const SizedBox(height: 16),
                  const Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.offline_pin, size: 16, color: Colors.emerald),
                      SizedBox(width: 4),
                      Text('Offline Available (Cached Local Vault)', style: TextStyle(fontSize: 12, color: Colors.emerald)),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
