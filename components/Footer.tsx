"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

interface FooterProps {
  onOpenAtelier: () => void;
  onOpenLookbook: () => void;
}

export default function Footer({ onOpenAtelier, onOpenLookbook }: FooterProps) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
    }
  };

  return (
    <footer className="bg-[#FAF7F2] border-t border-[#2C2621]/15 text-[#1E1B18] pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* VIP Newsletter Strip */}
        <div className="pb-10 mb-8 border-b border-[#2C2621]/15 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-6">
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#8C7A6B] font-semibold block mb-1">
              THE INNER CIRCLE
            </span>
            <h3 className="font-serif text-2xl uppercase font-light text-[#1E1B18]">
              PRIVATE LOOKBOOK PREVIEWS & 10% PRIVILEGE
            </h3>
            <p className="text-xs text-[#736555] tracking-wide mt-1.5">
              Enter code <strong className="text-[#1E1B18]">RII10</strong> at checkout for 10% off your first Florentine acquisition.
            </p>
          </div>

          <div className="lg:col-span-6">
            {subscribed ? (
              <div className="p-3.5 bg-[#2A4D33]/10 border border-[#2A4D33]/20 rounded-xl text-xs text-[#2A4D33] flex items-center gap-2 font-medium">
                <Check className="w-4 h-4 shrink-0" />
                <span>Benvenuta! Code <strong>RII10</strong> has been activated for your first order.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  required
                  placeholder="Enter your email address..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-[#EDE5DC]/60 border border-[#2C2621]/20 rounded-full px-5 py-2.5 text-xs tracking-wider placeholder:text-[#8C7A6B] focus:outline-none focus:border-[#1E1B18]"
                />
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#1E1B18] hover:bg-[#2C2621] text-[#FAF7F2] rounded-full text-xs tracking-[0.2em] uppercase font-medium transition-all flex items-center gap-1.5 shrink-0"
                >
                  <span>JOIN</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Center: Transparent Logo ONLY */}
        <div className="flex flex-col items-center justify-center text-center mb-8">
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 mb-2">
            <Image
              src="/images/logo-transparent.png"
              alt="Rii Amor"
              fill
              className="object-contain"
            />
          </div>
          <span className="text-[10px] tracking-[0.35em] uppercase text-[#8C7A6B]">
            VIA DE&apos; TORNABUONI, FIRENZE • HAUTE ANIMALIER
          </span>
        </div>

        {/* Bottom Navigation Row Matching Reference */}
        <div className="pt-6 border-t border-[#2C2621]/15 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] tracking-[0.22em] uppercase font-medium text-[#5C4D3C]">
          <ul className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <li>
              <a href="#our-story" className="hover:text-[#1E1B18] transition-colors">
                ABOUT US
              </a>
            </li>
            <li>
              <button onClick={onOpenAtelier} className="hover:text-[#1E1B18] transition-colors">
                CAREERS
              </button>
            </li>
            <li>
              <button onClick={onOpenLookbook} className="hover:text-[#1E1B18] transition-colors">
                PRESS
              </button>
            </li>
            <li>
              <button onClick={onOpenAtelier} className="hover:text-[#1E1B18] transition-colors">
                CONTACT
              </button>
            </li>
            <li>
              <a href="#terms" className="hover:text-[#1E1B18] transition-colors">
                TERMS & CONDITIONS
              </a>
            </li>
            <li>
              <Link href="/admin" className="text-[#8C6D46] hover:text-[#1E1B18] transition-colors font-semibold">
                ADMIN STUDIO
              </Link>
            </li>
          </ul>

          {/* Social Icons - Instagram Only */}
          <div className="flex items-center gap-3 text-[#1E1B18]">
            <a
              href="https://www.instagram.com/rii_amor_?vrfl=MTlicHVjbzA3b2Zxeg=="
              target="_blank"
              rel="noopener noreferrer"
              className="w-7 h-7 rounded-full bg-[#EDE5DC] hover:bg-[#1E1B18] hover:text-white flex items-center justify-center transition-all"
              aria-label="Instagram"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
          </div>

          <div className="text-[#8C7A6B]">
            <span>© RII AMOR. ALL RIGHTS RESERVED.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
