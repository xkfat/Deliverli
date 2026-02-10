import { useState } from 'react';
import { generateTrackingId } from '../../utils/helpers';

const AddCommandeForm = ({ onSubmit, onCancel }) => {
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
        coordinates: null // Will be geocoded in real implementation
      },
      livreur: null,
      statut: 'En attente',
      dateCreation: new Date(),
      dateLivraison: new Date(formData.dateLivraison),
      montant: parseFloat(formData.montant),
      notes: formData.notes
    };

    onSubmit(newCommande);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Notes (optionnel)
        </label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows="3"
          className="input-field"
          placeholder="Instructions spéciales..."
        />
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 btn-secondary"
        >
          Annuler
        </button>
        <button type="submit" className="flex-1 btn-primary">
          Créer la commande
        </button>
      </div>
    </form>
  );
};

export default AddCommandeForm;