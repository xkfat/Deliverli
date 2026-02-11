export const mockLivreurs = [
  {
    id: "36",
    name: "Amin Tazi",
    email: "amin.tazi@deliverli.ma",
    phone: "+212 6 61 12 34 56",
    username: "livreur_amin",
    isActive: true,
    role: "LIVREUR",
    vehicle_info: "Peugeot Partner (Matricule: 56789-B-6)",
    currentLocation: { lat: 33.9698, lng: -6.8521 },
    status: "Disponible" // No active 'En cours' command in DB
  },

  {
    id: "47",
    name: "Omar Idrissi",
    email: "omar.idrissi@deliverli.ma",
    phone: "+212 7 00 11 22 33",
    username: "livreur_omar",
    isActive: true,
    role: "LIVREUR",
    vehicle_info: "Yamaha Neos (Scooter)",
    currentLocation: { lat: 33.9810, lng: -6.8320 },
    status: "Disponible" // Fixed: Was orange but had 0 packages
  },
  {
    id: "34",
    name: "TEST Livreur 0",
    email: "livreur1@deliverli.com",
    phone: "323332322",
    username: "livreur_0",
    isActive: true,
    role: "LIVREUR",
    vehicle_info: "moto blanc",
    currentLocation: { lat: 33.9715, lng: -6.8498 },
    status: "En livraison" // Set to busy because he has Order #1
  }
];

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
    livreur: { id: "34", name: "TEST Livreur 0" }, // Assigned to ID 34
    statut: "En cours",
    dateCreation: "2026-02-10T00:01:09Z",
    montant: 10.00,
    poids: "10 kg",
    dimensions: "Standard"
  },
  {
  id: "3",
  trackingId: "LIV-NEW12345",
  client: { name: "Test Client 2", phone: "+212600112233" },
  adresse: { text: "Rue des Tests, Rabat", coordinates: { lat: 33.9750, lng: -6.8360 } },
  livreur: { id: "47", name: "Omar Idrissi" },
  statut: "En attente",
  dateCreation: "2026-02-10T08:00:00Z",
  dateLivraison: "2026-02-12T14:00:00Z",
  montant: 120.0,
  poids: "5 kg",
  dimensions: "Moyen"
}
,
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
        dateLivraison: "2026-02-11T10:00:00Z", // ← Add this

    dateCreation: "2026-02-10T06:13:40Z",
    montant: 850.00,
    poids: "0.5 kg",
    dimensions: "petit"
  }
];

export const mockGestionnaires = [
  {
    id: "35",
        dateLivraison: "2026-02-11T10:00:00Z", // ← Add this

    name: "Manager Principal",
    email: "manager1@test.com",
    phone: "+212 6 00 00 00 00",
    username: "manager_1",
    role: "ADMIN",
    isActive: true
  },
  {
    id: "31",
    name: "El Mami",
    email: "elmami478@gmail.com",
    phone: "+212 6 11 22 33 44",
    username: "elmami",
        dateLivraison: "2026-02-11T10:00:00Z", // ← Add this

    role: "ADMIN",
    isActive: true
  }
];