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

export default function AdminPage() {
  // ── ALL HOOKS MUST BE DECLARED BEFORE ANY EARLY RETURN ──────────

  // Password gate state
  const ADMIN_PASSWORD = "riiamore2026admin";
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Persist auth in sessionStorage so page refresh doesn't log out mid-session
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("rii_admin_auth");
      if (stored === "true") setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput.trim() === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem("rii_admin_auth", "true");
      setPasswordError(false);
    } else {
      setPasswordError(true);
      setPasswordInput("");
    }
  };

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // File upload state
  const [isUploading, setIsUploading] = useState(false);
  const multiFileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [formData, setFormData] = useState<{
    name: string;
    price: number | string;
    category:
      | "sets"
      | "swimwear"
      | "jumpsuits"
      | "dresses"
      | "tops"
      | "accessories";
    theme: "Atelier Co-Ords" | "Wild Resort & Swim" | "Sculpted Silhouettes";
    image: string;
    secondaryImage: string;
    images: string[];
    description: string;
    sizes: string[];
    quantity: number | string;
    inStock: boolean;
    isHeroFeatured: boolean;
  }>({
    name: "",
    price: "",
    category: "sets",
    theme: "Atelier Co-Ords",
    image: "",
    secondaryImage: "",
    images: [],
    description: "",
    sizes: ["S", "M", "L"],
    quantity: "",
    inStock: true,
    isHeroFeatured: false,
  });

  const [previewMode, setPreviewMode] = useState<"card" | "dossier">("card");
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

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

  // ── PASSWORD GATE EARLY RETURN (all hooks declared above) ─────────
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F4EFEA] flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <div className="flex flex-col items-center mb-8">
            <div className="relative w-16 h-16 mb-4">
              <Image
                src="/images/logo-transparent.png"
                alt="Rii Amor"
                fill
                className="object-contain"
                priority
              />
            </div>
            <h1 className="font-serif text-lg uppercase tracking-widest font-semibold text-[#1E1B18]">
              ATELIER STUDIO
            </h1>
            <p className="text-[10px] tracking-[0.25em] uppercase text-[#8C7A6B] mt-1">
              Restricted Access
            </p>
          </div>

          <div className="bg-[#FAF7F2] rounded-2xl p-8 border border-[#2C2621]/15 shadow-sm">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-[10px] tracking-[0.2em] uppercase text-[#8C7A6B] font-semibold block mb-1.5">
                  Studio Access Code
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    autoFocus
                    placeholder="Enter your code"
                    value={passwordInput}
                    onChange={(e) => {
                      setPasswordInput(e.target.value);
                      setPasswordError(false);
                    }}
                    className={`w-full bg-[#EDE5DC]/60 border rounded-xl px-4 py-3 text-sm text-[#1E1B18] placeholder:text-[#C5B5A1] focus:outline-none tracking-widest transition-colors pr-10 ${
                      passwordError
                        ? "border-[#992222] bg-red-50"
                        : "border-[#2C2621]/20 focus:border-[#1E1B18]"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C7A6B] hover:text-[#1E1B18] text-[10px] uppercase tracking-wider"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                {passwordError && (
                  <p className="text-[10px] text-[#992222] mt-1.5 tracking-wider uppercase flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Incorrect code. Please try again.
                  </p>
                )}
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-[#1E1B18] hover:bg-[#8C6D46] text-[#FAF7F2] rounded-full text-[10px] tracking-[0.25em] uppercase font-semibold transition-all shadow-sm"
              >
                ENTER ATELIER STUDIO
              </button>
            </form>
            <p className="text-center text-[9px] text-[#8C7A6B] tracking-wider mt-5 uppercase">
              Rii Amor · Private Access
            </p>
          </div>
        </div>
      </div>
    );
  }
  // ── END GATE ──────────────────────────────────────────────────────

  const showNotification = (type: "success" | "error", text: string) => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage(null), 3500);
  };

  // Update item name
  const handleNameChange = (nameVal: string) => {
    setFormData((prev) => ({
      ...prev,
      name: nameVal,
    }));
  };

  // Multi-image upload handler
  const handleMultipleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setIsUploading(true);
    const uploadedUrls: string[] = [];

    for (const file of files) {
      const body = new FormData();
      body.append("file", file);
      try {
        const res = await fetch("/api/upload", { method: "POST", body });
        if (res.ok) {
          const data = await res.json();
          uploadedUrls.push(data.url);
        }
      } catch {
        // skip failed file
      }
    }

    if (uploadedUrls.length > 0) {
      setFormData((prev) => {
        const newImages = [...prev.images, ...uploadedUrls];
        return {
          ...prev,
          images: newImages,
          image: prev.image && !prev.image.includes("unsplash") ? prev.image : newImages[0],
          secondaryImage:
            prev.secondaryImage && !prev.secondaryImage.includes("unsplash")
              ? prev.secondaryImage
              : newImages[1] || newImages[0],
        };
      });
      showNotification(
        "success",
        `${uploadedUrls.length} photo${uploadedUrls.length > 1 ? "s" : ""} uploaded!`,
      );
    } else {
      showNotification("error", "Failed to upload photos. Please try again.");
    }
    setIsUploading(false);
    // reset input so same files can be re-selected
    if (multiFileInputRef.current) multiFileInputRef.current.value = "";
  };

  const removeImage = (url: string) => {
    setFormData((prev) => {
      const newImages = prev.images.filter((u) => u !== url);
      return {
        ...prev,
        images: newImages,
        image:
          prev.image === url ? (newImages[0] || "")
            : prev.image,
        secondaryImage:
          prev.secondaryImage === url ? (newImages[1] || newImages[0] || "")
            : prev.secondaryImage,
      };
    });
  };

  // Reorder images (drag and drop or move)
  const moveImage = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;
    setFormData((prev) => {
      const updated = [...prev.images];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);
      return {
        ...prev,
        images: updated,
        image: updated[0] || "",
        secondaryImage: updated[1] || updated[0] || "",
      };
    });
  };

  const makeCover = (idx: number) => {
    if (idx === 0) return;
    moveImage(idx, 0);
    showNotification("success", "Set as cover image!");
  };

  // Quick Restock Toggle / Quantity Adjuster
  const handleToggleStock = async (product: Product) => {
    const newStockState = !product.inStock;
    const defaultRestockQty = (!product.inStock && (!product.quantity || product.quantity <= 0)) ? 5 : product.quantity;
    try {
      const res = await fetch("/api/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: product.id,
          inStock: newStockState,
          quantity: newStockState ? defaultRestockQty : 0,
        }),
      });

      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) =>
            p.id === product.id ? { ...p, inStock: newStockState, quantity: newStockState ? defaultRestockQty : 0 } : p,
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

  // Quick Restock with custom quantity prompt
  const handleQuickRestock = async (product: Product) => {
    const input = window.prompt(`How many pieces are available for "${product.name}"?`, String(product.quantity || 5));
    if (input === null) return;
    const qty = parseInt(input.trim(), 10);
    const validQty = isNaN(qty) || qty < 0 ? 0 : qty;
    const inStock = validQty > 0;

    try {
      const res = await fetch("/api/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: product.id,
          inStock,
          quantity: validQty,
        }),
      });

      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) =>
            p.id === product.id ? { ...p, inStock, quantity: validQty } : p,
          ),
        );
        showNotification(
          "success",
          inStock
            ? `Restocked "${product.name}" with ${validQty} pieces available!`
            : `Marked "${product.name}" as Sold Out.`,
        );
      }
    } catch (err) {
      console.error(err);
      showNotification("error", "Failed to update restock count.");
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

    if (!formData.image && formData.images.length === 0) {
      showNotification("error", "Please upload at least one photo from your device.");
      return;
    }

    // Ensure the primary cover image is strictly the 1st image in images array if available
    const primaryImage =
      formData.images.length > 0 ? formData.images[0] : formData.image || "";
    const secondaryImage =
      formData.images.length > 1
        ? formData.images[1]
        : formData.secondaryImage || primaryImage;
    const resolvedName = formData.name.trim() || `Piece #${products.length + 1}`;

    const resolvedQuantity =
      formData.quantity !== ""
        ? Math.max(0, parseInt(String(formData.quantity), 10) || 0)
        : undefined;

    const payload = {
      ...formData,
      name: resolvedName,
      image: primaryImage,
      secondaryImage: secondaryImage,
      price: formData.price ? parseFormattedNumber(String(formData.price)) : 0,
      quantity: resolvedQuantity,
      inStock: resolvedQuantity !== undefined ? resolvedQuantity > 0 && formData.inStock : formData.inStock,
      details: [],
      composition: "",
      subtitle: formData.theme,
      images:
        formData.images.length > 0
          ? formData.images
          : [primaryImage, secondaryImage].filter(Boolean),
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
      price: formatNumberWithCommas(product.price),
      category: product.category,
      theme: product.theme,
      image: product.image,
      secondaryImage: product.secondaryImage || product.image,
      images: product.images || [product.image, product.secondaryImage].filter(Boolean) as string[],
      description: product.description || "",
      sizes: product.sizes,
      quantity: product.quantity !== undefined ? String(product.quantity) : "",
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
      price: "",
      category: "sets",
      theme: "Atelier Co-Ords",
      image: "",
      secondaryImage: "",
      images: [],
      description: "",
      sizes: ["S", "M", "L"],
      quantity: "",
      inStock: true,
      isHeroFeatured: false,
    });
  };

  const livePreviewProduct: Product = {
    id: editingId || "preview-piece",
    name: formData.name || "Untitled Piece",
    subtitle: formData.theme,
    price: parseFormattedNumber(String(formData.price)) || 39000,
    category: formData.category,
    theme: formData.theme,
    image: formData.image || formData.images[0] || "",
    secondaryImage: formData.secondaryImage || formData.image || formData.images[1] || formData.images[0] || "",
    description: formData.description || "",
    details: [],
    composition: "",
    sizes: formData.sizes.length > 0 ? formData.sizes : ["Standard"],
    inStock: formData.inStock,
    isHeroFeatured: formData.isHeroFeatured,
    images: formData.images.length > 0 ? formData.images : undefined,
  };

  return (
    <div className="min-h-screen bg-[#F4EFEA] text-[#1E1B18] font-sans selection:bg-[#C99742]/30">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#2C2621]/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center justify-between">
          {/* Left: Logo and Titles */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative w-7 h-7 sm:w-8 sm:h-8 shrink-0">
              <Image
                src="/images/logo-transparent.png"
                alt="Rii Amor Logo"
                fill
                className="object-contain"
                priority
              />
            </div>

            <div className="min-w-0">
              {/* Hidden on mobile, shown on tablet/desktop */}
              <h1 className="hidden sm:block font-serif text-sm uppercase tracking-wider font-semibold text-[#1E1B18] truncate">
                ATELIER PRODUCT STUDIO
              </h1>

              {/* Subtitle */}
              <span className="text-[9px] sm:text-[9.5px] tracking-[0.16em] sm:tracking-[0.2em] text-[#8C7A6B] uppercase block truncate">
                <span className="hidden sm:inline">Rii Amor • </span>
                <span>Inventory & Storefront Control</span>
              </span>
            </div>
          </div>

          {/* Right: Connected Badge & Single Storefront Button */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            <span className="text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-full bg-[#2A4D33]/10 text-[#2A4D33] font-medium hidden md:inline-block">
              ● Connected ({products.length} Pieces)
            </span>

            <Link
              href="/"
              className="flex items-center gap-1.5 text-[10px] sm:text-[11px] tracking-wider uppercase font-semibold text-[#FAF7F2] bg-[#1E1B18] hover:bg-[#8C6D46] px-3 sm:px-4 py-1.5 rounded-full transition-all shadow-xs shrink-0"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Storefront</span>
            </Link>

            <button
              onClick={() => {
                sessionStorage.removeItem("rii_admin_auth");
                setIsAuthenticated(false);
              }}
              className="text-[9px] sm:text-[10px] tracking-wider uppercase font-semibold text-[#8C7A6B] hover:text-[#992222] transition-colors px-2 py-1.5 shrink-0"
              title="Lock studio"
            >
              LOCK
            </button>
          </div>
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
                ATELIER STUDIO — ADD & MANAGE PIECES
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
                  1. ITEM NAME & PRICE
                </h4>

                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] tracking-wider uppercase text-[#8C7A6B] block mb-1 font-semibold">
                      PIECE NAME <span className="text-[9px] font-normal text-[#8C7A6B]">(OPTIONAL)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Musera lace up two piece capri set (or leave blank)"
                      value={formData.name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      className="w-full bg-white border border-[#2C2621]/20 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-[#1E1B18] placeholder:text-[#8C7A6B] focus:outline-none focus:border-[#1E1B18]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] tracking-wider uppercase text-[#8C7A6B] block mb-1 font-semibold">
                      PRICE (₦ NAIRA) <span className="text-[9px] font-normal text-[#8C7A6B]">(OPTIONAL)</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#1E1B18] pointer-events-none">
                        ₦
                      </span>
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="e.g. 39,000 (leave blank if price on request)"
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
                        className="w-full bg-white border border-[#2C2621]/20 rounded-xl pl-7 pr-3.5 py-2.5 text-xs font-bold text-[#1E1B18] focus:outline-none focus:border-[#1E1B18]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] tracking-wider uppercase text-[#8C7A6B] block mb-1 font-semibold">
                      DESCRIPTION / FIT NOTES (OPTIONAL)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Lace-up front fastening with stretchy capri fit. True to size."
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      className="w-full bg-white border border-[#2C2621]/20 rounded-xl p-3 text-xs text-[#1E1B18] focus:outline-none focus:border-[#1E1B18] leading-relaxed"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: DEVICE PHOTO UPLOAD — MULTIPLE IMAGES */}
              <div className="pt-4 border-t border-[#2C2621]/10">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs tracking-[0.2em] uppercase font-semibold text-[#8C6D46] flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5" />
                    <span>2. PHOTOS FROM YOUR DEVICE</span>
                  </h4>
                  <span className="text-[9px] text-[#8C7A6B]">
                    Select multiple at once
                  </span>
                </div>

                {/* Hidden multi-file input */}
                <input
                  type="file"
                  ref={multiFileInputRef}
                  accept="image/*"
                  multiple
                  onChange={handleMultipleImageUpload}
                  className="hidden"
                  id="multi-photo-upload"
                />

                {/* Upload Drop Zone */}
                <div className="bg-white border-2 border-dashed border-[#2C2621]/20 rounded-2xl p-4 sm:p-5 text-center hover:border-[#1E1B18] transition-all">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-[#EDE5DC] text-[#1E1B18] flex items-center justify-center mb-2">
                      <UploadCloud className="w-5 h-5" />
                    </div>

                    <label
                      htmlFor="multi-photo-upload"
                      className="cursor-pointer px-4 py-2 bg-[#1E1B18] hover:bg-[#8C6D46] text-white rounded-full text-[10px] tracking-wider uppercase font-semibold transition-all shadow-xs"
                    >
                      {isUploading
                        ? "Uploading photos..."
                        : "Choose Photos from Device"}
                    </label>

                    <p className="text-[10px] text-[#8C7A6B] mt-2">
                      Select multiple photos at once · PNG, JPG, WEBP · Works on mobile &amp; laptop
                    </p>
                  </div>
                </div>

                {/* Uploaded Images Strip */}
                {formData.images.length > 0 && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[9px] tracking-wider uppercase text-[#8C7A6B] font-semibold block">
                        {formData.images.length} Photo{formData.images.length > 1 ? "s" : ""} — Drag or click &quot;Make Cover&quot; to reorder
                      </span>
                      <span className="text-[8px] text-[#8C6D46] uppercase font-medium">
                        First image = Cover
                      </span>
                    </div>

                    <div className="flex gap-2.5 overflow-x-auto pb-2 pt-1 scrollbar-none">
                      {formData.images.map((url, idx) => (
                        <div
                          key={url}
                          draggable
                          onDragStart={() => setDraggedIndex(idx)}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={() => {
                            if (draggedIndex !== null && draggedIndex !== idx) {
                              moveImage(draggedIndex, idx);
                              setDraggedIndex(null);
                            }
                          }}
                          className={`relative shrink-0 w-20 h-24 rounded-xl overflow-hidden border-2 transition-all cursor-grab active:cursor-grabbing group ${
                            idx === 0
                              ? "border-[#1E1B18] shadow-sm ring-2 ring-[#C99742]/40"
                              : "border-[#2C2621]/15 hover:border-[#1E1B18]"
                          }`}
                        >
                          <Image
                            src={url}
                            alt={`Photo ${idx + 1}`}
                            fill
                            className="object-cover pointer-events-none"
                          />

                          {/* Quick reorder controls (visible on hover / touch) */}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-1">
                            <div className="flex justify-between items-center">
                              {idx > 0 ? (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    makeCover(idx);
                                  }}
                                  className="px-1.5 py-0.5 rounded bg-[#C99742] text-[#1E1B18] text-[7px] font-bold uppercase tracking-wider shadow"
                                  title="Make this the Cover image"
                                >
                                  ★ Cover
                                </button>
                              ) : (
                                <span className="px-1.5 py-0.5 rounded bg-[#1E1B18] text-[#FAF7F2] text-[7px] font-bold uppercase tracking-wider">
                                  Cover
                                </span>
                              )}

                              {/* Remove button */}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeImage(url);
                                }}
                                className="w-4 h-4 rounded-full bg-[#992222] text-white text-[8px] flex items-center justify-center font-bold leading-none shadow"
                                title="Remove photo"
                              >
                                ✕
                              </button>
                            </div>

                            {/* Arrow buttons for mobile reordering */}
                            <div className="flex justify-center gap-1">
                              {idx > 0 && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    moveImage(idx, idx - 1);
                                  }}
                                  className="px-1.5 py-0.5 rounded bg-white/90 text-[#1E1B18] text-[8px] font-bold hover:bg-white shadow"
                                  title="Move Left"
                                >
                                  ◀
                                </button>
                              )}
                              {idx < formData.images.length - 1 && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    moveImage(idx, idx + 1);
                                  }}
                                  className="px-1.5 py-0.5 rounded bg-white/90 text-[#1E1B18] text-[8px] font-bold hover:bg-white shadow"
                                  title="Move Right"
                                >
                                  ▶
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Default Badge when not hovered */}
                          <span
                            className={`absolute bottom-0 left-0 right-0 text-center text-[7px] font-bold uppercase tracking-wider py-0.5 group-hover:opacity-0 transition-opacity ${
                              idx === 0
                                ? "bg-[#1E1B18] text-[#C99742]"
                                : idx === 1
                                ? "bg-[#2C2621]/80 text-white"
                                : "bg-black/60 text-white"
                            }`}
                          >
                            {idx === 0 ? "★ COVER" : idx === 1 ? "Detail" : `#${idx + 1}`}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Fallback: single image preview when no images[] uploaded */}
                {formData.images.length === 0 && (
                  <div className="mt-3 flex items-center gap-3 bg-[#EDE5DC]/60 p-2.5 rounded-xl border border-[#2C2621]/10">
                    <div className="relative w-12 h-14 rounded-lg overflow-hidden bg-white shrink-0 border border-[#2C2621]/15 flex items-center justify-center">
                    {formData.image ? (
                      <Image
                        src={formData.image}
                        alt="Active preview"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <Camera className="w-5 h-5 text-[#8C7A6B]/50" />
                    )}
                  </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[9px] tracking-wider uppercase text-[#8C7A6B] block">
                        CURRENT PHOTO
                      </span>
                      <p className="text-[10px] text-[#1E1B18] truncate font-medium">
                        {formData.image.startsWith("/uploads/")
                          ? "Uploaded from your device ✓"
                          : "No photo chosen — upload from your device above"}
                      </p>
                    </div>
                  </div>
                )}

                
              </div>

              {/* SECTION 3: THEME & CATEGORY */}
              <div className="pt-4 border-t border-[#2C2621]/10">
                <h4 className="text-xs tracking-[0.2em] uppercase font-semibold text-[#8C6D46] mb-2">
                  3. THEME & CATEGORY
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3">
                  {[
                    {
                      id: "Atelier Co-Ords" as const,
                      title: "Atelier Co-Ords",
                      desc: "Lace-up & capri two-piece sets",
                    },
                    {
                      id: "Wild Resort & Swim" as const,
                      title: "Wild Resort & Swim",
                      desc: "Bikinis & 3-piece swimwear",
                    },
                    {
                      id: "Sculpted Silhouettes" as const,
                      title: "Sculpted Silhouettes",
                      desc: "Backless jumpsuits & fitted pieces",
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

                {/* Garment Category Selector */}
                <div className="mt-3">
                  <span className="text-[9px] text-[#8C7A6B] uppercase font-semibold tracking-wider block mb-1.5">
                    Garment Category:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                    {[
                      { id: "sets" as const, label: "Two-Piece Sets / Co-Ords" },
                      { id: "swimwear" as const, label: "Swimwear & Bikinis" },
                      { id: "jumpsuits" as const, label: "Jumpsuits & Rompers" },
                      { id: "dresses" as const, label: "Dresses & Gowns" },
                      { id: "tops" as const, label: "Tops & Blouses" },
                      { id: "accessories" as const, label: "Accessories" },
                    ].map((cat) => {
                      const isCatSelected = formData.category === cat.id;
                      return (
                        <button
                          type="button"
                          key={cat.id}
                          onClick={() => setFormData({ ...formData, category: cat.id })}
                          className={`px-3 py-2 rounded-xl text-xs font-semibold uppercase border transition-all text-left flex items-center justify-between ${
                            isCatSelected
                              ? "bg-[#1E1B18] text-[#FAF7F2] border-[#1E1B18] shadow-xs"
                              : "bg-white text-[#5C4D3C] border-[#2C2621]/15 hover:border-[#1E1B18]"
                          }`}
                        >
                          <span className="truncate">{cat.label}</span>
                          {isCatSelected && (
                            <Check className="w-3 h-3 text-[#C99742] shrink-0 ml-1" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* SECTION 4: SIZES, QUANTITY & STOCK STATUS */}
              <div className="pt-4 border-t border-[#2C2621]/10">
                <h4 className="text-xs tracking-[0.2em] uppercase font-semibold text-[#8C6D46] mb-2">
                  4. SIZES, QUANTITY & STOCK
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

                {/* Available Quantity Field */}
                <div className="mb-3.5 bg-white p-3 rounded-xl border border-[#2C2621]/15">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[10px] tracking-wider uppercase text-[#8C7A6B] font-semibold block">
                      Number of Pieces Available (Stock Count)
                    </label>
                    <span className="text-[9px] text-[#8C7A6B]">Leave empty if unlimited</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      placeholder="e.g. 5, 10, 20"
                      value={formData.quantity}
                      onChange={(e) => {
                        const val = e.target.value;
                        const num = parseInt(val, 10);
                        setFormData({
                          ...formData,
                          quantity: val,
                          inStock: val === "" ? formData.inStock : num > 0,
                        });
                      }}
                      className="w-36 bg-[#EDE5DC]/40 border border-[#2C2621]/20 rounded-lg px-3 py-1.5 text-xs font-medium focus:outline-none focus:border-[#1E1B18]"
                    />
                    <span className="text-[11px] text-[#5C4D3C]">
                      {formData.quantity !== "" && parseInt(String(formData.quantity), 10) === 0 ? (
                        <span className="text-[#992222] font-semibold">0 pieces — will show as Sold Out</span>
                      ) : formData.quantity !== "" ? (
                        <span>{formData.quantity} piece{parseInt(String(formData.quantity), 10) === 1 ? "" : "s"} in stock</span>
                      ) : (
                        <span className="text-[#8C7A6B]">Unlimited stock</span>
                      )}
                    </span>
                  </div>
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
                    {livePreviewProduct.image ? (
                    <Image
                      src={livePreviewProduct.image}
                      alt={livePreviewProduct.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center text-[#8C7A6B]">
                      <Camera className="w-6 h-6 mb-1 opacity-40" />
                      <span className="text-[9px] uppercase tracking-wider">No photo uploaded yet</span>
                    </div>
                  )}

                    {!livePreviewProduct.inStock && (
                      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
                        <span className="bg-[#1E1B18] text-white text-[8px] tracking-[0.2em] uppercase px-2 py-0.5 rounded-full font-semibold">
                          SOLD OUT
                        </span>
                      </div>
                    )}

                    

                    <div className="absolute bottom-2 left-2 bg-[#1E1B18]/70 text-[#FAF7F2] text-[8px] tracking-[0.2em] uppercase px-2 py-0.5 rounded">
                      {livePreviewProduct.theme}
                    </div>
                  </div>

                  
                  <h4 className="font-serif text-sm uppercase font-semibold text-[#1E1B18] mt-0.5 truncate">
                    {livePreviewProduct.name}
                  </h4>
                  <div className="font-serif text-sm font-semibold text-[#1E1B18] mt-0.5">
                    {formatNaira(livePreviewProduct.price)}
                  </div>

                  {/* Clean specs preview */}
                  

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
                <div className="bg-white rounded-xl p-3.5 border border-[#2C2621]/15 text-xs space-y-2 max-w-xs mx-auto">
                  <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-[#EDE5DC]">
                    {livePreviewProduct.image ? (
                    <Image
                      src={livePreviewProduct.image}
                      alt="Dossier"
                      fill
                      className="object-cover object-top"
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center text-[#8C7A6B]">
                      <Camera className="w-6 h-6 mb-1 opacity-40" />
                      <span className="text-[9px] uppercase tracking-wider">No photo uploaded yet</span>
                    </div>
                  )}
                  </div>
                  <h4 className="font-serif text-sm uppercase font-semibold">
                    {livePreviewProduct.name}
                  </h4>
                  <p className="font-serif text-sm font-semibold text-[#8C6D46]">
                    {formatNaira(livePreviewProduct.price)}
                  </p>
                  {livePreviewProduct.description && (
                    <p className="text-[10px] text-[#5C4D3C] line-clamp-2">
                      {livePreviewProduct.description}
                    </p>
                  )}
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
                    <div className="relative w-12 h-14 rounded-lg overflow-hidden bg-[#EDE5DC] shrink-0 border border-[#2C2621]/10 flex items-center justify-center">
                      {p.image ? (
                        <Image
                          src={p.image}
                          alt={p.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <Camera className="w-5 h-5 text-[#8C7A6B]/50" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[8px] sm:text-[9px] tracking-wider uppercase text-[#8C7A6B] font-medium">{p.category}</span>
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
                            : "○ SOLD OUT"}
                        </button>

                        {/* Stock Count Pill with Quick Restock Prompt */}
                        <button
                          type="button"
                          onClick={() => handleQuickRestock(p)}
                          className="text-[8px] tracking-wider uppercase px-2 py-0.5 rounded-full font-semibold border border-[#2C2621]/20 bg-white hover:bg-[#EDE5DC] text-[#5C4D3C] transition-all flex items-center gap-1"
                          title="Click to change available quantity"
                        >
                          <span>QTY: {p.quantity !== undefined ? p.quantity : (p.inStock ? "∞" : "0")}</span>
                          <span className="text-[7px] text-[#8C6D46] underline">RESTOCK</span>
                        </button>
                      </div>

                      <h4 className="font-serif text-sm sm:text-base uppercase font-semibold text-[#1E1B18] mt-0.5">
                        {p.name}
                      </h4>

                      <p className="text-[10px] text-[#736555] line-clamp-1">Sizes: {p.sizes.join(", ")}</p>
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
