
export interface ProductBullet {
  label: string;
  value: string;
}

export interface ProductStory {
  line1: string;
  line2: string;
}

export interface Product {
  id: string;
  lookupKey: string; // New field for Stripe lookup_key
  name: string;
  tagline: string;
  price: number;
  originalPrice?: number;
  currency: string;
  image: string;
  gallery: string[]; 
  rating: number;    
  reviewCount: number; 
  badges: string[];
  bullets: ProductBullet[];
  story: ProductStory;
  stripeUrl?: string; // Optional/Deprecated
  specs: {
    range: number;
    rate: number;
    capacity: number;
  };
}

export interface CartItem extends Product {
  quantity: number;
}
