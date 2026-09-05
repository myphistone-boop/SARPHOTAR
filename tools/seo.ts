/**
 * Génération des métadonnées SEO au moment du build.
 *
 * Le site est une application monopage : son HTML servi aux robots ne
 * contient aucun contenu rendu par React. Les métadonnées, le JSON-LD et le
 * sitemap sont donc produits ici, à partir des mêmes données que l'interface
 * — ils ne peuvent pas diverger des prix ou du catalogue réels.
 */

import { PRODUCTS } from '../constants';
import { OFFERS } from '../api/stripe-config';
import { campaign } from '../content/campaign';
import { FAQ } from '../content/faq';
import { REVIEWS, averageRating } from '../content/reviews';
import { LEGAL_ENTITY, SHIPPING, RETURNS } from '../content/facts';

const SITE = LEGAL_ENTITY.siteUrl; // https://www.sarphotar.fr

/**
 * Garde-fou de cohérence des prix.
 *
 * Les prix affichés (constants.ts) et les montants de bootstrap Stripe
 * (api/stripe-config.ts) doivent rester identiques. Ils avaient divergé —
 * le site annonçait 34,99 € quand Stripe était configuré à 19,99 €.
 * Le build échoue désormais plutôt que de publier l'incohérence.
 */
export function assertPricesConsistent(): void {
  const errors: string[] = [];
  for (const p of PRODUCTS) {
    const offer = OFFERS.find((o) => o.key === p.id);
    if (!offer) {
      errors.push(`${p.id} : aucune offre correspondante dans api/stripe-config.ts`);
      continue;
    }
    const cents = Math.round(p.price * 100);
    if (cents !== offer.amount) {
      errors.push(`${p.id} : ${p.price} € affiché mais ${offer.amount / 100} € dans stripe-config`);
    }
  }
  if (errors.length > 0) {
    throw new Error(
      'Incohérence de prix entre constants.ts et api/stripe-config.ts :\n  - ' + errors.join('\n  - ')
    );
  }
}

/** Titre et description construits sur la campagne active. */
export const seoTitle = 'Pistolet à eau électrique rechargeable | Sarphotar™';

export const seoDescription =
  "Pistolets à eau électriques rechargeables NovElec™ : tir électrique sans pompage, batterie rechargeable, grande portée. " +
  (SHIPPING.free ? 'Livraison offerte. ' : '') +
  `Rétractation ${RETURNS.withdrawalDays} jours.`;

/** Image de partage social. Reprend le visuel produit principal. */
export const seoImage = PRODUCTS[0].image;

/**
 * Données structurées.
 *
 * Aucun `aggregateRating` n'est émis tant qu'il n'existe pas d'avis réels :
 * déclarer une note fictive dans le JSON-LD est à la fois une allégation
 * trompeuse et un motif de sanction manuelle chez Google.
 */
export function buildJsonLd(): object[] {
  const graph: object[] = [];

  graph.push({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE}/#organization`,
    name: LEGAL_ENTITY.siteName,
    url: SITE,
    email: 'sarphotar.pro@gmail.com',
    ...(LEGAL_ENTITY.companyName ? { legalName: LEGAL_ENTITY.companyName } : {}),
    ...(LEGAL_ENTITY.vatNumber ? { vatID: LEGAL_ENTITY.vatNumber } : {}),
  });

  graph.push({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE}/#website`,
    url: SITE,
    name: LEGAL_ENTITY.siteName,
    inLanguage: 'fr-FR',
    publisher: { '@id': `${SITE}/#organization` },
  });

  for (const p of PRODUCTS) {
    const rating = averageRating(p.id);
    const count = REVIEWS.filter((r) => r.productId === p.id).length;

    graph.push({
      '@context': 'https://schema.org',
      '@type': 'Product',
      '@id': `${SITE}/#product-${p.id}`,
      name: p.name,
      description: `${p.story.line1} ${p.story.line2}`,
      image: p.gallery,
      category: 'Pistolet à eau électrique',
      brand: { '@type': 'Brand', name: 'Sarphotar' },
      offers: {
        '@type': 'Offer',
        url: `${SITE}/?p=${p.id}`,
        priceCurrency: p.currency,
        price: p.price.toFixed(2),
        availability: 'https://schema.org/InStock',
        seller: { '@id': `${SITE}/#organization` },
        ...(SHIPPING.free
          ? {
              shippingDetails: {
                '@type': 'OfferShippingDetails',
                shippingRate: { '@type': 'MonetaryAmount', value: '0', currency: 'EUR' },
              },
            }
          : {}),
        hasMerchantReturnPolicy: {
          '@type': 'MerchantReturnPolicy',
          applicableCountry: 'FR',
          returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
          merchantReturnDays: RETURNS.withdrawalDays,
          returnMethod: 'https://schema.org/ReturnByMail',
          returnFees: RETURNS.returnShippingPaidByCustomer
            ? 'https://schema.org/ReturnShippingFees'
            : 'https://schema.org/FreeReturn',
        },
      },
      // Émis uniquement s'il existe de vrais avis.
      ...(rating !== null && count > 0
        ? {
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: rating,
              reviewCount: count,
            },
          }
        : {}),
    });
  }

  if (FAQ.length > 0) {
    graph.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      '@id': `${SITE}/#faq`,
      mainEntity: FAQ.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    });
  }

  // Fil d'Ariane : le site est monopage, une seule entrée « Accueil ».
  graph.push({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    '@id': `${SITE}/#breadcrumb`,
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: SITE + '/' },
    ],
  });

  return graph;
}

