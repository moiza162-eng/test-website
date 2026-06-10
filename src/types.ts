export interface Product {
  id: string;
  name: string;
  price: number;
  category: 'Apparel' | 'Outerwear' | 'Accessories';
  rating: number;
  image: string;
  colors: string[];
  sizes: string[];
  description: string;
  fabric: string;
  care: string;
  inStock: boolean;
  featured?: boolean;
}

export interface CartItem {
  product: Product;
  selectedColor: string;
  selectedSize: string;
  quantity: number;
}

export type ThemeAccent = 'charcoal' | 'terracotta' | 'indigo' | 'sage';
export type HeroStyle = 'minimal' | 'split' | 'editorial';
export type GridDensity = 'compact' | 'balanced' | 'spacious';

export interface LayoutSettings {
  accent: ThemeAccent;
  heroStyle: HeroStyle;
  gridDensity: GridDensity;
  showHero: boolean;
  showSizeFinder: boolean;
}
