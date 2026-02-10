import { useEffect } from 'react';
import { Package, TrendingUp, Users, Clock } from 'lucide-react';

// Components
import StatsCard from '../components/dashboard/StatsCard';
import DeliveryChart from '../components/dashboard/DeliveryChart';

// ✅ STORE IMPORT (Must use curly braces)
import { useCommandesStore } from '../store/commandesStore';

// Data
import { mockCommandes, mockLivreurs } from '../utils/mockData';

const Dashboard = () => {
  const { commandes, livreurs, setCommandes, setLivreurs } = useCommandesStore();

  useEffect(() => {
    // Load mock data if store is empty
    if (commandes.length === 0) {
      setCommandes(mockCommandes);
    }
    if (livreurs.length === 0) {
      setLivreurs(mockLivreurs);
    }
  }, [commandes.length, livreurs.length, setCommandes, setLivreurs]);

  // Calculate real-time stats
  const stats = {
    total: commandes.length,
    livres: commandes.filter(c => c.statut === 'Livré').length,
    enCours: commandes.filter(c => c.statut === 'En cours').length,
    enAttente: commandes.filter(c => c.statut === 'En attente').length,
    livreursActifs: livreurs.filter(l => l.isActive).length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Tableau de bord
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Vue d'ensemble de votre activité de livraison
        </p>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Commandes"
          value={stats.total}
          icon={Package}
          trend={12}
          color="primary"
        />
        <StatsCard
          title="Livrées"
          value={stats.livres}
          icon={TrendingUp}
          trend={8}
          color="green"
        />
        <StatsCard
          title="En Cours"
          value={stats.enCours}
          icon={Clock}
          color="blue"
        />
        <StatsCard
          title="Livreurs Actifs"
          value={stats.livreursActifs}
          icon={Users}
          color="yellow"
        />
      </div>

      {/* Charts Section */}
      <DeliveryChart />

      {/* Recent Activity Table */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Activité Récente</h3>
        <div className="space-y-3">
          {commandes.slice(0, 5).map(commande => (
            <div key={commande.id} className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700 last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center">
                  <Package className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {commande.trackingId}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {commande.client.name}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  commande.statut === 'Livré' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : commande.statut === 'En cours'
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                }`}>
                  {commande.statut}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;