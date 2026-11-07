"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Compass, Sparkles, ArrowRight } from "lucide-react";
import { Product } from "@/data/products";
import { formatNaira } from "@/lib/currency";

interface HeroLookbookProps {
  onOpenLookbook: () => void;
  onOpenQuickView: (product: Product) => void;
  onSelectTheme: (theme: "Modern Muse" | "City Safari" | "Timeless Textures" | "All") => void;
  activeTheme: string;
  products: Product[];
}

export default function HeroLookbook({
  onOpenLookbook,
  onOpenQuickView,
  onSelectTheme,
  activeTheme,
  products,
}: HeroLookbookProps) {
  const [activeLookIndex, setActiveLookIndex] = useState(0);

  // Looks for the hero preview
  const heroLooks = [
    {
      id: 1,
      tag: "LOOK 01",
      title: "Firenze Sunset Slip Gown",
      location: "Piazzale Michelangelo",
      image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85",
      productId: "florence-gown",
      fabricNote: "22-Momme Heavyweight Silk Charmeuse",
    },
    {
      id: 2,
      tag: "LOOK 02",
      title: "Cheetah Wool Overcoat",
      location: "Via de' Tornabuoni",
      image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=85",
      productId: "cheetah-coat",
      fabricNote: "Tuscan Double-Faced Virgin Wool",
    },
    {
      id: 3,
      tag: "LOOK 03",
      title: "Habotai Python Blouse",
      location: "Oltrarno Studio",
      image: "https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?auto=format&fit=crop&w=1200&q=85",
      productId: "python-blouse",
      fabricNote: "100% Italian Silk Habotai & Pearl Buttons",
    },
  ];

  const currentHero = heroLooks[activeLookIndex];
  const featuredProduct = products.find((p) => p.id === currentHero.productId) || products[0];
  const cheetahCoat = products.find((p) => p.id === "cheetah-coat") || products[1];
  const pythonBag = products.find((p) => p.id === "python-bag") || products[3];

  return (
    <section id="hero" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-8 sm:pt-6 sm:pb-12">
      {/* Brand Introduction: Punchy, tight, clear */}
      <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-10">
        <span className="text-[9px] sm:text-[11px] tracking-[0.3em] uppercase text-[#8C7A6B] font-semibold block mb-1">
          AUTUMN / WINTER 2026 • FIRENZE ATELIER
        </span>
        <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl uppercase tracking-wider text-[#1E1B18] font-light">
          CURATED COLLECTION FOCUS
        </h1>
        <p className="text-xs sm:text-sm text-[#5C4D3C] tracking-wide mt-2 leading-relaxed max-w-xl mx-auto font-light">
          A modern study in Italian animalier. Hand-screened leopard silks, tailored virgin wool coats, and artisanal python leather.
        </p>

        {/* Clear Call to Actions */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 mt-4 sm:mt-5">
          <a
            href="#curated-pieces"
            className="px-5 sm:px-7 py-2.5 sm:py-3 bg-[#1E1B18] hover:bg-[#2C2621] text-[#FAF7F2] rounded-full text-[11px] sm:text-xs tracking-[0.2em] uppercase font-medium transition-all shadow-sm flex items-center gap-2"
          >
            <span>SHOP COLLECTION</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
          <button
            onClick={onOpenLookbook}
            className="px-5 sm:px-7 py-2.5 sm:py-3 border border-[#2C2621]/30 hover:border-[#1E1B18] bg-white/70 hover:bg-white text-[#1E1B18] rounded-full text-[11px] sm:text-xs tracking-[0.2em] uppercase font-medium transition-all flex items-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C99742]" />
            <span>LOOKBOOK NO. 4</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Fully Responsive */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
        {/* LEFT COLUMN: Editorial Lifestyle Showcase */}
        <div className="lg:col-span-6 relative rounded-2xl overflow-hidden bg-[#EDE5DC] min-h-[380px] sm:min-h-[480px] lg:min-h-[540px] border border-[#2C2621]/15 shadow-sm flex flex-col justify-between group">
          {/* Main Photo */}
          <div className="absolute inset-0 z-0">
            <Image
              src={currentHero.image}
              alt={currentHero.title}
              fill
              className="object-cover object-top transition-transform duration-1000 group-hover:scale-105"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/25"></div>
          </div>

          {/* Top Label */}
          <div className="relative z-10 p-4 sm:p-5 flex items-center justify-between text-white">
            <span className="bg-[#1E1B18]/70 backdrop-blur-md px-2.5 py-1 rounded-full text-[8px] sm:text-[9px] tracking-[0.25em] uppercase font-medium">
              EDITORIAL CAMPAIGN
            </span>
            <span className="text-[9px] sm:text-[10px] tracking-wider uppercase text-white/90">
              {currentHero.location}
            </span>
          </div>

          {/* Bottom Card: Compact on mobile */}
          <div className="relative z-10 p-3.5 sm:p-5 m-3 sm:m-4 bg-[#FAF7F2]/95 backdrop-blur-md rounded-xl border border-[#2C2621]/15 shadow-lg">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div>
                <span className="text-[8px] sm:text-[9px] tracking-[0.2em] uppercase text-[#8C7A6B] block">
                  CAPSULE ARCHIVE
                </span>
                <h3 className="font-serif text-sm sm:text-base tracking-[0.15em] uppercase font-semibold text-[#1E1B18]">
                  LOOKBOOK NO. 4
                </h3>
              </div>
              <button
                onClick={onOpenLookbook}
                className="text-[9px] sm:text-[10px] tracking-[0.18em] uppercase font-semibold text-[#8C6D46] hover:text-[#1E1B18] flex items-center gap-1 transition-colors"
              >
                <span>OPEN GALLERY</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* 3 Interactive Look Switcher Thumbnails */}
            <div className="grid grid-cols-3 gap-2">
              {heroLooks.map((look, idx) => (
                <button
                  key={look.id}
                  onClick={() => setActiveLookIndex(idx)}
                  className={`relative aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all ${
                    activeLookIndex === idx
                      ? "border-[#1E1B18] scale-[1.02] shadow-sm"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={look.image}
                    alt={look.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/15"></div>
                  <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[8px] font-sans px-1 rounded">
                    0{idx + 1}
                  </span>
                </button>
              ))}
            </div>

            {/* Specs bar */}
            <div className="mt-2.5 pt-2 sm:mt-3 sm:pt-2.5 border-t border-[#2C2621]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div>
                <span className="font-serif text-xs sm:text-sm font-semibold text-[#1E1B18] block">
                  {featuredProduct.name} ({formatNaira(featuredProduct.price)})
                </span>
                <p className="text-[9px] sm:text-[10px] text-[#5C4D3C] truncate max-w-xs">{currentHero.fabricNote}</p>
              </div>

              <button
                onClick={() => onOpenQuickView(featuredProduct)}
                className="px-3 py-1 bg-[#1E1B18] hover:bg-[#8C6D46] text-white rounded-full text-[8px] sm:text-[9px] tracking-[0.18em] uppercase font-semibold transition-all shrink-0 self-start sm:self-center"
              >
                INSPECT SPECS →
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Highlights */}
        <div className="lg:col-span-6 flex flex-col justify-between gap-4 sm:gap-5">
          {/* Top Row: Cheetah Coat + Heritage Prints */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 flex-1">
            {/* Card 1: Cheetah Coat */}
            <div
              onClick={() => onOpenQuickView(cheetahCoat)}
              className="relative rounded-2xl overflow-hidden bg-[#EDE5DC] border border-[#2C2621]/15 min-h-[240px] sm:min-h-[280px] flex flex-col justify-between p-4 group cursor-pointer hover:shadow-md transition-all"
            >
              <Image
                src={cheetahCoat.image}
                alt="Cheetah Overcoat in Florence"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent"></div>

              <div className="relative z-10 flex justify-between">
                <span className="bg-[#FAF7F2]/90 backdrop-blur-sm text-[#1E1B18] text-[8px] tracking-[0.25em] uppercase px-2.5 py-0.5 rounded-full font-semibold">
                  KEY COAT
                </span>
              </div>

              <div className="relative z-10 text-white">
                <span className="text-[8px] sm:text-[9px] tracking-[0.25em] uppercase text-[#C5B5A1] block font-semibold">
                  TUSCAN VIRGIN WOOL
                </span>
                <h4 className="font-serif text-base sm:text-lg uppercase font-semibold">
                  CHEETAH COAT
                </h4>

                <p className="text-[10px] text-white/90 mt-1">
                  75% Virgin Wool, 5% Cashmere • Tailored structured shoulders
                </p>

                <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/20">
                  <span className="font-serif text-sm font-semibold text-[#FAF7F2]">
                    {formatNaira(cheetahCoat.price)}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenQuickView(cheetahCoat);
                    }}
                    className="px-2.5 py-0.5 bg-white hover:bg-[#FAF7F2] text-[#1E1B18] text-[8px] tracking-[0.18em] uppercase rounded-full font-bold transition-all"
                  >
                    INSPECT →
                  </button>
                </div>
              </div>
            </div>

            {/* Card 2: HERITAGE PRINTS: Python and Cheetah */}
            <div
              onClick={() => onOpenQuickView(pythonBag)}
              className="bg-[#FAF7F2] rounded-2xl p-4 sm:p-5 border border-[#2C2621]/15 flex flex-col justify-between hover:shadow-md transition-all group cursor-pointer"
            >
              <div>
                <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-[#EDE5DC] mb-2.5 border border-[#2C2621]/10">
                  <Image
                    src={pythonBag.image}
                    alt="Heritage Prints: Python and Cheetah"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-2 left-2 bg-[#1E1B18]/70 text-white text-[8px] tracking-[0.2em] uppercase px-2 py-0.5 rounded">
                    LEATHER GOODS
                  </span>
                </div>

                <span className="text-[8px] tracking-[0.2em] uppercase text-[#8C7A6B] block">
                  HERITAGE PRINTS:
                </span>
                <h4 className="font-serif text-sm sm:text-base uppercase font-semibold text-[#1E1B18]">
                  Embossed Python Flap Bag
                </h4>

                <p className="text-[10px] text-[#5C4D3C] mt-1 line-clamp-2">
                  Full-grain embossed calfskin with brushed antique brass hardware. Made in Florence.
                </p>
              </div>

              <div className="pt-2.5 mt-2.5 border-t border-[#2C2621]/10 flex items-center justify-between">
                <span className="text-xs sm:text-sm font-serif font-semibold text-[#1E1B18]">
                  {formatNaira(pythonBag.price)}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenQuickView(pythonBag);
                  }}
                  className="text-[8px] tracking-[0.2em] uppercase font-bold text-[#8C6D46] hover:text-[#1E1B18] flex items-center gap-1"
                >
                  <span>SPECS</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Row: STYLE COMPASS Theme Selector */}
          <div className="bg-[#EAE2D7]/80 rounded-2xl p-4 sm:p-5 border border-[#2C2621]/15 relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Compass className="w-3.5 h-3.5 text-[#8C6D46]" />
                <h4 className="font-serif text-xs sm:text-sm tracking-[0.18em] uppercase font-semibold text-[#1E1B18]">
                  STYLE COMPASS
                </h4>
              </div>
              {activeTheme !== "All" && (
                <button
                  onClick={() => onSelectTheme("All")}
                  className="text-[9px] text-[#8C6D46] underline hover:text-[#1E1B18]"
                >
                  Reset
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                {
                  id: "Modern Muse" as const,
                  title: "Modern Muse",
                  desc: "Fluid silks & slip gowns",
                },
                {
                  id: "City Safari" as const,
                  title: "City Safari",
                  desc: "Tailored wool coats & trousers",
                },
                {
                  id: "Timeless Textures" as const,
                  title: "Timeless Textures",
                  desc: "Python bags & pony pumps",
                },
              ].map((theme) => {
                const isSelected = activeTheme === theme.id;
                return (
                  <button
                    key={theme.id}
                    onClick={() =>
                      onSelectTheme(
                        isSelected ? "All" : theme.id
                      )
                    }
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? "bg-[#1E1B18] text-[#FAF7F2] border-[#1E1B18] shadow-xs"
                        : "bg-[#FAF7F2] hover:bg-white text-[#2C2621] border-[#2C2621]/15"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold uppercase tracking-wider">
                        {theme.title}
                      </span>
                      <span className="text-xs">{isSelected ? "✓" : "→"}</span>
                    </div>
                    <p
                      className={`text-[9px] mt-0.5 leading-tight ${
                        isSelected ? "text-[#C5B5A1]" : "text-[#736555]"
                      }`}
                    >
                      {theme.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
