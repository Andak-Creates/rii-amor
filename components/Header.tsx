"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Heart, Menu, X, Settings } from "lucide-react";

interface HeaderProps {
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenLookbook: () => void;
  onOpenAtelier: () => void;
}

export default function Header({
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenLookbook,
  onOpenAtelier,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#F4EFEA]/95 backdrop-blur-md border-b border-[#2C2621]/15 transition-all">
      {/* Top minimal luxury strip: calm and responsive */}
      <div className="bg-[#1E1B18] text-[#EAE2D7] text-[9px] sm:text-[11px] tracking-[0.2em] uppercase py-1.5 sm:py-2 px-3 sm:px-4 text-center">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="hidden md:flex items-center gap-3 text-[#C5B5A1]">
            <span>FIRENZE ATELIER • VIA DE&apos; TORNABUONI</span>
            <span>•</span>
            <Link
              href="/admin"
              className="text-[#C99742] hover:text-white flex items-center gap-1 transition-colors font-semibold"
            >
              <Settings className="w-3 h-3" />
              <span>ATELIER ADMIN STUDIO</span>
            </Link>
          </div>

          <span className="mx-auto md:mx-0 font-medium truncate">
            COMPLIMENTARY NATIONWIDE EXPRESS OVER ₦250
          </span>

          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={onOpenAtelier}
              className="text-[#C99742] hover:underline"
            >
              BOOK PRIVATE FITTING
            </button>
          </div>
        </div>
      </div>

      {/* Main Bar: Compact, balanced, mobile-optimized */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-3">
        <div className="flex items-center justify-between">
          {/* Left Nav Links for Desktop */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-7 text-[11px] tracking-[0.22em] uppercase font-medium text-[#2C2621] w-1/3">
            <a
              href="#hero"
              className="hover:text-[#8C6D46] transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#8C6D46] hover:after:w-full after:transition-all"
            >
              COLLECTION
            </a>
            <a
              href="#curated-pieces"
              className="hover:text-[#8C6D46] transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#8C6D46] hover:after:w-full after:transition-all"
            >
              SHOP PIECES
            </a>
            <button
              onClick={onOpenLookbook}
              className="hover:text-[#8C6D46] transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#8C6D46] hover:after:w-full after:transition-all"
            >
              LOOKBOOK NO. 4
            </button>
          </nav>

          {/* Left: Mobile hamburger */}
          <div className="lg:hidden flex items-center w-1/4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-[#1E1B18] hover:text-[#8C6D46] transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 stroke-[1.5]" />
              ) : (
                <Menu className="w-5 h-5 stroke-[1.5]" />
              )}
            </button>
          </div>

          {/* CENTER: Transparent Store Logo ONLY — perfectly scaled for mobile and desktop */}
          <div className="flex items-center justify-center flex-1 lg:w-1/3">
            <a
              href="#hero"
              className="group block transition-transform duration-300 hover:scale-[1.03]"
              title="Rii Amor Firenze"
            >
              <div className="relative w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20">
                <Image
                  src="/images/logo-transparent.png"
                  alt="Rii Amor Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </a>
          </div>

          {/* Right Nav Links & Actions */}
          <div className="flex items-center justify-end gap-3 sm:gap-5 w-1/4 lg:w-1/3">
            <nav className="hidden lg:flex items-center gap-6 xl:gap-7 text-[11px] tracking-[0.22em] uppercase font-medium text-[#2C2621]">
              <a
                href="#our-story"
                className="hover:text-[#8C6D46] transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#8C6D46] hover:after:w-full after:transition-all"
              >
                OUR STORY
              </a>
              <button
                onClick={onOpenAtelier}
                className="hover:text-[#8C6D46] transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#8C6D46] hover:after:w-full after:transition-all"
              >
                VISIT US
              </button>
            </nav>

            {/* Wishlist */}
            <button
              onClick={onOpenLookbook}
              className="hidden sm:flex items-center p-1.5 text-[#1E1B18] hover:text-[#8C6D46] transition-colors relative"
              aria-label="Wishlist"
            >
              <Heart className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.5]" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#8C6D46] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-medium">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Shopping Bag Button with count badge matching (3) */}
            <button
              onClick={onOpenCart}
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 rounded-full border border-[#2C2621]/30 bg-[#EDE5DC]/80 hover:bg-[#1E1B18] hover:text-[#FAF7F2] text-[#1E1B18] transition-all group shrink-0"
              aria-label="Open shopping bag"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 stroke-[1.5]" />
                <span className="absolute -top-1.5 -right-2 bg-[#8C6D46] group-hover:bg-[#C99742] text-white text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-medium font-sans">
                  {cartCount}
                </span>
              </div>
              <span className="hidden sm:inline-block text-[10px] tracking-[0.2em] uppercase font-semibold">
                BAG
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#2C2621]/15 bg-[#FAF7F2] px-5 py-4 animate-fadeIn shadow-lg">
          <ul className="space-y-3 text-xs tracking-[0.22em] uppercase font-medium text-[#1E1B18]">
            <li>
              <a
                href="#hero"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-1 hover:text-[#8C6D46]"
              >
                COLLECTION FOCUS
              </a>
            </li>
            <li>
              <a
                href="#curated-pieces"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-1 hover:text-[#8C6D46]"
              >
                SHOP PIECES
              </a>
            </li>
            <li>
              <button
                onClick={() => {
                  onOpenLookbook();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left py-1 hover:text-[#8C6D46]"
              >
                LOOKBOOK NO. 4
              </button>
            </li>
            <li>
              <a
                href="#our-story"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-1 hover:text-[#8C6D46]"
              >
                OUR STORY & CRAFT
              </a>
            </li>
            <li>
              <button
                onClick={() => {
                  onOpenAtelier();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left py-1 hover:text-[#8C6D46]"
              >
                VISIT FLORENCE ATELIER
              </button>
            </li>
            <li className="pt-2 border-t border-[#2C2621]/10">
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 text-[#8C6D46] font-semibold flex items-center justify-between"
              >
                <span>ATELIER ADMIN STUDIO</span>
                <span className="text-xs">⚙</span>
              </Link>
            </li>
          </ul>

          <div className="mt-4 pt-3 border-t border-[#2C2621]/10 text-center text-[9px] tracking-[0.2em] text-[#8C7A6B]">
            VIA DE&apos; TORNABUONI 18, FIRENZE
          </div>
        </div>
      )}
    </header>
  );
}
