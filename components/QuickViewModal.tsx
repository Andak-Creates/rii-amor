"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { X, ShoppingBag, Heart, Check } from "lucide-react";
import { Product } from "@/data/products";
import { formatNaira } from "@/lib/currency";
import { resolveColorNameToHex } from "@/lib/colors";

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, size: string, color?: string) => void;
  onToggleWishlist: (product: Product) => void;
  isWishlisted: boolean;
}

export default function QuickViewModal({
  product,
  onClose,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
}: QuickViewModalProps) {
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [activeImageIdx, setActiveImageIdx] = useState<number>(0);
  const [added, setAdded] = useState(false);

  // Initialize defaults whenever product changes
  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes?.[0] || "Standard");
      if (product.colorVariants && product.colorVariants.length > 0) {
        setSelectedColor(product.colorVariants[0].name);
      } else {
        setSelectedColor("");
      }
      setActiveImageIdx(0);
    }
  }, [product]);

  if (!product) return null;

  // Selected color variant object
  const activeColorVariant = product.colorVariants?.find(
    (cv) => cv.name === selectedColor
  );

  // Build gallery:
  // If a color variant is selected and has images, use those!
  // Otherwise use product.images or [product.image, product.secondaryImage]
  const variantImages =
    activeColorVariant && activeColorVariant.images && activeColorVariant.images.length > 0
      ? activeColorVariant.images
      : null;

  const defaultGallery: string[] =
    product.images && product.images.length > 0
      ? product.images
      : [product.image, product.secondaryImage].filter(
          (u, i, arr) => u && arr.indexOf(u) === i,
        ) as string[];

  const gallery: string[] = variantImages || defaultGallery;

  const currentSize = selectedSize || product.sizes[0] || "Standard";

  const handleColorSelect = (colorName: string) => {
    setSelectedColor(colorName);
    setActiveImageIdx(0);
  };

  const handleAdd = () => {
    onAddToCart(product, currentSize, selectedColor || undefined);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/65 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Dialog with strictly controlled max height */}
      <div className="relative w-full max-w-4xl max-h-[90vh] md:max-h-[85vh] bg-[#FAF7F2] rounded-2xl overflow-hidden border border-[#2C2621]/20 shadow-2xl z-10 flex flex-col md:flex-row animate-scaleUp">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-30 p-1.5 sm:p-2 rounded-full bg-white/90 hover:bg-white text-[#1E1B18] shadow-md border border-[#2C2621]/10 transition-all hover:scale-105"
          aria-label="Close modal"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.5]" />
        </button>

        {/* LEFT COLUMN: Visual Presentation */}
        <div className="relative w-full md:w-1/2 bg-[#EDE5DC] p-3 sm:p-5 flex flex-col justify-between shrink-0 border-b md:border-b-0 md:border-r border-[#2C2621]/15">
          {/* Main Image Frame: tall and prominent across all screen sizes */}
          <div className="relative aspect-[3/4] max-h-[46vh] sm:max-h-[50vh] md:max-h-none md:h-full md:min-h-[340px] w-full rounded-xl overflow-hidden shadow-inner border border-[#2C2621]/10 bg-[#E3D9CC]">
            <Image
              src={gallery[activeImageIdx] || product.image}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-top transition-opacity duration-300"
              priority
            />

            {/* Number Pill - only if explicitly provided */}
            {product.numberLabel ? (
              <div className="absolute top-2.5 left-2.5 bg-[#1E1B18]/85 text-[#FAF7F2] text-[8px] sm:text-[9px] tracking-[0.2em] uppercase px-2.5 py-1 rounded-full font-medium backdrop-blur-xs">
                {product.numberLabel}
              </div>
            ) : null}

            {/* Colorway Badge if variant selected */}
            {selectedColor && (
              <div className="absolute bottom-2.5 left-2.5 bg-[#1E1B18]/85 text-[#FAF7F2] text-[8px] sm:text-[9px] tracking-[0.16em] uppercase px-2.5 py-1 rounded-full font-medium backdrop-blur-xs">
                Color: {selectedColor}
              </div>
            )}
          </div>

          {/* Thumbnail switcher — dynamic gallery strip */}
          <div className="flex gap-2 mt-2.5 sm:mt-3 justify-center shrink-0 overflow-x-auto pb-0.5 scrollbar-none">
            {gallery.map((url, idx) => (
              <button
                key={url + idx}
                type="button"
                onClick={() => setActiveImageIdx(idx)}
                className={`relative shrink-0 w-11 h-11 sm:w-13 sm:h-13 rounded-lg overflow-hidden border-2 transition-all ${
                  activeImageIdx === idx
                    ? "border-[#1E1B18] scale-102 shadow-xs"
                    : "border-transparent opacity-65 hover:opacity-100"
                }`}
              >
                <Image
                  src={url}
                  alt={`View ${idx + 1}`}
                  fill
                  sizes="52px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: Details & Actions with smooth internal scroll */}
        <div className="w-full md:w-1/2 flex flex-col justify-between overflow-hidden bg-[#FAF7F2]">
          {/* Scrollable Details Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 sm:space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                {product.theme && (
                  <span className="text-[8px] sm:text-[9px] tracking-[0.25em] uppercase text-[#8C7A6B] font-semibold">
                    {product.theme}
                  </span>
                )}
                {product.category && (
                  <>
                    <span className="text-[#C5B5A1]">•</span>
                    <span className="text-[8px] sm:text-[9px] tracking-[0.2em] uppercase text-[#5C4D3C]">
                      {product.category}
                    </span>
                  </>
                )}
              </div>

              <h2 className="font-serif text-lg sm:text-2xl uppercase font-semibold text-[#1E1B18] leading-tight">
                {product.name}
              </h2>

              <div className="flex items-center gap-3 mt-1">
                <div className="font-serif text-base sm:text-xl font-medium text-[#1E1B18]">
                  {product.price > 0 ? formatNaira(product.price) : "Contact for Price"}
                </div>
                {!product.inStock ? (
                  <span className="text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-[#992222]/15 text-[#992222]">
                    Sold Out
                  </span>
                ) : product.quantity !== undefined && product.quantity > 0 && product.quantity <= 5 ? (
                  <span className="text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-[#8C6D46]/15 text-[#8C6D46]">
                    Only {product.quantity} Left
                  </span>
                ) : (
                  <span className="text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-[#2A4D33]/15 text-[#2A4D33]">
                    In Stock
                  </span>
                )}
              </div>

              {product.description && product.description.trim() ? (
                <p className="text-[11px] sm:text-xs text-[#736555] tracking-wide mt-2 leading-relaxed">
                  {product.description}
                </p>
              ) : null}
            </div>

            {/* COLORWAYS SELECTOR — Dynamic when product has color variants */}
            {product.colorVariants && product.colorVariants.length > 0 && (
              <div>
                <div className="flex items-center justify-between text-[10px] tracking-wider uppercase text-[#8C7A6B] mb-1.5">
                  <span className="font-semibold">
                    SELECT COLORWAY:{" "}
                    <span className="text-[#1E1B18] font-bold">
                      {selectedColor || "Select"}
                    </span>
                  </span>
                  <span className="text-[9px] text-[#8C7A6B]">
                    {product.colorVariants.length} option{product.colorVariants.length > 1 ? "s" : ""}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {product.colorVariants.map((cv) => {
                    const isSelected = selectedColor === cv.name;
                    return (
                      <button
                        type="button"
                        key={cv.name}
                        onClick={() => handleColorSelect(cv.name)}
                        className={`px-3 py-1.5 rounded-xl text-[10px] sm:text-xs font-medium uppercase border transition-all flex items-center gap-2 ${
                          isSelected
                            ? "bg-[#1E1B18] text-[#FAF7F2] border-[#1E1B18] shadow-xs ring-1 ring-[#1E1B18]"
                            : "bg-[#EDE5DC]/60 text-[#2C2621] border-[#2C2621]/15 hover:border-[#1E1B18]"
                        }`}
                      >
                        {(cv.hex || resolveColorNameToHex(cv.name)) && (
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-black/20 shrink-0"
                            style={{ backgroundColor: resolveColorNameToHex(cv.name) || cv.hex }}
                          />
                        )}
                        <span>{cv.name}</span>
                        {isSelected && <Check className="w-3 h-3 text-[#C99742]" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Composition badge - only if admin provided composition */}
            {product.composition && product.composition.trim() ? (
              <div className="p-2.5 sm:p-3 bg-[#EDE5DC]/70 rounded-xl border border-[#2C2621]/10 text-xs">
                <span className="text-[8px] sm:text-[9px] tracking-[0.2em] uppercase text-[#8C7A6B] block mb-0.5 font-semibold">
                  COMPOSITION & ORIGIN
                </span>
                <span className="text-[10px] sm:text-xs text-[#2C2621] font-medium block">
                  {product.composition}
                </span>
              </div>
            ) : null}

            {/* Sizing */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <div className="flex items-center justify-between text-[10px] tracking-wider uppercase text-[#8C7A6B] mb-1.5">
                  <span className="font-semibold">SELECT SIZE</span>
                </div>

                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {product.sizes.map((size) => (
                    <button
                      type="button"
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`h-7 sm:h-8 px-2.5 sm:px-3 rounded-lg text-[10px] sm:text-xs font-medium uppercase border transition-all ${
                        currentSize === size
                          ? "bg-[#1E1B18] text-[#FAF7F2] border-[#1E1B18] shadow-xs"
                          : "bg-[#EDE5DC]/60 text-[#2C2621] border-[#2C2621]/15 hover:border-[#1E1B18]"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Craftsmanship Highlights - only if admin explicitly added details */}
            {product.details && product.details.length > 0 ? (
              <div className="space-y-1 pt-1 border-t border-[#2C2621]/10 text-[10px] sm:text-[11px] text-[#5C4D3C]">
                <span className="text-[8px] sm:text-[9px] tracking-[0.2em] uppercase text-[#8C7A6B] font-semibold block mb-1">
                  ATELIER SPECIFICATIONS:
                </span>
                <div className="space-y-1 pl-2.5 border-l-2 border-[#C99742]">
                  {product.details.map((detail, idx) => (
                    <p key={idx} className="leading-snug">
                      {detail}
                    </p>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          {/* Sticky Bottom Actions */}
          <div className="p-3.5 sm:p-4 md:p-5 border-t border-[#2C2621]/15 bg-[#F4EFEA] flex items-center gap-2.5 shrink-0">
            {!product.inStock ? (
              <div className="flex-1 py-2.5 sm:py-3 rounded-full text-[10px] sm:text-xs tracking-[0.22em] uppercase font-semibold text-center bg-[#EDE5DC] text-[#736555] border border-[#2C2621]/15">
                OUT OF STOCK
              </div>
            ) : (
              <button
                type="button"
                onClick={handleAdd}
                disabled={added}
                className={`flex-1 py-2.5 sm:py-3 rounded-full text-[10px] sm:text-xs tracking-[0.22em] uppercase font-medium transition-all duration-300 flex items-center justify-center gap-2 border ${
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
                    <span>
                      ADD TO CART • {formatNaira(product.price)}
                    </span>
                  </>
                )}
              </button>
            )}

            <button
              type="button"
              onClick={() => onToggleWishlist(product)}
              className={`p-2.5 sm:p-3 rounded-full border transition-colors ${
                isWishlisted
                  ? "bg-[#8C6D46] text-white border-[#8C6D46]"
                  : "border-[#2C2621]/30 hover:border-[#1E1B18] text-[#1E1B18] bg-white"
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
  );
}
