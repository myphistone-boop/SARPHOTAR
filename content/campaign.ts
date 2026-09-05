/**
 * ============================================================================
 *  SYSTÈME DE CAMPAGNES SAISONNIÈRES — SARPHOTAR™
 * ============================================================================
 *
 *  UN SEUL ENDROIT À MODIFIER POUR CHANGER DE PÉRIODE COMMERCIALE :
 *  la constante CAMPAIGN_SEASON juste en dessous.
 *
 *  Changer de campagne ne modifie QUE des textes, badges et offres.
 *  Aucune couleur, aucune typo, aucun composant n'est touché : le design
 *  Sarphotar reste strictement identique d'une saison à l'autre.
 *
 *  Une seule campagne est active à la fois — par construction.
 *
 *  RÈGLE ABSOLUE : aucune donnée chiffrée inventée ici.
 *  Les caractéristiques produit vivent dans content/facts.ts,
 *  les avis clients dans content/reviews.ts. Ce fichier ne contient
 *  que du discours, jamais des promesses invérifiables.
 * ============================================================================
 */

/** Icônes disponibles — rendues en SVG dans le style HUD du site (voir components/Icon.tsx). */
export type IconName =
  | 'bolt' | 'drop' | 'battery' | 'gift' | 'lock' | 'truck'
  | 'return' | 'chat' | 'target' | 'trophy' | 'snow' | 'sun';

export type SeasonId =
  | 'late_summer'
  | 'autumn'
  | 'halloween'
  | 'black_friday'
  | 'christmas'
  | 'evergreen'
  | 'pre_summer'
  | 'summer';

/* ============================================================================
 *  ⚙️  CAMPAGNE ACTIVE — c'est la seule ligne à changer d'une période à l'autre
 * ========================================================================== */

export const CAMPAIGN_SEASON: SeasonId = 'late_summer';

/* ========================================================================== */

export interface Benefit {
  icon: IconName;
  label: string;
  /** Texte long : utilisé dans les sections de bénéfices, pas dans le hero. */
  detail?: string;
}

export interface Campaign {
  id: SeasonId;
  /** Libellé court affiché dans la pastille au-dessus du titre. */
  badge: string;
  badgeIcon: IconName;
  /**
   * Titre principal, en deux temps pour préserver la typographie monumentale
   * du hero : les lignes courtes en Oswald black italic, puis la fin de phrase
   * en corps réduit. Les deux sont dans le <h1> — le mot-clé SEO reste dedans.
   */
  h1Lines: string[];
  /** Ligne mise en accent (dernière ligne du bloc monumental). */
  h1Accent: string;
  h1Tail: string;
  subtitle: string;
  benefits: Benefit[];
  ctaPrimary: string;
  ctaSecondary: string;
  /** Bloc de fin de page. */
  finalCta: { title: string; subtitle: string; button: string };
  /** Capture e-mail (un seul popup maximum sur le site). */
  emailCapture: { title: string; subtitle: string; button: string };
  /** Angles publicitaires de la période — documentation pour les campagnes Ads. */
  adAngles: string[];
}

/** Bénéfices produit communs — formulés sans chiffre non confirmé. */
const CORE_BENEFITS: Benefit[] = [
  { icon: 'bolt', label: 'Tir électrique', detail: "Une expérience électrique différente d'un pistolet classique." },
  { icon: 'drop', label: 'Grande portée', detail: 'Un jet franc, qui porte loin et reste précis.' },
  { icon: 'battery', label: 'Rechargeable', detail: 'Rechargez-le et repartez pour une nouvelle partie.' },
];

