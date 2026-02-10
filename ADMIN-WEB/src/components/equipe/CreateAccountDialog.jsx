import { useState } from 'react';
import Dialog from '../common/Dialog';

const CreateAccountDialog = ({ isOpen, onClose, onSubmit, isAdmin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'livreur'
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newMember = {
      id: `${formData.role.toUpperCase()}${Date.now()}`,
      ...formData,
      isActive: formData.role === 'livreur' ? true : undefined,
      status: formData.role === 'livreur' ? 'Disponible' : undefined,
      currentLocation: formData.role === 'livreur' 
        ? { lat: 33.9716, lng: -6.8498 } // Default Rabat coordinates
        : undefined,
      deliveriesToday: formData.role === 'livreur' ? 0 : undefined,
      dateCreation: new Date()
    };

    onSubmit(newMember, formData.role);
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: 'livreur'
    });
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Créer un nouveau compte"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Role Selection */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Rôle 
          </label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="input-field"
            required
          >
            <option value="livreur">Livreur</option>
            {isAdmin && <option value="gestionnaire">Gestionnaire</option>}
          </select>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {formData.role === 'livreur' 
              ? 'Les livreurs peuvent livrer les commandes' 
              : 'Les gestionnaires peuvent gérer les commandes'}
          </p>
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Nom complet 
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="input-field"
            placeholder="Ahmed Benali"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Email 
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="input-field"
            placeholder="ahmed.benali@delivery.ma"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Téléphone 
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="input-field"
            placeholder="+212 6 12 34 56 78"
          />
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            ℹ️ Un email avec les identifiants de connexion sera envoyé à l'adresse fournie.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 btn-secondary"
          >
            Annuler
          </button>
          <button 
            type="submit" 
            className="flex-1 btn-primary"
          >
            Créer le compte
          </button>
        </div>
      </form>
    </Dialog>
  );
};

export default CreateAccountDialog;