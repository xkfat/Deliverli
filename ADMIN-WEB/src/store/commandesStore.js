import { create } from 'zustand';

export const useCommandesStore = create((set) => ({
  commandes: [],
  livreurs: [],
  gestionnaires: [],
  
  setCommandes: (commandes) => set({ commandes }),
  
  addCommande: (commande) => set((state) => ({
    commandes: [...state.commandes, commande]
  })),
  
  updateCommande: (id, updates) => set((state) => ({
    commandes: state.commandes.map(cmd => 
      cmd.id === id ? { ...cmd, ...updates } : cmd
    )
  })),
  
  deleteCommande: (id) => set((state) => ({
    commandes: state.commandes.filter(cmd => cmd.id !== id)
  })),
  
  setLivreurs: (livreurs) => set({ livreurs }),
  
  addLivreur: (livreur) => set((state) => ({
    livreurs: [...state.livreurs, livreur]
  })),
  
deleteLivreur: (id) => 
    set((state) => ({ livreurs: state.livreurs.filter(l => l.id !== id) })),
    
  deleteGestionnaire: (id) => 
    set((state) => ({ gestionnaires: state.gestionnaires.filter(g => g.id !== id) })),

  updateLivreur: (updatedLivreur) =>
    set((state) => ({
      livreurs: state.livreurs.map(l => l.id === updatedLivreur.id ? updatedLivreur : l)
    })),

  updateGestionnaire: (updatedGest) =>
    set((state) => ({
      gestionnaires: state.gestionnaires.map(g => g.id === updatedGest.id ? updatedGest : g)
    })),


  setGestionnaires: (gestionnaires) => set({ gestionnaires }),
  
  addGestionnaire: (gestionnaire) => set((state) => ({
    gestionnaires: [...state.gestionnaires, gestionnaire]
  })),

  syncAllData: (data) => set({ 
    commandes: data.commandes, 
    livreurs: data.livreurs, 
    gestionnaires: data.gestionnaires 
  }),
}));