export const CAMPAIGNS: Record<SeasonId, Campaign> = {
  /* ---------------------------------------------------------------- */
  /*  A — 5 septembre → fin septembre 2026                            */
  /*  Angle : les derniers beaux jours + fun + cadeau                  */
  /* ---------------------------------------------------------------- */
  late_summer: {
    id: 'late_summer',
    badge: 'Les derniers beaux jours',
    badgeIcon: 'bolt',
    h1Lines: ['CHAQUE MOMENT'],
    h1Accent: 'DEVIENT UN DÉFI',
    h1Tail: "Le pistolet à eau électrique qui transforme chaque moment en défi.",
    subtitle:
      "Rechargeable, fun et conçu pour des batailles d'eau complètement différentes. Profitez des derniers beaux jours pour passer à l'action.",
    benefits: CORE_BENEFITS,
    ctaPrimary: 'Découvrir NovElec™',
    ctaSecondary: 'Acheter maintenant',
    finalCta: {
      title: 'Toujours prêt pour une dernière bataille ?',
      subtitle: 'Découvrez NovElec™ et profitez des derniers beaux jours.',
      button: 'Découvrir NovElec™',
    },
    emailCapture: {
      title: 'Une offre à ne pas manquer ?',
      subtitle: 'Restez au courant des prochaines offres Sarphotar.',
      button: "Je m'inscris",
    },
    adAngles: [
      "Les derniers beaux jours ne sont pas terminés.",
      "On a remplacé le pistolet à eau classique par ça.",
      "POV : tu pensais avoir gagné la bataille.",
      "Le petit achat qui transforme une après-midi en compétition.",
    ],
  },

  /* ---------------------------------------------------------------- */
  /*  B — octobre 2026 · challenge + fun                              */
  /*  Aucune référence à la plage ou aux vacances d'été.               */
  /* ---------------------------------------------------------------- */
  autumn: {
    id: 'autumn',
    badge: 'Mode challenge activé',
    badgeIcon: 'target',
    h1Lines: ['QUI GAGNERA'],
    h1Accent: 'LA PROCHAINE ?',
    h1Tail: 'Qui gagnera la prochaine bataille ?',
    subtitle: "NovElec™ transforme une simple partie en véritable défi.",
    benefits: CORE_BENEFITS,
    ctaPrimary: 'Relever le défi',
    ctaSecondary: 'Voir l’arsenal',
    finalCta: {
      title: 'Prêt à relever le défi ?',
      subtitle: 'NovElec™ transforme une simple partie en véritable défi.',
      button: 'Relever le défi',
    },
    emailCapture: {
      title: 'Restez au courant des prochaines offres Sarphotar.',
      subtitle: 'Les nouveautés et les offres, directement par e-mail.',
      button: "Je m'inscris",
    },
    adAngles: ['Qui gagnera le prochain défi ?'],
  },

  /* ---------------------------------------------------------------- */
  /*  Halloween — clin d'œil uniquement, PAS de refonte graphique.     */
  /*  Seuls le badge, le copy hero et quelques micro-textes changent.  */
  /* ---------------------------------------------------------------- */
  halloween: {
    id: 'halloween',
    badge: 'Mode bataille activé',
    badgeIcon: 'target',
    h1Lines: ['PERSONNE NE'],
    h1Accent: 'RESSORT SEC',
    h1Tail: 'Cette fois, personne ne ressortira sec.',
    subtitle: 'Préparez votre prochain défi avec NovElec™.',
    benefits: CORE_BENEFITS,
    ctaPrimary: "Passer à l'action",
    ctaSecondary: 'Voir l’arsenal',
    finalCta: {
      title: 'Cette fois, personne ne ressortira sec.',
      subtitle: 'Préparez votre prochain défi avec NovElec™.',
      button: "Passer à l'action",
    },
    emailCapture: {
      title: 'Restez au courant des prochaines offres Sarphotar.',
      subtitle: 'Les nouveautés et les offres, directement par e-mail.',
      button: "Je m'inscris",
    },
    adAngles: ['Cette année, personne ne ressort sec.'],
  },

  /* ---------------------------------------------------------------- */
  /*  C — novembre 2026 · Black Friday                                */
  /*  L'offre réelle se configure dans content/offer.ts.               */
  /*  Aucun pourcentage, prix barré ou stock n'est inventé ici.        */
  /* ---------------------------------------------------------------- */
  black_friday: {
    id: 'black_friday',
    badge: 'Black Friday',
    badgeIcon: 'bolt',
    h1Lines: ['LE MOMENT'],
    h1Accent: 'DE PASSER À NOVELEC™',
    h1Tail: 'Le moment de passer à NovElec™.',
    subtitle: 'Profitez de notre offre Black Friday pendant la durée de la campagne.',
    benefits: CORE_BENEFITS,
    ctaPrimary: "Profiter de l'offre",
    ctaSecondary: 'Voir l’arsenal',
    finalCta: {
      title: 'Le moment de passer à NovElec™.',
      subtitle: 'Profitez de notre offre Black Friday pendant la durée de la campagne.',
      button: "Profiter de l'offre",
    },
    emailCapture: {
      title: "Ne ratez pas l'offre Black Friday.",
      subtitle: 'Soyez parmi les premiers informés de notre offre Black Friday.',
      button: "Je m'inscris",
    },
    adAngles: ['Le moment de passer à NovElec™.'],
  },

  /* ---------------------------------------------------------------- */
  /*  D — décembre 2026 · Noël · positionnement IDÉE CADEAU            */
  /*  Ne jamais garantir une livraison avant Noël sans données réelles.*/
  /* ---------------------------------------------------------------- */
  christmas: {
    id: 'christmas',
    badge: 'Idée cadeau',
    badgeIcon: 'gift',
    h1Lines: ['LE CADEAU'],
    h1Accent: 'QU’ON N’OUBLIE PAS',
    h1Tail: 'Le cadeau qui transforme une journée ordinaire en partie mémorable.',
    subtitle:
      "NovElec™ est pensé pour ceux qui aiment jouer, défier leurs proches et essayer quelque chose de différent.",
    benefits: [
      { icon: 'gift', label: 'Idée cadeau', detail: 'Un cadeau original pour ceux qui aiment jouer.' },
      { icon: 'bolt', label: 'Tir électrique', detail: "Une expérience différente d'un pistolet classique." },
      { icon: 'battery', label: 'Rechargeable', detail: 'Rechargez-le et repartez pour une nouvelle partie.' },
    ],
    ctaPrimary: 'Offrir NovElec™',
    ctaSecondary: 'Voir l’arsenal',
    finalCta: {
      title: 'Un cadeau qu’on n’oublie pas.',
      subtitle: 'Offrez NovElec™ à quelqu’un qui aime jouer et relever des défis.',
      button: 'Offrir NovElec™',
    },
    emailCapture: {
      title: 'Préparez vos cadeaux.',
      subtitle: 'Recevez nos offres cadeaux.',
      button: "Je m'inscris",
    },
    adAngles: ["Tu cherches un cadeau que la personne n'oubliera pas ?"],
  },

  /* ---------------------------------------------------------------- */
  /*  E — janvier → mars 2027 · plaisir / cadeau / anticipation        */
  /* ---------------------------------------------------------------- */
  evergreen: {
    id: 'evergreen',
    badge: 'Plus qu’un pistolet à eau',
    badgeIcon: 'bolt',
    h1Lines: ['UN NOUVEAU'],
    h1Accent: 'PRÉTEXTE POUR JOUER',
    h1Tail: "Le pistolet à eau électrique qui transforme chaque moment en défi.",
    subtitle:
      "Électrique, rechargeable et pensé pour rendre chaque partie plus intense. À offrir, ou à garder pour soi.",
    benefits: CORE_BENEFITS,
    ctaPrimary: 'Découvrir NovElec™',
    ctaSecondary: 'Voir l’arsenal',
    finalCta: {
      title: 'Prêt pour la prochaine partie ?',
      subtitle: 'Découvrez NovElec™ et changez de niveau.',
      button: 'Découvrir NovElec™',
    },
    emailCapture: {
      title: 'Restez au courant des prochaines offres Sarphotar.',
      subtitle: 'Les nouveautés et les offres, directement par e-mail.',
      button: "Je m'inscris",
    },
    adAngles: ['Le petit achat qui transforme une après-midi en compétition.'],
  },

  /* ---------------------------------------------------------------- */
  /*  F — avril → mai 2027 · pré-saison été                            */
  /* ---------------------------------------------------------------- */
  pre_summer: {
    id: 'pre_summer',
    badge: 'Prêt avant tout le monde',
    badgeIcon: 'sun',
    h1Lines: ['LA SAISON'],
    h1Accent: 'COMMENCE MAINTENANT',
    h1Tail: "Le pistolet à eau électrique qui transforme chaque moment en défi.",
    subtitle:
      "Les beaux jours arrivent. Équipez-vous avant les premières batailles et prenez une longueur d'avance.",
    benefits: CORE_BENEFITS,
    ctaPrimary: 'Découvrir NovElec™',
    ctaSecondary: 'Voir l’arsenal',
    finalCta: {
      title: 'Prêt avant tout le monde ?',
      subtitle: 'Découvrez NovElec™ et attaquez la saison équipé.',
      button: 'Découvrir NovElec™',
    },
    emailCapture: {
      title: 'Restez au courant des prochaines offres Sarphotar.',
      subtitle: 'Les nouveautés et les offres, directement par e-mail.',
      button: "Je m'inscris",
    },
    adAngles: ["La saison commence plus tôt que tu ne le penses."],
  },

  /* ---------------------------------------------------------------- */
  /*  G — juin → août 2027 · plein été                                 */
  /* ---------------------------------------------------------------- */
  summer: {
    id: 'summer',
    badge: 'Pleine saison',
    badgeIcon: 'sun',
    h1Lines: ['LA BATAILLE'],
    h1Accent: 'CHANGE DE NIVEAU',
    h1Tail: "Le pistolet à eau électrique qui transforme chaque moment en défi.",
    subtitle:
      "Rechargeable, fun et conçu pour des batailles d'eau complètement différentes. L'été est à vous.",
    benefits: CORE_BENEFITS,
    ctaPrimary: 'Découvrir NovElec™',
    ctaSecondary: 'Acheter maintenant',
    finalCta: {
      title: 'Prêt pour la prochaine bataille ?',
      subtitle: 'Découvrez NovElec™ et passez à l’électrique.',
      button: 'Découvrir NovElec™',
    },
    emailCapture: {
      title: 'Restez au courant des prochaines offres Sarphotar.',
      subtitle: 'Les nouveautés et les offres, directement par e-mail.',
      button: "Je m'inscris",
    },
    adAngles: [
      "On a remplacé le pistolet à eau classique par ça.",
      "POV : tu pensais avoir gagné la bataille.",
    ],
  },
};

/** La campagne active. Une seule, toujours. */
export const campaign: Campaign = CAMPAIGNS[CAMPAIGN_SEASON];
