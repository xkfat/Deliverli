import { useState, useEffect, useMemo } from "react";
import { Filter, RefreshCw, Package } from "lucide-react";
import toast from "react-hot-toast";
import { useCommandesStore } from "../store/commandesStore"; // Import your store

const CommandHistory = () => {
  // 1. Get commands directly from the global store
  const { commandes } = useCommandesStore();
  const [loading, setLoading] = useState(false);

  // Filters state
  const [filters, setFilters] = useState({
    status: "",
    livreur: "",
    dateFrom: "",
    dateTo: "",
    searchTerm: "",
  });

  // 2. Use useMemo for filtering to improve performance
  const filteredCommands = useMemo(() => {
    let filtered = [...commandes];

    if (filters.status) {
      filtered = filtered.filter((cmd) => cmd.statut === filters.status);
    }

    if (filters.livreur) {
      filtered = filtered.filter((cmd) =>
        // Note: Using cmd.livreur?.name to match your mockData.js structure
        cmd.livreur?.name?.toLowerCase().includes(filters.livreur.toLowerCase())
      );
    }

    if (filters.dateFrom) {
      filtered = filtered.filter(
        (cmd) => new Date(cmd.date_creation || cmd.dateCreation) >= new Date(filters.dateFrom)
      );
    }

    if (filters.dateTo) {
      filtered = filtered.filter(
        (cmd) => new Date(cmd.date_creation || cmd.dateCreation) <= new Date(filters.dateTo)
      );
    }

    if (filters.searchTerm) {
      const search = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (cmd) =>
          (cmd.tracking_id || cmd.trackingId)?.toLowerCase().includes(search) ||
          (cmd.client_name || cmd.client?.name)?.toLowerCase().includes(search)
      );
    }

    return filtered;
  }, [commandes, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({
      status: "",
      livreur: "",
      dateFrom: "",
      dateTo: "",
      searchTerm: "",
    });
  };

  const getStatusBadge = (status) => {
    const badges = {
      Livré: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      "En cours": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      "En attente": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      Annulé: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      Retour: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    };
    return badges[status] || badges["En attente"];
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Historique des Commandes
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Consultez et filtrez l'historique complet (Mock Data Sync)
          </p>
        </div>
        <button
          onClick={() => toast.success("Données synchronisées")}
          className="btn-primary flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Actualiser
        </button>
      </div>

      {/* Filters Card */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <input
            type="text"
            name="searchTerm"
            placeholder="ID, Client..."
            value={filters.searchTerm}
            onChange={handleFilterChange}
            className="input-field"
          />
          <select name="status" value={filters.status} onChange={handleFilterChange} className="input-field">
            <option value="">Tous les statuts</option>
            <option value="En attente">En attente</option>
            <option value="En cours">En cours</option>
            <option value="Livré">Livré</option>
            <option value="Annulé">Annulé</option>
          </select>
          <input type="text" name="livreur" placeholder="Livreur" value={filters.livreur} onChange={handleFilterChange} className="input-field" />
          <input type="date" name="dateFrom" value={filters.dateFrom} onChange={handleFilterChange} className="input-field" />
          <input type="date" name="dateTo" value={filters.dateTo} onChange={handleFilterChange} className="input-field" />
        </div>
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-gray-600">{filteredCommands.length} résultats</p>
          <button onClick={clearFilters} className="text-sm text-primary-600 hover:underline">Réinitialiser</button>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr className="text-left text-xs font-medium text-gray-500 uppercase">
                <th className="px-6 py-3">Tracking ID</th>
                <th className="px-6 py-3">Client</th>
                <th className="px-6 py-3">Adresse</th>
                <th className="px-6 py-3">Livreur</th>
                <th className="px-6 py-3">Montant</th>
                <th className="px-6 py-3">Statut</th>
                <th className="px-6 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredCommands.map((command) => (
                <tr key={command.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <td className="px-6 py-4 font-medium text-primary-600">
                    {command.trackingId || command.tracking_id}
                  </td>
                  <td className="px-6 py-4">
                    {command.client?.name || command.client_name}
                  </td>
                  <td className="px-6 py-4 text-sm max-w-xs truncate text-gray-500">
                    {command.adresse?.text || command.adresse_text}
                  </td>
                  <td className="px-6 py-4">
                    {command.livreur?.name || "Non assigné"}
                  </td>
                  <td className="px-6 py-4 font-bold">{command.montant} DH</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(command.statut)}`}>
                      {command.statut}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {formatDate(command.dateCreation || command.date_creation)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CommandHistory;