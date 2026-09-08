import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';

class OfflineStorage {
  static const String _keyCachedTickets = 'cached_tickets';
  static const String _keySyncQueue = 'pending_sync_queue';

  static Future<void> cacheTickets(List<Map<String, dynamic>> tickets) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_keyCachedTickets, jsonEncode(tickets));
  }

  static Future<List<Map<String, dynamic>>> getCachedTickets() async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString(_keyCachedTickets);
    if (raw == null) return [];
    final List decoded = jsonDecode(raw);
    return decoded.cast<Map<String, dynamic>>();
  }

  static Future<void> queuePendingCheckIn(String barcode) async {
    final prefs = await SharedPreferences.getInstance();
    final List<String> queue = prefs.getStringList(_keySyncQueue) ?? [];
    queue.add(barcode);
    await prefs.setStringList(_keySyncQueue, queue);
  }

  static Future<List<String>> getPendingSyncQueue() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getStringList(_keySyncQueue) ?? [];
  }

  static Future<void> clearPendingSyncQueue() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_keySyncQueue);
  }
}
