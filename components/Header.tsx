"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ShoppingBag, Heart, Menu, X } from "lucide-react";

interface HeaderProps {
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenLookbook?: () => void;
  onOpenAtelier?: () => void;
}

export default function Header({
  cartCount,
  wishlistCount,
  onOpenCart,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#F4EFEA]/95 backdrop-blur-md border-b border-[#2C2621]/15 transition-all">
      {/* Promo strip */}
      <div className="bg-[#1E1B18] text-[#EAE2D7] text-[9px] sm:text-[11px] tracking-[0.2em] uppercase py-1.5 sm:py-2 px-3 sm:px-4 text-center">
        <span className="font-medium">
          FREE NATIONWIDE DELIVERY ON ORDERS OVER ₦250,000
        </span>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-3">
        <div className="flex items-center justify-between">
          {/* Left Nav — Desktop */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-[11px] tracking-[0.22em] uppercase font-medium text-[#2C2621] w-1/3">
            <a
              href="#hero"
              className="hover:text-[#8C6D46] transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#8C6D46] hover:after:w-full after:transition-all"
            >
              NEW IN
            </a>
            <a
              href="#curated-pieces"
              className="hover:text-[#8C6D46] transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#8C6D46] hover:after:w-full after:transition-all"
            >
              SHOP ALL
            </a>
            <a
              href="#curated-pieces"
              className="text-[#8C6D46] hover:text-[#1E1B18] transition-colors py-1 font-semibold relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#1E1B18] hover:after:w-full after:transition-all"
            >
              SETS
            </a>
          </nav>

          {/* Mobile hamburger */}
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

          {/* Centre: Logo */}
          <div className="flex items-center justify-center flex-1 lg:w-1/3">
            <a
              href="#hero"
              className="group block transition-transform duration-300 hover:scale-[1.03]"
              title="Rii Amor"
            >
              <div className="relative w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20">
                <Image
                  src="/images/logo-transparent.png"
                  alt="Rii Amor Logo"
                  fill
                  sizes="80px"
                  className="object-contain"
                  priority
                />
              </div>
            </a>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center justify-end gap-3 sm:gap-5 w-1/4 lg:w-1/3">
            {/* Desktop right nav */}
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-[11px] tracking-[0.22em] uppercase font-medium text-[#2C2621]">
              <a
                href="#curated-pieces"
                className="hover:text-[#8C6D46] transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#8C6D46] hover:after:w-full after:transition-all"
              >
                SWIMWEAR
              </a>
              <a
                href="#curated-pieces"
                className="hover:text-[#8C6D46] transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#8C6D46] hover:after:w-full after:transition-all"
              >
                JUMPSUITS
              </a>
            </nav>

            {/* Wishlist icon */}
            <button
              className="hidden sm:flex items-center p-1.5 text-[#1E1B18] hover:text-[#8C6D46] transition-colors relative"
              aria-label="Saved items"
            >
              <Heart className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.5]" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#8C6D46] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-medium">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Bag */}
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

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#2C2621]/15 bg-[#FAF7F2] px-5 py-4 animate-fadeIn shadow-lg">
          <ul className="space-y-3 text-xs tracking-[0.22em] uppercase font-medium text-[#1E1B18]">
            <li>
              <a
                href="#hero"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-1 hover:text-[#8C6D46]"
              >
                NEW IN
              </a>
            </li>
            <li>
              <a
                href="#curated-pieces"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-1 hover:text-[#8C6D46]"
              >
                SHOP ALL
              </a>
            </li>
            <li>
              <a
                href="#curated-pieces"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-1 text-[#8C6D46] font-semibold"
              >
                SETS
              </a>
            </li>
            <li>
              <a
                href="#curated-pieces"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-1 hover:text-[#8C6D46]"
              >
                SWIMWEAR
              </a>
            </li>
            <li>
              <a
                href="#curated-pieces"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-1 hover:text-[#8C6D46]"
              >
                JUMPSUITS
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
