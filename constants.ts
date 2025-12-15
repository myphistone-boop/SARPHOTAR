import { Product } from './types';

export const PRODUCTS: Product[] = [
  {
    id: 'novelec-pistol',
    name: 'Pistolet NovElec™',
    tagline: '100% Électrique',
    price: 1.99,
    originalPrice: 39.99,
    currency: 'EUR',
    image: 'https://storage.googleapis.com/novelec_assets/Pistolet',
    gallery: [
      'https://storage.googleapis.com/novelec_assets/Pistolet',
      'https://storage.googleapis.com/novelec_assets/Cross%20pistolet',
      'https://storage.googleapis.com/novelec_assets/Accessoires%20pistolet'
    ],
    rating: 4.8,
    reviewCount: 124,
    badges: ['Night-ready', 'USB-C'],
    bullets: [
      { label: 'Portée', value: '10 m' },
      { label: 'Tir', value: 'Constant' },
      { label: 'Batterie', value: 'Inclus' },
      { label: 'Moteur', value: 'Silent V2' },
    ],
    story: {
      line1: 'La puissance électrique. Le style. La nuit.',
      line2: 'Un jet précis, des effets lumineux, et zéro effort.',
    },
    stripeUrl: 'https://buy.stripe.com/test_1',
    specs: {
      range: 70,
      rate: 60,
      capacity: 50,
    }
  },
  {
    id: 'ciovelec-rifle',
    name: 'Fusil CiovElec™',
    tagline: 'L\'Avantage Tactique',
    price: 29.99,
    originalPrice: 59.99,
    currency: 'EUR',
    image: 'https://storage.googleapis.com/novelec_assets/Fusil%20NovElec',
    gallery: [
      'https://storage.googleapis.com/novelec_assets/Fusil%20NovElec',
      'https://storage.googleapis.com/novelec_assets/Cross%20Fusil'
    ],
    rating: 4.9,
    reviewCount: 89,
    badges: ['Longue Portée', 'Grande Capacité'],
    bullets: [
      { label: 'Portée', value: '12 m' },
      { label: 'Réservoir', value: 'XXL' },
      { label: 'Ergo', value: 'Grip Pro' },
      { label: 'Moteur', value: 'TurboFlow' },
    ],
    story: {
      line1: 'Le format fusil. L’avantage à mi-distance.',
      line2: 'Plus de contrôle, plus d’impact, plus de fun.',
    },
    stripeUrl: 'https://buy.stripe.com/test_2',
    specs: {
      range: 90,
      rate: 75,
      capacity: 85,
    }
  },
  {
    id: 'novelec-gatling',
    name: 'Gatling NovElec™',
    tagline: 'Domination Totale',
    price: 99.99,
    originalPrice: 199.99,
    currency: 'EUR',
    image: 'https://storage.googleapis.com/novelec_assets/Gatling',
    gallery: [
      'https://storage.googleapis.com/novelec_assets/Gatling',
      'https://storage.googleapis.com/novelec_assets/Accessoire%20Gatling',
    ],
    rating: 5.0,
    reviewCount: 42,
    badges: ['Rafale Auto', 'RGB LED'],
    bullets: [
      { label: 'Cadence', value: 'Extrême' },
      { label: 'LED', value: 'RGB Sync' },
      { label: 'Mode', value: 'Boss Final' },
      { label: 'Moteur', value: 'Quad-Core' },
    ],
    story: {
      line1: 'Rafales électriques. Signature RGB.',
      line2: 'Le mode “boss final” des batailles aquatiques.',
    },
    stripeUrl: 'https://buy.stripe.com/test_3',
    specs: {
      range: 60,
      rate: 100,
      capacity: 100,
    }
  },
];

