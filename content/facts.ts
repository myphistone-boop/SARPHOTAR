/**
 * ============================================================================
 *  FAITS PRODUIT & PROMESSES COMMERCIALES — SOURCE UNIQUE DE VÉRITÉ
 * ============================================================================
 *
 *  RÈGLE DE FONCTIONNEMENT :
 *
 *    Une valeur à `null` n'est PAS affichée sur le site. Du tout.
 *
 *  C'est volontaire. Le site ne peut donc pas afficher une caractéristique,
 *  un délai ou une garantie qui n'a pas été explicitement renseignée ici.
 *  Il est structurellement impossible d'inventer une donnée par oubli.
 *
 *  Pour ajouter une information : remplacez le `null` par la valeur réelle.
 *  Pour la retirer du site : remettez `null`.
 *
 *  Chaque `null` est accompagné du commentaire « À CONFIRMER » qui indique
 *  précisément ce qu'il faut vérifier (fiche fournisseur, transporteur,
 *  extrait Kbis…) avant de le renseigner.
 * ============================================================================
 */

/** Une caractéristique affichable : libellé court + valeur. */
export interface Spec {
  label: string;
  value: string;
  /** Note de bas de page facultative (ex. conditions de mesure). */
  note?: string;
}

/* ==========================================================================
 *  1. CARACTÉRISTIQUES PRODUIT
 *
 *  Les valeurs ci-dessous sont celles déjà publiées sur sarphotar.fr avant
 *  cette refonte : elles sont conservées telles quelles pour ne pas faire
 *  régresser la fiche produit. Les champs jamais publiés restent à `null`.
 * ======================================================================== */

export interface ProductFacts {
  /** Portée annoncée. La note précise les conditions — obligatoire si « jusqu'à ». */
  range: Spec | null;
  /** Autonomie en usage continu. */
  battery: Spec | null;
  /** Temps de recharge complet. */
  charging: Spec | null;
  /** Capacité du réservoir. */
  capacity: Spec | null;
  /** Dimensions hors tout. */
  dimensions: Spec | null;
  /** Poids. */
  weight: Spec | null;
  /** Indice / protection contre l'eau. */
  waterResistance: Spec | null;
  /** Âge recommandé par le fabricant. */
  age: Spec | null;
  /** Liste exacte de ce que contient la boîte. */
  boxContents: string[] | null;
  /** Conseils d'utilisation et d'entretien. */
  care: string[] | null;
}

const COMMON_FACTS: Omit<ProductFacts, 'range' | 'capacity' | 'dimensions' | 'weight'> = {
  // Déjà publié en FAQ : « Environ 2h pour une charge complète via USB (câble fourni) ».
  charging: { label: 'Recharge', value: 'Environ 2 h', note: 'Charge complète via USB, câble fourni.' },

  // Déjà publié en FAQ : « joint silicone étanche IPX4 ».
  waterResistance: {
    label: 'Étanchéité',
    value: 'Compartiment batterie IPX4',
    note: 'Résiste aux projections. Ne pas immerger.',
  },

  // Déjà publié en FAQ : « À partir de 8 ans ».
  age: { label: 'Âge recommandé', value: 'À partir de 8 ans' },

  // À CONFIRMER — autonomie réelle en usage continu (fiche fournisseur).
  // Tant que c'est `null`, aucune autonomie n'est annoncée nulle part.
  battery: null,

  // À CONFIRMER — contenu exact du colis. Ouvrir une boîte et lister.
  // Exemple une fois vérifié :
  //   ['1 × NovElec™', '1 × batterie rechargeable', '1 × câble USB', '1 × notice']
  boxContents: null,

  // À CONFIRMER — consignes d'entretien du fournisseur.
  // Exemple : ['Vider le réservoir après usage', 'Sécher avant rangement', ...]
  care: null,
};

