export interface ColorVariant {
  name: string;
  hex?: string;
  images: string[];
  quantity?: number;
  price?: number;
  sizes?: string[];
}

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
  colorVariants?: ColorVariant[];
}

export const PRODUCTS: Product[] = [];

export interface CartItem {
  product: Product;
  selectedSize: string;
  selectedColor?: string;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  selectedSize: string;
  selectedColor?: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  promoCode?: string;
  status: "pending" | "confirmed" | "shipped" | "delivered";
  customerNote?: string;
  createdAt: string;
}

export const INITIAL_CART: CartItem[] = [];
