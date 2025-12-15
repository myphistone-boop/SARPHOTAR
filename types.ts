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
  name: string;
  tagline: string;
  price: number;
  originalPrice?: number; // New field for strikethrough price
  currency: string;
  image: string;
  gallery: string[]; 
  rating: number;    
  reviewCount: number; 
  badges: string[];
  bullets: ProductBullet[];
  story: ProductStory;
  stripeUrl: string;
  specs: {
    range: number; // 0-100 scale for bar
    rate: number;
    capacity: number;
  };
}

export interface CartItem extends Product {
  quantity: number;
}