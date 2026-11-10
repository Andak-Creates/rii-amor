"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ShoppingBag, Eye, Heart, Check, Filter } from "lucide-react";
import { Product } from "@/data/products";
import { formatNaira } from "@/lib/currency";

interface ProductShowcaseProps {
  products: Product[];
  onAddToCart: (product: Product, size: string) => void;
  onOpenQuickView: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  wishlistIds: string[];
}

export default function ProductShowcase({
  products,
  onAddToCart,
  onOpenQuickView,
  onToggleWishlist,
  wishlistIds,
}: ProductShowcaseProps) {
  const [selectedSizes] = useState<Record<string, string>>({});
  const [addedId, setAddedId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const categories = [
    { id: "All", label: "All Pieces" },
    { id: "sets", label: "Two-Piece Sets" },
    { id: "swimwear", label: "Swimwear & Bikinis" },
    { id: "jumpsuits", label: "Jumpsuits & Rompers" },
    { id: "dresses", label: "Dresses" },
    { id: "tops", label: "Tops" },
    { id: "accessories", label: "Accessories" },
  ];

  const handleAdd = (product: Product, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!product.inStock) return;
    const size = selectedSizes[product.id] || product.sizes[0] || "Standard";
    onAddToCart(product, size);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1800);
  };

  const filteredProducts =
    activeCategory === "All"
      ? products
      : products.filter((p) => p.category === activeCategory);

  return (
    <section id="curated-pieces" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Section Header with Real Working Category Filter */}
      <div className="flex flex-col md:flex-row md:items-end justify-between pb-4 sm:pb-6 mb-6 sm:mb-8 border-b border-[#2C2621]/15 gap-4">
        <div>
          <span className="text-[9px] sm:text-[10px] tracking-[0.28em] uppercase text-[#8C7A6B] font-semibold block mb-0.5">
            RII AMOR WARDROBE
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl uppercase tracking-wide text-[#1E1B18]">
            SHOP ALL PIECES ({products.length})
          </h2>
          <p className="text-[11px] sm:text-xs text-[#5C4D3C] tracking-wide mt-1">
            Browse our curated drops. Tap any item to inspect photos and sizing.
          </p>
        </div>

        {/* Real Category Filter Bar */}
        <div className="flex items-center flex-wrap gap-1.5 sm:gap-2 text-xs tracking-wider uppercase font-medium">
          <span className="text-[9px] sm:text-[10px] text-[#8C7A6B] mr-0.5 sm:mr-1 flex items-center gap-1 font-semibold">
            <Filter className="w-3 h-3" /> CATEGORY:
          </span>
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full border transition-all text-[9px] sm:text-[10px] tracking-[0.16em] font-semibold ${
                  isActive
                    ? "bg-[#1E1B18] text-[#FAF7F2] border-[#1E1B18] shadow-xs"
                    : "bg-[#FAF7F2] text-[#5C4D3C] border-[#2C2621]/15 hover:border-[#1E1B18]"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Empty State */}
      {products.length === 0 ? (
        <div className="py-20 text-center rounded-2xl bg-[#EDE5DC]/40 border border-dashed border-[#2C2621]/20 p-8 my-6">
          <p className="text-[10px] tracking-[0.25em] uppercase text-[#8C7A6B] font-semibold mb-2">
            CATALOG IN PROGRESS
          </p>
          <h3 className="font-serif text-lg uppercase text-[#1E1B18] font-light mb-2">
            No Pieces Added Yet
          </h3>
          <p className="text-xs text-[#5C4D3C] max-w-sm mx-auto leading-relaxed">
            Use the Atelier Admin Studio from the footer to upload outfits, sets, and swimwear.
          </p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="py-16 text-center rounded-2xl bg-[#EDE5DC]/30 border border-[#2C2621]/10 p-8 my-6">
          <p className="text-[10px] tracking-[0.2em] uppercase text-[#8C7A6B] font-semibold mb-2">
            NO ITEMS FOUND
          </p>
          <h3 className="font-serif text-base uppercase text-[#1E1B18] font-light mb-2">
            No pieces in this category yet
          </h3>
          <button
            onClick={() => setActiveCategory("All")}
            className="mt-2 px-4 py-1.5 rounded-full bg-[#1E1B18] text-white text-[10px] uppercase tracking-wider font-semibold"
          >
            Show All Pieces
          </button>
        </div>
      ) : (
        /* The Collection Grid: Responsive Cards */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map((product) => {
            const isWishlisted = wishlistIds.includes(product.id);
            const isJustAdded = addedId === product.id;
            const isSoldOut = !product.inStock;

            return (
              <div
                key={product.id}
                onClick={() => onOpenQuickView(product)}
                className={`bg-[#FAF7F2] rounded-xl p-3.5 sm:p-4 border border-[#2C2621]/15 hover:border-[#2C2621]/35 hover:shadow-md transition-all flex flex-col justify-between group shadow-xs cursor-pointer ${
                  isSoldOut ? "opacity-85" : ""
                }`}
              >
                <div>
                  {/* Image Container */}
                  <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-[#EDE5DC] mb-2.5 sm:mb-3 border border-[#2C2621]/10">
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] text-[#8C7A6B] uppercase tracking-wider">
                        No photo
                      </div>
                    )}

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

                    {/* Category Pill Tag */}
                    <div className="absolute bottom-2 left-2 bg-[#1E1B18]/70 text-[#FAF7F2] text-[8px] tracking-[0.16em] uppercase px-2 py-0.5 rounded">
                      {product.category}
                    </div>
                  </div>

                  {/* Title & Price */}
                  <h4 className="font-serif text-sm sm:text-base uppercase font-semibold text-[#1E1B18] mt-1 group-hover:text-[#8C6D46] transition-colors truncate">
                    {product.name}
                  </h4>
                  <div className="font-serif text-sm font-semibold text-[#1E1B18] mt-0.5">
                    {product.price > 0 ? formatNaira(product.price) : "Contact for Price"}
                  </div>

                  {/* Description / Sizes */}
                  {product.description ? (
                    <p className="text-[10px] text-[#736555] line-clamp-2 mt-1">
                      {product.description}
                    </p>
                  ) : null}

                  {product.sizes && product.sizes.length > 0 && (
                    <div className="flex items-center justify-between text-[9px] text-[#8C7A6B] uppercase tracking-wider mt-1.5">
                      <span>Sizes: {product.sizes.join(", ")}</span>
                      {product.inStock && product.quantity !== undefined && product.quantity > 0 && product.quantity <= 5 && (
                        <span className="text-[#992222] font-semibold text-[8px]">
                          Only {product.quantity} left
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="mt-3 pt-2.5 border-t border-[#2C2621]/10 space-y-1.5">
                  {isSoldOut ? (
                    <div className="w-full py-1.5 rounded-full text-[9px] uppercase tracking-wider font-semibold text-center bg-[#EDE5DC] text-[#736555]">
                      OUT OF STOCK
                    </div>
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
      )}
    </section>
  );
}
