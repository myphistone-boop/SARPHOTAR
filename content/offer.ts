/**
 * ============================================================================
 *  OFFRE COMMERCIALE — RÉELLE UNIQUEMENT
 * ============================================================================
 *
 *  Ce fichier remplace l'ancien composant PromoTimer, qui affichait un
 *  compte à rebours « offre flash · 2h » se réinitialisant automatiquement
 *  à chaque expiration, associé à un « jusqu'à −50% » calculé sur des prix
 *  barrés inventés (`originalPrice: 60, // prix fictif rond`).
 *
 *  Deux problèmes de droit s'y cumulaient :
 *
 *   • Fausse réduction de prix. Depuis la directive Omnibus (art. L112-1-1
 *     du code de la consommation), le prix de référence barré doit être le
 *     prix le plus bas réellement pratiqué durant les 30 derniers jours.
 *
 *   • Fausse urgence. Un compte à rebours qui redémarre indéfiniment est
 *     une pratique commerciale trompeuse (art. L121-2).
 *
 *  ── COMMENT ANNONCER UNE VRAIE PROMOTION ──────────────────────────────
 *
 *  1. Baissez réellement le prix dans Stripe (nouveau `unit_amount`).
 *  2. Renseignez `previousPrice` avec le prix RÉELLEMENT pratiqué avant,
 *     tel qu'il apparaît dans votre historique Stripe.
 *  3. Donnez une date de fin RÉELLE, que vous respecterez.
 *
 *  Le compte à rebours affiché sera alors exact : il descend jusqu'à la
 *  date de fin, puis l'offre disparaît d'elle-même. Elle ne redémarre pas.
 * ============================================================================
 */

export interface Offer {
  /** Titre court affiché dans le bandeau. */
  label: string;
  /** Phrase d'explication. Doit décrire l'offre réelle, sans exagération. */
  description: string;
  /**
   * Date et heure de fin réelles, au format ISO 8601 avec fuseau.
   * Exemple : '2026-11-30T23:59:59+01:00'
   * Passée cette date, le bandeau disparaît automatiquement.
   */
  endsAt: string;
  /**
   * Prix de référence par produit, en euros.
   * UNIQUEMENT le prix le plus bas réellement pratiqué dans les 30 jours
   * précédant l'offre. Laisser vide si vous ne baissez pas les prix :
   * une offre peut exister sans prix barré.
   */
  previousPrices?: Record<string, number>;
}

/**
 * ⬇️  L'OFFRE EN COURS
 *
 *  `null` = aucune promotion. C'est la valeur par défaut, et c'est
 *  volontaire : le site n'affiche aucune urgence tant qu'il n'y en a pas.
 *
 *  Exemple pour le Black Friday, une fois les prix réellement baissés
 *  dans Stripe :
 *
 *  export const OFFER: Offer | null = {
 *    label: 'Black Friday',
 *    description: 'Offre valable jusqu’au 30 novembre inclus.',
 *    endsAt: '2026-11-30T23:59:59+01:00',
 *    previousPrices: {
 *      'pistol-novelec': 34.99,
 *      'ciovelec-rifle': 49.99,
 *      'novelec-gatling': 99.99,
 *    },
 *  };
 */
export const OFFER: Offer | null = null;

/** L'offre est-elle réellement en cours ? Faux si expirée ou absente. */
export function offerIsLive(now: Date = new Date()): boolean {
  if (!OFFER) return false;
  const end = new Date(OFFER.endsAt);
  if (Number.isNaN(end.getTime())) return false;
  return end.getTime() > now.getTime();
}

/** Prix de référence réel d'un produit, ou null s'il n'y en a pas. */
export function previousPriceFor(productId: string): number | null {
  if (!offerIsLive() || !OFFER?.previousPrices) return null;
  const p = OFFER.previousPrices[productId];
  return typeof p === 'number' && p > 0 ? p : null;
}

/** Millisecondes restantes avant la fin de l'offre. 0 si aucune offre. */
export function msRemaining(now: Date = new Date()): number {
  if (!OFFER) return 0;
  return Math.max(0, new Date(OFFER.endsAt).getTime() - now.getTime());
}

/** Date de fin formatée en français, pour l'affichage « valable jusqu'au … ». */
export function offerEndLabel(): string | null {
  if (!OFFER) return null;
  const d = new Date(OFFER.endsAt);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}
