// src/services/mockApi.js
import mockData from '../../../rabat_logistics_data.json';

class MockApiService {
  // Simulate API delay
  static delay(ms = 500) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Get all commandes
  static async getCommandes() {
    await this.delay();
    return mockData.commandes;
  }

  // Get commandes by status
  static async getCommandesByStatus(status) {
    await this.delay();
    return mockData.commandes.filter(c => c.statut === status);
  }

  // Get commande by ID
  static async getCommandeById(id) {
    await this.delay();
    return mockData.commandes.find(c => c.id === id);
  }

  // Get all livreurs
  static async getLivreurs() {
    await this.delay();
    return mockData.livreurs;
  }

  // Get available livreurs
  static async getAvailableLivreurs() {
    await this.delay();
    return mockData.livreurs.filter(l => l.is_available);
  }

  // Get notifications for user
  static async getNotifications(userId) {
    await this.delay();
    return mockData.notifications.filter(n => n.user === userId);
  }

  // Get clients
  static async getClients() {
    await this.delay();
    return mockData.clients;
  }
}

export default MockApiService;