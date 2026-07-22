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

export const money = (n: number) => Math.round(n * 100) / 100;
