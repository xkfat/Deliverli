// lib/services/mock_api_service.dart
import 'dart:convert';
import 'package:flutter/services.dart';
import '../models/commande_model.dart';

class MockApiService {
  static Map<String, dynamic>? _cachedData;

  // Load and cache the JSON data
  static Future<Map<String, dynamic>> _loadData() async {
    if (_cachedData != null) return _cachedData!;
    
    final String jsonString = await rootBundle.loadString('assets/rabat_data.json');
    _cachedData = json.decode(jsonString);
    return _cachedData!;
  }

  // Get all commandes
  static Future<List<CommandeModel>> getCommandes() async {
    final data = await _loadData();
    final List<dynamic> commandesJson = data['commandes'];
    return commandesJson.map((json) => CommandeModel.fromJson(json)).toList();
  }

  // Get commandes by status
  static Future<List<CommandeModel>> getCommandesByStatus(String status) async {
    final commandes = await getCommandes();
    return commandes.where((c) => c.statut == status).toList();
  }

  // Get commande by ID
  static Future<CommandeModel?> getCommandeById(int id) async {
    final commandes = await getCommandes();
    try {
      return commandes.firstWhere((c) => c.id == id);
    } catch (e) {
      return null;
    }
  }

  // Get livreurs
  static Future<List<Map<String, dynamic>>> getLivreurs() async {
    final data = await _loadData();
    return List<Map<String, dynamic>>.from(data['livreurs']);
  }

  // Get available livreurs
  static Future<List<Map<String, dynamic>>> getAvailableLivreurs() async {
    final livreurs = await getLivreurs();
    return livreurs.where((l) => l['is_available'] == true).toList();
  }

  // Get notifications
  static Future<List<Map<String, dynamic>>> getNotifications(int userId) async {
    final data = await _loadData();
    final List<dynamic> notifications = data['notifications'];
    return notifications
        .where((n) => n['user'] == userId)
        .cast<Map<String, dynamic>>()
        .toList();
  }
}