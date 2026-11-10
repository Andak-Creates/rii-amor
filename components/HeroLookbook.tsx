"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Product } from "@/data/products";
import { formatNaira } from "@/lib/currency";

interface HeroLookbookProps {
  onOpenQuickView: (product: Product) => void;
  products: Product[];
}

export default function HeroLookbook({
  onOpenQuickView,
  products,
}: HeroLookbookProps) {
  const [activeLookIndex, setActiveLookIndex] = useState(0);

  // Strictly hero-featured products if marked, else fall back to catalog items
  const heroFeatured = products.filter((p) => Boolean(p.isHeroFeatured));
  const pool = heroFeatured.length > 0 ? heroFeatured : products;

  // Active items for the 3 slots
  const currentHero =
    pool[activeLookIndex % Math.max(pool.length, 1)] || products[0] || null;
  const card1Product = pool[1] || pool[0] || products[0] || null;
  const card2Product = pool[2] || pool[0] || products[0] || null;

  // 3 Thumbnails for the switcher
  const lookSwitcherItems = pool.slice(0, 3);
  while (lookSwitcherItems.length < 3 && pool.length > 0) {
    lookSwitcherItems.push(pool[lookSwitcherItems.length % pool.length]);
  }

  return (
    <section
      id="hero"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-8 sm:pt-6 sm:pb-12"
    >
      {/* Brand Introduction */}
      <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-10">
        <span className="text-[9px] sm:text-[11px] tracking-[0.3em] uppercase text-[#8C7A6B] font-semibold block mb-1">
          RII AMOR
        </span>
        <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl uppercase tracking-wider text-[#1E1B18] font-light">
          FEATURED COLLECTION
        </h1>
        <p className="text-xs sm:text-sm text-[#5C4D3C] tracking-wide mt-2 leading-relaxed max-w-xl mx-auto font-light">
          Trendy sets, swimwear, and statement pieces available for instant
          order.
        </p>

        {/* Call to Actions */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 mt-4 sm:mt-5">
          <a
            href="#curated-pieces"
            className="px-5 sm:px-7 py-2.5 sm:py-3 bg-[#1E1B18] hover:bg-[#2C2621] text-[#FAF7F2] rounded-full text-[11px] sm:text-xs tracking-[0.2em] uppercase font-medium transition-all shadow-sm flex items-center gap-2"
          >
            <span>SHOP COLLECTION</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
          <a
            href="#curated-pieces"
            className="px-5 sm:px-7 py-2.5 sm:py-3 border border-[#2C2621]/30 hover:border-[#1E1B18] bg-white/70 hover:bg-white text-[#1E1B18] rounded-full text-[11px] sm:text-xs tracking-[0.2em] uppercase font-medium transition-all flex items-center gap-2"
          >
            <span>VIEW ALL PIECES</span>
          </a>
        </div>
      </div>

      {/* Main Grid: Balanced 3-panel editorial layout */}
      {currentHero && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
          {/* LEFT COLUMN: Main Feature Showcase */}
          <div className="lg:col-span-6 relative rounded-2xl overflow-hidden bg-[#EDE5DC] min-h-[380px] sm:min-h-[480px] lg:min-h-[540px] border border-[#2C2621]/15 shadow-sm flex flex-col justify-between group">
            {/* Main Photo */}
            <div className="absolute inset-0 z-0">
              {currentHero.image ? (
                <Image
                  src={currentHero.image}
                  alt={currentHero.name}
                  fill
                  className="object-cover object-top transition-transform duration-1000 group-hover:scale-105"
                  priority
                />
              ) : (
                <div className="w-full h-full bg-[#EDE5DC]" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/25"></div>
            </div>

            {/* Top Label */}
            <div className="relative z-10 p-4 sm:p-5 flex items-center justify-between text-white">
              <span className="bg-[#1E1B18]/70 backdrop-blur-md px-2.5 py-1 rounded-full text-[8px] sm:text-[9px] tracking-[0.25em] uppercase font-medium">
                FEATURED SPOTLIGHT
              </span>
              <span className="text-[9px] sm:text-[10px] tracking-wider uppercase text-white/90 font-medium">
                {currentHero.category?.toUpperCase() || "RII AMOR"}
              </span>
            </div>

            {/* Bottom Card: Compact switcher */}
            <div className="relative z-10 p-3.5 sm:p-5 m-3 sm:m-4 bg-[#FAF7F2]/95 backdrop-blur-md rounded-xl border border-[#2C2621]/15 shadow-lg">
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <div>
                  <span className="text-[8px] sm:text-[9px] tracking-[0.2em] uppercase text-[#8C7A6B] block">
                    FEATURED LOOKS
                  </span>
                  <h3 className="font-serif text-sm sm:text-base tracking-[0.15em] uppercase font-semibold text-[#1E1B18]">
                    SPOTLIGHT PIECES
                  </h3>
                </div>
                <a
                  href="#curated-pieces"
                  className="text-[9px] sm:text-[10px] tracking-[0.18em] uppercase font-semibold text-[#8C6D46] hover:text-[#1E1B18] flex items-center gap-1 transition-colors"
                >
                  <span>SEE ALL</span>
                  <ArrowRight className="w-3 h-3" />
                </a>
              </div>

              {/* 3 Interactive Look Switcher Thumbnails */}
              <div className="grid grid-cols-3 gap-2">
                {lookSwitcherItems.map((item, idx) => (
                  <button
                    key={item.id + idx}
                    onClick={() => setActiveLookIndex(idx)}
                    className={`relative aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all ${
                      activeLookIndex === idx
                        ? "border-[#1E1B18] scale-[1.02] shadow-sm"
                        : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    {item.image && (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    )}
                    <div className="absolute inset-0 bg-black/15"></div>
                    <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[8px] font-sans px-1 rounded">
                      0{idx + 1}
                    </span>
                  </button>
                ))}
              </div>

              {/* Product Info Bar */}
              <div className="mt-2.5 pt-2 sm:mt-3 sm:pt-2.5 border-t border-[#2C2621]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="min-w-0">
                  <span className="font-serif text-xs sm:text-sm font-semibold text-[#1E1B18] block truncate max-w-[240px] sm:max-w-xs">
                    {currentHero.name}{" "}
                    {currentHero.price > 0 &&
                      `(${formatNaira(currentHero.price)})`}
                  </span>
                  {currentHero.description ? (
                    <p className="text-[9px] sm:text-[10px] text-[#5C4D3C] truncate max-w-xs">
                      {currentHero.description}
                    </p>
                  ) : null}
                </div>

                <button
                  onClick={() => onOpenQuickView(currentHero)}
                  className="px-3 py-1 bg-[#1E1B18] hover:bg-[#8C6D46] text-white rounded-full text-[8px] sm:text-[9px] tracking-[0.18em] uppercase font-semibold transition-all shrink-0 self-start sm:self-center"
                >
                  VIEW DETAILS →
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Two Full-Height Editorial Spotlight Cards */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 h-full">
            {/* Card 1: Key Look (Dark Full-Bleed Card) */}
            {card1Product && (
              <div
                onClick={() => onOpenQuickView(card1Product)}
                className="relative rounded-2xl overflow-hidden bg-[#EDE5DC] border border-[#2C2621]/15 h-full min-h-[380px] sm:min-h-[480px] lg:min-h-[540px] flex flex-col justify-between p-4 sm:p-5 group cursor-pointer hover:shadow-md transition-all"
              >
                {card1Product.image && (
                  <Image
                    src={card1Product.image}
                    alt={card1Product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent"></div>

                <div className="relative z-10 flex justify-between">
                  <span className="bg-[#FAF7F2]/90 backdrop-blur-sm text-[#1E1B18] text-[8px] tracking-[0.25em] uppercase px-2.5 py-0.5 rounded-full font-semibold">
                    TOP PICK
                  </span>
                </div>

                <div className="relative z-10 text-white">
                  <span className="text-[8px] sm:text-[9px] tracking-[0.25em] uppercase text-[#C5B5A1] block font-semibold">
                    {card1Product.category?.toUpperCase() || "RII AMOR"}
                  </span>
                  <h4 className="font-serif text-base sm:text-lg uppercase font-semibold truncate mt-0.5">
                    {card1Product.name}
                  </h4>

                  {card1Product.description ? (
                    <p className="text-[10px] text-white/90 mt-1 line-clamp-2">
                      {card1Product.description}
                    </p>
                  ) : null}

                  <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-white/20">
                    <span className="font-serif text-sm font-semibold text-[#FAF7F2]">
                      {card1Product.price > 0
                        ? formatNaira(card1Product.price)
                        : "Contact for Price"}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenQuickView(card1Product);
                      }}
                      className="px-2.5 py-0.5 bg-white hover:bg-[#FAF7F2] text-[#1E1B18] text-[8px] tracking-[0.18em] uppercase rounded-full font-bold transition-all"
                    >
                      VIEW →
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Card 2: Curated Piece (Light Luxury Card with tall photo) */}
            {card2Product && (
              <div
                onClick={() => onOpenQuickView(card2Product)}
                className="bg-[#FAF7F2] rounded-2xl p-3.5 sm:p-4 border border-[#2C2621]/15 h-full min-h-[380px] sm:min-h-[480px] lg:min-h-[540px] flex flex-col justify-between hover:shadow-md transition-all group cursor-pointer"
              >
                <div className="flex flex-col flex-1">
                  {/* Expanded image frame taking dominant card height to eliminate empty white space */}
                  <div className="relative w-full flex-1 min-h-[290px] sm:min-h-[360px] lg:min-h-[410px] rounded-xl overflow-hidden bg-[#EDE5DC] mb-2.5 border border-[#2C2621]/10">
                    {card2Product.image && (
                      <Image
                        src={card2Product.image}
                        alt={card2Product.name}
                        fill
                        className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      />
                    )}
                    <span className="absolute top-2 left-2 bg-[#1E1B18]/70 text-white text-[8px] tracking-[0.2em] uppercase px-2 py-0.5 rounded">
                      {card2Product.category?.toUpperCase()}
                    </span>
                  </div>

                  <span className="text-[8px] tracking-[0.2em] uppercase text-[#8C7A6B] block font-semibold">
                    FEATURED
                  </span>
                  <h4 className="font-serif text-sm sm:text-base uppercase font-semibold text-[#1E1B18] truncate mt-0.5">
                    {card2Product.name}
                  </h4>

                  {card2Product.description ? (
                    <p className="text-[10px] text-[#5C4D3C] mt-1 line-clamp-2">
                      {card2Product.description}
                    </p>
                  ) : null}
                </div>

                <div className="pt-2 mt-2 border-t border-[#2C2621]/10 flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-serif font-semibold text-[#1E1B18]">
                    {card2Product.price > 0
                      ? formatNaira(card2Product.price)
                      : "Contact for Price"}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenQuickView(card2Product);
                    }}
                    className="text-[8px] tracking-[0.2em] uppercase font-bold text-[#8C6D46] hover:text-[#1E1B18] flex items-center gap-1"
                  >
                    <span>VIEW</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
