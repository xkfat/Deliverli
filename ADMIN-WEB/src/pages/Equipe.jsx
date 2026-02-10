import { useState, useEffect } from 'react';
import { UserPlus } from 'lucide-react';
import SearchBar from '../components/common/SearchBar';
import Dialog from '../components/common/Dialog';
import { useCommandesStore } from '../store/commandesStore';
import { useAuthStore } from '../store/authStore';
import { mockLivreurs, mockGestionnaires } from '../utils/mockData';
import toast from 'react-hot-toast';

const Equipe = () => {
  const { livreurs, gestionnaires, setLivreurs, setGestionnaires, addLivreur, addGestionnaire } = useCommandesStore();
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('livreurs');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'livreur'
  });

  useEffect(() => {
    if (livreurs.length === 0) setLivreurs(mockLivreurs);
    if (gestionnaires.length === 0 && isAdmin) setGestionnaires(mockGestionnaires);
  }, []);

  const allMembers = activeTab === 'livreurs' ? livreurs : gestionnaires;
  const filteredMembers = allMembers.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newMember = {
      id: `${formData.role.toUpperCase()}${Date.now()}`,
      ...formData,
      isActive: formData.role === 'livreur' ? true : undefined,
      status: formData.role === 'livreur' ? 'Disponible' : undefined,
      dateCreation: new Date()
    };

    if (formData.role === 'livreur') {
      addLivreur(newMember);
    } else {
      addGestionnaire(newMember);
    }

    toast.success(`${formData.role === 'livreur' ? 'Livreur' : 'Gestionnaire'} ajouté avec succès!`);
    setShowCreateDialog(false);
    setFormData({ name: '', email: '', phone: '', role: 'livreur' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Gestion de l'Équipe
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {filteredMembers.length} membre(s)
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setShowCreateDialog(true)}
            className="btn-primary flex items-center gap-2"
          >
            <UserPlus className="w-5 h-5" />
            Créer un compte
          </button>
        )}
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => setActiveTab('livreurs')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'livreurs'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          Livreurs ({livreurs.length})
        </button>
        {isAdmin && (
          <button
            onClick={() => setActiveTab('gestionnaires')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'gestionnaires'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Gestionnaires ({gestionnaires.length})
          </button>
        )}
      </div>

      <div className="max-w-md">
        <SearchBar
          placeholder="Rechercher par nom ou email..."
          value={searchQuery}
          onChange={setSearchQuery}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map(member => (
          <div key={member.id} className="card">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center">
                <span className="text-primary-600 dark:text-primary-400 font-semibold text-lg">
                  {member.name.charAt(0)}
                </span>
              </div>
              {member.isActive !== undefined && (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  member.isActive
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                }`}>
                  {member.isActive ? 'Actif' : 'Inactif'}
                </span>
              )}
            </div>
            <h3 className="font-semibold text-lg mb-1">{member.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{member.email}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{member.phone}</p>
            {member.deliveriesToday !== undefined && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Livraisons aujourd'hui: <span className="font-medium">{member.deliveriesToday}</span>
              </p>
            )}
          </div>
        ))}
      </div>

      <Dialog
        isOpen={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        title="Créer un nouveau compte"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Rôle</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
              className="input-field"
            >
              <option value="livreur">Livreur</option>
              {isAdmin && <option value="gestionnaire">Gestionnaire</option>}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Nom complet</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Téléphone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              required
              className="input-field"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setShowCreateDialog(false)}
              className="flex-1 btn-secondary"
            >
              Annuler
            </button>
            <button type="submit" className="flex-1 btn-primary">
              Créer
            </button>
          </div>
        </form>
      </Dialog>
    </div>
  );
};

export default Equipe;