import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useCommandesStore } from '../store/commandesStore';
import { generateTrackingId } from '../utils/helpers';
import toast from 'react-hot-toast';

const AddCommande = () => {
  const navigate = useNavigate();
  const { addCommande } = useCommandesStore();
  
  const [formData, setFormData] = useState({
    clientName: '',
    clientPhone: '',
    adresse: '',
    montant: '',
    dateLivraison: '',
    notes: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newCommande = {
      id: `CMD${Date.now()}`,
      trackingId: generateTrackingId(),
      client: {
        name: formData.clientName,
        phone: formData.clientPhone
      },
      adresse: {
        text: formData.adresse,
        coordinates: null // Will be geocoded in production
      },
      livreur: null,
      statut: 'En attente',
      dateCreation: new Date(),
      dateLivraison: new Date(formData.dateLivraison),
      montant: parseFloat(formData.montant),
      notes: formData.notes
    };

    addCommande(newCommande);
    toast.success('Commande créée avec succès!');
    navigate('/commandes');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Nouvelle Commande
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Remplissez les informations de la commande
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-6">
        {/* Client Information */}
        <div>
          <h3 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
            Informations du client
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Nom du client 
              </label>
              <input
                type="text"
                name="clientName"
                value={formData.clientName}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="Ahmed Benali"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Téléphone 
              </label>
              <input
                type="tel"
                name="clientPhone"
                value={formData.clientPhone}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="+212 6 12 34 56 78"
              />
            </div>
          </div>
        </div>

        {/* Delivery Information */}
        <div>
          <h3 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
            Détails de livraison
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Adresse de livraison 
              </label>
              <textarea
                name="adresse"
                value={formData.adresse}
                onChange={handleChange}
                required
                rows="3"
                className="input-field"
                placeholder="45 Rue Hassan II, Agdal, Rabat"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Incluez le quartier et les points de repère pour faciliter la livraison
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Montant (MAD) 
                </label>
                <input
                  type="number"
                  name="montant"
                  value={formData.montant}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="input-field"
                  placeholder="250.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Date de livraison 
                </label>
                <input
                  type="date"
                  name="dateLivraison"
                  value={formData.dateLivraison}
                  onChange={handleChange}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="input-field"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Additional Notes */}
        <div>
          <h3 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
            Notes additionnelles
          </h3>
          <div>
            <label className="block text-sm font-medium mb-2">
              Instructions spéciales (optionnel)
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="4"
              className="input-field"
              placeholder="Ex: Appeler avant d'arriver, Accès par l'entrée arrière..."
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex-1 btn-secondary"
          >
            Annuler
          </button>
          <button type="submit" className="flex-1 btn-primary">
            Créer la commande
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCommande;