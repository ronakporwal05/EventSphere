import 'package:flutter/material.dart';

class VolunteerScannerScreen extends StatefulWidget {
  const VolunteerScannerScreen({super.key});

  @override
  State<VolunteerScannerScreen> createState() => _VolunteerScannerScreenState();
}

class _VolunteerScannerScreenState extends State<VolunteerScannerScreen> {
  String? _scanResult;
  bool _isSuccess = false;

  void _simulateScan(String code, bool valid) {
    setState(() {
      _scanResult = code;
      _isSuccess = valid;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Volunteer Scanner Terminal'),
        actions: [
          IconButton(
            icon: const Icon(Icons.flash_on),
            onPressed: () {},
          ),
        ],
      ),
      body: Column(
        children: [
          Expanded(
            child: Container(
              margin: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.black,
                borderRadius: BorderRadius.circular(24),
                border: Border.all(color: Colors.indigo.withOpacity(0.5), width: 2),
              ),
              child: Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Icon(Icons.qr_code_scanner, size: 80, color: Colors.indigoAccent),
                    const SizedBox(height: 16),
                    const Text('Align QR Code in Target Frame', style: TextStyle(color: Colors.grey)),
                    const SizedBox(height: 24),
                    Wrap(
                      spacing: 8,
                      children: [
                        ElevatedButton(
                          onPressed: () => _simulateScan('TKT-VALID-9941', true),
                          style: ElevatedButton.styleFrom(backgroundColor: Colors.emerald),
                          child: const Text('Simulate Valid Pass', style: TextStyle(color: Colors.white)),
                        ),
                        ElevatedButton(
                          onPressed: () => _simulateScan('TKT-INVALID-0000', false),
                          style: ElevatedButton.styleFrom(backgroundColor: Colors.rose),
                          child: const Text('Simulate Invalid Pass', style: TextStyle(color: Colors.white)),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ),
          if (_scanResult != null)
            Container(
              padding: const EdgeInsets.all(20),
              margin: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: _isSuccess ? Colors.emerald.withOpacity(0.2) : Colors.rose.withOpacity(0.2),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: _isSuccess ? Colors.emerald : Colors.rose),
              ),
              child: Row(
                children: [
                  Icon(_isSuccess ? Icons.check_circle : Icons.error, color: _isSuccess ? Colors.emerald : Colors.rose, size: 32),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          _isSuccess ? 'ACCESS GRANTED' : 'ACCESS DENIED',
                          style: TextStyle(fontWeight: FontWeight.bold, color: _isSuccess ? Colors.emerald : Colors.rose),
                        ),
                        Text('Barcode: $_scanResult', style: const TextStyle(fontSize: 12, color: Colors.white70)),
                      ],
                    ),
                  ),
                ],
              ),
            ),
        ],
      ),
    );
  }
}
