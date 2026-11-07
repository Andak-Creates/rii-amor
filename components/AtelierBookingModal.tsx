"use client";

import React, { useState } from "react";
import { X, Check, MapPin } from "lucide-react";

interface AtelierBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AtelierBookingModal({
  isOpen,
  onClose,
}: AtelierBookingModalProps) {
  const [location, setLocation] = useState<"florence" | "newyork">("florence");
  const [service, setService] = useState("Private Collection Preview");
  const [date, setDate] = useState("2026-11-12");
  const [time, setTime] = useState("14:30");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/65 backdrop-blur-sm transition-opacity"
      />

      <div className="relative w-full max-w-2xl bg-[#FAF7F2] rounded-2xl overflow-hidden border border-[#2C2621]/20 shadow-2xl z-10">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#2C2621]/15 bg-[#F4EFEA] flex items-center justify-between">
          <div>
            <span className="text-[9px] tracking-[0.3em] uppercase text-[#8C7A6B] block">
              HAUTE ATELIER SERVICES
            </span>
            <h2 className="font-serif text-lg sm:text-xl tracking-[0.15em] uppercase font-semibold text-[#1E1B18]">
              SCHEDULE A PRIVATE APPOINTMENT
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#EDE5DC] text-[#1E1B18] transition-colors"
          >
            <X className="w-5 h-5 stroke-[1.5]" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center">
            <div className="w-14 h-14 rounded-full bg-[#2A4D33]/10 text-[#2A4D33] flex items-center justify-center mx-auto mb-4">
              <Check className="w-7 h-7" />
            </div>
            <h3 className="font-serif text-2xl uppercase font-semibold text-[#1E1B18]">
              APPOINTMENT RESERVED
            </h3>
            <p className="text-xs text-[#5C4D3C] tracking-wide mt-2 max-w-md mx-auto leading-relaxed">
              We look forward to welcoming you at our{" "}
              {location === "florence"
                ? "Florence Atelier on Via de' Tornabuoni"
                : "New York Showroom on Madison Avenue"}
              . Your personal stylist concierge will confirm your date via email.
            </p>
            <div className="mt-6 p-4 bg-[#EDE5DC]/60 rounded-xl max-w-sm mx-auto text-xs text-[#2C2621] space-y-1">
              <p>
                <strong>Date:</strong> {date} at {time}
              </p>
              <p>
                <strong>Experience:</strong> {service}
              </p>
            </div>
            <button
              onClick={() => {
                setSubmitted(false);
                onClose();
              }}
              className="mt-6 px-8 py-2.5 bg-[#1E1B18] text-[#FAF7F2] rounded-full text-xs tracking-[0.2em] uppercase font-medium hover:bg-[#8C6D46] transition-colors"
            >
              CLOSE
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
            {/* Location selector */}
            <div>
              <label className="text-[10px] tracking-[0.25em] uppercase text-[#8C7A6B] block mb-2 font-semibold">
                SELECT ATELIER LOCATION
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setLocation("florence")}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    location === "florence"
                      ? "border-[#1E1B18] bg-[#EDE5DC] shadow-xs"
                      : "border-[#2C2621]/15 bg-white hover:border-[#1E1B18]"
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-xs font-semibold uppercase text-[#1E1B18]">
                    <MapPin className="w-3.5 h-3.5 text-[#C99742]" />
                    <span>Firenze Atelier</span>
                  </div>
                  <p className="text-[10px] text-[#8C7A6B] mt-0.5">
                    Via de&apos; Tornabuoni 18, Florence
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setLocation("newyork")}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    location === "newyork"
                      ? "border-[#1E1B18] bg-[#EDE5DC] shadow-xs"
                      : "border-[#2C2621]/15 bg-white hover:border-[#1E1B18]"
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-xs font-semibold uppercase text-[#1E1B18]">
                    <MapPin className="w-3.5 h-3.5 text-[#C99742]" />
                    <span>New York Showroom</span>
                  </div>
                  <p className="text-[10px] text-[#8C7A6B] mt-0.5">
                    Madison Avenue & 68th, NYC
                  </p>
                </button>
              </div>
            </div>

            {/* Experience type */}
            <div>
              <label className="text-[10px] tracking-[0.25em] uppercase text-[#8C7A6B] block mb-2 font-semibold">
                CONSULTATION TYPE
              </label>
              <select
                value={service}
                onChange={(e) => setService(e.target.value)}
                className="w-full bg-white border border-[#2C2621]/20 rounded-xl px-4 py-2.5 text-xs tracking-wider uppercase text-[#1E1B18] focus:outline-none focus:border-[#1E1B18]"
              >
                <option value="Private Collection Preview">
                  Private Collection Preview & Champagne Reception
                </option>
                <option value="Bespoke Animalier Tailoring">
                  Bespoke Animalier Tailoring & Made-to-Measure
                </option>
                <option value="Florence Gown Fitting">
                  Florence Silk Gown & Eveningwear Fitting
                </option>
                <option value="VIP Wardrobe Styling">
                  Full Seasonal Wardrobe Styling Consultation
                </option>
              </select>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] tracking-[0.25em] uppercase text-[#8C7A6B] block mb-1.5 font-semibold">
                  PREFERRED DATE
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-white border border-[#2C2621]/20 rounded-xl px-3 py-2 text-xs text-[#1E1B18] focus:outline-none focus:border-[#1E1B18]"
                />
              </div>

              <div>
                <label className="text-[10px] tracking-[0.25em] uppercase text-[#8C7A6B] block mb-1.5 font-semibold">
                  PREFERRED TIME
                </label>
                <input
                  type="time"
                  required
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full bg-white border border-[#2C2621]/20 rounded-xl px-3 py-2 text-xs text-[#1E1B18] focus:outline-none focus:border-[#1E1B18]"
                />
              </div>
            </div>

            {/* Contact details */}
            <div className="space-y-3 pt-2">
              <div>
                <label className="text-[10px] tracking-[0.25em] uppercase text-[#8C7A6B] block mb-1 font-semibold">
                  FULL NAME
                </label>
                <input
                  type="text"
                  required
                  placeholder="Countess Alessandra Moretti"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white border border-[#2C2621]/20 rounded-xl px-4 py-2 text-xs text-[#1E1B18] focus:outline-none focus:border-[#1E1B18]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] tracking-[0.25em] uppercase text-[#8C7A6B] block mb-1 font-semibold">
                    EMAIL ADDRESS
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="client@riamoor.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white border border-[#2C2621]/20 rounded-xl px-4 py-2 text-xs text-[#1E1B18] focus:outline-none focus:border-[#1E1B18]"
                  />
                </div>
                <div>
                  <label className="text-[10px] tracking-[0.25em] uppercase text-[#8C7A6B] block mb-1 font-semibold">
                    TELEPHONE
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+39 055 123 4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-white border border-[#2C2621]/20 rounded-xl px-4 py-2 text-xs text-[#1E1B18] focus:outline-none focus:border-[#1E1B18]"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-4 py-3 bg-[#1E1B18] hover:bg-[#2C2621] text-[#FAF7F2] rounded-full text-xs tracking-[0.25em] uppercase font-medium transition-all shadow-md"
            >
              CONFIRM ATELIER RESERVATION
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

