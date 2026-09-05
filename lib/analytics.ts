// Lightweight e-commerce event layer.
// Pushes to window.dataLayer (GTM) and forwards to Meta Pixel / GA4 when present.
// Activate Meta Pixel by setting your Pixel ID in index.html (window.PIXEL_ID).

type Params = Record<string, unknown>;

const FB_MAP: Record<string, string> = {
  view_item: 'ViewContent',
  add_to_cart: 'AddToCart',
  begin_checkout: 'InitiateCheckout',
  purchase: 'Purchase',
};

export function track(event: string, params: Params = {}): void {
  if (typeof window === 'undefined') return;
  try {
    const w = window as any;
    w.dataLayer = w.dataLayer || [];
    w.dataLayer.push({ event, ...params });

    if (typeof w.fbq === 'function' && FB_MAP[event]) {
      w.fbq('track', FB_MAP[event], params);
    }
    if (typeof w.gtag === 'function') {
      w.gtag('event', event, params);
    }
  } catch {
    /* never let analytics break the app */
  }
}

/**
 * Conversion Google Ads (distincte de l'événement GA4).
 *
 * Google Ads compte les achats via un événement `conversion` avec `send_to`
 * pointant vers l'ID de la balise + le libellé de la conversion. Ne fait rien
 * tant que GADS_ID et le libellé ne sont pas renseignés dans index.html.
 */
export function googleAdsConversion(params: Params = {}): void {
  if (typeof window === 'undefined') return;
  try {
    const w = window as any;
    if (typeof w.gtag === 'function' && w.GADS_ID && w.GADS_PURCHASE_LABEL) {
      w.gtag('event', 'conversion', {
        send_to: `${w.GADS_ID}/${w.GADS_PURCHASE_LABEL}`,
        ...params,
      });
    }
  } catch {
    /* never let analytics break the app */
  }
}

export const money = (n: number) => Math.round(n * 100) / 100;
