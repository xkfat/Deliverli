import { useState, useEffect } from "react";
import { Filter, RefreshCw, Package } from "lucide-react";
// import { getAllCommands } from '../api/admin/commands'; // ✅ COMMENTED - Will use when backend is ready
import toast from "react-hot-toast";

// ✅ UPDATED MOCK DATA - Based on your actual database
const mockCommands = [
  {
    id: "1",
    tracking_id: "LIV-FYY56006",
    client_name: "CLIENT",
    client_phone: "123456787",
    adresse_text: "Adresse à définir",
    livreur_name: "Non assigné",
    montant: "10.00",
    statut: "En cours",
    date_creation: "2026-02-10T10:30:00",
    date_livraison: null,
    poids: "10 kg",
    dimensions: "Standard"
  },
  {
    id: "2",
    tracking_id: "LIV-GTG66959",
    client_name: "Dr. Mouna Alami",
    client_phone: "+212 7 07 11 22 33",
    adresse_text: "Villa 14, Avenue Beni Mellal, Souissi, Rabat",
    livreur_name: "Amin Tazi",
    montant: "850.00",
    statut: "Livré",
    date_creation: "2026-02-10T08:15:00",
    date_livraison: "2026-02-10T14:30:00",
    poids: "0.5 kg",
    dimensions: "petit"
  },
  {
    id: "3",
    tracking_id: "LIV-ABC12345",
    client_name: "Hassan Benjelloun",
    client_phone: "+212 6 61 99 88 77",
    adresse_text: "Résidence Al Andalous, Agdal, Rabat",
    livreur_name: "Omar Idrissi",
    montant: "125.50",
    statut: "En cours",
    date_creation: "2026-02-09T16:20:00",
    date_livraison: null,
    poids: "2.3 kg",
    dimensions: "Moyen"
  },
  {
    id: "4",
    tracking_id: "LIV-XYZ98765",
    client_name: "Fatima Zahra",
    client_phone: "+212 7 00 55 44 33",
    adresse_text: "Quartier Hassan, Salé",
    livreur_name: "Amin Tazi",
    montant: "67.25",
    statut: "Livré",
    date_creation: "2026-02-08T11:45:00",
    date_livraison: "2026-02-08T17:20:00",
    poids: "1.1 kg",
    dimensions: "petit"
  },
  {
    id: "5",
    tracking_id: "LIV-DEF54321",
    client_name: "Mohamed Alaoui",
    client_phone: "+212 6 12 34 56 78",
    adresse_text: "Centre ville, Témara",
    livreur_name: null,
    montant: "430.00",
    statut: "En attente",
    date_creation: "2026-02-07T09:30:00",
    date_livraison: null,
    poids: "5.7 kg",
    dimensions: "Grand"
  },
  {
    id: "6",
    tracking_id: "LIV-GHI11111",
    client_name: "Aicha Bennani",
    client_phone: "+212 7 77 88 99 00",
    adresse_text: "Hay Riad, Rabat",
    livreur_name: "Omar Idrissi",
    montant: "89.75",
    statut: "Annulé",
    date_creation: "2026-02-06T14:10:00",
    date_livraison: null,
    poids: "0.8 kg",
    dimensions: "petit"
  },
];

const CommandHistory = () => {
  const [commands, setCommands] = useState([]);
  const [filteredCommands, setFilteredCommands] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filters
  const [filters, setFilters] = useState({
    status: "",
    livreur: "",
    dateFrom: "",
    dateTo: "",
    searchTerm: "",
  });

  // Fetch commands on component mount
  useEffect(() => {
    fetchCommands();
  }, []);

  // Apply filters when commands or filters change
  useEffect(() => {
    applyFilters();
  }, [commands, filters]);

  const fetchCommands = async () => {
    try {
      setLoading(true);

      // ✅ MOCK DATA VERSION - Using updated mock data
      setTimeout(() => {
        setCommands(mockCommands);
        setFilteredCommands(mockCommands);
        setLoading(false);
        toast.success("Historique chargé avec succès");
      }, 500); // Simulate network delay

      /* ✅ REAL API VERSION - Uncomment when backend is ready
      const data = await getAllCommands();
      setCommands(data);
      setFilteredCommands(data);
      toast.success('Historique chargé');
      */
    } catch (error) {
      toast.error("Échec du chargement de l'historique");
      console.error(error);
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...commands];

    if (filters.status) {
      filtered = filtered.filter((cmd) => cmd.statut === filters.status);
    }

    if (filters.livreur) {
      filtered = filtered.filter((cmd) =>
        cmd.livreur_name?.toLowerCase().includes(filters.livreur.toLowerCase())
      );
    }

    if (filters.dateFrom) {
      filtered = filtered.filter(
        (cmd) => new Date(cmd.date_creation) >= new Date(filters.dateFrom)
      );
    }

    if (filters.dateTo) {
      filtered = filtered.filter(
        (cmd) => new Date(cmd.date_creation) <= new Date(filters.dateTo)
      );
    }

    if (filters.searchTerm) {
      filtered = filtered.filter(
        (cmd) =>
          cmd.tracking_id
            ?.toLowerCase()
            .includes(filters.searchTerm.toLowerCase()) ||
          cmd.client_name
            ?.toLowerCase()
            .includes(filters.searchTerm.toLowerCase())
      );
    }

    setFilteredCommands(filtered);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
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
      Livré:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      "En cours":
        "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      "En attente":
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      Annulé: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gray-600 dark:text-gray-400">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Historique des Commandes
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Consultez et filtrez l'historique complet des commandes
          </p>
        </div>
        <button
          onClick={fetchCommands}
          className="btn-primary flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Actualiser
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Filtres
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <input
            type="text"
            name="searchTerm"
            placeholder="Rechercher (Tracking ID, Client)"
            value={filters.searchTerm}
            onChange={handleFilterChange}
            className="input-field"
          />

          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="input-field"
          >
            <option value="">Tous les statuts</option>
            <option value="En attente">En attente</option>
            <option value="En cours">En cours</option>
            <option value="Livré">Livré</option>
            <option value="Annulé">Annulé</option>
          </select>

          <input
            type="text"
            name="livreur"
            placeholder="Livreur"
            value={filters.livreur}
            onChange={handleFilterChange}
            className="input-field"
          />

          <input
            type="date"
            name="dateFrom"
            value={filters.dateFrom}
            onChange={handleFilterChange}
            className="input-field"
          />

          <input
            type="date"
            name="dateTo"
            value={filters.dateTo}
            onChange={handleFilterChange}
            className="input-field"
          />
        </div>

        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {filteredCommands.length} commande(s) trouvée(s)
          </p>
          <button
            onClick={clearFilters}
            className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
          >
            Réinitialiser les filtres
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Tracking ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Téléphone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Adresse
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Livreur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Montant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Poids
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date Création
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredCommands.length === 0 ? (
                <tr>
                  <td
                    colSpan="9"
                    className="px-6 py-8 text-center text-gray-500 dark:text-gray-400"
                  >
                    Aucune commande trouvée
                  </td>
                </tr>
              ) : (
                filteredCommands.map((command) => (
                  <tr
                    key={command.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                        <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                          {command.tracking_id}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {command.client_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {command.client_phone}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate">
                      {command.adresse_text}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {command.livreur_name || "Non assigné"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {command.montant} MAD
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {command.poids}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                          command.statut
                        )}`}
                      >
                        {command.statut}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {formatDate(command.date_creation)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CommandHistory;