export const PRODUCT_FACTS: Record<string, ProductFacts> = {
  'pistol-novelec': {
    ...COMMON_FACTS,
    // Déjà publié : bullet « Portée · 10 m ».
    range: { label: 'Portée', value: "Jusqu'à 10 m", note: 'Portée maximale mesurée en conditions optimales.' },
    capacity: null,   // À CONFIRMER — volume du réservoir en ml.
    dimensions: null, // À CONFIRMER — L × l × H en cm.
    weight: null,     // À CONFIRMER — poids en grammes.
  },
  'ciovelec-rifle': {
    ...COMMON_FACTS,
    // Déjà publié : bullet « Portée · 12 m ».
    range: { label: 'Portée', value: "Jusqu'à 12 m", note: 'Portée maximale mesurée en conditions optimales.' },
    capacity: null,   // À CONFIRMER — le site annonce « réservoir XXL » sans volume chiffré.
    dimensions: null, // À CONFIRMER
    weight: null,     // À CONFIRMER
  },
  'novelec-gatling': {
    ...COMMON_FACTS,
    range: null,      // À CONFIRMER — aucune portée n'a jamais été publiée pour ce modèle.
    capacity: null,   // À CONFIRMER
    dimensions: null, // À CONFIRMER
    weight: null,     // À CONFIRMER
  },
};

/** Renvoie uniquement les caractéristiques réellement renseignées, prêtes à afficher. */
export function specsFor(productId: string): Spec[] {
  const f = PRODUCT_FACTS[productId];
  if (!f) return [];
  return [f.range, f.battery, f.charging, f.capacity, f.dimensions, f.weight, f.waterResistance, f.age]
    .filter((s): s is Spec => s !== null);
}

/* ==========================================================================
 *  2. PROMESSES BOUTIQUE (réassurance)
 *
 *  Ne renseigner que ce qui est réellement tenu. Une promesse non tenue
 *  est une pratique commerciale trompeuse, et c'est aussi le meilleur moyen
 *  de générer des litiges et des impayés.
 * ======================================================================== */

export interface Promise_ {
  title: string;
  body: string;
}

export const SHIPPING = {
  /**
   * Vérifié dans le code : api/create-checkout-session.ts ne configure aucun
   * `shipping_options`, donc aucun frais de port n'est facturé au client.
   * La livraison est bien offerte — cette affirmation est exacte.
   */
  free: true,

  /**
   * Délai de PRÉPARATION avant remise au transporteur.
   */
  handling: '1 à 2 jours ouvrés',

  /**
   * Délai TOTAL entre la commande et la réception par le client.
   *
   * Approvisionnement en dropshipping : compter une douzaine de jours.
   * La fourchette est volontairement un peu large pour absorber les aléas —
   * mieux vaut annoncer 15 et livrer en 10 que l'inverse.
   *
   * ⚠️  Ce délai doit être annoncé AVANT l'achat, pas seulement sur l'écran de
   * confirmation (art. L216-1 du code de la consommation). C'est aussi le
   * meilleur moyen d'éviter les litiges et les impayés : un client qui a lu
   * « 12 jours » avant de payer attend, un client qui croyait recevoir en 48 h
   * ouvre un litige au cinquième jour.
   *
   * Au-delà de 30 jours, le client peut annuler sa commande de plein droit.
   */
  deliveryEstimate: '10 à 15 jours',

  /** Pays réellement livrés — repris de shipping_address_collection (Stripe). */
  countries: ['France', 'Belgique', 'Suisse'],

  /**
   * À CONFIRMER — transporteur(s) réellement utilisé(s) pour la remise finale.
   * Le texte des CGV mentionnait « Colissimo, Chronopost » : à valider avant
   * de le réafficher comme une promesse.
   */
  carrier: null as string | null,

  /**
   * À CONFIRMER — un numéro de suivi est-il systématiquement transmis ?
   * Tant que c'est `false`, le site dit « suivi lorsqu'il est disponible »
   * au lieu de promettre un suivi systématique.
   */
  trackingAlways: false,
};

export const RETURNS = {
  /** Droit de rétractation : 14 jours, garanti par la loi (art. L221-18 code de la consommation). */
  withdrawalDays: 14,
  /**
   * Frais de retour à la charge du client — conforme aux CGV actuelles.
   * Mettre à `false` seulement si vous prenez réellement les frais en charge.
   */
  returnShippingPaidByCustomer: true,
};

export const WARRANTY = {
  /**
   * Garantie légale de conformité : 2 ans, prévue par la loi française
   * (art. L217-3 code de la consommation). L'affirmation est donc exacte
   * — à condition de la nommer « garantie légale », pas « garantie
   * constructeur 2 ans » qui serait une promesse commerciale distincte.
   */
  legalConformityYears: 2,
  /** À CONFIRMER — garantie commerciale supplémentaire offerte par la marque ? */
  commercial: null as string | null,
};

