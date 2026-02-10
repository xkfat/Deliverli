export const generateMockTeamData = () => {
  // Données extraites directement de votre db.sqlite3 [cite: 5, 248, 1754]
  const livreurs = [
    {
      id: "36",
      name: "Amin Tazi",
      email: "amin.tazi@deliverli.ma",
      phone: "+212 6 61 12 34 56",
      username: "livreur_amin",
      vehicle_info: "Peugeot Partner (Matricule: 56789-B-6)",
      isActive: true,
      role: 'livreur',
      dateCreation: "2026-02-08"
    },
    {
      id: "47",
      name: "Omar Idrissi",
      email: "omar.idrissi@deliverli.ma",
      phone: "+212 7 00 11 22 33",
      username: "livreur_omar",
      vehicle_info: "Yamaha Neos (Scooter)",
      isActive: true,
      role: 'livreur',
      dateCreation: "2026-02-10"
    }
  ];

  const gestionnaires = [
    {
      id: "manager_1",
      name: "Manager Principal",
      email: "manager1@test.com",
      phone: "+212 600000000",
      username: "manager_1",
      role: "admin", // Dans votre DB, manager_1 est Admin [cite: 1649]
      isActive: true
    }
  ];

  return { livreurs, gestionnaires };
};

export const generateMockCommandes = () => {
  return [
    {
      id: "1",
      tracking_id: "LIV-FYY56006",
      client_name: "CLIENT",
      client_phone: "123456787",
      montant: "10.00",
      statut: "En cours",
      date_creation: "2026-02-10",
      adresse_text: "Adresse à définir",
      poids: "10 kg",
      dimensions: "Standard"
    },
    {
      id: "2",
      tracking_id: "LIV-GTG66959",
      client_name: "Dr. Mouna Alami",
      client_phone: "+212 7 07 11 22 33",
      montant: "850.00",
      statut: "Livré",
      date_creation: "2026-02-10",
      adresse_text: "Villa 14, Avenue Beni Mellal, Souissi, Rabat",
      poids: "0.5 kg",
      dimensions: "petit"
    }
  ];
};