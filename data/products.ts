export interface Product {
  id: string;
  numberLabel?: string;
  name: string;
  subtitle?: string;
  price: number;
  originalPrice?: number;
  category:
    | "sets"
    | "swimwear"
    | "jumpsuits"
    | "dresses"
    | "tops"
    | "accessories";
  theme: "Atelier Co-Ords" | "Wild Resort & Swim" | "Sculpted Silhouettes";
  image: string;
  secondaryImage: string;
  images?: string[];
  description: string;
  details: string[];
  composition: string;
  sizes: string[];
  inStock: boolean;
  quantity?: number;
  isHeroFeatured?: boolean;
}

export const PRODUCTS: Product[] = [];

export interface CartItem {
  product: Product;
  selectedSize: string;
  quantity: number;
}

export const INITIAL_CART: CartItem[] = [];