export const SUPPORT = {
  email: 'sarphotar.pro@gmail.com',
  /** Repris de l'écran d'aide déjà en ligne : « Notre équipe répond sous 24h ». */
  responseTime: 'Réponse sous 24 h',
  /** À CONFIRMER — le SAV est-il réellement joignable 7j/7 ? Sinon, ne pas l'annoncer. */
  availability: null as string | null,
};

/* ==========================================================================
 *  2 bis. CONFORMITÉ & QUALITÉ PRODUIT
 *
 *  ⚠️  POINT RÉGLEMENTAIRE IMPORTANT
 *
 *  Un pistolet à eau destiné aux enfants (le site annonce « à partir de
 *  8 ans ») est juridiquement un JOUET au sens de la directive 2009/48/CE.
 *  À ce titre il doit porter le marquage CE, et l'importateur — c'est-à-dire
 *  vous si vous achetez hors Union européenne — doit pouvoir présenter la
 *  déclaration UE de conformité du fabricant.
 *
 *  Demandez ces documents à votre fournisseur et conservez-les. Sans eux,
 *  la responsabilité de la mise sur le marché vous revient entièrement.
 *
 *  Aucun label ci-dessous n'est affiché tant qu'il n'est pas confirmé.
 * ======================================================================== */

export const QUALITY = {
  /** À CONFIRMER — marquage CE présent sur le produit et sur l'emballage ? */
  ceMarking: null as boolean | null,

  /** À CONFIRMER — attestation fournisseur (sans BPA / phtalates) ? */
  nonToxic: null as boolean | null,

  /** À CONFIRMER — chaque exemplaire est-il réellement contrôlé avant envoi ? */
  testedBeforeShipping: null as boolean | null,
};

/* ==========================================================================
 *  3. PREUVE SOCIALE
 *
 *  Aucune note moyenne ni aucun compteur d'avis n'est affiché tant qu'il
 *  n'existe pas d'avis réels collectés. Voir content/reviews.ts.
 * ======================================================================== */

export const SOCIAL_PROOF = {
  /**
   * À CONFIRMER — nombre de commandes réellement livrées, si vous souhaitez
   * l'afficher un jour. Doit être justifiable (export Stripe).
   * Laisser `null` tant que ce n'est pas sourcé.
   */
  ordersDelivered: null as number | null,
};

/* ==========================================================================
 *  4. IDENTITÉ LÉGALE (mentions légales — obligatoire)
 *
 *  Obligations : art. 6-III de la LCEN (éditeur + hébergeur) et
 *  art. L221-5 du code de la consommation (vente à distance).
 *  Un site marchand sans ces informations est en infraction.
 * ======================================================================== */

export const LEGAL_ENTITY = {
  siteName: 'Sarphotar™',
  siteUrl: 'https://www.sarphotar.fr',

  // À CONFIRMER — toutes les valeurs ci-dessous doivent venir de votre Kbis.
  // Tant qu'elles sont `null`, l'onglet « Mentions légales » affiche un
  // encart d'avertissement au lieu d'informations inventées.
  companyName: 'Brahim Sahoui' as string | null,        // Entrepreneur individuel
  legalForm: 'Entrepreneur individuel' as string | null,
  capital: null as string | null,           // Capital social (sociétés uniquement)
  siret: '980 655 351 00016' as string | null,
  vatNumber: null as string | null,         // TVA intracommunautaire
  rcs: null as string | null,               // Ville + numéro RCS
  address: '165 rue de Charonne, 75011 Paris' as string | null,
  phone: null as string | null,             // Facultatif mais recommandé
  publicationDirector: 'Brahim Sahoui' as string | null,

  /** Hébergeur — connu et vérifié (le site est déployé sur Vercel). */
  host: {
    name: 'Vercel Inc.',
    address: '440 N Barranca Ave #4133, Covina, CA 91723, États-Unis',
    url: 'https://vercel.com',
  },

  /**
   * Médiateur de la consommation : son adhésion est OBLIGATOIRE pour tout
   * professionnel vendant à des consommateurs (art. L612-1 code conso).
   * À CONFIRMER — nom et coordonnées du médiateur auquel vous adhérez.
   */
  mediator: null as { name: string; url: string } | null,
};

/** True quand les mentions légales sont complètes et publiables. */
export const legalEntityComplete =
  LEGAL_ENTITY.companyName !== null &&
  LEGAL_ENTITY.siret !== null &&
  LEGAL_ENTITY.address !== null;
