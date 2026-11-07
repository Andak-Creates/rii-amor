"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ShoppingBag, Eye, Heart, Check, Filter, ChevronRight, Bell } from "lucide-react";
import { Product } from "@/data/products";
import { formatNaira } from "@/lib/currency";

interface ProductShowcaseProps {
  products: Product[];
  onAddToCart: (product: Product, size: string) => void;
  onOpenQuickView: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  wishlistIds: string[];
  activeTheme: string;
  onSelectTheme: (theme: "Modern Muse" | "City Safari" | "Timeless Textures" | "All") => void;
}

export default function ProductShowcase({
  products,
  onAddToCart,
  onOpenQuickView,
  onToggleWishlist,
  wishlistIds,
  activeTheme,
  onSelectTheme,
}: ProductShowcaseProps) {
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({
    "python-blouse": "S",
    "cheetah-coat": "M",
    "florence-gown": "S",
    "savannah-trousers": "M",
    "essentials-stiletto": "38",
    "corset-midi-dress": "S",
    "python-bag": "One Size",
    "leopard-silk-scarf": "One Size",
  });

  const [addedId, setAddedId] = useState<string | null>(null);

  const handleSizeChange = (productId: string, size: string) => {
    setSelectedSizes((prev) => ({ ...prev, [productId]: size }));
  };

  const handleAdd = (product: Product, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!product.inStock) return;
    const size = selectedSizes[product.id] || product.sizes[0] || "Standard";
    onAddToCart(product, size);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1800);
  };

  const filteredProducts =
    activeTheme === "All"
      ? products
      : products.filter((p) => p.theme === activeTheme);

  return (
    <section id="curated-pieces" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Section Header: Clean, responsive, never overflowed */}
      <div className="flex flex-col md:flex-row md:items-end justify-between pb-4 sm:pb-6 mb-6 sm:mb-8 border-b border-[#2C2621]/15 gap-3 sm:gap-4">
        <div>
          <span className="text-[9px] sm:text-[10px] tracking-[0.28em] uppercase text-[#8C7A6B] font-semibold block mb-0.5">
            HAUTE ANIMALIER WARDROBE
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl uppercase tracking-wide text-[#1E1B18]">
            CURATED PIECES & PRINTS
          </h2>
          <p className="text-[11px] sm:text-xs text-[#5C4D3C] tracking-wide mt-1">
            Hand-screened silks and tailored overcoats. Tap any piece to view full atelier specs.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center flex-wrap gap-1.5 sm:gap-2 text-xs tracking-wider uppercase font-medium">
          <span className="text-[9px] sm:text-[10px] text-[#8C7A6B] mr-0.5 sm:mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> THEME:
          </span>
          {(["All", "Modern Muse", "City Safari", "Timeless Textures"] as const).map(
            (theme) => {
              const isActive = activeTheme === theme;
              return (
                <button
                  key={theme}
                  onClick={() => onSelectTheme(theme)}
                  className={`px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full border transition-all text-[9px] sm:text-[10px] tracking-[0.16em] ${
                    isActive
                      ? "bg-[#1E1B18] text-[#FAF7F2] border-[#1E1B18] shadow-xs"
                      : "bg-[#FAF7F2] text-[#5C4D3C] border-[#2C2621]/15 hover:border-[#1E1B18]"
                  }`}
                >
                  {theme}
                </button>
              );
            }
          )}
        </div>
      </div>

      {/* Primary Featured Row from Reference Mockup */}
      <div className="mb-10 sm:mb-12">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[9px] sm:text-[10px] tracking-[0.25em] uppercase text-[#8C7A6B] font-semibold">
            SPOTLIGHT ARCHIVE RUNS:
          </span>
          <span className="text-[9px] sm:text-[10px] tracking-[0.18em] text-[#8C6D46] uppercase font-medium">
            FULL SPECS & SIZING
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {products.slice(0, 2).map((product) => {
            const isWishlisted = wishlistIds.includes(product.id);
            const currentSize = selectedSizes[product.id] || product.sizes[0];
            const isJustAdded = addedId === product.id;
            const isSoldOut = !product.inStock;

            return (
              <div
                key={product.id}
                onClick={() => onOpenQuickView(product)}
                className={`bg-[#FAF7F2] rounded-2xl p-4 sm:p-6 border border-[#2C2621]/20 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row gap-4 sm:gap-5 group cursor-pointer ${
                  isSoldOut ? "opacity-80" : ""
                }`}
              >
                {/* Product Image Frame */}
                <div className="relative w-full sm:w-1/2 aspect-[4/5] rounded-xl overflow-hidden bg-[#EDE5DC] shrink-0 border border-[#2C2621]/10">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />

                  {/* Number Badge */}
                  <div className="absolute top-2.5 left-2.5 bg-[#1E1B18]/85 text-[#FAF7F2] text-[8px] sm:text-[9px] tracking-[0.2em] uppercase px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full font-medium">
                    {product.numberLabel?.split(".")[0] || "01"}
                  </div>

                  {/* Sold out overlay */}
                  {isSoldOut && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
                      <span className="bg-[#1E1B18] text-white text-[9px] tracking-[0.25em] uppercase px-3 py-1 rounded-full font-semibold border border-white/20">
                        SOLD OUT
                      </span>
                    </div>
                  )}

                  {/* Quick action buttons */}
                  <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 z-10">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleWishlist(product);
                      }}
                      className={`p-1.5 sm:p-2 rounded-full backdrop-blur-sm transition-all ${
                        isWishlisted
                          ? "bg-[#8C6D46] text-white"
                          : "bg-[#FAF7F2]/80 hover:bg-[#FAF7F2] text-[#1E1B18]"
                      }`}
                      aria-label="Save to wishlist"
                    >
                      <Heart
                        className={`w-3.5 h-3.5 ${
                          isWishlisted ? "fill-current" : ""
                        }`}
                      />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenQuickView(product);
                      }}
                      className="p-1.5 sm:p-2 rounded-full bg-[#FAF7F2]/80 hover:bg-[#FAF7F2] text-[#1E1B18] backdrop-blur-sm transition-all"
                      aria-label="Inspect details"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Product Information */}
                <div className="flex flex-col justify-between flex-1">
                  <div>
                    <span className="text-[8px] sm:text-[9px] tracking-[0.22em] uppercase text-[#8C7A6B] block">
                      {product.subtitle}
                    </span>

                    <h3 className="font-serif text-base sm:text-lg lg:text-xl uppercase font-semibold text-[#1E1B18] mt-0.5">
                      {product.numberLabel || product.name}
                    </h3>

                    <div className="font-serif text-lg sm:text-xl text-[#1E1B18] font-medium mt-1">
                      {formatNaira(product.price)}
                    </div>

                    {/* Composition Pill */}
                    <div className="mt-2 inline-block bg-[#EDE5DC] text-[#2C2621] text-[9px] sm:text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-md font-medium border border-[#2C2621]/10">
                      {product.composition}
                    </div>

                    {/* Clean Tailoring Specs Accent (NO COLLIDING BULLETS) */}
                    <div className="mt-3">
                      <span className="text-[8px] sm:text-[9px] tracking-[0.2em] uppercase text-[#8C7A6B] font-semibold block mb-1">
                        TAILORING SPECS:
                      </span>
                      <div className="space-y-1 pl-2.5 border-l-2 border-[#C99742]/70 text-[11px] text-[#5C4D3C]">
                        {product.details.slice(0, 3).map((detail, idx) => (
                          <p key={idx} className="leading-snug">
                            {detail}
                          </p>
                        ))}
                      </div>
                    </div>

                    {/* Sizing Selector */}
                    {product.sizes.length > 1 && (
                      <div className="mt-3.5" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between text-[9px] sm:text-[10px] tracking-wider uppercase text-[#8C7A6B] mb-1">
                          <span>SELECT SIZE:</span>
                          <span className="text-[#1E1B18] font-semibold">{currentSize}</span>
                        </div>
                        <div className="flex flex-wrap gap-1 sm:gap-1.5">
                          {product.sizes.map((size) => (
                            <button
                              key={size}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSizeChange(product.id, size);
                              }}
                              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-md text-[9px] sm:text-[10px] font-medium uppercase border transition-all ${
                                currentSize === size
                                  ? "bg-[#1E1B18] text-[#FAF7F2] border-[#1E1B18]"
                                  : "bg-[#EDE5DC]/60 text-[#2C2621] border-[#2C2621]/15 hover:border-[#1E1B18]"
                              }`}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-3 sm:pt-4 mt-3 sm:mt-4 border-t border-[#2C2621]/10 flex flex-col gap-1.5">
                    {isSoldOut ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenQuickView(product);
                        }}
                        className="w-full py-2.5 px-6 rounded-full text-[10px] sm:text-[11px] tracking-[0.2em] uppercase font-medium bg-[#DDD2C4] text-[#736555] border border-[#2C2621]/20 flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Bell className="w-3.5 h-3.5" />
                        <span>JOIN WAITLIST</span>
                      </button>
                    ) : (
                      <button
                        onClick={(e) => handleAdd(product, e)}
                        disabled={isJustAdded}
                        className={`w-full py-2.5 px-6 rounded-full text-[10px] sm:text-[11px] tracking-[0.22em] uppercase font-medium transition-all duration-300 flex items-center justify-center gap-2 border ${
                          isJustAdded
                            ? "bg-[#2A4D33] text-white border-[#2A4D33]"
                            : "bg-[#FAF7F2] hover:bg-[#1E1B18] text-[#1E1B18] hover:text-[#FAF7F2] border-[#2C2621]/40 hover:border-[#1E1B18] shadow-xs"
                        }`}
                      >
                        {isJustAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>ADDED TO BAG</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>ADD TO CART</span>
                          </>
                        )}
                      </button>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenQuickView(product);
                      }}
                      className="w-full text-center text-[9px] sm:text-[10px] tracking-[0.16em] uppercase text-[#8C6D46] hover:text-[#1E1B18] font-semibold py-1 flex items-center justify-center gap-1 transition-colors"
                    >
                      <span>VIEW COMPLETE DOSSIER</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ALL COLLECTION ITEMS (Grid) */}
      <div className="pt-2">
        <div className="flex items-center justify-between mb-4 sm:mb-6 text-[11px] sm:text-xs text-[#736555] tracking-wider uppercase font-medium border-b border-[#2C2621]/10 pb-2.5">
          <span>COMPLETE ATELIER RUN ({filteredProducts.length} PIECES)</span>
          <span className="text-[9px] sm:text-[10px] text-[#8C7A6B]">
            TAP FOR FABRIC & FIT
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map((product) => {
            const isWishlisted = wishlistIds.includes(product.id);
            const currentSize = selectedSizes[product.id] || product.sizes[0];
            const isJustAdded = addedId === product.id;
            const isSoldOut = !product.inStock;

            return (
              <div
                key={product.id}
                onClick={() => onOpenQuickView(product)}
                className={`bg-[#FAF7F2] rounded-xl p-3.5 sm:p-4 border border-[#2C2621]/15 hover:border-[#2C2621]/35 hover:shadow-md transition-all flex flex-col justify-between group shadow-xs cursor-pointer ${
                  isSoldOut ? "opacity-80" : ""
                }`}
              >
                <div>
                  {/* Image Container */}
                  <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-[#EDE5DC] mb-2.5 sm:mb-3 border border-[#2C2621]/10">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />

                    {isSoldOut && (
                      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
                        <span className="bg-[#1E1B18] text-white text-[8px] tracking-[0.2em] uppercase px-2.5 py-0.5 rounded-full font-semibold">
                          SOLD OUT
                        </span>
                      </div>
                    )}

                    {/* Quick action buttons */}
                    <div className="absolute top-2 right-2 flex flex-col gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity z-10">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleWishlist(product);
                        }}
                        className={`p-1.5 rounded-full backdrop-blur-sm transition-all ${
                          isWishlisted
                            ? "bg-[#8C6D46] text-white"
                            : "bg-[#FAF7F2]/90 hover:bg-[#FAF7F2] text-[#1E1B18]"
                        }`}
                        aria-label="Wishlist"
                      >
                        <Heart
                          className={`w-3.5 h-3.5 ${
                            isWishlisted ? "fill-current" : ""
                          }`}
                        />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenQuickView(product);
                        }}
                        className="p-1.5 rounded-full bg-[#FAF7F2]/90 hover:bg-[#FAF7F2] text-[#1E1B18] backdrop-blur-sm"
                        aria-label="Inspect details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="absolute bottom-2 left-2 bg-[#1E1B18]/70 backdrop-blur-sm text-[#FAF7F2] text-[8px] tracking-[0.2em] uppercase px-2 py-0.5 rounded">
                      {product.theme}
                    </div>
                  </div>

                  {/* Title & Price */}
                  <span className="text-[8px] sm:text-[9px] tracking-[0.2em] uppercase text-[#8C7A6B] block">
                    {product.subtitle}
                  </span>
                  <h4 className="font-serif text-sm sm:text-base uppercase font-semibold text-[#1E1B18] mt-0.5 group-hover:text-[#8C6D46] transition-colors truncate">
                    {product.name}
                  </h4>
                  <div className="font-serif text-sm font-semibold text-[#1E1B18] mt-0.5">
                    {formatNaira(product.price)}
                  </div>

                  {/* Clean Specs list with vertical gold accent line (NO COLLIDING BULLETS) */}
                  <div className="mt-2 pt-2 border-t border-[#2C2621]/10">
                    <span className="text-[8px] sm:text-[9px] tracking-[0.2em] uppercase text-[#8C7A6B] font-semibold block mb-0.5">
                      FABRIC & CRAFT:
                    </span>
                    <p className="text-[9px] sm:text-[10px] text-[#2C2621] font-medium truncate">
                      {product.composition}
                    </p>
                    <div className="mt-1 space-y-0.5 pl-2 border-l border-[#C99742]/70 text-[9px] sm:text-[10px] text-[#736555]">
                      {product.details.slice(0, 2).map((detail, idx) => (
                        <p key={idx} className="truncate">
                          {detail}
                        </p>
                      ))}
                    </div>
                  </div>

                  {/* Sizing options */}
                  {product.sizes.length > 1 && (
                    <div className="mt-2 pt-1.5 border-t border-[#2C2621]/10" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-between text-[8px] uppercase tracking-wider text-[#8C7A6B] mb-1">
                        <span>SIZE:</span>
                        <span className="font-semibold text-[#1E1B18]">{currentSize}</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {product.sizes.map((size) => (
                          <button
                            key={size}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSizeChange(product.id, size);
                            }}
                            className={`px-1.5 py-0.5 rounded text-[8px] sm:text-[9px] font-medium border transition-all ${
                              currentSize === size
                                ? "bg-[#1E1B18] text-[#FAF7F2] border-[#1E1B18]"
                                : "bg-[#EDE5DC]/60 text-[#2C2621] border-[#2C2621]/15 hover:border-[#1E1B18]"
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Action Buttons */}
                <div className="mt-3 pt-2 border-t border-[#2C2621]/10 flex flex-col gap-1">
                  {isSoldOut ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenQuickView(product);
                      }}
                      className="w-full py-1.5 rounded-full text-[9px] sm:text-[10px] tracking-[0.18em] uppercase font-medium bg-[#DDD2C4] text-[#736555] border border-[#2C2621]/20 flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Bell className="w-3 h-3" />
                      <span>WAITLIST</span>
                    </button>
                  ) : (
                    <button
                      onClick={(e) => handleAdd(product, e)}
                      disabled={isJustAdded}
                      className={`w-full py-1.5 sm:py-2 rounded-full text-[9px] sm:text-[10px] tracking-[0.2em] uppercase font-medium transition-all flex items-center justify-center gap-1.5 border ${
                        isJustAdded
                          ? "bg-[#2A4D33] text-white border-[#2A4D33]"
                          : "bg-[#EDE5DC]/60 hover:bg-[#1E1B18] text-[#1E1B18] hover:text-[#FAF7F2] border-[#2C2621]/20 hover:border-[#1E1B18]"
                      }`}
                    >
                      {isJustAdded ? (
                        <>
                          <Check className="w-3 h-3" />
                          <span>ADDED</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3 h-3" />
                          <span>ADD TO CART</span>
                        </>
                      )}
                    </button>
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenQuickView(product);
                    }}
                    className="w-full text-center text-[8px] sm:text-[9px] tracking-[0.16em] uppercase text-[#8C6D46] hover:text-[#1E1B18] font-semibold py-0.5 transition-colors"
                  >
                    VIEW DETAILS →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