/**
 * Flux produit Google Merchant Center (format RSS 2.0).
 *
 * Émis au build sous /merchant-feed.xml. Les prix, la disponibilité et les
 * images viennent du même catalogue que le site : aucune incohérence possible
 * entre le site, le flux et les annonces Shopping.
 *
 * ⚠️  Avant utilisation dans Merchant Center : renseigner un vrai identifiant
 * produit (GTIN/EAN du fournisseur) si vous en avez un, sinon Google accepte
 * `identifier_exists = no` (déjà déclaré ci-dessous).
 */
export function buildMerchantFeed(): string {
  const esc = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const items = PRODUCTS.map((p) => `
    <item>
      <g:id>${esc(p.id)}</g:id>
      <g:title>${esc(p.name)} — pistolet à eau électrique rechargeable</g:title>
      <g:description>${esc(`${p.story.line1} ${p.story.line2}`)}</g:description>
      <g:link>${SITE}/?p=${esc(p.id)}</g:link>
      <g:image_link>${esc(p.image)}</g:image_link>
      <g:availability>in_stock</g:availability>
      <g:price>${p.price.toFixed(2)} EUR</g:price>
      <g:brand>Sarphotar</g:brand>
      <g:condition>new</g:condition>
      <g:identifier_exists>no</g:identifier_exists>
      <g:google_product_category>3287</g:google_product_category>
      <g:shipping>
        <g:country>FR</g:country>
        <g:price>0.00 EUR</g:price>
      </g:shipping>
    </item>`).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>${esc(LEGAL_ENTITY.siteName)}</title>
    <link>${SITE}/</link>
    <description>Pistolets à eau électriques rechargeables</description>${items}
  </channel>
</rss>
`;
}

/** Balises injectées dans le <head>. */
export function buildMetaTags(): string {
  const esc = (s: string) => s.replace(/"/g, '&quot;');
  return [
    `<link rel="canonical" href="${SITE}/" />`,
    `<meta name="robots" content="index, follow, max-image-preview:large" />`,
    ``,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="Sarphotar" />`,
    `<meta property="og:locale" content="fr_FR" />`,
    `<meta property="og:url" content="${SITE}/" />`,
    `<meta property="og:title" content="${esc(seoTitle)}" />`,
    `<meta property="og:description" content="${esc(seoDescription)}" />`,
    `<meta property="og:image" content="${esc(seoImage)}" />`,
    `<meta property="og:image:alt" content="${esc(PRODUCTS[0].name)}" />`,
    ``,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(seoTitle)}" />`,
    `<meta name="twitter:description" content="${esc(seoDescription)}" />`,
    `<meta name="twitter:image" content="${esc(seoImage)}" />`,
  ].join('\n    ');
}

/** robots.txt — autorise aussi explicitement les robots des IA génératives. */
export function buildRobotsTxt(): string {
  return `# robots.txt — ${LEGAL_ENTITY.siteName}
User-agent: *
Allow: /
Disallow: /api/

# Robots des moteurs génératifs (référencement dans les réponses IA)
User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

Sitemap: ${SITE}/sitemap.xml
`;
}

/**
 * sitemap.xml.
 *
 * Le site n'expose qu'une seule URL réelle : c'est une application
 * monopage, sans routage par produit. Déclarer des URL supplémentaires
 * qui renvoient toutes le même document nuirait au référencement.
 */
export function buildSitemap(): string {
  const today = new Date().toISOString().slice(0, 10);
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`;
}

export const activeCampaignId = campaign.id;
