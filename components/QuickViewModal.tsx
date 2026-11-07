"use client";

import React, { useState } from "react";
import Image from "next/image";
import { X, ShoppingBag, Heart, Check, Sparkles, Ruler } from "lucide-react";
import { Product } from "@/data/products";
import { formatNaira } from "@/lib/currency";

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, size: string) => void;
  onToggleWishlist: (product: Product) => void;
  isWishlisted: boolean;
  onOpenAtelier: () => void;
}

export default function QuickViewModal({
  product,
  onClose,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
  onOpenAtelier,
}: QuickViewModalProps) {
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [activeImage, setActiveImage] = useState<"primary" | "secondary">("primary");
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const currentSize = selectedSize || product.sizes[0] || "Standard";

  const handleAdd = () => {
    onAddToCart(product, currentSize);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-3xl bg-[#FAF7F2] rounded-2xl overflow-hidden border border-[#2C2621]/20 shadow-2xl z-10 animate-scaleUp">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 hover:bg-white text-[#1E1B18] shadow-sm transition-all"
          aria-label="Close modal"
        >
          <X className="w-5 h-5 stroke-[1.5]" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left: Image gallery */}
          <div className="relative bg-[#EDE5DC] p-6 flex flex-col justify-between">
            <div className="relative aspect-[4/5] w-full rounded-xl overflow-hidden shadow-inner border border-[#2C2621]/10">
              <Image
                src={
                  activeImage === "primary"
                    ? product.image
                    : product.secondaryImage
                }
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>

            {/* Thumbnail switcher */}
            <div className="flex gap-2.5 mt-3 justify-center">
              <button
                onClick={() => setActiveImage("primary")}
                className={`relative w-14 h-16 rounded-md overflow-hidden border-2 transition-all ${
                  activeImage === "primary"
                    ? "border-[#1E1B18]"
                    : "border-transparent opacity-70 hover:opacity-100"
                }`}
              >
                <Image
                  src={product.image}
                  alt="Primary view"
                  fill
                  className="object-cover"
                />
              </button>
              <button
                onClick={() => setActiveImage("secondary")}
                className={`relative w-14 h-16 rounded-md overflow-hidden border-2 transition-all ${
                  activeImage === "secondary"
                    ? "border-[#1E1B18]"
                    : "border-transparent opacity-70 hover:opacity-100"
                }`}
              >
                <Image
                  src={product.secondaryImage}
                  alt="Detail view"
                  fill
                  className="object-cover"
                />
              </button>
            </div>
          </div>

          {/* Right: Product details */}
          <div className="p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[9px] tracking-[0.3em] uppercase text-[#8C7A6B] font-semibold">
                  {product.theme}
                </span>
                <span className="text-[#C5B5A1]">•</span>
                <span className="text-[9px] tracking-[0.2em] uppercase text-[#5C4D3C]">
                  ARCHIVAL EDITION
                </span>
              </div>

              <h2 className="font-serif text-2xl uppercase font-semibold text-[#1E1B18]">
                {product.name}
              </h2>

              <div className="font-serif text-xl font-medium text-[#1E1B18] mt-1.5">
                {formatNaira(product.price)}
              </div>

              <p className="text-xs text-[#736555] tracking-wide mt-3 leading-relaxed">
                {product.description}
              </p>

              {/* Composition badge */}
              <div className="mt-4 p-3 bg-[#EDE5DC]/60 rounded-xl border border-[#2C2621]/10 text-xs">
                <span className="text-[9px] tracking-[0.25em] uppercase text-[#8C7A6B] block mb-1 font-semibold">
                  COMPOSITION & ORIGIN
                </span>
                <span className="text-xs text-[#2C2621] font-medium">
                  {product.composition}
                </span>
              </div>

              {/* Sizing */}
              {product.sizes.length > 1 && (
                <div className="mt-5">
                  <div className="flex items-center justify-between text-xs tracking-wider uppercase text-[#8C7A6B] mb-2">
                    <span>SELECT SIZE</span>
                    <button
                      onClick={onOpenAtelier}
                      className="text-[10px] text-[#8C6D46] hover:underline flex items-center gap-1"
                    >
                      <Ruler className="w-3 h-3" />
                      <span>ATELIER SIZING CONCIERGE</span>
                    </button>
                  </div>

                  <div className="flex gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`h-9 px-3.5 rounded-lg text-xs font-medium uppercase border transition-all ${
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

              {/* Craftsmanship Highlights */}
              <ul className="mt-4 space-y-1.5 text-[11px] text-[#5C4D3C]">
                {product.details.map((detail, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-[#C99742]">•</span>
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Actions */}
            <div className="pt-6 mt-6 border-t border-[#2C2621]/15 flex items-center gap-3">
              <button
                onClick={handleAdd}
                disabled={added}
                className={`flex-1 py-3 rounded-full text-xs tracking-[0.25em] uppercase font-medium transition-all duration-300 flex items-center justify-center gap-2 border ${
                  added
                    ? "bg-[#2A4D33] text-white border-[#2A4D33]"
                    : "bg-[#1E1B18] hover:bg-[#2C2621] text-[#FAF7F2] border-[#1E1B18] shadow-sm"
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>ADDED TO BAG</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>ADD TO CART</span>
                  </>
                )}
              </button>

              <button
                onClick={() => onToggleWishlist(product)}
                className={`p-3 rounded-full border transition-colors ${
                  isWishlisted
                    ? "bg-[#8C6D46] text-white border-[#8C6D46]"
                    : "border-[#2C2621]/30 hover:border-[#1E1B18] text-[#1E1B18]"
                }`}
                aria-label="Wishlist"
              >
                <Heart
                  className={`w-4 h-4 ${isWishlisted ? "fill-current" : ""}`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

