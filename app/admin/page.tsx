"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  Plus,
  Trash2,
  Edit,
  Check,
  ArrowLeft,
  RefreshCw,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  ShoppingBag,
  Camera,
} from "lucide-react";
import { Product } from "@/data/products";
import {
  formatNaira,
  formatNumberWithCommas,
  parseFormattedNumber,
} from "@/lib/currency";

// High-end curated presets
const CURATED_IMAGE_PRESETS: {
  name: string;
  url: string;
  theme: "Modern Muse" | "City Safari" | "Timeless Textures";
  composition: string;
  category: "outerwear" | "tops" | "dresses" | "accessories" | "footwear";
}[] = [
  {
    name: "Cheetah Wool Coat",
    url: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=85",
    theme: "City Safari",
    composition: "75% Virgin Wool, 20% Polyamide, 5% Cashmere",
    category: "outerwear",
  },
  {
    name: "Firenze Sunset Leopard Gown",
    url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=85",
    theme: "Modern Muse",
    composition: "100% Mulberry Silk Charmeuse",
    category: "dresses",
  },
  {
    name: "Python Print Silk Blouse",
    url: "https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?auto=format&fit=crop&w=900&q=85",
    theme: "Modern Muse",
    composition: "100% Italian Silk Habotai",
    category: "tops",
  },
  {
    name: "Embossed Python Flap Bag",
    url: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=85",
    theme: "Timeless Textures",
    composition: "100% Calfskin Leather • Brushed Brass",
    category: "accessories",
  },
];

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // File upload state
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [formData, setFormData] = useState<{
    name: string;
    subtitle: string;
    numberLabel: string;
    price: number | string;
    category: "outerwear" | "tops" | "dresses" | "accessories" | "footwear";
    theme: "Modern Muse" | "City Safari" | "Timeless Textures";
    image: string;
    secondaryImage: string;
    description: string;
    composition: string;
    detailsText: string;
    sizes: string[];
    inStock: boolean;
    isHeroFeatured: boolean;
  }>({
    name: "",
    subtitle: "Florence Atelier Collection",
    numberLabel: "",
    price: "",
    category: "outerwear",
    theme: "Modern Muse",
    image: CURATED_IMAGE_PRESETS[0].url,
    secondaryImage: CURATED_IMAGE_PRESETS[0].url,
    description: "",
    composition: "100% Italian Silk Charmeuse",
    detailsText:
      "Hand-finished in Florence atelier\nArchival animalier print placement\n100% Italian sustainable tailoring",
    sizes: ["XS", "S", "M", "L"],
    inStock: true,
    isHeroFeatured: false,
  });

  const [previewMode, setPreviewMode] = useState<"card" | "dossier">("card");

  // Fetch live products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/products");
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      console.error("Failed to load products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const showNotification = (type: "success" | "error", text: string) => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage(null), 3500);
  };

  // Auto-fill numberLabel
  const handleNameChange = (nameVal: string) => {
    const nextNum = editingId
      ? formData.numberLabel
      : `${products.length + 1}. ${nameVal.toUpperCase()}`;

    setFormData((prev) => ({
      ...prev,
      name: nameVal,
      numberLabel: prev.numberLabel && editingId ? prev.numberLabel : nextNum,
    }));
  };

  // Device File Upload Handler (camera / laptop file / phone gallery)
  const handleDeviceFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const body = new FormData();
      body.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body,
      });

      if (res.ok) {
        const data = await res.json();
        setFormData((prev) => ({
          ...prev,
          image: data.url,
          secondaryImage: data.url,
        }));
        showNotification("success", "Photo uploaded from device successfully!");
      } else {
        showNotification("error", "Failed to upload image. Please try again.");
      }
    } catch (err) {
      console.error(err);
      showNotification("error", "Error uploading file.");
    } finally {
      setIsUploading(false);
    }
  };

  // Quick Restock Toggle
  const handleToggleStock = async (product: Product) => {
    const newStockState = !product.inStock;
    try {
      const res = await fetch("/api/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: product.id,
          inStock: newStockState,
        }),
      });

      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) =>
            p.id === product.id ? { ...p, inStock: newStockState } : p,
          ),
        );
        showNotification(
          "success",
          newStockState
            ? `Restocked "${product.name}" on the storefront!`
            : `Marked "${product.name}" as Sold Out on the storefront.`,
        );
      }
    } catch (err) {
      console.error(err);
      showNotification("error", "Failed to update stock status.");
    }
  };

  // Delete product
  const handleDelete = async (id: string, name: string) => {
    if (
      !confirm(`Are you sure you want to remove "${name}" from the storefront?`)
    ) {
      return;
    }

    try {
      const res = await fetch(`/api/products?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        showNotification("success", `Removed "${name}" from the storefront.`);
        if (editingId === id) resetForm();
        fetchProducts();
      }
    } catch (err) {
      console.error(err);
      showNotification("error", "Failed to remove piece.");
    }
  };

  // Toggle size
  const toggleSize = (size: string) => {
    setFormData((prev) => {
      const exists = prev.sizes.includes(size);
      const updated = exists
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size];
      return { ...prev, sizes: updated };
    });
  };

  // Save Piece
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      showNotification("error", "Please provide a name for this piece.");
      return;
    }
    if (!formData.price || parseFormattedNumber(String(formData.price)) <= 0) {
      showNotification("error", "Please specify a valid price.");
      return;
    }

    const detailsArray = formData.detailsText
      .split("\n")
      .map((d) => d.trim())
      .filter((d) => d.length > 0);

    const payload = {
      ...formData,
      price: parseFormattedNumber(String(formData.price)),
      details: detailsArray,
      id: editingId || undefined,
    };

    try {
      const method = editingId ? "PUT" : "POST";
      const res = await fetch("/api/products", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        showNotification(
          "success",
          editingId
            ? `Updated "${formData.name}" on the storefront!`
            : `Published "${formData.name}" to the storefront!`,
        );
        resetForm();
        fetchProducts();
      } else {
        showNotification("error", "Failed to save piece. Please check inputs.");
      }
    } catch (err) {
      console.error(err);
      showNotification("error", "Network error while saving.");
    }
  };

  // Load into form for editing
  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      subtitle: product.subtitle,
      numberLabel: product.numberLabel || "",
      price: formatNumberWithCommas(product.price),
      category: product.category,
      theme: product.theme,
      image: product.image,
      secondaryImage: product.secondaryImage || product.image,
      description: product.description,
      composition: product.composition,
      detailsText: product.details.join("\n"),
      sizes: product.sizes,
      inStock: product.inStock,
      isHeroFeatured: Boolean(product.isHeroFeatured),
    });
    window.scrollTo({ top: 120, behavior: "smooth" });
    showNotification("success", `Editing "${product.name}"`);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name: "",
      subtitle: "Florence Atelier Collection",
      numberLabel: "",
      price: "",
      category: "outerwear",
      theme: "Modern Muse",
      image: CURATED_IMAGE_PRESETS[0].url,
      secondaryImage: CURATED_IMAGE_PRESETS[0].url,
      description: "",
      composition: "100% Italian Silk Charmeuse",
      detailsText:
        "Hand-finished in Florence atelier\nArchival animalier print placement\n100% Italian sustainable tailoring",
      sizes: ["XS", "S", "M", "L"],
      inStock: true,
      isHeroFeatured: false,
    });
  };

  const livePreviewProduct: Product = {
    id: editingId || "preview-piece",
    numberLabel:
      formData.numberLabel ||
      `${products.length + 1}. ${(formData.name || "UNTITLED PIECE").toUpperCase()}`,
    name: formData.name || "Untitled Archival Piece",
    subtitle: formData.subtitle || "Florentine Edition",
    price: parseFormattedNumber(String(formData.price)) || 185000,
    category: formData.category,
    theme: formData.theme,
    image: formData.image || CURATED_IMAGE_PRESETS[0].url,
    secondaryImage:
      formData.secondaryImage || formData.image || CURATED_IMAGE_PRESETS[0].url,
    description:
      formData.description ||
      "An iconic statement piece crafted from double-faced Italian fabrics with artisanal animalier print placement.",
    details: formData.detailsText
      .split("\n")
      .map((d) => d.trim())
      .filter((d) => d.length > 0),
    composition: formData.composition || "100% Italian Silk",
    sizes: formData.sizes.length > 0 ? formData.sizes : ["Standard"],
    inStock: formData.inStock,
    isHeroFeatured: formData.isHeroFeatured,
  };

  return (
    <div className="min-h-screen bg-[#F4EFEA] text-[#1E1B18] font-sans selection:bg-[#C99742]/30">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#2C2621]/15 px-3 sm:px-8 py-2.5 sm:py-3 flex items-center justify-between">
        {/* Left: Logo and Titles */}
        <div className="flex items-center gap-2.5">
          <div className="relative w-7 h-7 sm:w-8 sm:h-8 shrink-0">
            <Image
              src="/images/logo-transparent.png"
              alt="Rii Amor Logo"
              fill
              className="object-contain"
              priority
            />
          </div>

          <div>
            {/* Hidden on mobile, shown on tablet/desktop */}
            <h1 className="hidden sm:block font-serif text-sm uppercase tracking-wider font-semibold text-[#1E1B18]">
              ATELIER PRODUCT STUDIO
            </h1>

            {/* Subtitle: "Rii Amor • " is hidden on mobile; "Inventory & Storefront Control" remains visible */}
            <span className="text-[9px] sm:text-[9.5px] tracking-[0.16em] sm:tracking-[0.2em] text-[#8C7A6B] uppercase block">
              <span className="hidden sm:inline">Rii Amor • </span>
              <span>Inventory & Storefront Control</span>
            </span>
          </div>
        </div>

        {/* Right: Connected Badge & Single Storefront Button (Duplicate removed) */}
        <div className="flex items-center gap-2.5">
          <span className="text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-full bg-[#2A4D33]/10 text-[#2A4D33] font-medium hidden md:inline-block">
            ● Connected ({products.length} Pieces)
          </span>

          <Link
            href="/"
            className="flex items-center gap-1.5 text-[10px] sm:text-[11px] tracking-wider uppercase font-semibold text-[#FAF7F2] bg-[#1E1B18] hover:bg-[#8C6D46] px-3 sm:px-4 py-1.5 rounded-full transition-all shadow-xs shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>View Storefront</span>
          </Link>
        </div>
      </header>

      {/* Floating Notification Toast */}
      {statusMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-full text-xs tracking-wider uppercase font-medium shadow-2xl flex items-center gap-2 border animate-bounce ${
            statusMessage.type === "success"
              ? "bg-[#2A4D33] text-white border-[#2A4D33]"
              : "bg-[#992222] text-white border-[#992222]"
          }`}
        >
          {statusMessage.type === "success" ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : (
            <AlertCircle className="w-4 h-4" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Guidance Banner */}
        <div className="bg-[#EAE2D7]/80 rounded-2xl p-4 sm:p-5 mb-6 sm:mb-8 border border-[#2C2621]/15 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <Sparkles className="w-4 h-4 text-[#8C6D46]" />
              <h2 className="font-serif text-base sm:text-lg tracking-wide uppercase font-semibold text-[#1E1B18]">
                FLORENTINE ATELIER PRODUCT CREATOR
              </h2>
            </div>
            <p className="text-xs text-[#5C4D3C] max-w-2xl leading-relaxed">
              Upload photos directly from your device, restock or remove
              existing pieces, and see changes instantly on the storefront.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {editingId && (
              <button
                onClick={resetForm}
                className="px-3 py-1.5 border border-[#2C2621]/30 rounded-full text-xs tracking-wider uppercase text-[#1E1B18] hover:bg-white transition-colors"
              >
                Cancel Edit
              </button>
            )}
            <button
              onClick={fetchProducts}
              className="p-2 border border-[#2C2621]/20 rounded-full hover:bg-white text-[#736555] transition-colors"
              title="Refresh catalog"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 2-COLUMN WORKSPACE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          {/* LEFT COLUMN: THE FORM (7 cols) */}
          <div className="lg:col-span-7 bg-[#FAF7F2] rounded-2xl p-5 sm:p-7 border border-[#2C2621]/15 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#2C2621]/10 pb-3 mb-5">
              <div>
                <span className="text-[9px] tracking-[0.25em] uppercase text-[#8C7A6B] font-semibold block">
                  {editingId
                    ? "UPDATING EXISTING PIECE"
                    : "NEW COLLECTION ITEM"}
                </span>
                <h3 className="font-serif text-lg sm:text-xl uppercase font-semibold text-[#1E1B18]">
                  {editingId
                    ? `Edit: ${formData.name}`
                    : "Add an Item to the Wardrobe"}
                </h3>
              </div>

              {editingId && (
                <span className="px-2.5 py-0.5 bg-[#C99742]/20 text-[#8C6D46] rounded-full text-[9px] font-semibold uppercase tracking-wider">
                  Editing
                </span>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* SECTION 1: IDENTITY */}
              <div>
                <h4 className="text-xs tracking-[0.2em] uppercase font-semibold text-[#8C6D46] mb-2.5">
                  1. BASIC IDENTITY
                </h4>

                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] tracking-wider uppercase text-[#8C7A6B] block mb-1 font-semibold">
                      PIECE NAME *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Cheetah Wool Cape or Python Silk Kimono"
                      value={formData.name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      className="w-full bg-white border border-[#2C2621]/20 rounded-xl px-3.5 py-2 text-xs font-medium text-[#1E1B18] placeholder:text-[#8C7A6B] focus:outline-none focus:border-[#1E1B18]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] tracking-wider uppercase text-[#8C7A6B] block mb-1 font-semibold">
                        SUBTITLE / CAPSULE TAG
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Tuscan Outerwear Edition"
                        value={formData.subtitle}
                        onChange={(e) =>
                          setFormData({ ...formData, subtitle: e.target.value })
                        }
                        className="w-full bg-white border border-[#2C2621]/20 rounded-xl px-3.5 py-2 text-xs text-[#1E1B18] focus:outline-none focus:border-[#1E1B18]"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] tracking-wider uppercase text-[#8C7A6B] block mb-1 font-semibold">
                        PRICE (₦ NAIRA) *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#1E1B18] pointer-events-none">₦</span>
                        <input
                          type="text"
                          inputMode="numeric"
                          required
                          placeholder="e.g. 219,000"
                          value={
                            typeof formData.price === "number"
                              ? formatNumberWithCommas(formData.price)
                              : (formData.price as string)
                          }
                          onChange={(e) => {
                            const raw = e.target.value.replace(/[^0-9]/g, "");
                            const formatted = formatNumberWithCommas(raw);
                            setFormData({ ...formData, price: formatted });
                          }}
                          className="w-full bg-white border border-[#2C2621]/20 rounded-xl pl-7 pr-3.5 py-2 text-xs font-semibold text-[#1E1B18] focus:outline-none focus:border-[#1E1B18]"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] tracking-wider uppercase text-[#8C7A6B] block mb-1 font-semibold">
                      NUMBER LABEL
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 9. TUSCAN CHEETAH CAPE"
                      value={formData.numberLabel}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          numberLabel: e.target.value,
                        })
                      }
                      className="w-full bg-white border border-[#2C2621]/20 rounded-xl px-3.5 py-2 text-xs text-[#1E1B18] focus:outline-none focus:border-[#1E1B18]"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: DEVICE PHOTO UPLOAD */}
              <div className="pt-4 border-t border-[#2C2621]/10">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs tracking-[0.2em] uppercase font-semibold text-[#8C6D46] flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5" />
                    <span>2. PHOTO FROM YOUR DEVICE</span>
                  </h4>
                  <span className="text-[9px] text-[#8C7A6B]">
                    Camera or local files
                  </span>
                </div>

                {/* Direct File Upload Box */}
                <div className="bg-white border-2 border-dashed border-[#2C2621]/20 rounded-2xl p-4 sm:p-5 text-center hover:border-[#1E1B18] transition-all">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleDeviceFileUpload}
                    className="hidden"
                    id="device-photo-upload"
                  />

                  <div className="flex flex-col items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-[#EDE5DC] text-[#1E1B18] flex items-center justify-center mb-2">
                      <UploadCloud className="w-5 h-5" />
                    </div>

                    <label
                      htmlFor="device-photo-upload"
                      className="cursor-pointer px-4 py-2 bg-[#1E1B18] hover:bg-[#8C6D46] text-white rounded-full text-[10px] tracking-wider uppercase font-semibold transition-all shadow-xs"
                    >
                      {isUploading
                        ? "Uploading photo..."
                        : "Choose Photo from Device"}
                    </label>

                    <p className="text-[10px] text-[#8C7A6B] mt-2">
                      Works on mobile phones (camera/gallery) or laptops (PNG,
                      JPG, WEBP)
                    </p>
                  </div>
                </div>

                {/* Current Image Preview & Presets fallback */}
                <div className="mt-3 flex items-center gap-3 bg-[#EDE5DC]/60 p-2.5 rounded-xl border border-[#2C2621]/10">
                  <div className="relative w-12 h-14 rounded-lg overflow-hidden bg-white shrink-0 border border-[#2C2621]/15">
                    <Image
                      src={formData.image}
                      alt="Active preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] tracking-wider uppercase text-[#8C7A6B] block">
                      CURRENT PHOTO
                    </span>
                    <p className="text-[10px] text-[#1E1B18] truncate font-medium">
                      {formData.image.startsWith("/uploads/")
                        ? "Uploaded from your device ✓"
                        : formData.image}
                    </p>
                  </div>
                </div>

                {/* Quick Presets */}
                <div className="mt-2.5">
                  <span className="text-[9px] text-[#8C7A6B] uppercase font-semibold tracking-wider block mb-1">
                    Or select a curated preset:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                    {CURATED_IMAGE_PRESETS.map((p) => (
                      <button
                        type="button"
                        key={p.name}
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            image: p.url,
                            theme: p.theme,
                            composition: p.composition,
                            name: prev.name || p.name,
                          }))
                        }
                        className="p-1.5 rounded-lg border border-[#2C2621]/15 bg-white text-left hover:border-[#1E1B18] transition-colors"
                      >
                        <span className="text-[9px] font-medium block truncate text-[#1E1B18]">
                          {p.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* SECTION 3: THEME & CATEGORY */}
              <div className="pt-4 border-t border-[#2C2621]/10">
                <h4 className="text-xs tracking-[0.2em] uppercase font-semibold text-[#8C6D46] mb-2">
                  3. THEME & CATEGORY
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3">
                  {[
                    {
                      id: "Modern Muse" as const,
                      title: "Modern Muse",
                      desc: "Fluid silks & gowns",
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
                    const isSelected = formData.theme === theme.id;
                    return (
                      <button
                        type="button"
                        key={theme.id}
                        onClick={() =>
                          setFormData({ ...formData, theme: theme.id })
                        }
                        className={`p-2.5 rounded-xl border text-left transition-all ${
                          isSelected
                            ? "bg-[#1E1B18] text-[#FAF7F2] border-[#1E1B18] shadow-xs"
                            : "bg-white hover:bg-[#EDE5DC] text-[#2C2621] border-[#2C2621]/15"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-semibold uppercase">
                            {theme.title}
                          </span>
                          {isSelected && (
                            <Check className="w-3 h-3 text-[#C99742]" />
                          )}
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

              {/* SECTION 4: FABRIC & COMPOSITION */}
              <div className="pt-4 border-t border-[#2C2621]/10">
                <h4 className="text-xs tracking-[0.2em] uppercase font-semibold text-[#8C6D46] mb-1">
                  4. FABRIC & COMPOSITION
                </h4>
                <input
                  type="text"
                  placeholder="e.g. 100% Italian Silk Habotai • Mother of Pearl buttons"
                  value={formData.composition}
                  onChange={(e) =>
                    setFormData({ ...formData, composition: e.target.value })
                  }
                  className="w-full bg-white border border-[#2C2621]/20 rounded-xl px-3.5 py-2 text-xs font-medium text-[#1E1B18] focus:outline-none focus:border-[#1E1B18] mb-1.5"
                />
              </div>

              {/* SECTION 5: TAILORING DETAILS (BULLET POINTS) */}
              <div className="pt-4 border-t border-[#2C2621]/10">
                <h4 className="text-xs tracking-[0.2em] uppercase font-semibold text-[#8C6D46] mb-1">
                  5. TAILORING SPECS (1 PER LINE)
                </h4>
                <textarea
                  rows={3}
                  placeholder={`Hand-finished in Florence atelier\nDouble-faced virgin wool blend\nHorn button closures with silk lining`}
                  value={formData.detailsText}
                  onChange={(e) =>
                    setFormData({ ...formData, detailsText: e.target.value })
                  }
                  className="w-full bg-white border border-[#2C2621]/20 rounded-xl p-3 text-xs text-[#1E1B18] focus:outline-none focus:border-[#1E1B18] leading-relaxed"
                />
              </div>

              {/* SECTION 6: SIZES & STOCK */}
              <div className="pt-4 border-t border-[#2C2621]/10">
                <h4 className="text-xs tracking-[0.2em] uppercase font-semibold text-[#8C6D46] mb-2">
                  6. SIZES & STOCK STATUS
                </h4>

                <div className="flex flex-wrap gap-1.5 mb-3">
                  {["XS", "S", "M", "L", "XL", "One Size"].map((size) => {
                    const isSelected = formData.sizes.includes(size);
                    return (
                      <button
                        type="button"
                        key={size}
                        onClick={() => toggleSize(size)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold uppercase border transition-all ${
                          isSelected
                            ? "bg-[#1E1B18] text-white border-[#1E1B18]"
                            : "bg-white text-[#736555] border-[#2C2621]/20 hover:border-[#1E1B18]"
                        }`}
                      >
                        {size} {isSelected && "✓"}
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-[#1E1B18]">
                    <input
                      type="checkbox"
                      checked={formData.inStock}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          inStock: e.target.checked,
                        })
                      }
                      className="w-4 h-4 accent-[#1E1B18]"
                    />
                    <span>Available / In Stock</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-[#1E1B18]">
                    <input
                      type="checkbox"
                      checked={formData.isHeroFeatured}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isHeroFeatured: e.target.checked,
                        })
                      }
                      className="w-4 h-4 accent-[#1E1B18]"
                    />
                    <span>Hero Feature</span>
                  </label>
                </div>
              </div>

              {/* SUBMIT BUTTON */}
              <div className="pt-4 border-t border-[#2C2621]/15">
                <button
                  type="submit"
                  className="w-full py-3 bg-[#1E1B18] hover:bg-[#8C6D46] text-[#FAF7F2] rounded-full text-xs tracking-[0.22em] uppercase font-semibold transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>
                    {editingId
                      ? "SAVE CHANGES ON STOREFRONT"
                      : "PUBLISH PIECE TO STOREFRONT"}
                  </span>
                </button>
              </div>
            </form>
          </div>

          {/* RIGHT COLUMN: REAL-TIME STOREFRONT PREVIEW (5 cols) */}
          <div className="lg:col-span-5 sticky top-20">
            <div className="bg-[#FAF7F2] rounded-2xl p-4 sm:p-5 border border-[#2C2621]/20 shadow-sm">
              <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-[#2C2621]/10">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#2A4D33] animate-pulse"></span>
                  <h4 className="font-serif text-xs sm:text-sm uppercase tracking-wider font-semibold text-[#1E1B18]">
                    STOREFRONT PREVIEW
                  </h4>
                </div>

                <div className="flex rounded-lg overflow-hidden border border-[#2C2621]/20 text-[9px] tracking-wider uppercase font-medium">
                  <button
                    onClick={() => setPreviewMode("card")}
                    className={`px-2 py-0.5 ${
                      previewMode === "card"
                        ? "bg-[#1E1B18] text-white"
                        : "bg-white text-[#736555]"
                    }`}
                  >
                    Card
                  </button>
                  <button
                    onClick={() => setPreviewMode("dossier")}
                    className={`px-2 py-0.5 ${
                      previewMode === "dossier"
                        ? "bg-[#1E1B18] text-white"
                        : "bg-white text-[#736555]"
                    }`}
                  >
                    Dossier
                  </button>
                </div>
              </div>

              <p className="text-[10px] text-[#736555] mb-2.5">
                Renders exactly as seen on the storefront:
              </p>

              {/* CARD PREVIEW */}
              {previewMode === "card" ? (
                <div className="bg-[#FAF7F2] rounded-xl p-3.5 border border-[#2C2621]/20 shadow-xs max-w-xs mx-auto">
                  <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-[#EDE5DC] mb-2.5 border border-[#2C2621]/10">
                    <Image
                      src={livePreviewProduct.image}
                      alt={livePreviewProduct.name}
                      fill
                      className="object-cover"
                    />

                    {!livePreviewProduct.inStock && (
                      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
                        <span className="bg-[#1E1B18] text-white text-[8px] tracking-[0.2em] uppercase px-2 py-0.5 rounded-full font-semibold">
                          SOLD OUT
                        </span>
                      </div>
                    )}

                    <div className="absolute top-2 left-2 bg-[#1E1B18]/85 text-white text-[8px] tracking-[0.2em] uppercase px-2 py-0.5 rounded-full font-medium">
                      {livePreviewProduct.numberLabel?.split(".")[0] || "01"}
                    </div>

                    <div className="absolute bottom-2 left-2 bg-[#1E1B18]/70 text-[#FAF7F2] text-[8px] tracking-[0.2em] uppercase px-2 py-0.5 rounded">
                      {livePreviewProduct.theme}
                    </div>
                  </div>

                  <span className="text-[8px] tracking-[0.2em] uppercase text-[#8C7A6B] block">
                    {livePreviewProduct.subtitle}
                  </span>
                  <h4 className="font-serif text-sm uppercase font-semibold text-[#1E1B18] mt-0.5 truncate">
                    {livePreviewProduct.name}
                  </h4>
                  <div className="font-serif text-sm font-semibold text-[#1E1B18] mt-0.5">
                    {formatNaira(livePreviewProduct.price)}
                  </div>

                  {/* Clean specs preview */}
                  <div className="mt-2 pt-1.5 border-t border-[#2C2621]/10">
                    <span className="text-[8px] tracking-[0.2em] uppercase text-[#8C7A6B] font-semibold block mb-0.5">
                      FABRIC & CRAFT:
                    </span>
                    <p className="text-[9px] text-[#2C2621] font-medium truncate">
                      {livePreviewProduct.composition}
                    </p>
                    <div className="mt-1 space-y-0.5 pl-2 border-l border-[#C99742]/70 text-[9px] text-[#736555]">
                      {livePreviewProduct.details.slice(0, 2).map((d, i) => (
                        <p key={i} className="truncate">
                          {d}
                        </p>
                      ))}
                    </div>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-[#2C2621]/10 flex flex-col gap-1">
                    <button
                      type="button"
                      className="w-full py-1.5 rounded-full text-[9px] tracking-[0.2em] uppercase font-semibold bg-[#EDE5DC]/80 text-[#1E1B18] border border-[#2C2621]/20 flex items-center justify-center gap-1"
                    >
                      <ShoppingBag className="w-3 h-3" />
                      <span>
                        {livePreviewProduct.inStock
                          ? "ADD TO CART"
                          : "SOLD OUT"}
                      </span>
                    </button>
                    <span className="text-center text-[8px] tracking-[0.16em] uppercase text-[#8C6D46] font-semibold">
                      VIEW ALL DETAILS →
                    </span>
                  </div>
                </div>
              ) : (
                /* DOSSIER MODAL PREVIEW */
                <div className="bg-white rounded-xl p-3.5 border border-[#2C2621]/15 text-xs space-y-2">
                  <div className="relative aspect-[16/10] rounded-lg overflow-hidden bg-[#EDE5DC]">
                    <Image
                      src={livePreviewProduct.image}
                      alt="Dossier"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h4 className="font-serif text-sm uppercase font-semibold">
                    {livePreviewProduct.name}
                  </h4>
                  <p className="font-serif text-sm font-semibold text-[#8C6D46]">
                    {formatNaira(livePreviewProduct.price)}
                  </p>
                  <div className="p-2 bg-[#FAF7F2] rounded-lg border border-[#2C2621]/10 text-[9px]">
                    <strong>COMPOSITION:</strong>{" "}
                    {livePreviewProduct.composition}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* INVENTORY CATALOG TABLE: Instant Restock & Delete with 1 Click */}
        <div className="mt-10 sm:mt-12 bg-[#FAF7F2] rounded-2xl p-4 sm:p-7 border border-[#2C2621]/15 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-5 border-b border-[#2C2621]/10 gap-2">
            <div>
              <span className="text-[9px] tracking-[0.25em] uppercase text-[#8C7A6B] font-semibold block">
                STOREFRONT INVENTORY
              </span>
              <h3 className="font-serif text-lg sm:text-xl uppercase font-semibold text-[#1E1B18]">
                All Published Pieces ({products.length})
              </h3>
            </div>
            <span className="text-[11px] text-[#5C4D3C]">
              Click <strong>In Stock / Sold Out</strong> to toggle availability
              instantly.
            </span>
          </div>

          {loading ? (
            <div className="py-10 text-center text-xs tracking-wider uppercase text-[#8C7A6B]">
              Loading catalog...
            </div>
          ) : products.length === 0 ? (
            <div className="py-10 text-center text-xs text-[#8C7A6B]">
              No pieces in inventory. Use the form above to add your first
              piece!
            </div>
          ) : (
            <div className="divide-y divide-[#2C2621]/10">
              {products.map((p) => (
                <div
                  key={p.id}
                  className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white/60 px-2.5 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-14 rounded-lg overflow-hidden bg-[#EDE5DC] shrink-0 border border-[#2C2621]/10">
                      <Image
                        src={p.image}
                        alt={p.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[8px] sm:text-[9px] tracking-wider uppercase text-[#8C7A6B] font-medium">
                          {p.numberLabel || p.theme}
                        </span>
                        <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-[#EDE5DC] text-[#2C2621]">
                          {p.theme}
                        </span>
                        {/* Instant Restock Toggle Badge */}
                        <button
                          type="button"
                          onClick={() => handleToggleStock(p)}
                          className={`text-[8px] tracking-wider uppercase px-2 py-0.5 rounded-full font-bold transition-all border ${
                            p.inStock
                              ? "bg-[#2A4D33]/15 text-[#2A4D33] border-[#2A4D33]/30 hover:bg-[#992222]/15 hover:text-[#992222] hover:border-[#992222]/30"
                              : "bg-[#992222]/15 text-[#992222] border-[#992222]/30 hover:bg-[#2A4D33]/15 hover:text-[#2A4D33] hover:border-[#2A4D33]/30"
                          }`}
                          title="Click to toggle In Stock / Sold Out"
                        >
                          {p.inStock
                            ? "● IN STOCK"
                            : "○ SOLD OUT (CLICK TO RESTOCK)"}
                        </button>
                      </div>

                      <h4 className="font-serif text-sm sm:text-base uppercase font-semibold text-[#1E1B18] mt-0.5">
                        {p.name}
                      </h4>

                      <p className="text-[10px] text-[#736555] line-clamp-1">
                        {p.composition} • Sizes: {p.sizes.join(", ")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                    <span className="font-serif text-sm sm:text-base font-semibold text-[#1E1B18]">
                      {formatNaira(p.price)}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleEdit(p)}
                        className="px-2.5 py-1 border border-[#2C2621]/20 hover:border-[#1E1B18] hover:bg-[#1E1B18] hover:text-white rounded-lg text-[10px] font-medium uppercase tracking-wider transition-all flex items-center gap-1"
                      >
                        <Edit className="w-3 h-3" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => handleDelete(p.id, p.name)}
                        className="p-1 text-[#8C7A6B] hover:text-[#992222] hover:bg-red-50 rounded-lg transition-colors"
                        title="Remove piece from storefront"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
