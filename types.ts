export interface ProductStory {
  line1: string;
  line2: string;
}

export interface Product {
  id: string;
  name: string;
  tagline: string;
  /** Prix de vente réel, en euros. Doit correspondre au prix Stripe (lookup_key = id). */
  price: number;
  currency: string;
  image: string;
  gallery: string[];
  story: ProductStory;
  /**
   * Indice comparatif entre les modèles de la gamme, sur 100.
   * Ce n'est PAS une mesure physique : c'est un positionnement relatif
   * destiné à comparer les trois modèles entre eux. Les caractéristiques
   * réelles et chiffrées vivent dans content/facts.ts.
   */
  specs: {
    range: number;
    rate: number;
    capacity: number;
  };
}

export interface CartItem extends Product {
  quantity: number;
}
