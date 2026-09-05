/**
 * ============================================================================
 *  AVIS CLIENTS — VRAIS AVIS UNIQUEMENT
 * ============================================================================
 *
 *  Ce fichier remplace l'ancien générateur `getReviewsForProduct()`, qui
 *  fabriquait des avis à partir d'une liste de 30 prénoms et 20 textes, avec
 *  un badge « vérifié » attribué au hasard et des dates relatives simulées.
 *
 *  Publier de faux avis est une pratique commerciale trompeuse
 *  (art. L121-2 et L121-4 11° du code de la consommation, directive Omnibus).
 *  C'est aussi le premier motif de signalement DGCCRF sur le e-commerce.
 *
 *  RÈGLES :
 *
 *   1. N'ajoutez ici QUE des avis réellement reçus d'un client réel.
 *   2. `verifiedPurchase: true` uniquement si la commande est retrouvable
 *      dans Stripe. Ce badge engage juridiquement.
 *   3. `photo` uniquement avec l'accord explicite du client.
 *   4. Prénom + initiale suffisent (RGPD : minimisation des données).
 *
 *  Tant que ce tableau est vide, TOUTES les sections d'avis du site sont
 *  automatiquement masquées : aucune note moyenne, aucun compteur, aucune
 *  étoile. Le site ne ment pas par défaut.
 *
 *  ── Comment collecter de vrais avis rapidement ─────────────────────────
 *  Le webhook Stripe (api/stripe-webhook.ts) connaît déjà chaque commande
 *  livrée et l'e-mail du client : un e-mail de relance à J+10 demandant un
 *  avis est le moyen le plus simple de remplir ce fichier légalement.
 * ============================================================================
 */

export interface Review {
  id: string;
  /** Doit correspondre à un id de PRODUCTS (constants.ts). */
  productId: string;
  /** Prénom + initiale. Jamais le nom complet. */
  firstName: string;
  /** Note réellement donnée par le client, de 1 à 5. */
  rating: 1 | 2 | 3 | 4 | 5;
  /** Date de l'avis au format ISO (YYYY-MM-DD). */
  date: string;
  /** Texte de l'avis, non retouché. */
  content: string;
  /** URL d'une photo envoyée par le client — avec son accord explicite. */
  photo?: string;
  /** true seulement si la commande est retrouvable dans Stripe. */
  verifiedPurchase: boolean;
}

/**
 * ⬇️  AJOUTEZ VOS VRAIS AVIS ICI
 *
 * Exemple de format (à décommenter et remplacer par un avis réel) :
 *
 * {
 *   id: 'rev-001',
 *   productId: 'pistol-novelec',
 *   firstName: 'Karim B.',
 *   rating: 5,
 *   date: '2026-08-14',
 *   content: "Texte exact écrit par le client, sans retouche.",
 *   photo: 'https://storage.googleapis.com/novelec_assets/Pistolet%20avis%201.webp',
 *   verifiedPurchase: true,
 * },
 */
export const REVIEWS: Review[] = [];

/** Avis d'un produit donné, du plus récent au plus ancien. */
export function reviewsFor(productId: string): Review[] {
  return REVIEWS.filter((r) => r.productId === productId).sort((a, b) => b.date.localeCompare(a.date));
}

/** Note moyenne réelle, ou null s'il n'y a aucun avis. */
export function averageRating(productId?: string): number | null {
  const list = productId ? reviewsFor(productId) : REVIEWS;
  if (list.length === 0) return null;
  return Math.round((list.reduce((s, r) => s + r.rating, 0) / list.length) * 10) / 10;
}

/** Nombre d'avis réels. */
export function reviewCount(productId?: string): number {
  return productId ? reviewsFor(productId).length : REVIEWS.length;
}

/** Formate une date ISO en français pour l'affichage. */
export function formatReviewDate(iso: string): string {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}
