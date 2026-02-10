import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Save, X, ExternalLink } from 'lucide-react';
import SearchBar from '../components/common/SearchBar';
import Dialog from '../components/common/Dialog';
import ConfirmDialog from '../components/common/ConfirmDialog';
import AssignLivreurDialog from '../components/commandes/AssignLivreurDialog';
import CommandeDetailsDialog from '../components/commandes/CommandeDetailsDialog';
import CommandeTable from '../components/commandes/CommandeTable';
import { useCommandesStore } from '../store/commandesStore';
import { mockCommandes, mockLivreurs } from '../utils/mockData';
import toast from 'react-hot-toast';
import MockApiService from '../services/mockApi';

const Commandes = () => {
  const navigate = useNavigate();
  const { commandes, setCommandes, updateCommande, deleteCommande, setLivreurs } = useCommandesStore();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Dialog States
  const [showLocationDialog, setShowLocationDialog] = useState(false);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  
  const [selectedCommande, setSelectedCommande] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('');

  // Editing State
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState(null);

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

  // --- Edit Logic ---
  const handleEditClick = (commande) => {
    setEditingId(commande.id);
    setEditFormData(JSON.parse(JSON.stringify(commande)));
  };

  const handleEditChange = (field, value, section = null) => {
    setEditFormData(prev => {
      if (section) {
        return {
          ...prev,
          [section]: {
            ...prev[section],
            [field]: value
          }
        };
      }
      return { ...prev, [field]: value };
    });
  };

  const handleSaveEdit = () => {
    if (!editFormData) return;
    updateCommande(editingId, editFormData);
    toast.success('Commande modifiée avec succès');
    setEditingId(null);
    setEditFormData(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditFormData(null);
  };

  // --- View Details ---
  const handleViewDetails = (commande) => {
    setSelectedCommande(commande);
    setShowDetailsDialog(true);
  };

  // --- Handling Dialog Triggers (View Mode vs Edit Mode) ---
  const handleOpenAssignDialog = (commandeData) => {
    setSelectedCommande(commandeData);
    setShowAssignDialog(true);
  };

  const handleOpenStatusDialog = (commandeData) => {
    setSelectedCommande(commandeData);
    setSelectedStatus(commandeData.statut);
    setShowStatusDialog(true);
  };

  // --- Dialog Confirmations ---
  
  // 1. Status Confirmation
  const confirmStatusChange = () => {
    if (!selectedStatus) return;

    if (editingId) {
      // If editing, just update the temporary form data
      handleEditChange('statut', selectedStatus);
      toast.success('Statut mis à jour (non sauvegardé)');
    } else {
      // If not editing (should generally be disabled based on UI, but safe to keep)
      updateCommande(selectedCommande.id, { statut: selectedStatus });
      toast.success('Statut mis à jour avec succès');
    }
    setShowStatusDialog(false);
    setSelectedCommande(null);
  };

  // 2. Livreur Confirmation (Callback passed to Dialog)
  const handleLivreurSelect = (livreur) => {
    if (editingId) {
      handleEditChange('livreur', { id: livreur.id, name: livreur.name });
      toast.success('Livreur mis à jour (non sauvegardé)');
    }
    // Note: If not editing, AssignLivreurDialog handles the save internally,
    // but in this specific flow, we are only using this callback for Edit Mode.
  };

  // --- Delete Logic ---
  const handleDeleteClick = (commande) => {
    setSelectedCommande(commande);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    if (selectedCommande) {
      deleteCommande(selectedCommande.id);
      toast.success('Commande supprimée');
      setShowDeleteDialog(false);
      setSelectedCommande(null);
    }
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

        <div className="flex items-center gap-3">
          {editingId ? (
            <>
              <button
                onClick={handleCancelEdit}
                className="btn-secondary flex items-center gap-2 bg-gray-200 text-gray-800"
              >
                <X className="w-5 h-5" />
                Annuler
              </button>
              <button
                onClick={handleSaveEdit}
                className="btn-primary flex items-center gap-2 bg-green-600 hover:bg-green-700"
              >
                <Save className="w-5 h-5" />
                Enregistrer les modifications
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate('/add-commande')}
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Nouvelle commande
            </button>
          )}
        </div>
      </div>

      <div className="max-w-md">
        <SearchBar
          placeholder="Rechercher par ID, client, téléphone..."
          value={searchQuery}
          onChange={setSearchQuery}
          disabled={!!editingId}
        />
      </div>

      <CommandeTable 
        commandes={filteredCommandes}
        onViewDetails={handleViewDetails}
        onViewLocation={(cmd) => {
          setSelectedCommande(cmd);
          setShowLocationDialog(true);
        }}
        // Pass the handlers that open dialogs
        onAssignLivreur={handleOpenAssignDialog}
        onChangeStatus={handleOpenStatusDialog}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
        editingId={editingId}
        editFormData={editFormData}
        onEditChange={handleEditChange}
      />

      <CommandeDetailsDialog 
        isOpen={showDetailsDialog}
        onClose={() => setShowDetailsDialog(false)}
        commande={selectedCommande}
      />

      <Dialog
        isOpen={showLocationDialog}
        onClose={() => setShowLocationDialog(false)}
        title="Localisation"
        size="lg"
      >
        {selectedCommande?.adresse?.coordinates && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm flex justify-between items-center">
               <p className="text-gray-900 dark:text-white font-medium">
                 {selectedCommande.adresse.text}
               </p>
               <a 
                  href={`https://www.google.com/maps/search/?api=1&query=${selectedCommande.adresse.coordinates.lat},${selectedCommande.adresse.coordinates.lng}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium whitespace-nowrap ml-4"
               >
                 <ExternalLink className="w-4 h-4" />
                 Ouvrir
               </a>
            </div>
            
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg h-96 overflow-hidden relative border border-gray-200 dark:border-gray-600">
              <iframe
                title="Map Localisation"
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="no"
                marginHeight="0"
                marginWidth="0"
                src={`https://maps.google.com/maps?q=${selectedCommande.adresse.coordinates.lat},${selectedCommande.adresse.coordinates.lng}&hl=fr&z=15&output=embed`}
                className="absolute inset-0 w-full h-full"
              />
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
            <button onClick={() => setShowStatusDialog(false)} className="flex-1 btn-secondary">
              Annuler
            </button>
            <button onClick={confirmStatusChange} className="flex-1 btn-primary">
              {editingId ? "Sélectionner" : "Confirmer"}
            </button>
          </div>
        </div>
      </Dialog>

      <AssignLivreurDialog
        isOpen={showAssignDialog}
        onClose={() => setShowAssignDialog(false)}
        commande={selectedCommande}
        // If we are editing, pass the handler to update editFormData
        onConfirmSelect={editingId ? handleLivreurSelect : null}
      />

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleConfirmDelete}
        title="Supprimer la commande"
        message={`Êtes-vous sûr de vouloir supprimer la commande ${selectedCommande?.trackingId} ?`}
        type="danger"
        confirmText="Supprimer"
      />
    </div>
  );
};

export default Commandes;