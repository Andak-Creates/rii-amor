"use client";

import React, { useState } from "react";
import Image from "next/image";
import { X, ArrowRight, ArrowLeft, Sparkles, ShoppingBag } from "lucide-react";
import { Product } from "@/data/products";
import { formatNaira } from "@/lib/currency";

interface LookbookModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onOpenQuickView: (product: Product) => void;
  onAddToCart?: (product: Product, size: string) => void;
}

export default function LookbookModal({
  isOpen,
  onClose,
  products,
  onOpenQuickView,
}: LookbookModalProps) {
  const [activeSlide, setActiveSlide] = useState(0);

  if (!isOpen) return null;

  const hasProducts = products.length > 0;
  const currentProduct = hasProducts ? products[activeSlide % products.length] : null;

  const handleNext = () => {
    if (products.length > 0) {
      setActiveSlide((prev) => (prev + 1) % products.length);
    }
  };

  const handlePrev = () => {
    if (products.length > 0) {
      setActiveSlide((prev) => (prev - 1 + products.length) % products.length);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity"
      />

      {/* Main Container */}
      <div className="relative w-full max-w-5xl bg-[#FAF7F2] rounded-2xl overflow-hidden border border-[#2C2621]/20 shadow-2xl z-10 flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-[#2C2621]/15 bg-[#F4EFEA] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#8C7A6B] font-semibold">
              COLLECTION EDITORIAL
            </span>
            <span className="text-[#C5B5A1]">•</span>
            <h2 className="font-serif text-base sm:text-lg tracking-[0.18em] uppercase font-semibold text-[#1E1B18]">
              LOOKBOOK NO. 4 — ARCHIVIO PRIVATO
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#EDE5DC] text-[#1E1B18] transition-colors"
            aria-label="Close lookbook"
          >
            <X className="w-5 h-5 stroke-[1.5]" />
          </button>
        </div>

        {/* Content Body */}
        {hasProducts && currentProduct ? (
          <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-12 gap-0">
            {/* Main Visual Frame (7 cols) */}
            <div className="md:col-span-7 relative bg-[#EDE5DC] min-h-[360px] sm:min-h-[480px]">
              <Image
                src={currentProduct.image}
                alt={currentProduct.name}
                fill
                className="object-cover object-top"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

              {/* Inset Badge */}
              <div className="absolute top-4 left-4 bg-[#FAF7F2]/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[9px] tracking-[0.25em] uppercase font-semibold text-[#1E1B18] border border-[#2C2621]/15">
                {currentProduct.numberLabel || `LOOK 0${(activeSlide % products.length) + 1}`}
              </div>

              {/* Theme tag */}
              <div className="absolute bottom-4 left-4 right-4 text-white text-xs flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#C99742]" />
                <span className="tracking-wider uppercase text-[10px]">
                  {currentProduct.theme} • {currentProduct.category}
                </span>
              </div>
            </div>

            {/* Editorial Notes & Shop Piece (5 cols) */}
            <div className="md:col-span-5 p-6 sm:p-8 flex flex-col justify-between bg-[#FAF7F2]">
              <div>
                <div className="text-[9px] tracking-[0.3em] uppercase text-[#8C7A6B] font-semibold mb-1">
                  CURATED COMPOSITION
                </div>

                <h3 className="font-serif text-2xl uppercase font-light text-[#1E1B18]">
                  {currentProduct.name}
                </h3>

                {currentProduct.description ? (
                  <p className="font-serif italic text-sm text-[#5C4D3C] mt-4 pl-4 border-l-2 border-[#C99742] leading-relaxed">
                    &ldquo;{currentProduct.description}&rdquo;
                  </p>
                ) : null}

                <div className="mt-6 text-xs text-[#736555] space-y-2">
                  {currentProduct.composition ? (
                    <p>
                      <strong className="text-[#1E1B18] font-medium tracking-wider uppercase text-[10px]">
                        Composition:
                      </strong>{" "}
                      {currentProduct.composition}
                    </p>
                  ) : null}
                  {currentProduct.sizes && currentProduct.sizes.length > 0 && (
                    <p>
                      <strong className="text-[#1E1B18] font-medium tracking-wider uppercase text-[10px]">
                        Available Sizes:
                      </strong>{" "}
                      {currentProduct.sizes.join(", ")}
                    </p>
                  )}
                </div>

                {/* Featured piece preview card */}
                <div className="mt-6 p-4 rounded-xl bg-[#EAE2D7]/70 border border-[#2C2621]/15 flex items-center gap-3.5">
                  <div className="relative w-16 h-20 rounded-lg overflow-hidden bg-white shrink-0 border border-[#2C2621]/10">
                    <Image
                      src={currentProduct.image}
                      alt={currentProduct.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] tracking-wider uppercase text-[#8C7A6B] block">
                      ARCHIVAL PIECE
                    </span>
                    <h4 className="font-serif text-sm uppercase font-semibold text-[#1E1B18] truncate">
                      {currentProduct.name}
                    </h4>
                    <span className="font-serif text-sm font-semibold text-[#1E1B18] block mt-0.5">
                      {formatNaira(currentProduct.price)}
                    </span>
                  </div>

                  <button
                    onClick={() => onOpenQuickView(currentProduct)}
                    className="p-2.5 rounded-full bg-[#1E1B18] text-white hover:bg-[#8C6D46] transition-colors shrink-0 shadow-xs"
                    title="Quick View"
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Navigation Controls */}
              <div className="mt-8 pt-4 border-t border-[#2C2621]/15 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrev}
                    disabled={products.length <= 1}
                    className="p-2 rounded-full border border-[#2C2621]/20 hover:border-[#1E1B18] text-[#1E1B18] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    aria-label="Previous look"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={products.length <= 1}
                    className="p-2 rounded-full border border-[#2C2621]/20 hover:border-[#1E1B18] text-[#1E1B18] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    aria-label="Next look"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <span className="text-[10px] tracking-widest text-[#8C7A6B] uppercase font-semibold">
                  0{(activeSlide % products.length) + 1} / 0{products.length}
                </span>

                <button
                  onClick={() => onOpenQuickView(currentProduct)}
                  className="px-4 py-2 bg-[#1E1B18] hover:bg-[#8C6D46] text-[#FAF7F2] rounded-full text-[10px] tracking-[0.2em] uppercase font-semibold transition-all"
                >
                  VIEW DOSSIER
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Empty state when no products yet */
          <div className="py-24 text-center px-6 flex flex-col items-center justify-center">
            <div className="relative w-16 h-16 mb-4 opacity-40">
              <Image
                src="/images/logo-transparent.png"
                alt="Rii Amor"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#8C7A6B] font-semibold block mb-2">
              ARCHIVE IN PREPARATION
            </span>
            <h3 className="font-serif text-xl uppercase font-light text-[#1E1B18] mb-2">
              Lookbook No. 4 Is Currently Empty
            </h3>
            <p className="text-xs text-[#5C4D3C] max-w-sm leading-relaxed mb-6">
              When you add pieces via the Atelier Studio, they will dynamically appear in this high-editorial lookbook gallery.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-[#1E1B18] text-white rounded-full text-xs tracking-[0.2em] uppercase font-semibold"
            >
              CLOSE GALLERY
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
