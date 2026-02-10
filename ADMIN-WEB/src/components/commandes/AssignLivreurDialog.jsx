import { useState, useEffect } from 'react';
import Dialog from '../common/Dialog';
import { useCommandesStore } from '../../store/commandesStore';
import { findNearestLivreurs } from '../../utils/helpers';
import { MapPin, Package, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const AssignLivreurDialog = ({ isOpen, onClose, commande, onConfirmSelect }) => {
  const { livreurs, updateCommande } = useCommandesStore();
  const [selectedLivreur, setSelectedLivreur] = useState(null);

  useEffect(() => {
    setSelectedLivreur(null);
  }, [isOpen]);

  if (!commande) return null;

  const isReplacing = !!commande.livreur;

  // Use the address from the passed commande (or editFormData)
  const availableLivreurs = commande.adresse?.coordinates
    ? findNearestLivreurs(commande.adresse.coordinates, livreurs, 15)
    : livreurs.filter(l => l.isActive && l.status === 'Disponible');

  const handleAssign = () => {
    if (!selectedLivreur) {
      toast.error('Veuillez sélectionner un livreur');
      return;
    }

    // NEW: If onConfirmSelect is passed, return data to parent instead of saving to store
    if (onConfirmSelect) {
      onConfirmSelect(selectedLivreur);
      onClose();
      return;
    }

    // Standard behavior (Immediate Save)
    updateCommande(commande.id, {
      livreur: {
        id: selectedLivreur.id,
        name: selectedLivreur.name
      },
      statut: 'En cours' 
    });

    toast.success(isReplacing 
      ? `Livreur remplacé par ${selectedLivreur.name}` 
      : `Commande assignée à ${selectedLivreur.name}`
    );
    onClose();
  };

  return (
    <Dialog 
      isOpen={isOpen} 
      onClose={onClose} 
      title={isReplacing ? "Changer de livreur" : "Assigner un livreur"} 
      size="md"
    >
      <div className="space-y-4">
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Commande</p>
            <p className="font-semibold">{commande.trackingId}</p>
            <p className="text-sm mt-1">{commande.adresse.text}</p>
          </div>
          {isReplacing && (
            <div className="text-right">
              <p className="text-xs text-orange-600 dark:text-orange-400 font-medium mb-1 flex items-center gap-1 justify-end">
                <AlertCircle className="w-3 h-3" /> Actuel
              </p>
              <p className="font-medium text-gray-900 dark:text-white">
                {commande.livreur.name}
              </p>
            </div>
          )}
        </div>

        <div>
          <h4 className="font-medium mb-3">
            Livreurs disponibles ({availableLivreurs.length})
          </h4>
          
          {availableLivreurs.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-dashed border-gray-300 dark:border-gray-600">
              <p className="text-gray-500">Aucun livreur disponible pour le moment</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {availableLivreurs.map(livreur => {
                if (isReplacing && livreur.name === commande.livreur?.name) return null;

                return (
                  <div
                    key={livreur.id}
                    onClick={() => setSelectedLivreur(livreur)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedLivreur?.id === livreur.id
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{livreur.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {livreur.phone}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                            <Package className="w-3 h-3" />
                            {livreur.deliveriesToday} livraisons
                          </span>
                          {livreur.distance && (
                            <span className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                              <MapPin className="w-3 h-3" />
                              {livreur.distance.toFixed(1)} km
                            </span>
                          )}
                        </div>
                      </div>
                      <div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          livreur.status === 'Disponible' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {livreur.status}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-4">
          <button onClick={onClose} className="flex-1 btn-secondary">
            Annuler
          </button>
          <button 
            onClick={handleAssign} 
            className="flex-1 btn-primary"
            disabled={!selectedLivreur}
          >
            {onConfirmSelect ? "Sélectionner" : (isReplacing ? "Confirmer le changement" : "Assigner")}
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default AssignLivreurDialog;