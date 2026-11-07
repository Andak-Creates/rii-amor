"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import HeroLookbook from "@/components/HeroLookbook";
import ProductShowcase from "@/components/ProductShowcase";
import CartDrawer from "@/components/CartDrawer";
import QuickViewModal from "@/components/QuickViewModal";
import LookbookModal from "@/components/LookbookModal";
import AtelierBookingModal from "@/components/AtelierBookingModal";
import StorySection from "@/components/StorySection";
import Footer from "@/components/Footer";
import { PRODUCTS, INITIAL_CART, CartItem, Product } from "@/data/products";

export default function Home() {
  // Dynamic products list connected to the Admin API
  const [productsList, setProductsList] = useState<Product[]>(PRODUCTS);

  // Cart state preloaded with the 3 items from the reference mockup!
  const [cart, setCart] = useState<CartItem[]>(INITIAL_CART);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Wishlist state
  const [wishlistIds, setWishlistIds] = useState<string[]>([
    "florence-gown",
    "cheetah-coat",
  ]);

  // Modals state
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isLookbookOpen, setIsLookbookOpen] = useState(false);
  const [isAtelierOpen, setIsAtelierOpen] = useState(false);

  // Active theme filter (Style Compass)
  const [activeTheme, setActiveTheme] = useState<string>("All");

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load products from API on mount & on window focus (so admin changes reflect immediately!)
  const loadProducts = async () => {
    try {
      const res = await fetch("/api/products");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
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
  const handleAddToCart = (product: Product, size: string) => {
    setCart((prev) => {
      const existing = prev.find(
        (item) => item.product.id === product.id && item.selectedSize === size
      );
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id && item.selectedSize === size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, selectedSize: size, quantity: 1 }];
    });
    showToast(`Added ${product.name} (${size}) to your bag`);
  };

  const handleUpdateQuantity = (
    productId: string,
    size: string,
    delta: number
  ) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId && item.selectedSize === size) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveFromCart = (productId: string, size: string) => {
    setCart((prev) =>
      prev.filter(
        (item) =>
          !(item.product.id === productId && item.selectedSize === size)
      )
    );
    showToast("Item removed from bag");
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

      {/* Main Header with Reference Navigation & Admin portal link */}
      <Header
        cartCount={totalCartCount}
        wishlistCount={wishlistIds.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenLookbook={() => setIsLookbookOpen(true)}
        onOpenAtelier={() => setIsAtelierOpen(true)}
      />

      <main className="flex-1">
        {/* Hero & Lookbook Bento Grid Section from Reference Mockup */}
        <HeroLookbook
          products={productsList}
          onOpenLookbook={() => setIsLookbookOpen(true)}
          onOpenQuickView={(p) => setQuickViewProduct(p)}
          onSelectTheme={(theme) => setActiveTheme(theme)}
          activeTheme={activeTheme}
        />

        {/* Curated Pieces & Full Collection dynamically populated */}
        <ProductShowcase
          products={productsList}
          onAddToCart={handleAddToCart}
          onOpenQuickView={(p) => setQuickViewProduct(p)}
          onToggleWishlist={handleToggleWishlist}
          wishlistIds={wishlistIds}
          activeTheme={activeTheme}
          onSelectTheme={(theme) => setActiveTheme(theme)}
        />

        {/* Our Story & Italian Animalier Craftsmanship */}
        <StorySection
          onOpenAtelier={() => setIsAtelierOpen(true)}
          onOpenLookbook={() => setIsLookbookOpen(true)}
        />
      </main>

      {/* Footer matching reference layout */}
      <Footer
        onOpenAtelier={() => setIsAtelierOpen(true)}
        onOpenLookbook={() => setIsLookbookOpen(true)}
      />

      {/* Interactive Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
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
        onOpenAtelier={() => {
          setQuickViewProduct(null);
          setIsAtelierOpen(true);
        }}
      />

      {/* Lookbook No. 4 Fullscreen Story Gallery */}
      <LookbookModal
        isOpen={isLookbookOpen}
        onClose={() => setIsLookbookOpen(false)}
        products={productsList}
        onOpenQuickView={(p) => setQuickViewProduct(p)}
        onAddToCart={handleAddToCart}
      />

      {/* Atelier VIP Booking Modal ("Visit Us") */}
      <AtelierBookingModal
        isOpen={isAtelierOpen}
        onClose={() => setIsAtelierOpen(false)}
      />
    </div>
  );
}
