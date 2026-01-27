
export const STRIPE_API_VERSION = "2023-10-16";

export const OFFERS = [
  {
    key: "pistol-novelec", // <--- C'EST CETTE CLÉ QUI DOIT CORRESPONDRE AU "LOOKUP_KEY" SUR STRIPE
    name: "Pistolet NovElec™",
    description: "100% Électrique - Portée 10m",
    amount: 3499, // Prix en centimes (34.99€)
    currency: "eur",
  },
  {
    key: "ciovelec-rifle",
    name: "Fusil CiovElec™",
    description: "L'Avantage Tactique - Portée 12m",
    amount: 4999,
    currency: "eur",
  },
  {
    key: "novelec-gatling",
    name: "Gatling NovElec™",
    description: "Domination Totale - Rafale Auto",
    amount: 9999,
    currency: "eur",
  }
];
