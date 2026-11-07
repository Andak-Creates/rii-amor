"use client";

import React from "react";
import Image from "next/image";
import { Sparkles, Shield, HeartHandshake, Compass } from "lucide-react";

interface StorySectionProps {
  onOpenAtelier: () => void;
  onOpenLookbook: () => void;
}

export default function StorySection({
  onOpenAtelier,
  onOpenLookbook,
}: StorySectionProps) {
  const pillars = [
    {
      icon: Sparkles,
      title: "Hand-Aligned Rosettes",
      desc: "Every leopard rosette and python gradient is aligned by hand across lapels, seams, and cuffs for continuous visual harmony.",
    },
    {
      icon: Shield,
      title: "Como Silk & Tuscan Wool",
      desc: "Woven in legacy family-owned mills in Lombardy and Tuscany using double-faced virgin wool and 22-momme pure mulberry silk.",
    },
    {
      icon: HeartHandshake,
      title: "Ethical Italian Craft",
      desc: "Produced in limited seasonal runs of fewer than 150 pieces per style to ensure zero waste and master tailor attention.",
    },
    {
      icon: Compass,
      title: "Florentine Heritage",
      desc: "Conceived between the historic stone ateliers of Florence and the modern runways of Milan for the uncompromising muse.",
    },
  ];

  return (
    <section id="our-story" className="bg-[#EAE2D7]/60 border-y border-[#2C2621]/15 py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Story Heading */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-[#2C2621]/20 shadow-lg bg-[#DDD2C4]">
              <Image
                src="https://images.unsplash.com/photo-1543429776-2782fc8e1acd?auto=format&fit=crop&w=1200&q=85"
                alt="Florence Architecture & Atelier Inspiration"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="text-[9px] tracking-[0.3em] uppercase text-[#C5B5A1] block font-semibold">
                  VIA DE' TORNABUONI, FIRENZE
                </span>
                <p className="font-serif text-xl uppercase tracking-wide mt-1">
                  WHERE REFINED WILDNESS MEETS RENAISSANCE ARCHITECTURE
                </p>
              </div>
            </div>

            {/* Overlapping small detail photo */}
            <div className="hidden sm:block absolute -bottom-6 -right-6 w-44 h-44 rounded-xl overflow-hidden border-4 border-[#FAF7F2] shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=600&q=80"
                alt="Silk twill craftsmanship detail"
                fill
                className="object-cover"
              />
            </div>
          </div>

          <div className="lg:col-span-7 lg:pl-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] tracking-[0.35em] uppercase text-[#8C7A6B] font-semibold">
                OUR PHILOSOPHY
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#C99742]"></span>
              <span className="text-[10px] tracking-[0.25em] uppercase text-[#5C4D3C]">
                HAUTE ANIMALIER
              </span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl uppercase font-light text-[#1E1B18] leading-[1.15]">
              ANIMALIER IS NOT A SEASONAL TREND.
              <br />
              <span className="italic font-normal">IT IS AN ITALIAN NEUTRAL.</span>
            </h2>

            <p className="text-xs sm:text-sm text-[#5C4D3C] tracking-wide mt-6 leading-relaxed font-light">
              Founded on the belief that animal print has been cheapened by fast-fashion synthetics,
              <strong className="font-medium text-[#1E1B18]"> Rii Amor</strong> reclaims the primal allure of cheetah, leopard, and python through the lens of uncompromising Florentine tailoring.
            </p>

            <p className="text-xs sm:text-sm text-[#736555] tracking-wide mt-3 leading-relaxed">
              We commission custom hand-screened prints from archival silk mills on Lake Como, pairing them with architectural shoulder cuts, heavyweight bias silks, and structured virgin wool overcoats that demand respect from the streets of Florence to the lounges of Manhattan.
            </p>

            {/* Pillar Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 pt-6 border-t border-[#2C2621]/15">
              {pillars.map((pillar) => {
                const Icon = pillar.icon;
                return (
                  <div key={pillar.title} className="p-3.5 bg-[#FAF7F2]/80 rounded-xl border border-[#2C2621]/10">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className="w-3.5 h-3.5 text-[#8C6D46]" />
                      <h4 className="font-serif text-sm uppercase font-semibold text-[#1E1B18]">
                        {pillar.title}
                      </h4>
                    </div>
                    <p className="text-[11px] text-[#736555] leading-relaxed">
                      {pillar.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Atelier CTA buttons */}
            <div className="flex flex-wrap items-center gap-3 mt-8">
              <button
                onClick={onOpenAtelier}
                className="px-6 py-2.5 bg-[#1E1B18] hover:bg-[#2C2621] text-[#FAF7F2] rounded-full text-xs tracking-[0.2em] uppercase font-medium transition-all shadow-sm"
              >
                BOOK ATELIER VISIT
              </button>
              <button
                onClick={onOpenLookbook}
                className="px-6 py-2.5 border border-[#2C2621]/30 hover:border-[#1E1B18] bg-transparent text-[#1E1B18] rounded-full text-xs tracking-[0.2em] uppercase font-medium transition-all"
              >
                VIEW LOOKBOOK ARCHIVES
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

