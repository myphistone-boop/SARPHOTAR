
export const STRIPE_API_VERSION = "2023-10-16";

export const OFFERS = [
  {
    key: "novelec-pistol", // <--- C'EST CETTE CLÉ QUI DOIT CORRESPONDRE AU "LOOKUP_KEY" SUR STRIPE
    name: "Pistolet NovElec™",
    description: "100% Électrique - Portée 10m",
    amount: 1999, // Prix en centimes (19.99€)
    currency: "eur",
  },
  {
    key: "ciovelec-rifle",
    name: "Fusil CiovElec™",
    description: "L'Avantage Tactique - Portée 12m",
    amount: 2999,
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
