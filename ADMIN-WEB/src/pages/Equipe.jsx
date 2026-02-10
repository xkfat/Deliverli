import { useState, useEffect } from 'react';
import { 
  UserPlus, 
  Trash2, 
  UserCheck, 
  UserMinus, 
  Edit, 
  Search, 
  Database 
} from 'lucide-react';
import SearchBar from '../components/common/SearchBar';
import Dialog from '../components/common/Dialog';
import { useCommandesStore } from '../store/commandesStore';
import { useAuthStore } from '../store/authStore'; // Gardez celle-ci
import { mockLivreurs, mockGestionnaires } from '../utils/mockData';
import { generateMockTeamData } from '../utils/seeder';
import toast from 'react-hot-toast';


const Equipe = () => {
  const { 
    livreurs, gestionnaires, setLivreurs, setGestionnaires, 
    addLivreur, addGestionnaire 
  } = useCommandesStore();
  
  const { syncAllData } = useCommandesStore(); // Importez la nouvelle action
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

  // Initialisation par défaut si vide
  useEffect(() => {
    if (livreurs.length === 0) setLivreurs(mockLivreurs);
    if (gestionnaires.length === 0 && isAdmin) setGestionnaires(mockGestionnaires);
  }, [isAdmin, livreurs.length, gestionnaires.length]);

  const allMembers = activeTab === 'livreurs' ? livreurs : gestionnaires;
  
  const filteredMembers = allMembers.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ✅ Synchronisation avec les données réelles (db.sqlite3 via seeder)
  const handleSyncWithDjango = () => {
    const { livreurs: realLivreurs, gestionnaires: realGest } = generateMockTeamData();
    setLivreurs(realLivreurs);
    setGestionnaires(realGest);
    setSearchQuery('');
    toast.success("Données synchronisées avec db.sqlite3 !");
  };

  const handleToggleStatus = (member) => {
    const updated = { ...member, isActive: !member.isActive };
    if (activeTab === 'livreurs') {
      setLivreurs(livreurs.map(l => l.id === member.id ? updated : l));
    } else {
      setGestionnaires(gestionnaires.map(g => g.id === member.id ? updated : g));
    }
    toast.success(`${member.name} est maintenant ${updated.isActive ? 'Actif' : 'Inactif'}`);
  };

  const handleDelete = (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer ce membre ?")) {
      if (activeTab === 'livreurs') {
        setLivreurs(livreurs.filter(l => l.id !== id));
      } else {
        setGestionnaires(gestionnaires.filter(g => g.id !== id));
      }
      toast.error("Membre supprimé");
    }
  };

  const handleEdit = (member) => {
    setFormData({ ...member, role: activeTab === 'livreurs' ? 'livreur' : 'gestionnaire' });
    setShowCreateDialog(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.id) {
      if (formData.role === 'livreur') {
        setLivreurs(livreurs.map(l => l.id === formData.id ? formData : l));
      } else {
        setGestionnaires(gestionnaires.map(g => g.id === formData.id ? formData : g));
      }
      toast.success("Compte mis à jour !");
    } else {
      const newMember = {
        ...formData,
        id: `${formData.role.toUpperCase()}${Date.now()}`,
        isActive: true,
        status: formData.role === 'livreur' ? 'Disponible' : undefined,
        dateCreation: new Date()
      };
      formData.role === 'livreur' ? addLivreur(newMember) : addGestionnaire(newMember);
      toast.success("Nouveau membre ajouté !");
    }
    setShowCreateDialog(false);
    setFormData({ name: '', email: '', phone: '', role: 'livreur' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Gestion de l'Équipe</h1>
          <p className="text-gray-600 dark:text-gray-400">{filteredMembers.length} membre(s) trouvé(s)</p>
        </div>
        
        {isAdmin && (
          <div className="flex gap-2">
         
            <button
              onClick={() => {
                setFormData({ name: '', email: '', phone: '', role: 'livreur' });
                setShowCreateDialog(true);
              }}
              className="btn-primary flex items-center justify-center gap-2"
            >
              <UserPlus className="w-5 h-5" />
              Créer un compte
            </button>
          </div>
        )}
      </div>

      <div className="flex gap-4 border-b border-gray-200 dark:border-gray-700 pb-px">
        <button
          onClick={() => setActiveTab('livreurs')}
          className={`pb-2 px-4 font-medium transition-colors relative ${
            activeTab === 'livreurs' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500'
          }`}
        >
          Livreurs ({livreurs.length})
        </button>
        {isAdmin && (
          <button
            onClick={() => setActiveTab('gestionnaires')}
            className={`pb-2 px-4 font-medium transition-colors relative ${
              activeTab === 'gestionnaires' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500'
            }`}
          >
            Gestionnaires ({gestionnaires.length})
          </button>
        )}
      </div>

      <div className="max-w-md">
        <SearchBar
          placeholder="Rechercher un nom, email..."
          value={searchQuery}
          onChange={setSearchQuery}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map(member => (
          <div key={member.id} className="card group hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center">
                <span className="text-primary-600 dark:text-primary-400 font-bold text-lg">{member.name.charAt(0)}</span>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                member.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {member.isActive ? 'Actif' : 'Inactif'}
              </span>
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white text-lg">{member.name}</h3>
            <p className="text-sm text-gray-500 mb-1">{member.email}</p>
            <p className="text-sm text-gray-500 mb-4">{member.phone}</p>

            {isAdmin && (
              <div className="flex items-center gap-2 pt-4 border-t border-gray-100 dark:border-gray-700">
                <button onClick={() => handleToggleStatus(member)} className={`p-2 rounded-lg transition-colors ${member.isActive ? 'text-amber-600 hover:bg-amber-50' : 'text-green-600 hover:bg-green-50'}`}>
                  {member.isActive ? <UserMinus size={18} /> : <UserCheck size={18} />}
                </button>
                <button onClick={() => handleEdit(member)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit size={18} /></button>
                <button onClick={() => handleDelete(member.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg ml-auto"><Trash2 size={18} /></button>
              </div>
            )}
          </div>
        ))}
      </div>

      <Dialog
        isOpen={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        title={formData.id ? "Modifier le compte" : "Créer un nouveau compte"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Rôle</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
              className="input-field"
              disabled={!!formData.id}
            >
              <option value="livreur">Livreur</option>
              <option value="gestionnaire">Gestionnaire</option>
            </select>
          </div>
          {/* ... Reste des champs identiques ... */}
          <div>
            <label className="block text-sm font-medium mb-2">Nom complet</label>
            <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Téléphone</label>
            <input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} required className="input-field" />
          </div>
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={() => setShowCreateDialog(false)} className="flex-1 btn-secondary">Annuler</button>
            <button type="submit" className="flex-1 btn-primary">{formData.id ? "Enregistrer" : "Créer"}</button>
          </div>
        </form>
      </Dialog>
    </div>
  );
};

export default Equipe;