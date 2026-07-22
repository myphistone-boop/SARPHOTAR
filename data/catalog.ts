import { PRODUCTS } from '../constants';
import { Product } from '../types';

export interface WeaponMeta {
  klass: string;      // classe d'arme (affichage)
  rarity: string;     // rareté
  rarityColor: string;
  order: number;
}

// Métadonnées d'affichage indexées par id produit (les id restent ceux de Stripe).
const META: Record<string, WeaponMeta> = {
  'pistol-novelec': { klass: 'SIDEARM', rarity: 'RARE', rarityColor: '#38E1F0', order: 1 },
  'ciovelec-rifle': { klass: 'FUSIL', rarity: 'EPIC', rarityColor: '#8A6BFF', order: 2 },
  'novelec-gatling': { klass: 'LOURD', rarity: 'LÉGENDAIRE', rarityColor: '#FF6A2C', order: 3 },
};

const DEFAULT_META: WeaponMeta = { klass: 'ARME', rarity: 'RARE', rarityColor: '#FF6A2C', order: 99 };

export interface Weapon extends Product {
  meta: WeaponMeta;
}

export const WEAPONS: Weapon[] = PRODUCTS
  .map((p) => ({ ...p, meta: META[p.id] ?? DEFAULT_META }))
  .sort((a, b) => a.meta.order - b.meta.order);

export const getWeapon = (id: string): Weapon | undefined => WEAPONS.find((w) => w.id === id);
