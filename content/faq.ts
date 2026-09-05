/**
 * ============================================================================
 *  FAQ — DÉRIVÉE DES FAITS VÉRIFIÉS
 * ============================================================================
 *
 *  Les réponses sont construites à partir de content/facts.ts. Une question
 *  dont la réponse dépend d'une donnée non confirmée (`null`) est
 *  automatiquement retirée de la FAQ plutôt que d'être inventée.
 *
 *  Conséquence concrète : renseignez `battery` dans facts.ts et la question
 *  « Quelle est son autonomie ? » apparaît d'elle-même sur le site.
 * ============================================================================
 */

import { PRODUCT_FACTS, SHIPPING, RETURNS, SUPPORT, WARRANTY } from './facts';

export interface FaqItem {
  q: string;
  a: string;
}

/** Portées réellement renseignées, formatées pour la réponse. */
function rangeAnswer(): string | null {
  const parts = Object.entries(PRODUCT_FACTS)
    .filter(([, f]) => f.range !== null)
    .map(([, f]) => f.range!.value);
  if (parts.length === 0) return null;
  const uniq = Array.from(new Set(parts));
  return uniq.length === 1
    ? `${uniq[0]} selon les conditions d'utilisation.`
    : `Selon le modèle : ${uniq.join(', ')}. Portées maximales mesurées en conditions optimales.`;
}

/**
 * Construit la FAQ affichée. Chaque entrée est conditionnée à l'existence
 * réelle de l'information — d'où les `null` filtrés en fin de fonction.
 */
export function buildFaq(): FaqItem[] {
  const anyProduct = PRODUCT_FACTS['pistol-novelec'];
  const range = rangeAnswer();

  const items: (FaqItem | null)[] = [
    {
      q: 'Comment fonctionne NovElec™ ?',
      a: "NovElec™ est un pistolet à eau électrique : un moteur alimenté par batterie propulse l'eau en continu, sans pompage. Il suffit de remplir le réservoir, d'allumer et d'appuyer sur la gâchette.",
    },

    anyProduct.charging
      ? {
          q: 'Comment recharge-t-on NovElec™ ?',
          a: `La recharge se fait par câble USB, fourni dans la boîte. ${anyProduct.charging.note ?? ''}`.trim(),
        }
      : null,

    // Apparaîtra dès que `battery` sera renseigné dans facts.ts.
    anyProduct.battery
      ? { q: 'Quelle est son autonomie ?', a: `${anyProduct.battery.value}.` }
      : null,

    range ? { q: 'Quelle est sa portée ?', a: range } : null,

    anyProduct.charging
      ? {
          q: 'Combien de temps faut-il pour le recharger ?',
          a: `${anyProduct.charging.value} pour une charge complète.`,
        }
      : null,

    anyProduct.waterResistance
      ? {
          q: 'Est-il étanche ?',
          a: `${anyProduct.waterResistance.value}. ${anyProduct.waterResistance.note ?? ''}`.trim(),
        }
      : null,

    anyProduct.waterResistance
      ? {
          q: 'Peut-il être utilisé dans une piscine ?',
          a: "Il peut être utilisé au bord d'une piscine et résiste aux projections, mais il ne doit pas être immergé : l'électronique n'est pas conçue pour rester sous l'eau.",
        }
      : null,

    anyProduct.age
      ? {
          q: 'Quel âge est recommandé ?',
          a: `${anyProduct.age.value}. L'utilisation par un enfant se fait sous la surveillance d'un adulte. Ne jamais viser le visage ou les yeux.`,
        }
      : null,

    // Apparaîtra dès que `boxContents` sera renseigné dans facts.ts.
    anyProduct.boxContents
      ? { q: 'Que contient le colis ?', a: anyProduct.boxContents.join(' · ') }
      : null,

    {
      q: 'Quels sont les délais de livraison ?',
      a: [
        `Comptez ${SHIPPING.deliveryEstimate} entre votre commande et sa réception.`,
        `Elle est préparée et expédiée sous ${SHIPPING.handling}.`,
        SHIPPING.carrier ? `Elle est ensuite acheminée par ${SHIPPING.carrier}.` : null,
        SHIPPING.free ? 'Les frais de livraison sont offerts.' : null,
        `Livraison en ${SHIPPING.countries.join(', ')}.`,
      ]
        .filter(Boolean)
        .join(' '),
    },

    {
      q: 'Comment fonctionne le retour ?',
      a: [
        `Vous disposez de ${RETURNS.withdrawalDays} jours à compter de la réception pour exercer votre droit de rétractation, sans avoir à vous justifier.`,
        'Le produit doit être retourné complet et dans son état d’origine.',
        RETURNS.returnShippingPaidByCustomer
          ? 'Les frais de retour restent à votre charge.'
          : 'Les frais de retour sont pris en charge par Sarphotar™.',
        `Vous bénéficiez par ailleurs de la garantie légale de conformité de ${WARRANTY.legalConformityYears} ans.`,
      ].join(' '),
    },

    {
      q: 'Comment contacter Sarphotar ?',
      a: `Écrivez-nous à ${SUPPORT.email} ou via le formulaire de contact du site. ${SUPPORT.responseTime}.`,
    },
  ];

  return items.filter((i): i is FaqItem => i !== null);
}

export const FAQ: FaqItem[] = buildFaq();
