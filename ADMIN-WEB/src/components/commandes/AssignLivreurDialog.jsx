import { useState } from 'react';
import Dialog from '../common/Dialog';
import { useCommandesStore } from '../../store/commandesStore';
import { findNearestLivreurs } from '../../utils/helpers';
import { MapPin, Package } from 'lucide-react';
import toast from 'react-hot-toast';

const AssignLivreurDialog = ({ isOpen, onClose, commande }) => {
  const { livreurs, updateCommande } = useCommandesStore();
  const [selectedLivreur, setSelectedLivreur] = useState(null);

  if (!commande) return null;

  const availableLivreurs = commande.adresse?.coordinates
    ? findNearestLivreurs(commande.adresse.coordinates, livreurs, 15)
    : livreurs.filter(l => l.isActive && l.status === 'Disponible');

  const handleAssign = () => {
    if (!selectedLivreur) {
      toast.error('Veuillez sélectionner un livreur');
      return;
    }

    updateCommande(commande.id, {
      livreur: {
        id: selectedLivreur.id,
        name: selectedLivreur.name
      },
      statut: 'En cours'
    });

    toast.success(`Commande assignée à ${selectedLivreur.name}`);
    onClose();
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Assigner un livreur" size="md">
      <div className="space-y-4">
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400">Commande</p>
          <p className="font-semibold">{commande.trackingId}</p>
          <p className="text-sm mt-1">{commande.client.name}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">{commande.adresse.text}</p>
        </div>

        <div>
          <h4 className="font-medium mb-3">
            Livreurs disponibles ({availableLivreurs.length})
          </h4>
          
          {availableLivreurs.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              Aucun livreur disponible pour le moment
            </p>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {availableLivreurs.map(livreur => (
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
                          {livreur.deliveriesToday} livraisons aujourd'hui
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
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        {livreur.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
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
            Assigner
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default AssignLivreurDialog;