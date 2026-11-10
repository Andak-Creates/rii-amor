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
      desc: "Every animalier motif and print gradient is aligned by hand across lapels, seams, and cuffs for continuous visual harmony.",
    },
    {
      icon: Shield,
      title: "Como Silk & Tuscan Wool",
      desc: "Woven in legacy family-owned mills using double-faced virgin wool and 22-momme pure mulberry silk.",
    },
    {
      icon: HeartHandshake,
      title: "Ethical Craftsmanship",
      desc: "Produced in limited seasonal runs to ensure zero waste and master tailor attention to every stitch.",
    },
    {
      icon: Compass,
      title: "Florentine Heritage",
      desc: "Conceived between the historic stone ateliers of Florence and modern runways for the uncompromising muse.",
    },
  ];

  return (
    <section id="our-story" className="bg-[#EAE2D7]/60 border-y border-[#2C2621]/15 py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Story Heading */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Brand Heraldic Card — Pure Brand Identity, No Stock Photos */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-[#2C2621]/20 shadow-lg bg-[#1E1B18] p-8 sm:p-10 flex flex-col justify-between text-[#FAF7F2]">
              {/* Gold Filigree Accent */}
              <div className="flex items-center justify-between border-b border-[#C99742]/30 pb-4">
                <span className="text-[9px] tracking-[0.35em] uppercase text-[#C99742] font-semibold">
                  ARCHIVIO STORICO
                </span>
                <span className="text-[10px] tracking-widest text-[#8C7A6B]">
                  FIRENZE
                </span>
              </div>

              {/* Central Logo Crest */}
              <div className="my-auto text-center flex flex-col items-center">
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 mb-4">
                  <Image
                    src="/images/logo-transparent.png"
                    alt="Rii Amor Emblem"
                    fill
                    className="object-contain"
                  />
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl uppercase tracking-[0.2em] font-light text-[#FAF7F2]">
                  RII AMOR
                </h3>
                <span className="text-[9px] tracking-[0.3em] uppercase text-[#C99742] mt-1 block">
                  HAUTE ANIMALIER • ATELIER PRIVÉ
                </span>
              </div>

              {/* Bottom Inscription */}
              <div className="border-t border-[#C99742]/30 pt-4 text-center">
                <p className="text-[9.5px] tracking-[0.22em] uppercase text-[#C5B5A1] leading-relaxed">
                  WHERE REFINED WILDNESS MEETS RENAISSANCE ARCHITECTURE
                </p>
                <span className="text-[8px] tracking-[0.25em] text-[#8C7A6B] uppercase block mt-1">
                  VIA DE&apos; TORNABUONI 18, FIRENZE
                </span>
              </div>
            </div>

            {/* Overlapping Small Heritage Badge */}
            <div className="hidden sm:flex absolute -bottom-5 -right-5 w-40 h-40 rounded-2xl bg-[#FAF7F2] border border-[#2C2621]/20 shadow-xl p-4 flex-col justify-between text-center">
              <span className="text-[8px] tracking-[0.25em] uppercase text-[#8C6D46] font-semibold">
                EDIZIONE LIMITATA
              </span>
              <p className="font-serif text-xs uppercase font-medium text-[#1E1B18] leading-snug">
                100% ARTISANAL TAILORING
              </p>
              <span className="text-[7.5px] tracking-[0.18em] text-[#8C7A6B] uppercase">
                ZERO COMPROMISE
              </span>
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
