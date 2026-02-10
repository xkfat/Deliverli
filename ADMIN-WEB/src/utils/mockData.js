export const mockCommandes = [
  {
    id: "1",
    trackingId: "LIV-FYY56006",
    client: {
      name: "CLIENT",
      phone: "123456787"
    },
    adresse: {
      text: "Adresse à définir",
      coordinates: { lat: 33.9715, lng: -6.8498 }
    },
    livreur: { id: "34", name: "livreur_0" },
    statut: "En cours",
    dateCreation: new Date("2026-02-10"),
    dateLivraison: new Date("2026-02-10"),
    montant: 10.00,
    poids: "10 kg",
    dimensions: "Standard"
  },
  {
    id: "2",
    trackingId: "LIV-GTG66959",
    client: {
      name: "Dr. Mouna Alami",
      phone: "+212 7 07 11 22 33"
    },
    adresse: {
      text: "Villa 14, Avenue Beni Mellal, Souissi, Rabat",
      coordinates: { lat: 33.9823, lng: -6.8354 }
    },
    livreur: null,
    statut: "Livré",
    dateCreation: new Date("2026-02-10"),
    dateLivraison: new Date("2026-02-23"),
    montant: 850.00,
    poids: "0.5 kg",
    dimensions: "petit"
  },
  {
    id: "3",
    trackingId: "LIV-YFZ22234",
    client: {
      name: "Sarah Benjelloun",
      phone: "+212 6 61 12 34 56"
    },
    adresse: {
      text: "22 Avenue de France, Agdal, Rabat (près du McDo)",
      coordinates: { lat: 34.0045, lng: -6.8485 }
    },
    livreur: null,
    statut: "Annulé",
    dateCreation: new Date("2026-02-10"),
    dateLivraison: new Date("2026-02-10"),
    montant: 250.00,
    notes: "Déposer à la réception au 3ème étage"
  }
];

export const mockLivreurs = [
  {
    id: "36",
    name: "Amin Tazi",
    email: "amin.tazi@deliverli.ma",
    phone: "+212 6 61 12 34 56",
    username: "livreur_amin",
    isActive: true,
    role: "livreur",
    vehicle_info: "Peugeot Partner (Matricule: 56789-B-6)",
    currentLocation: { lat: 33.9698, lng: -6.8521 }, // Rabat Agdal
    deliveriesToday: 5,
    status: "Disponible"
  },
  {
    id: "47",
    name: "Omar Idrissi",
    email: "omar.idrissi@deliverli.ma",
    phone: "+212 7 00 11 22 33",
    username: "livreur_omar",
    isActive: true,
    role: "livreur",
    vehicle_info: "Yamaha Neos (Scooter)",
    currentLocation: { lat: 33.9810, lng: -6.8320 }, // Rabat Souissi
    deliveriesToday: 2,
    status: "En livraison"
  },
  {
    id: "34",
    name: "TEST Livreur 0",
    email: "livreur1@deliverli.com",
    phone: "323332322",
    username: "livreur_0",
    isActive: true,
    role: "livreur",
    vehicle_info: "moto blanc",
    currentLocation: { lat: 33.9715, lng: -6.8498 },
    deliveriesToday: 0,
    status: "Disponible"
  }
];

export const mockGestionnaires = [
  {
    id: "35",
    name: "Manager Principal",
    email: "manager1@test.com",
    phone: "+212 6 00 00 00 00",
    username: "manager_1",
    role: "admin",
    isActive: true,
    dateCreation: new Date("2026-02-08")
  },
  {
    id: "31",
    name: "El Mami",
    email: "elmami478@gmail.com",
    phone: "+212 6 11 22 33 44",
    username: "elmami",
    role: "admin",
    isActive: true,
    dateCreation: new Date("2026-02-05")
  }
];