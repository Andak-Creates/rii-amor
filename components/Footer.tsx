"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Lock, Mail } from "lucide-react";

export default function Footer() {
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
        {/* Newsletter Strip */}
        <div className="pb-10 mb-8 border-b border-[#2C2621]/15 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-6">
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#8C7A6B] font-semibold block mb-1">
              NEWSLETTER
            </span>
            <h3 className="font-serif text-2xl uppercase font-light text-[#1E1B18]">
              BE THE FIRST TO KNOW ABOUT NEW DROPS
            </h3>
            <p className="text-xs text-[#736555] tracking-wide mt-1.5">
              Subscribe to get notified the second new pieces drop, plus receive 10% off your first order with code <strong className="text-[#1E1B18]">RII10</strong>.
            </p>
          </div>

          <div className="lg:col-span-6">
            {subscribed ? (
              <div className="p-3.5 bg-[#2A4D33]/10 border border-[#2A4D33]/20 rounded-xl text-xs text-[#2A4D33] flex items-center gap-2 font-medium">
                <Check className="w-4 h-4 shrink-0" />
                <span>You&apos;re subscribed! You&apos;ll be notified whenever new pieces arrive. Code: <strong>RII10</strong></span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <div className="relative flex-1">
                  <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#8C7A6B]" />
                  <input
                    type="email"
                    required
                    placeholder="Enter your email to get drop alerts..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#EDE5DC]/60 border border-[#2C2621]/20 rounded-full pl-11 pr-5 py-2.5 text-xs tracking-wider placeholder:text-[#8C7A6B] focus:outline-none focus:border-[#1E1B18]"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#1E1B18] hover:bg-[#2C2621] text-[#FAF7F2] rounded-full text-xs tracking-[0.2em] uppercase font-medium transition-all flex items-center gap-1.5 shrink-0"
                >
                  <span>SUBSCRIBE</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Center: Transparent Logo */}
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
            RII AMOR • LUXURY RESORT & FASHION
          </span>
        </div>

        {/* Bottom Navigation Row */}
        <div className="pt-6 border-t border-[#2C2621]/15 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] tracking-[0.22em] uppercase font-medium text-[#5C4D3C]">
          <ul className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <li>
              <a href="#curated-pieces" className="hover:text-[#1E1B18] transition-colors">
                SHOP ALL
              </a>
            </li>
            <li>
              <a href="#curated-pieces" className="hover:text-[#1E1B18] transition-colors">
                SETS & SWIMWEAR
              </a>
            </li>
            <li>
              <Link href="/admin" className="text-[#8C6D46] hover:text-[#1E1B18] transition-colors font-semibold flex items-center gap-1">
                <Lock className="w-2.5 h-2.5" />
                <span>ADMIN ACCESS</span>
              </Link>
            </li>
          </ul>

          {/* Social Icons */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#1E1B18] hover:bg-[#8C6D46] text-[#FAF7F2] text-[10px] tracking-[0.2em] uppercase font-semibold transition-all shadow-xs"
            >
              <Lock className="w-3 h-3 text-[#C99742]" />
              <span>ADMIN STUDIO</span>
            </Link>

            <div className="flex items-center gap-2 text-[#1E1B18]">
              {/* Instagram */}
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

              {/* TikTok */}
              <a
                href="https://www.tiktok.com/@rii_amor_?_r=1&_t=ZP-9BCh5tJhQOk"
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 rounded-full bg-[#EDE5DC] hover:bg-[#1E1B18] hover:text-white flex items-center justify-center transition-all"
                aria-label="TikTok"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z" />
                </svg>
              </a>

              {/* Snapchat */}
              <a
                href="https://snapchat.com/t/Gd8wZsHC"
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 rounded-full bg-[#EDE5DC] hover:bg-[#1E1B18] hover:text-white flex items-center justify-center transition-all"
                aria-label="Snapchat"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12.016 2.001c-3.328 0-5.748 2.457-5.748 5.86 0 .762.164 1.742.38 2.348.093.262.126.471.025.688-.119.255-.386.417-.674.524-.467.173-1.222.427-1.577.834-.236.27-.272.585-.1.884.225.39.75.64 1.28.795.344.1.58.267.653.461.1.267-.04.606-.298.918-.466.562-1.222 1.272-1.42 1.94-.131.442.062.88.547 1.242.668.5 1.78.683 2.766.425.432-.113.782-.037 1.01.221.365.414.922 1.135 1.637 1.492.518.258 1.025.367 1.52.367.496 0 1.003-.109 1.52-.367.716-.357 1.272-1.078 1.638-1.492.228-.258.578-.334 1.01-.221.986.258 2.098.075 2.766-.425.485-.362.678-.8.547-1.242-.198-.668-.954-1.378-1.42-1.94-.258-.312-.398-.651-.298-.918.073-.194.309-.361.653-.461.53-.155 1.055-.405 1.28-.795.172-.299.136-.614-.1-.884-.355-.407-1.11-.661-1.577-.834-.288-.107-.555-.269-.674-.524-.101-.217-.068-.426.025-.688.216-.606.38-1.586.38-2.348 0-3.403-2.42-5.86-5.748-5.86z" />
                </svg>
              </a>
            </div>
          </div>

          <div className="text-[#8C7A6B]">
            <span>© RII AMOR. ALL RIGHTS RESERVED.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
