/**
 * Consentement aux cookies de mesure et de publicité.
 *
 * Le Pixel Meta prévu dans index.html déposait ses cookies dès le chargement
 * de la page, sans recueillir le moindre consentement. En France, le dépôt
 * de traceurs publicitaires ou de mesure d'audience non exemptés exige un
 * consentement préalable (art. 82 de la loi Informatique et Libertés).
 *
 * Le pixel n'est désormais chargé qu'après acceptation explicite.
 */

export type ConsentValue = 'granted' | 'denied';

const KEY = 'sarphotar_consent';

declare global {
  interface Window {
    PIXEL_ID?: string;
    __sarphotarLoadPixel?: () => void;
    fbq?: (...args: unknown[]) => void;
    // Google (GA4 + Google Ads)
    GA4_ID?: string;
    GADS_ID?: string;
    GADS_PURCHASE_LABEL?: string;
    __sarphotarLoadGoogle?: () => void;
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

/** Vrai si au moins un traceur (Meta ou Google) est configuré. */
export function trackersConfigured(): boolean {
  if (typeof window === 'undefined') return false;
  return Boolean(window.PIXEL_ID || window.GA4_ID || window.GADS_ID);
}

/** Choix déjà exprimé par le visiteur, ou null s'il ne s'est pas prononcé. */
export function getConsent(): ConsentValue | null {
  try {
    const v = localStorage.getItem(KEY);
    return v === 'granted' || v === 'denied' ? v : null;
  } catch {
    return null;
  }
}

/** Efface le choix de consentement : le bandeau réapparaîtra au prochain rendu. */
export function resetConsent(): void {
  try { localStorage.removeItem(KEY); } catch { /* mode privé */ }
}

export function setConsent(value: ConsentValue): void {
  try {
    localStorage.setItem(KEY, value);
  } catch {
    /* mode privé : le choix ne sera pas mémorisé, sans conséquence */
  }
  if (value === 'granted') loadTrackers();
}

/** Charge les traceurs. Appelé uniquement après consentement. */
export function loadTrackers(): void {
  if (typeof window === 'undefined') return;
  try {
    window.__sarphotarLoadPixel?.();
    window.__sarphotarLoadGoogle?.();
  } catch {
    /* le suivi ne doit jamais casser la boutique */
  }
}

/** À appeler au démarrage : recharge les traceurs si le visiteur avait accepté. */
export function initConsent(): void {
  if (getConsent() === 'granted') loadTrackers();
}
