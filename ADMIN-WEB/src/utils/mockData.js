export const mockCommandes = [
  {
    id: 'CMD001',
    trackingId: 'TRK-2024-001',
    client: {
      name: 'Ahmed Benali',
      phone: '+212 6 12 34 56 78'
    },
    adresse: {
      text: '45 Rue Hassan II, Agdal, Rabat',
      coordinates: { lat: 33.9716, lng: -6.8498 }
    },
    livreur: {
      id: 'LIV001',
      name: 'Youssef El Amrani'
    },
    statut: 'En cours',
    dateCreation: new Date('2024-02-01'),
    dateLivraison: new Date('2024-02-02'),
    montant: 250
  },
  {
    id: 'CMD002',
    trackingId: 'TRK-2024-002',
    client: {
      name: 'Fatima Zahra',
      phone: '+212 6 23 45 67 89'
    },
    adresse: {
      text: '12 Avenue Mohammed V, Hay Riad, Rabat',
      coordinates: { lat: 33.9582, lng: -6.8737 }
    },
    livreur: null,
    statut: 'En attente',
    dateCreation: new Date('2024-02-02'),
    dateLivraison: new Date('2024-02-03'),
    montant: 180
  },
  {
    id: 'CMD003',
    trackingId: 'TRK-2024-003',
    client: {
      name: 'Omar Idrissi',
      phone: '+212 6 34 56 78 90'
    },
    adresse: {
      text: '78 Boulevard Al Amir Fal Ould Oumair, Agdal, Rabat',
      coordinates: { lat: 33.9735, lng: -6.8512 }
    },
    livreur: {
      id: 'LIV002',
      name: 'Karim Tazi'
    },
    statut: 'Livré',
    dateCreation: new Date('2024-01-30'),
    dateLivraison: new Date('2024-01-31'),
    montant: 320
  }
];

export const mockLivreurs = [
  {
    id: 'LIV001',
    name: 'Youssef El Amrani',
    phone: '+212 6 11 22 33 44',
    email: 'youssef@delivery.ma',
    isActive: true,
    currentLocation: { lat: 33.9716, lng: -6.8498 },
    deliveriesToday: 3,
    status: 'En livraison'
  },
  {
    id: 'LIV002',
    name: 'Karim Tazi',
    phone: '+212 6 22 33 44 55',
    email: 'karim@delivery.ma',
    isActive: true,
    currentLocation: { lat: 33.9735, lng: -6.8512 },
    deliveriesToday: 2,
    status: 'Disponible'
  },
  {
    id: 'LIV003',
    name: 'Hassan Benjelloun',
    phone: '+212 6 33 44 55 66',
    email: 'hassan@delivery.ma',
    isActive: false,
    currentLocation: { lat: 33.9582, lng: -6.8737 },
    deliveriesToday: 0,
    status: 'Hors service'
  }
];

export const mockGestionnaires = [
  {
    id: 'GEST001',
    name: 'Salma Alaoui',
    phone: '+212 6 44 55 66 77',
    email: 'salma@delivery.ma',
    role: 'gestionnaire',
    dateCreation: new Date('2023-06-15')
  },
  {
    id: 'GEST002',
    name: 'Mehdi Senhaji',
    phone: '+212 6 55 66 77 88',
    email: 'mehdi@delivery.ma',
    role: 'gestionnaire',
    dateCreation: new Date('2023-08-20')
  }
];