export const FAQ_ITEMS = [
  {
    q: "À partir de quel âge ?",
    a: "À partir de 8 ans. Conception avec bords adoucis et prise en main confortable."
  },
  {
    q: "Quelle est la portée ?",
    a: "Jusqu’à 10-12m selon le modèle."
  },
  {
    q: "Est-ce étanche ?",
    a: "Oui, le compartiment batterie est isolé avec un joint silicone étanche IPX4."
  },
  {
    q: "Temps de recharge ?",
    a: "Environ 2h pour une charge complète via USB (câble fourni)."
  }
];

// --- DYNAMIC REVIEWS SYSTEM ---

const REVIEW_NAMES = [
  "Karim B.", "Sophie L.", "Mehdi K.", "Camille D.", "Yassine A.",
  "Thomas M.", "Léa P.", "Mohamed S.", "Sarah J.", "Nicolas F.",
  "Amira H.", "Lucas R.", "Inès B.", "Hugo T.", "Manon G.",
  "Kevin L.", "Julie C.", "Antoine D.", "Clara M.", "Alexandre V.",
  "Fatima Z.", "Pierre H.", "Emma R.", "David L.", "Alice N.",
  "Enzo P.", "Jade M.", "Louis B.", "Chloé S.", "Gabriel L."
];

const REVIEW_CONTENTS = [
  "Absolument dingue. La pression est constante, rien à voir avec les pistolets manuels. Les soirées d'été ont changé de niveau.",
  "Design futuriste incroyable. Mon fils (et mon mari) ne le lâchent plus. La batterie tient vraiment longtemps.",
  "Portée impressionnante pour un jouet électrique. Le réservoir se vide vite si on bourrine, mais c'est le jeu !",
  "Reçu super vite. La qualité du plastique est top, ça fait pas cheap du tout. Je recommande le Gatling pour le show !",
  "Meilleur achat de l'été. On a fait une bataille à 10 personnes, les NovElec™ ont dominé.",
  "Franchement surpris par la puissance. Ça part loin et droit.",
  "L'autonomie est correcte, on tient l'aprem tranquille. Le chargement USB est pratique.",
  "Le look est vraiment badass, surtout la nuit avec les LEDs.",
  "Un peu cher mais la qualité est là. C'est du solide.",
  "Service client au top, j'avais une question sur la batterie, réponse en 1h.",
  "Le débit est impressionnant, mes neveux étaient ravis.",
  "Attention ça mouille fort ! Parfait pour les grosses chaleurs.",
  "Ergonomie parfaite, même pour des mains d'adultes.",
  "Le réservoir additionnel est un must-have.",
  "Je ne regrette pas mon achat, on s'éclate avec les voisins.",
  "Livraison soignée, produit conforme à la description.",
  "La précision est bluffante pour un pistolet à eau.",
  "J'adore le bruit du moteur, ça fait très futuriste.",
  "Simple à remplir, pas de fuite, c'est propre.",
  "On a pris le pack duo, aucun regret."
];

// Pseudo-random generator to ensure deterministic reviews per product
// This allows us to have different reviews for different products, but they stay the same for a specific product
const mulberry32 = (a: number) => {
    return function() {
      var t = a += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}

const stringToHash = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash);
}

export const getReviewsForProduct = (productId: string, count: number, offset: number) => {
    const seed = stringToHash(productId) + offset + 123; // Base seed + offset
    const random = mulberry32(seed);

    return Array.from({ length: count }).map((_, i) => {
        const nameIndex = Math.floor(random() * REVIEW_NAMES.length);
        const contentIndex = Math.floor(random() * REVIEW_CONTENTS.length);
        
        const ratingRoll = random();
        const rating = ratingRoll > 0.1 ? 5 : 4; // 90% 5 stars, 10% 4 stars
        
        const daysAgo = Math.floor(random() * 45) + 2;
        
        return {
            id: `${productId}-review-${offset + i}`,
            name: REVIEW_NAMES[nameIndex],
            verified: random() > 0.2, // 80% verified
            rating: rating,
            date: `Il y a ${daysAgo} jours`,
            content: REVIEW_CONTENTS[contentIndex]
        };
    });
};