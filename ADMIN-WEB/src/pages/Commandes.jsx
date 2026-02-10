import { useState, useEffect } from 'react';
import { MapPin, Edit, Trash2, UserPlus, Eye } from 'lucide-react';
import SearchBar from '../components/common/SearchBar';
import StatusBadge from '../components/common/StatusBadge';
import Dialog from '../components/common/Dialog';
import ConfirmDialog from '../components/common/ConfirmDialog';
import AssignLivreurDialog from '../components/commandes/AssignLivreurDialog';
import { useCommandesStore } from '../store/commandesStore';
import { mockCommandes, mockLivreurs } from '../utils/mockData';
import { formatDate } from '../utils/helpers';
import toast from 'react-hot-toast';

const Commandes = () => {
  const { commandes, setCommandes, updateCommande, deleteCommande, setLivreurs } = useCommandesStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [showLocationDialog, setShowLocationDialog] = useState(false);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedCommande, setSelectedCommande] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('');

  useEffect(() => {
    if (commandes.length === 0) {
      setCommandes(mockCommandes);
      setLivreurs(mockLivreurs);
    }
  }, []);

  const filteredCommandes = commandes.filter(cmd =>
    cmd.trackingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cmd.client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cmd.client.phone.includes(searchQuery) ||
    cmd.statut.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStatusChange = () => {
    if (!selectedStatus) return;
    
    updateCommande(selectedCommande.id, { statut: selectedStatus });
    toast.success('Statut mis à jour avec succès');
    setShowStatusDialog(false);
    setSelectedCommande(null);
  };

  const handleDelete = () => {
    deleteCommande(selectedCommande.id);
    toast.success('Commande supprimée');
    setShowDeleteDialog(false);
    setSelectedCommande(null);
  };

  const statusOptions = ['En attente', 'En cours', 'Livré', 'Annulé'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Gestion des Commandes
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {filteredCommandes.length} commande(s)
          </p>
        </div>
      </div>

      <div className="max-w-md">
        <SearchBar
          placeholder="Rechercher par ID, client, téléphone..."
          value={searchQuery}
          onChange={setSearchQuery}
        />
      </div>

      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Tracking ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Adresse
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Livreur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredCommandes.map((commande) => (
                <tr key={commande.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {commande.trackingId}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(commande.dateCreation)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {commande.client.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {commande.client.phone}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-700 dark:text-gray-300 max-w-xs truncate">
                        {commande.adresse.text}
                      </span>
                      {commande.adresse.coordinates && (
                        <button
                          onClick={() => {
                            setSelectedCommande(commande);
                            setShowLocationDialog(true);
                          }}
                          className="text-primary-600 hover:text-primary-700 dark:text-primary-400"
                        >
                          <MapPin className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {commande.livreur ? (
                      <span className="text-sm text-gray-900 dark:text-white">
                        {commande.livreur.name}
                      </span>
                    ) : (
                      <button
                        onClick={() => {
                          setSelectedCommande(commande);
                          setShowAssignDialog(true);
                        }}
                        className="flex items-center gap-1 text-primary-600 hover:text-primary-700 dark:text-primary-400 text-sm font-medium"
                      >
                        <UserPlus className="w-4 h-4" />
                        Assigner
                      </button>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge
                      status={commande.statut}
                      onClick={() => {
                        setSelectedCommande(commande);
                        setSelectedStatus(commande.statut);
                        setShowStatusDialog(true);
                      }}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        className="p-1 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                        title="Voir détails"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        className="p-1 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                        title="Modifier"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedCommande(commande);
                          setShowDeleteDialog(true);
                        }}
                        className="p-1 text-red-600 hover:text-red-700 dark:text-red-400"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog
        isOpen={showLocationDialog}
        onClose={() => setShowLocationDialog(false)}
        title="Localisation"
        size="lg"
      >
        {selectedCommande?.adresse?.coordinates && (
          <div>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              {selectedCommande.adresse.text}
            </p>
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg h-96 flex items-center justify-center">
              <p className="text-gray-500">
                Carte Google Maps ici
                <br />
                Lat: {selectedCommande.adresse.coordinates.lat}
                <br />
                Lng: {selectedCommande.adresse.coordinates.lng}
              </p>
            </div>
          </div>
        )}
      </Dialog>

      <Dialog
        isOpen={showStatusDialog}
        onClose={() => setShowStatusDialog(false)}
        title="Modifier le statut"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Sélectionner un nouveau statut
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="input-field"
            >
              {statusOptions.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              onClick={() => setShowStatusDialog(false)}
              className="flex-1 btn-secondary"
            >
              Annuler
            </button>
            <button onClick={handleStatusChange} className="flex-1 btn-primary">
              Confirmer
            </button>
          </div>
        </div>
      </Dialog>

      <AssignLivreurDialog
        isOpen={showAssignDialog}
        onClose={() => setShowAssignDialog(false)}
        commande={selectedCommande}
      />

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Supprimer la commande"
        message={`Êtes-vous sûr de vouloir supprimer la commande ${selectedCommande?.trackingId} ?`}
        type="danger"
        confirmText="Supprimer"
      />
    </div>
  );
};

export default Commandes;