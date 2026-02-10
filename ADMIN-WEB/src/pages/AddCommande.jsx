import { useState, useEffect } from 'react'; // Added useEffect
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useCommandesStore } from '../store/commandesStore';
import { generateTrackingId } from '../utils/helpers';
import { mockLivreurs } from '../utils/mockData'; // Import mocks just in case store is empty
import toast from 'react-hot-toast';

const AddCommande = () => {
  const navigate = useNavigate();
  // Get livreurs from store
  const { addCommande, livreurs, setLivreurs } = useCommandesStore();
  
  // Ensure livreurs are loaded (in case user goes directly to this page)
  useEffect(() => {
    if (livreurs.length === 0) {
      setLivreurs(mockLivreurs);
    }
  }, []);

  const [formData, setFormData] = useState({
    clientName: '',
    clientPhone: '',
    adresse: '',
    montant: '',
    dateLivraison: '',
    livreurId: '', // New Field
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
    
    // Find selected livreur object
    const selectedLivreur = formData.livreurId 
      ? livreurs.find(l => l.id.toString() === formData.livreurId.toString())
      : null;

    const newCommande = {
      id: `CMD${Date.now()}`,
      trackingId: generateTrackingId(),
      client: {
        name: formData.clientName,
        phone: formData.clientPhone
      },
      adresse: {
        text: formData.adresse,
        coordinates: null 
      },
      // Assign the full livreur object if selected
      livreur: selectedLivreur ? { id: selectedLivreur.id, name: selectedLivreur.name } : null,
      // If a livreur is assigned, status starts as 'En cours', otherwise 'En attente'
      statut: selectedLivreur ? 'En cours' : 'En attente',
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
                  className="input-field"
                />
              </div>

              {/* NEW: Livreur Selection */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">
                  Assigner un livreur (Optionnel)
                </label>
                <select
                  name="livreurId"
                  value={formData.livreurId}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="">-- Non assigné (En attente) --</option>
                  {livreurs.map(l => (
                    <option key={l.id} value={l.id}>
                      {l.name} {l.status !== 'Disponible' ? `(${l.status})` : ''}
                    </option>
                  ))}
                </select>
               
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