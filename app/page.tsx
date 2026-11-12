"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import HeroLookbook from "@/components/HeroLookbook";
import ProductShowcase from "@/components/ProductShowcase";
import CartDrawer from "@/components/CartDrawer";
import QuickViewModal from "@/components/QuickViewModal";
import Footer from "@/components/Footer";
import { CartItem, Product } from "@/data/products";

const CART_STORAGE_KEY = "rii_amor_cart_items";

export default function Home() {
  // Dynamic products list — starts empty, always loaded from API
  const [productsList, setProductsList] = useState<Product[]>([]);

  // Cart state persisted via localStorage
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartLoaded, setIsCartLoaded] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Wishlist state — starts empty
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);

  // Modals state
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // 1. Load cart from localStorage on initial client mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setCart(parsed);
        }
      }
    } catch (e) {
      console.warn("Could not load cart from localStorage", e);
    } finally {
      setIsCartLoaded(true);
    }
  }, []);

  // 2. Persist cart changes to localStorage (only after initial load has finished)
  useEffect(() => {
    if (!isCartLoaded) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.warn("Could not save cart to localStorage", e);
    }
  }, [cart, isCartLoaded]);

  // Load products from API on mount & on window focus (so admin changes reflect immediately!)
  const loadProducts = async () => {
    try {
      const res = await fetch("/api/products");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setProductsList(data);
        }
      }
    } catch (err) {
      console.error("Failed to fetch products:", err);
    }
  };

  useEffect(() => {
    loadProducts();
    const handleFocus = () => loadProducts();
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  // Cart operations
  const handleAddToCart = (product: Product, size: string, color?: string) => {
    setCart((prev) => {
      const existing = prev.find(
        (item) =>
          item.product.id === product.id &&
          item.selectedSize === size &&
          (item.selectedColor || "") === (color || "")
      );
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id &&
          item.selectedSize === size &&
          (item.selectedColor || "") === (color || "")
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        { product, selectedSize: size, selectedColor: color, quantity: 1 },
      ];
    });
    const label = color ? `${product.name} (${size} · ${color})` : `${product.name} (${size})`;
    showToast(`Added ${label} to your bag`);
  };

  const handleUpdateQuantity = (
    productId: string,
    size: string,
    delta: number,
    color?: string
  ) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (
            item.product.id === productId &&
            item.selectedSize === size &&
            (item.selectedColor || "") === (color || "")
          ) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveFromCart = (productId: string, size: string, color?: string) => {
    setCart((prev) =>
      prev.filter(
        (item) =>
          !(
            item.product.id === productId &&
            item.selectedSize === size &&
            (item.selectedColor || "") === (color || "")
          )
      )
    );
    showToast("Item removed from bag");
  };

  const handleClearCart = () => {
    setCart([]);
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch (e) {
      console.warn("Could not clear cart localStorage", e);
    }
  };

  // Wishlist operations
  const handleToggleWishlist = (product: Product) => {
    setWishlistIds((prev) => {
      const exists = prev.includes(product.id);
      if (exists) {
        showToast(`Removed from saved pieces`);
        return prev.filter((id) => id !== product.id);
      } else {
        showToast(`Saved ${product.name} to wishlist`);
        return [...prev, product.id];
      }
    });
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#F4EFEA] text-[#1E1B18] flex flex-col font-sans selection:bg-[#C99742]/30 selection:text-[#1E1B18]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1E1B18] text-[#FAF7F2] px-5 py-3 rounded-full text-xs tracking-wider uppercase font-medium shadow-2xl border border-[#FAF7F2]/10 animate-bounce">
          {toastMessage}
        </div>
      )}

      {/* Main Header */}
      <Header
        cartCount={totalCartCount}
        wishlistCount={wishlistIds.length}
        onOpenCart={() => setIsCartOpen(true)}
      />

      <main className="flex-1">
        {/* Hero Section */}
        <HeroLookbook
          products={productsList}
          onOpenQuickView={(p) => setQuickViewProduct(p)}
        />

        {/* Real Collection Grid & Category Filter */}
        <ProductShowcase
          products={productsList}
          onAddToCart={handleAddToCart}
          onOpenQuickView={(p) => setQuickViewProduct(p)}
          onToggleWishlist={handleToggleWishlist}
          wishlistIds={wishlistIds}
        />
      </main>

      {/* Clean Store Footer */}
      <Footer />

      {/* Interactive Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
      />

      {/* Product Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
        onToggleWishlist={handleToggleWishlist}
        isWishlisted={
          quickViewProduct ? wishlistIds.includes(quickViewProduct.id) : false
        }
      />
    </div>
  );
}
