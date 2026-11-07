"use client";

import React, { useState } from "react";
import Image from "next/image";
import { X, ArrowRight, ArrowLeft, Sparkles, MapPin, ShoppingBag } from "lucide-react";
import { Product } from "@/data/products";
import { formatNaira } from "@/lib/currency";

interface LookbookModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onOpenQuickView: (product: Product) => void;
  onAddToCart: (product: Product, size: string) => void;
}

export default function LookbookModal({
  isOpen,
  onClose,
  products,
  onOpenQuickView,
  onAddToCart,
}: LookbookModalProps) {
  const [activeSlide, setActiveSlide] = useState(0);

  if (!isOpen) return null;

  const slides = [
    {
      id: "look-01",
      number: "LOOK 01",
      title: "Firenze Sunset on the Arno",
      location: "Piazzale Michelangelo, Florence",
      photographer: "Editorial Archive Milano",
      quote:
        "The drama of low-back bias silk against the terracotta tiles of the Tuscan capital at twilight.",
      image:
        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85",
      featuredProductId: "florence-gown",
      stylingNotes: "Paired with minimal brushed gold ear cuffs and bare neck.",
    },
    {
      id: "look-02",
      number: "LOOK 02",
      title: "Via de' Tornabuoni Safari Tailoring",
      location: "Via de' Tornabuoni & Santa Maria Novella",
      photographer: "Editorial Archive Milano",
      quote:
        "Tailored double-faced virgin wool in graphic cheetah rosettes commands the historic cobblestone avenues.",
      image:
        "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=85",
      featuredProductId: "cheetah-coat",
      stylingNotes: "Layered over high-gauge black ribbed knit and dark sunglasses.",
    },
    {
      id: "look-03",
      number: "LOOK 03",
      title: "Palazzo Corsini Twilight Reception",
      location: "Palazzo Corsini, Lungarno Corsini",
      photographer: "Editorial Archive Milano",
      quote:
        "Sculpted corsetry meets delicate animalier georgette — a masterclass in modern Florentine romance.",
      image:
        "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=1200&q=85",
      featuredProductId: "corset-midi-dress",
      stylingNotes: "Accompanied by the Embossed Python Flap Bag and 90mm pony pumps.",
    },
    {
      id: "look-04",
      number: "LOOK 04",
      title: "Oltrarno Studio Fluidity",
      location: "Oltrarno Artisan Quarter, Florence",
      photographer: "Editorial Archive Milano",
      quote:
        "Habotai silk that catches the Tuscan breeze with natural serpent scale movement.",
      image:
        "https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?auto=format&fit=crop&w=1200&q=85",
      featuredProductId: "python-blouse",
      stylingNotes: "Worn partially unbuttoned with tailored high-rise trousers.",
    },
  ];

  const currentLook = slides[activeSlide];
  const featuredProduct = products.find(
    (p) => p.id === currentLook.featuredProductId
  ) || products[0];

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
              LOOKBOOK NO. 4 — SUNSET IN FIRENZE
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
        <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-12 gap-0">
          {/* Main Visual Frame (7 cols) */}
          <div className="md:col-span-7 relative bg-[#EDE5DC] min-h-[360px] sm:min-h-[480px]">
            <Image
              src={currentLook.image}
              alt={currentLook.title}
              fill
              className="object-cover object-top"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

            {/* Inset Badge */}
            <div className="absolute top-4 left-4 bg-[#FAF7F2]/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[9px] tracking-[0.25em] uppercase font-semibold text-[#1E1B18] border border-[#2C2621]/15">
              {currentLook.number} • ARCHIVE 2026
            </div>

            {/* Location tag */}
            <div className="absolute bottom-4 left-4 right-4 text-white text-xs flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#C99742]" />
              <span className="tracking-wider uppercase text-[10px]">
                {currentLook.location}
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
                {currentLook.title}
              </h3>

              <p className="font-serif italic text-sm text-[#5C4D3C] mt-4 pl-4 border-l-2 border-[#C99742] leading-relaxed">
                "{currentLook.quote}"
              </p>

              <div className="mt-6 text-xs text-[#736555] space-y-2">
                <p>
                  <strong className="text-[#1E1B18] font-medium tracking-wider uppercase text-[10px]">
                    Styling Notes:
                  </strong>{" "}
                  {currentLook.stylingNotes}
                </p>
                <p>
                  <strong className="text-[#1E1B18] font-medium tracking-wider uppercase text-[10px]">
                    Location:
                  </strong>{" "}
                  {currentLook.location}
                </p>
              </div>

              {/* Featured piece preview card */}
              <div className="mt-6 p-4 rounded-xl bg-[#EAE2D7]/70 border border-[#2C2621]/15 flex items-center gap-3.5">
                <div className="relative w-16 h-20 rounded-lg overflow-hidden bg-white shrink-0 border border-[#2C2621]/10">
                  <Image
                    src={featuredProduct.image}
                    alt={featuredProduct.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <span className="text-[9px] tracking-[0.2em] uppercase text-[#8C7A6B] block">
                    FEATURED ATELIER PIECE
                  </span>
                  <h4 className="font-serif text-sm font-semibold uppercase text-[#1E1B18] truncate">
                    {featuredProduct.name}
                  </h4>
                  <div className="font-serif text-sm font-medium text-[#1E1B18] mt-0.5">
                    {formatNaira(featuredProduct.price)}
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => {
                        onClose();
                        onOpenQuickView(featuredProduct);
                      }}
                      className="text-[9px] tracking-[0.15em] uppercase font-semibold text-[#8C6D46] hover:underline"
                    >
                      VIEW PIECE
                    </button>
                    <span className="text-[#C5B5A1]">•</span>
                    <button
                      onClick={() =>
                        onAddToCart(
                          featuredProduct,
                          featuredProduct.sizes[0] || "Standard"
                        )
                      }
                      className="text-[9px] tracking-[0.15em] uppercase font-semibold text-[#1E1B18] hover:text-[#8C6D46]"
                    >
                      ADD TO BAG
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Slide Navigation Controls */}
            <div className="pt-6 mt-6 border-t border-[#2C2621]/15 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveSlide(idx)}
                    className={`h-1.5 rounded-full transition-all ${
                      activeSlide === idx
                        ? "w-8 bg-[#1E1B18]"
                        : "w-2 bg-[#C5B5A1] hover:bg-[#8C7A6B]"
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setActiveSlide(
                      (prev) => (prev - 1 + slides.length) % slides.length
                    )
                  }
                  className="p-2 rounded-full border border-[#2C2621]/20 hover:bg-[#1E1B18] hover:text-[#FAF7F2] text-[#1E1B18] transition-colors"
                  aria-label="Previous look"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() =>
                    setActiveSlide((prev) => (prev + 1) % slides.length)
                  }
                  className="p-2 rounded-full border border-[#2C2621]/20 hover:bg-[#1E1B18] hover:text-[#FAF7F2] text-[#1E1B18] transition-colors"
                  aria-label="Next look"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

