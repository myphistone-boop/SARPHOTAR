
export const STRIPE_API_VERSION = "2023-10-16";

/**
 * Offres utilisees UNIQUEMENT par /api/init-stripe, qui cree produits et prix
 * s'ils n'existent pas encore. Une fois les prix crees dans Stripe, ce fichier
 * n'a plus d'effet : c'est Stripe qui fait foi au moment du debit.
 *
 * Les montants doivent neanmoins rester alignes sur `price` dans constants.ts,
 * sinon un bootstrap sur un nouveau compte creerait des prix errones.
 * Ils etaient restes a 19,99 / 29,99 alors que le site affiche 34,99 / 49,99.
 */

export const OFFERS = [
  {
    key: "pistol-novelec", // <--- C'EST CETTE CLÉ QUI DOIT CORRESPONDRE AU "LOOKUP_KEY" SUR STRIPE
    name: "Pistolet NovElec™",
    description: "100% Électrique - Portée 10m",
    amount: 3499, // 34,99 € — doit correspondre a constants.ts
    currency: "eur",
  },
  {
    key: "ciovelec-rifle",
    name: "Fusil CiovElec™",
    description: "L'Avantage Tactique - Portée 12m",
    amount: 4999, // 49,99 €
    currency: "eur",
  },
  {
    key: "novelec-gatling",
    name: "Gatling NovElec™",
    description: "Domination Totale - Rafale Auto",
    amount: 9999, // 99,99 €
    currency: "eur",
  }
];
