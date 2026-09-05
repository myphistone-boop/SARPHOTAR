/**
 * A/B testing léger, sans dépendance ni service tiers.
 *
 * Chaque test assigne un visiteur à une variante (A ou B), la mémorise pour
 * qu'il voie toujours la même, et expose la variante au tracking via un
 * événement `experiment_impression`. On peut ainsi comparer les taux de
 * conversion par variante dans Meta / GA4.
 *
 * Les tests sont DÉSACTIVÉS par défaut (voir les drapeaux ci-dessous) : tant
 * qu'un test est off, tout le monde voit la variante A et rien n'est fausse.
 * Activez un test seulement quand le volume de trafic le justifie, et ne
 * testez qu'une variable à la fois.
 */
import { track } from './analytics';

export type Variant = 'A' | 'B';

/* ============================================================================
 *  DRAPEAUX — passez à true pour lancer un test
 * ========================================================================== */

/** Teste le libellé du CTA principal du hero (A = campaign.ctaPrimary, B = ctaAlt). */
export const AB_HERO_CTA = false;

/* ========================================================================== */

const KEY_PREFIX = 'sarphotar_ab_';

/** Variante assignée à ce visiteur pour un test donné (stable dans le temps). */
export function getVariant(experiment: string, enabled: boolean): Variant {
  if (!enabled) return 'A';
  if (typeof window === 'undefined') return 'A';
  const key = KEY_PREFIX + experiment;
  try {
    const stored = localStorage.getItem(key);
    if (stored === 'A' || stored === 'B') return stored;
    const assigned: Variant = Math.random() < 0.5 ? 'A' : 'B';
    localStorage.setItem(key, assigned);
    return assigned;
  } catch {
    return 'A';
  }
}

/** À appeler une fois quand la variante est affichée, pour la mesurer. */
export function trackImpression(experiment: string, variant: Variant): void {
  track('experiment_impression', { experiment, variant });
}
