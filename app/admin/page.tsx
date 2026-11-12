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
  Package,
  Clock,
  Palette,
} from "lucide-react";
import { Product, ColorVariant, Order } from "@/data/products";
import { resolveColorNameToHex } from "@/lib/colors";
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

  // Tab switcher & Orders state
  const [activeTab, setActiveTab] = useState<"inventory" | "orders">("inventory");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Color variant creation state & mode
  const [colorMode, setColorMode] = useState<"single" | "variants">("single");
  const [newColorName, setNewColorName] = useState("");
  const [newColorHex, setNewColorHex] = useState("#1E1B18");
  const [stagedColorImages, setStagedColorImages] = useState<string[]>([]);
  const [isUploadingStagedColor, setIsUploadingStagedColor] = useState(false);
  const stagedColorFileInputRef = useRef<HTMLInputElement>(null);
  const [variantUploadingIdx, setVariantUploadingIdx] = useState<number | null>(null);

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
    colorVariants: ColorVariant[];
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
    colorVariants: [],
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

  // Fetch client orders
  const fetchOrders = async () => {
    try {
      setLoadingOrders(true);
      const res = await fetch("/api/orders");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) setOrders(data);
      }
    } catch (err) {
      console.error("Failed to load orders:", err);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
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

    // Also delete from Supabase storage bucket if uploaded there
    if (url.includes("/product-images/")) {
      fetch(`/api/upload?url=${encodeURIComponent(url)}`, {
        method: "DELETE",
      }).catch((err) => {
        console.warn("Storage cleanup failed for:", url, err);
      });
    }
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

  // Color Variant handlers
  const handleColorNameChange = (val: string) => {
    setNewColorName(val);
    const matched = resolveColorNameToHex(val);
    if (matched) {
      setNewColorHex(matched);
    }
  };

  const handleStagedColorImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setIsUploadingStagedColor(true);
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
      } catch (err) {
        console.error("Staged color image upload error:", err);
      }
    }

    if (uploadedUrls.length > 0) {
      setStagedColorImages((prev) => [...prev, ...uploadedUrls]);
      showNotification(
        "success",
        `Attached ${uploadedUrls.length} photo(s) to this colorway.`
      );
    } else {
      showNotification("error", "Failed to upload photo(s).");
    }
    setIsUploadingStagedColor(false);
    e.target.value = "";
  };

  const removeStagedColorImage = async (url: string) => {
    setStagedColorImages((prev) => prev.filter((u) => u !== url));
    if (url.includes("/product-images/")) {
      try {
        await fetch(`/api/upload?url=${encodeURIComponent(url)}`, {
          method: "DELETE",
        });
      } catch {
        // background cleanup
      }
    }
  };

  const handleAddColorVariant = () => {
    const trimmed = newColorName.trim();
    if (!trimmed) {
      showNotification(
        "error",
        "Please enter a color name (e.g. Hazel nut, Noir, Emerald)"
      );
      return;
    }
    const exists = formData.colorVariants.some(
      (cv) => cv.name.toLowerCase() === trimmed.toLowerCase()
    );
    if (exists) {
      showNotification(
        "error",
        `Colorway "${trimmed}" already exists for this piece.`
      );
      return;
    }
    if (stagedColorImages.length === 0) {
      showNotification(
        "error",
        `Please attach at least one photo for "${trimmed}" before adding.`
      );
      return;
    }

    const resolvedHex = resolveColorNameToHex(trimmed) || newColorHex;

    setFormData((prev) => ({
      ...prev,
      colorVariants: [
        ...prev.colorVariants,
        {
          name: trimmed,
          hex: resolvedHex,
          images: [...stagedColorImages],
        },
      ],
    }));

    // Seamless reset: clear inputs so user can immediately add another colorway!
    setNewColorName("");
    setNewColorHex("#1E1B18");
    setStagedColorImages([]);
    if (stagedColorFileInputRef.current) stagedColorFileInputRef.current.value = "";
    showNotification(
      "success",
      `Added "${trimmed}" with ${stagedColorImages.length} photo(s)! You can now add another colorway.`
    );
  };

  const handleRemoveColorVariant = (idx: number) => {
    const variantToRemove = formData.colorVariants[idx];
    setFormData((prev) => ({
      ...prev,
      colorVariants: prev.colorVariants.filter((_, i) => i !== idx),
    }));

    // Delete photos of this removed colorway from storage
    if (variantToRemove?.images?.length) {
      for (const imgUrl of variantToRemove.images) {
        if (imgUrl.includes("/product-images/")) {
          fetch(`/api/upload?url=${encodeURIComponent(imgUrl)}`, {
            method: "DELETE",
          }).catch(() => {});
        }
      }
    }
  };

  const handleVariantImageUpload = async (
    variantIdx: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setVariantUploadingIdx(variantIdx);
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
        // skip
      }
    }

    if (uploadedUrls.length > 0) {
      setFormData((prev) => {
        const updated = [...prev.colorVariants];
        updated[variantIdx] = {
          ...updated[variantIdx],
          images: [...updated[variantIdx].images, ...uploadedUrls],
        };
        return { ...prev, colorVariants: updated };
      });
      showNotification(
        "success",
        `Uploaded ${uploadedUrls.length} photo(s) for ${formData.colorVariants[variantIdx].name}`
      );
    } else {
      showNotification("error", "Failed to upload photos for this colorway.");
    }
    setVariantUploadingIdx(null);
    e.target.value = "";
  };

  const handleRemoveVariantImage = (variantIdx: number, imgUrl: string) => {
    setFormData((prev) => {
      const updated = [...prev.colorVariants];
      updated[variantIdx] = {
        ...updated[variantIdx],
        images: updated[variantIdx].images.filter((u) => u !== imgUrl),
      };
      return { ...prev, colorVariants: updated };
    });

    if (imgUrl.includes("/product-images/")) {
      fetch(`/api/upload?url=${encodeURIComponent(imgUrl)}`, {
        method: "DELETE",
      }).catch((err) => {
        console.warn("Storage cleanup failed for variant image:", imgUrl, err);
      });
    }
  };

  const moveColorVariant = (fromIdx: number, toIdx: number) => {
    setFormData((prev) => {
      const variants = [...prev.colorVariants];
      if (toIdx < 0 || toIdx >= variants.length) return prev;
      const [moved] = variants.splice(fromIdx, 1);
      variants.splice(toIdx, 0, moved);
      return { ...prev, colorVariants: variants };
    });
  };

  const moveVariantImage = (variantIdx: number, fromIdx: number, toIdx: number) => {
    setFormData((prev) => {
      const variants = [...prev.colorVariants];
      const target = { ...variants[variantIdx] };
      const imgs = [...target.images];
      if (toIdx < 0 || toIdx >= imgs.length) return prev;
      const [moved] = imgs.splice(fromIdx, 1);
      imgs.splice(toIdx, 0, moved);
      target.images = imgs;
      variants[variantIdx] = target;
      return { ...prev, colorVariants: variants };
    });
  };

  // Order status update
  const handleUpdateOrderStatus = async (orderId: string, status: Order["status"]) => {
    try {
      const res = await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: orderId, status }),
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status } : o))
        );
        showNotification("success", `Order updated to ${status.toUpperCase()}`);
      }
    } catch (err) {
      console.error("Order status update failed:", err);
      showNotification("error", "Failed to update order status.");
    }
  };

  // Save Piece
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (colorMode === "single") {
      if (!formData.image && formData.images.length === 0) {
        showNotification(
          "error",
          "Please upload at least one photo from your device."
        );
        return;
      }
    } else {
      if (formData.colorVariants.length === 0) {
        showNotification("error", "Please add at least one colorway.");
        return;
      }
      const hasAnyPhoto = formData.colorVariants.some(
        (cv) => cv.images && cv.images.length > 0
      );
      if (!hasAnyPhoto) {
        showNotification(
          "error",
          "Please upload at least one photo for your colorways."
        );
        return;
      }
    }

    let primaryImage = "";
    let secondaryImage = "";
    let finalImages: string[] = [];
    let finalColorVariants: ColorVariant[] | undefined = undefined;

    if (colorMode === "single") {
      finalImages =
        formData.images.length > 0
          ? formData.images
          : formData.image
          ? [formData.image]
          : [];
      primaryImage = finalImages[0] || formData.image || "";
      secondaryImage =
        finalImages.length > 1
          ? finalImages[1]
          : formData.secondaryImage || primaryImage;
      finalColorVariants = undefined;
    } else {
      finalColorVariants = formData.colorVariants;
      // First colorway with photos provides the storefront catalog cover
      const leadColorway =
        formData.colorVariants.find(
          (cv) => cv.images && cv.images.length > 0
        ) || formData.colorVariants[0];
      const leadImages = leadColorway?.images || [];
      primaryImage = leadImages[0] || "";
      secondaryImage = leadImages[1] || primaryImage;
      finalImages = leadImages;
    }

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
      inStock:
        resolvedQuantity !== undefined
          ? resolvedQuantity > 0 && formData.inStock
          : formData.inStock,
      details: [],
      composition: "",
      subtitle: formData.theme,
      images: finalImages,
      colorVariants: finalColorVariants,
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
    const hasVariants = Boolean(
      product.colorVariants && product.colorVariants.length > 0
    );
    setColorMode(hasVariants ? "variants" : "single");
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
      colorVariants: product.colorVariants ? [...product.colorVariants] : [],
    });
    window.scrollTo({ top: 120, behavior: "smooth" });
    showNotification("success", `Editing "${product.name}"`);
  };

  const resetForm = () => {
    setEditingId(null);
    setColorMode("single");
    setNewColorName("");
    setNewColorHex("#1E1B18");
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
      colorVariants: [],
    });
  };

  const leadVariantImage = formData.colorVariants.find(
    (cv) => cv.images && cv.images.length > 0
  )?.images[0];

  const previewPrimaryImage =
    colorMode === "variants"
      ? leadVariantImage || formData.image || formData.images[0] || ""
      : formData.image || formData.images[0] || "";

  const livePreviewProduct: Product = {
    id: editingId || "preview-piece",
    name: formData.name || "Untitled Piece",
    subtitle: formData.theme,
    price: parseFormattedNumber(String(formData.price)) || 39000,
    category: formData.category,
    theme: formData.theme,
    image: previewPrimaryImage,
    secondaryImage: previewPrimaryImage,
    description: formData.description || "",
    details: [],
    composition: "",
    sizes: formData.sizes.length > 0 ? formData.sizes : ["Standard"],
    inStock: formData.inStock,
    isHeroFeatured: formData.isHeroFeatured,
    images:
      colorMode === "variants"
        ? (formData.colorVariants.find((cv) => cv.images && cv.images.length > 0)?.images || [])
        : (formData.images.length > 0 ? formData.images : undefined),
    colorVariants:
      colorMode === "variants" && formData.colorVariants.length > 0
        ? formData.colorVariants
        : undefined,
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

        {/* TAB SWITCHER: INVENTORY vs RECENT ORDERS */}
        <div className="flex items-center gap-2 mb-6 border-b border-[#2C2621]/15 pb-3">
          <button
            onClick={() => setActiveTab("inventory")}
            className={`px-4 py-2 rounded-full text-xs uppercase tracking-wider font-semibold transition-all flex items-center gap-2 ${
              activeTab === "inventory"
                ? "bg-[#1E1B18] text-[#FAF7F2] shadow-xs"
                : "bg-white/80 hover:bg-white text-[#5C4D3C] border border-[#2C2621]/15"
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Pieces &amp; Inventory ({products.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("orders");
              fetchOrders();
            }}
            className={`px-4 py-2 rounded-full text-xs uppercase tracking-wider font-semibold transition-all flex items-center gap-2 ${
              activeTab === "orders"
                ? "bg-[#1E1B18] text-[#FAF7F2] shadow-xs"
                : "bg-white/80 hover:bg-white text-[#5C4D3C] border border-[#2C2621]/15"
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Recent Orders ({orders.length})</span>
            {orders.filter((o) => o.status === "confirmed").length > 0 && (
              <span className="w-2 h-2 rounded-full bg-[#8C6D46] animate-pulse" />
            )}
          </button>
        </div>

        {activeTab === "orders" ? (
          /* ORDERS STUDIO VIEW */
          <div className="bg-[#FAF7F2] rounded-2xl p-5 sm:p-7 border border-[#2C2621]/15 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-[#2C2621]/10 gap-3">
              <div>
                <span className="text-[9px] tracking-[0.25em] uppercase text-[#8C7A6B] font-semibold block">
                  ATELIER ACQUISITIONS
                </span>
                <h3 className="font-serif text-lg sm:text-2xl uppercase font-semibold text-[#1E1B18]">
                  Recent Client Orders ({orders.length})
                </h3>
                <p className="text-xs text-[#5C4D3C] mt-0.5">
                  Real-time record of all client orders placed through the shopping bag.
                </p>
              </div>

              <button
                onClick={fetchOrders}
                className="px-3.5 py-1.5 border border-[#2C2621]/20 hover:border-[#1E1B18] rounded-full text-xs tracking-wider uppercase text-[#1E1B18] bg-white transition-all flex items-center gap-1.5 self-start sm:self-auto shadow-xs"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${loadingOrders ? "animate-spin" : ""}`}
                />
                <span>Refresh Orders</span>
              </button>
            </div>

            {loadingOrders ? (
              <div className="py-16 text-center text-xs tracking-wider uppercase text-[#8C7A6B]">
                Loading client orders...
              </div>
            ) : orders.length === 0 ? (
              <div className="py-16 text-center rounded-2xl bg-[#EDE5DC]/40 border border-dashed border-[#2C2621]/20 p-8">
                <Package className="w-10 h-10 text-[#8C7A6B] mx-auto mb-2 opacity-50" />
                <h4 className="font-serif text-base uppercase text-[#1E1B18] font-semibold mb-1">
                  No Client Orders Placed Yet
                </h4>
                <p className="text-xs text-[#5C4D3C] max-w-sm mx-auto leading-relaxed">
                  When a client checks out from the shopping bag, their selected pieces, colorways, sizes, and total will be logged here.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white rounded-2xl p-4 sm:p-5 border border-[#2C2621]/15 shadow-xs space-y-3"
                  >
                    {/* Order Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#2C2621]/10">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-serif text-sm sm:text-base font-bold text-[#1E1B18] tracking-wider">
                          {order.orderNumber}
                        </span>
                        <span className="text-[10px] text-[#8C7A6B] flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(order.createdAt).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        {order.promoCode && (
                          <span className="text-[8px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#8C6D46]/15 text-[#8C6D46] font-semibold">
                            Promo: {order.promoCode}
                          </span>
                        )}
                      </div>

                      {/* Status Badge & Status Actions */}
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[9px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full border ${
                            order.status === "delivered"
                              ? "bg-[#2A4D33]/15 text-[#2A4D33] border-[#2A4D33]/30"
                              : order.status === "shipped"
                              ? "bg-[#8C6D46]/15 text-[#8C6D46] border-[#8C6D46]/30"
                              : "bg-[#1E1B18]/10 text-[#1E1B18] border-[#1E1B18]/25"
                          }`}
                        >
                          ● {order.status.toUpperCase()}
                        </span>

                        {order.status === "confirmed" && (
                          <button
                            onClick={() => handleUpdateOrderStatus(order.id, "shipped")}
                            className="text-[9px] uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#1E1B18] hover:bg-[#8C6D46] text-[#FAF7F2] font-semibold transition-all"
                          >
                            Mark Shipped →
                          </button>
                        )}
                        {order.status === "shipped" && (
                          <button
                            onClick={() => handleUpdateOrderStatus(order.id, "delivered")}
                            className="text-[9px] uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#2A4D33] hover:bg-[#1E1B18] text-white font-semibold transition-all"
                          >
                            Mark Delivered ✓
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Items List */}
                    <div className="divide-y divide-[#2C2621]/5">
                      {order.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="py-2.5 flex items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-3">
                            <div className="relative w-12 h-14 rounded-lg overflow-hidden bg-[#EDE5DC] shrink-0 border border-[#2C2621]/10">
                              {item.productImage ? (
                                <Image
                                  src={item.productImage}
                                  alt={item.productName}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-[8px] text-[#8C7A6B]">
                                  Piece
                                </div>
                              )}
                            </div>
                            <div>
                              <h5 className="font-serif text-xs sm:text-sm uppercase font-semibold text-[#1E1B18]">
                                {item.productName}
                              </h5>
                              <div className="text-[10px] text-[#736555] flex items-center gap-1.5 flex-wrap mt-0.5">
                                <span>
                                  Size: <strong className="text-[#1E1B18]">{item.selectedSize}</strong>
                                </span>
                                {item.selectedColor && (
                                  <>
                                    <span>•</span>
                                    <span>
                                      Colorway: <strong className="text-[#8C6D46]">{item.selectedColor}</strong>
                                    </span>
                                  </>
                                )}
                                <span>•</span>
                                <span>
                                  Qty: <strong className="text-[#1E1B18]">{item.quantity}</strong>
                                </span>
                              </div>
                            </div>
                          </div>

                          <span className="font-serif text-xs sm:text-sm font-semibold text-[#1E1B18] shrink-0">
                            {formatNaira(item.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Order Totals Summary */}
                    <div className="pt-2.5 border-t border-[#2C2621]/10 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-[#5C4D3C] gap-2">
                      <div className="flex items-center gap-3 text-[11px] flex-wrap">
                        <span>Subtotal: {formatNaira(order.subtotal)}</span>
                        {order.discount > 0 && (
                          <span className="text-[#2A4D33]">
                            Discount: -{formatNaira(order.discount)}
                          </span>
                        )}
                        <span>
                          Shipping: {order.shipping === 0 ? "Complimentary" : formatNaira(order.shipping)}
                        </span>
                      </div>
                      <div className="text-sm font-serif font-bold text-[#1E1B18]">
                        Total: {formatNaira(order.total)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <>
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

              {/* SECTION 2: PHOTOGRAPHY & COLOR OPTIONS */}
              <div className="pt-4 border-t border-[#2C2621]/10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
                  <h4 className="text-xs tracking-[0.2em] uppercase font-semibold text-[#8C6D46] flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5" />
                    <span>2. PHOTOGRAPHY &amp; COLOR OPTIONS</span>
                  </h4>
                  <span className="text-[9px] text-[#8C7A6B]">
                    Choose single piece or color variants
                  </span>
                </div>

                {/* MODE TOGGLE: Single Color vs Multiple Colorways */}
                <div className="grid grid-cols-2 gap-2 p-1 bg-[#EDE5DC]/60 rounded-xl border border-[#2C2621]/15 mb-4">
                  <button
                    type="button"
                    onClick={() => {
                      setColorMode("single");
                      if (formData.images.length === 0 && formData.colorVariants.length > 0) {
                        const leadPhotos = formData.colorVariants[0].images;
                        if (leadPhotos && leadPhotos.length > 0) {
                          setFormData((prev) => ({
                            ...prev,
                            images: [...leadPhotos],
                            image: leadPhotos[0] || prev.image,
                          }));
                        }
                      }
                    }}
                    className={`py-2 px-3 rounded-lg text-[10px] sm:text-xs uppercase tracking-wider font-semibold transition-all flex items-center justify-center gap-1.5 ${
                      colorMode === "single"
                        ? "bg-[#1E1B18] text-[#FAF7F2] shadow-xs"
                        : "text-[#5C4D3C] hover:text-[#1E1B18] hover:bg-white/50"
                    }`}
                  >
                    <span>Single Color Piece</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setColorMode("variants");
                      if (formData.colorVariants.length === 0 && formData.images.length > 0) {
                        setFormData((prev) => ({
                          ...prev,
                          colorVariants: [
                            {
                              name: "Main Color",
                              hex: "#1E1B18",
                              images: [...prev.images],
                            },
                          ],
                        }));
                      }
                    }}
                    className={`py-2 px-3 rounded-lg text-[10px] sm:text-xs uppercase tracking-wider font-semibold transition-all flex items-center justify-center gap-1.5 ${
                      colorMode === "variants"
                        ? "bg-[#1E1B18] text-[#FAF7F2] shadow-xs"
                        : "text-[#5C4D3C] hover:text-[#1E1B18] hover:bg-white/50"
                    }`}
                  >
                    <Palette className="w-3.5 h-3.5" />
                    <span>Multiple Colorways</span>
                    {formData.colorVariants.length > 0 && (
                      <span className="w-4 h-4 rounded-full bg-[#8C6D46] text-[#FAF7F2] text-[8px] flex items-center justify-center font-bold">
                        {formData.colorVariants.length}
                      </span>
                    )}
                  </button>
                </div>

                {/* ── BRANCH A: SINGLE COLOR PIECE PHOTOS ── */}
                {colorMode === "single" && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[10px] text-[#736555]">
                        Upload photos for this single piece directly. First photo will automatically serve as the catalog cover.
                      </p>
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

                              {/* Quick reorder controls */}
                              <div className="absolute inset-0 bg-black/45 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex flex-col justify-between p-1">
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

                                <div className="flex justify-center gap-1">
                                  {idx > 0 && (
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        moveImage(idx, idx - 1);
                                      }}
                                      className="px-1.5 py-0.5 rounded bg-white/95 text-[#1E1B18] text-[8px] font-bold hover:bg-white shadow"
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
                                      className="px-1.5 py-0.5 rounded bg-white/95 text-[#1E1B18] text-[8px] font-bold hover:bg-white shadow"
                                      title="Move Right"
                                    >
                                      ▶
                                    </button>
                                  )}
                                </div>
                              </div>

                              <span
                                className={`absolute bottom-0 left-0 right-0 text-center text-[7px] font-bold uppercase tracking-wider py-0.5 opacity-0 sm:opacity-100 sm:group-hover:opacity-0 transition-opacity ${
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

                    {/* Fallback preview when no images[] */}
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
                            {formData.image.startsWith("http")
                              ? "Stored in Supabase Cloud ✓"
                              : formData.image
                              ? "Photo chosen ✓"
                              : "No photo chosen — upload from your device above"}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ── BRANCH B: MULTIPLE COLORWAYS ONLY ── */}
                {colorMode === "variants" && (
                  <div>
                    <div className="mb-3">
                      <p className="text-[10px] text-[#736555]">
                        Add each colorway for this piece (e.g. Hazel nut, Noir, Emerald). Upload dedicated photos for each color.
                        The first photo of <strong>Colorway #1</strong> will automatically serve as the storefront catalog cover.
                      </p>
                    </div>

                    {/* ADD NEW COLORWAY CREATOR BOX */}
                    <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-[#2C2621]/15 mb-4 shadow-xs space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-[#2C2621]/10">
                        <span className="text-[10px] tracking-[0.18em] uppercase font-bold text-[#8C6D46] flex items-center gap-1.5">
                          <Palette className="w-3.5 h-3.5" />
                          <span>NEW COLORWAY BUILDER</span>
                        </span>
                        <span className="text-[9px] text-[#8C7A6B]">
                          Name &rarr; Photos &rarr; Add
                        </span>
                      </div>

                      {/* Step 1: Color Name and Swatch */}
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                        <div className="sm:col-span-8">
                          <label className="text-[9px] uppercase tracking-wider text-[#8C7A6B] font-semibold block mb-1">
                            1. Colorway Name
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Hazel nut, Noir, Emerald Green, Burgundy"
                            value={newColorName}
                            onChange={(e) => handleColorNameChange(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                handleAddColorVariant();
                              }
                            }}
                            className="w-full bg-[#EDE5DC]/40 border border-[#2C2621]/20 rounded-xl px-3 py-2 text-xs text-[#1E1B18] placeholder:text-[#8C7A6B] focus:outline-none focus:border-[#1E1B18]"
                          />

                          {/* Live Color Recognition Indicator */}
                          {newColorName.trim() && resolveColorNameToHex(newColorName) && (
                            <div className="flex items-center gap-1.5 mt-1 text-[9px] text-[#2A4D33] font-semibold">
                              <span
                                className="w-2.5 h-2.5 rounded-full border border-black/20 shadow-xs shrink-0"
                                style={{ backgroundColor: newColorHex }}
                              />
                              <span>Recognized shade ({newColorHex}) — color swatch matched!</span>
                            </div>
                          )}
                        </div>

                        <div className="sm:col-span-4">
                          <label className="text-[9px] uppercase tracking-wider text-[#8C7A6B] font-semibold block mb-1">
                            Swatch Color
                          </label>
                          <div className="flex items-center gap-2 bg-[#EDE5DC]/40 border border-[#2C2621]/20 rounded-xl px-2.5 py-1.5">
                            <input
                              type="color"
                              value={newColorHex}
                              onChange={(e) => setNewColorHex(e.target.value)}
                              className="w-7 h-7 rounded-lg cursor-pointer border-0 bg-transparent p-0"
                              title="Fine-tune swatch color"
                            />
                            <span className="text-[10px] font-mono font-medium text-[#5C4D3C] uppercase truncate">
                              {newColorHex}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Quick-Pick Popular Fashion Palette */}
                      <div>
                        <span className="text-[8.5px] uppercase tracking-wider text-[#8C7A6B] block mb-1 font-medium">
                          Quick-Pick Atelier Shades:
                        </span>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {[
                            { name: "Hazel nut", hex: "#A87B51" },
                            { name: "Burgundy", hex: "#800020" },
                            { name: "Emerald", hex: "#097969" },
                            { name: "Champagne", hex: "#F7E7CE" },
                            { name: "Noir", hex: "#111111" },
                            { name: "Cream", hex: "#FFFDD0" },
                            { name: "Caramel", hex: "#C68B59" },
                            { name: "Mocha", hex: "#967969" },
                            { name: "Olive", hex: "#556B2F" },
                            { name: "Terracotta", hex: "#E2725B" },
                          ].map((shade) => (
                            <button
                              key={shade.name}
                              type="button"
                              onClick={() => {
                                setNewColorName(shade.name);
                                setNewColorHex(shade.hex);
                              }}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[8.5px] uppercase tracking-wider font-semibold bg-[#EDE5DC]/60 hover:bg-[#1E1B18] hover:text-white border border-[#2C2621]/15 text-[#5C4D3C] transition-all"
                            >
                              <span
                                className="w-2 h-2 rounded-full border border-black/20 shrink-0"
                                style={{ backgroundColor: shade.hex }}
                              />
                              <span>{shade.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Step 2: Upload Photos for this Color Right Here */}
                      <div className="pt-2 border-t border-[#2C2621]/10">
                        <label className="text-[9px] uppercase tracking-wider text-[#8C7A6B] font-semibold block mb-1.5">
                          2. Photos for &ldquo;{newColorName.trim() || "This Colorway"}&rdquo;
                        </label>

                        {/* Hidden multi-file input */}
                        <input
                          type="file"
                          ref={stagedColorFileInputRef}
                          id="staged-color-upload"
                          accept="image/*"
                          multiple
                          onChange={handleStagedColorImageUpload}
                          className="hidden"
                        />

                        <label
                          htmlFor="staged-color-upload"
                          className="w-full cursor-pointer py-3 px-4 bg-[#EDE5DC]/80 hover:bg-[#1E1B18] hover:text-white text-[#1E1B18] rounded-xl text-xs uppercase tracking-wider font-semibold transition-all border border-[#2C2621]/20 flex items-center justify-center gap-2 shadow-2xs"
                        >
                          <Camera className="w-4 h-4" />
                          <span>
                            {isUploadingStagedColor
                              ? "Uploading photos from device..."
                              : stagedColorImages.length > 0
                              ? "+ Choose More Photos for this Color"
                              : `Choose Photos for ${newColorName.trim() || "this Color"}`}
                          </span>
                        </label>

                        {/* Attached Photos Preview Strip */}
                        {stagedColorImages.length > 0 && (
                          <div className="mt-2.5">
                            <span className="text-[8.5px] text-[#8C6D46] uppercase font-semibold block mb-1">
                              {stagedColorImages.length} photo{stagedColorImages.length > 1 ? "s" : ""} attached:
                            </span>
                            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                              {stagedColorImages.map((url, idx) => (
                                <div
                                  key={url + idx}
                                  className="relative shrink-0 w-16 h-20 rounded-lg overflow-hidden border border-[#2C2621]/20 bg-[#EDE5DC] group"
                                >
                                  <Image
                                    src={url}
                                    alt={`Preview ${idx + 1}`}
                                    fill
                                    className="object-cover"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => removeStagedColorImage(url)}
                                    className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#992222] text-white text-[8px] flex items-center justify-center font-bold shadow"
                                    title="Remove photo"
                                  >
                                    ✕
                                  </button>
                                  {idx === 0 && (
                                    <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[6.5px] uppercase font-bold text-center py-0.5">
                                      Lead
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Step 3: Confirm Button to Add the Colorway */}
                      <div className="pt-2 border-t border-[#2C2621]/10">
                        <button
                          type="button"
                          onClick={handleAddColorVariant}
                          disabled={isUploadingStagedColor}
                          className="w-full py-3 bg-[#1E1B18] hover:bg-[#8C6D46] active:scale-[0.99] text-[#FAF7F2] rounded-xl text-xs tracking-[0.2em] uppercase font-semibold transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          <Plus className="w-4 h-4" />
                          <span>
                            ADD &ldquo;{newColorName.trim() || "COLORWAY"}&rdquo; TO PIECE
                            {stagedColorImages.length > 0
                              ? ` (${stagedColorImages.length} PHOTO${stagedColorImages.length > 1 ? "S" : ""})`
                              : ""}
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* List of Added Colorways */}
                    {formData.colorVariants.length === 0 ? (
                      <div className="p-4 rounded-xl border border-dashed border-[#2C2621]/20 bg-white/60 text-center">
                        <Palette className="w-6 h-6 text-[#8C7A6B]/50 mx-auto mb-1.5" />
                        <p className="text-xs font-serif uppercase tracking-wider text-[#1E1B18]">
                          No Colorways Added Yet
                        </p>
                        <p className="text-[10px] text-[#8C7A6B] mt-0.5">
                          Type a color name above (e.g. &ldquo;Hazel nut&rdquo;) and click <strong>Add Colorway</strong>.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {formData.colorVariants.map((cv, vIdx) => (
                          <div
                            key={cv.name + vIdx}
                            className={`bg-white rounded-xl p-3.5 border transition-all ${
                              vIdx === 0
                                ? "border-[#C99742] ring-1 ring-[#C99742]/30 shadow-xs"
                                : "border-[#2C2621]/15"
                            }`}
                          >
                            {/* Colorway Header */}
                            <div className="flex items-center justify-between pb-2 border-b border-[#2C2621]/10 gap-2 flex-wrap">
                              <div className="flex items-center gap-2">
                                {cv.hex && (
                                  <span
                                    className="w-4 h-4 rounded-full border border-black/20 shrink-0 shadow-xs"
                                    style={{ backgroundColor: cv.hex }}
                                  />
                                )}
                                <span className="font-serif text-sm uppercase font-semibold text-[#1E1B18]">
                                  {cv.name}
                                </span>
                                {vIdx === 0 ? (
                                  <span className="px-2 py-0.5 rounded-full bg-[#1E1B18] text-[#C99742] text-[8px] font-bold uppercase tracking-wider">
                                    ★ Cover Colorway
                                  </span>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => moveColorVariant(vIdx, 0)}
                                    className="text-[8px] uppercase tracking-wider text-[#8C6D46] hover:text-[#1E1B18] font-bold underline"
                                    title="Make this colorway the lead cover for catalog"
                                  >
                                    Set as Cover
                                  </button>
                                )}
                                <span className="text-[9px] text-[#8C7A6B]">
                                  ({cv.images.length} photo{cv.images.length === 1 ? "" : "s"})
                                </span>
                              </div>

                              <div className="flex items-center gap-2">
                                {vIdx > 0 && (
                                  <button
                                    type="button"
                                    onClick={() => moveColorVariant(vIdx, vIdx - 1)}
                                    className="px-1.5 py-0.5 rounded bg-[#EDE5DC] hover:bg-[#1E1B18] hover:text-white text-[#1E1B18] text-[8px] font-bold uppercase tracking-wider"
                                    title="Move Colorway Up"
                                  >
                                    ▲ Up
                                  </button>
                                )}
                                {vIdx < formData.colorVariants.length - 1 && (
                                  <button
                                    type="button"
                                    onClick={() => moveColorVariant(vIdx, vIdx + 1)}
                                    className="px-1.5 py-0.5 rounded bg-[#EDE5DC] hover:bg-[#1E1B18] hover:text-white text-[#1E1B18] text-[8px] font-bold uppercase tracking-wider"
                                    title="Move Colorway Down"
                                  >
                                    ▼ Down
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={() => handleRemoveColorVariant(vIdx)}
                                  className="text-[#8C7A6B] hover:text-[#992222] text-[10px] uppercase tracking-wider font-semibold flex items-center gap-1"
                                >
                                  <Trash2 className="w-3 h-3" />
                                  <span>Remove</span>
                                </button>
                              </div>
                            </div>

                            {/* Colorway Upload Controls & Photo Strip */}
                            <div className="mt-2.5">
                              {/* Upload Button */}
                              <div className="flex items-center gap-2 mb-2">
                                <input
                                  type="file"
                                  id={`variant-upload-${vIdx}`}
                                  accept="image/*"
                                  multiple
                                  onChange={(e) => handleVariantImageUpload(vIdx, e)}
                                  className="hidden"
                                />
                                <label
                                  htmlFor={`variant-upload-${vIdx}`}
                                  className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1E1B18] hover:bg-[#8C6D46] text-white rounded-full text-[9px] uppercase tracking-wider font-semibold transition-all shadow-xs"
                                >
                                  <UploadCloud className="w-3 h-3" />
                                  <span>
                                    {variantUploadingIdx === vIdx
                                      ? "Uploading photos..."
                                      : `+ Upload Photos for ${cv.name}`}
                                  </span>
                                </label>
                                <span className="text-[9px] text-[#8C7A6B]">
                                  PNG, JPG, WEBP from device
                                </span>
                              </div>

                              {/* Photo Thumbnails Strip for this colorway */}
                              {cv.images.length > 0 ? (
                                <div className="flex gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none">
                                  {cv.images.map((imgUrl, imgIdx) => (
                                    <div
                                      key={imgUrl + imgIdx}
                                      className={`relative shrink-0 w-16 h-20 rounded-lg overflow-hidden border-2 group ${
                                        vIdx === 0 && imgIdx === 0
                                          ? "border-[#C99742] ring-2 ring-[#C99742]/40"
                                          : "border-[#2C2621]/15"
                                      }`}
                                    >
                                      <Image
                                        src={imgUrl}
                                        alt={`${cv.name} ${imgIdx + 1}`}
                                        fill
                                        className="object-cover"
                                      />

                                      {/* Hover/Tap actions */}
                                      <div className="absolute inset-0 bg-black/45 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex flex-col justify-between p-1">
                                        <div className="flex justify-between items-center">
                                          {vIdx === 0 && imgIdx === 0 ? (
                                            <span className="px-1 py-0.5 rounded bg-[#C99742] text-[#1E1B18] text-[6.5px] font-bold uppercase tracking-wider">
                                              ★ Cover
                                            </span>
                                          ) : (
                                            <span className="text-[6.5px] text-white font-medium">
                                              #{imgIdx + 1}
                                            </span>
                                          )}
                                          <button
                                            type="button"
                                            onClick={() => handleRemoveVariantImage(vIdx, imgUrl)}
                                            className="w-4 h-4 rounded-full bg-[#992222] text-white text-[8px] flex items-center justify-center font-bold"
                                            title="Remove photo"
                                          >
                                            ✕
                                          </button>
                                        </div>

                                        {/* Reorder within colorway */}
                                        <div className="flex justify-center gap-1">
                                          {imgIdx > 0 && (
                                            <button
                                              type="button"
                                              onClick={() => moveVariantImage(vIdx, imgIdx, imgIdx - 1)}
                                              className="px-1 py-0.5 rounded bg-white text-[#1E1B18] text-[7px] font-bold"
                                              title="Move left"
                                            >
                                              ◀
                                            </button>
                                          )}
                                          {imgIdx < cv.images.length - 1 && (
                                            <button
                                              type="button"
                                              onClick={() => moveVariantImage(vIdx, imgIdx, imgIdx + 1)}
                                              className="px-1 py-0.5 rounded bg-white text-[#1E1B18] text-[7px] font-bold"
                                              title="Move right"
                                            >
                                              ▶
                                            </button>
                                          )}
                                        </div>
                                      </div>

                                      {vIdx === 0 && imgIdx === 0 && (
                                        <span className="absolute bottom-0 left-0 right-0 bg-[#1E1B18] text-[#C99742] text-[6.5px] font-bold uppercase text-center py-0.5">
                                          ★ COVER
                                        </span>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-[10px] text-[#8C7A6B] italic">
                                  No photos uploaded for this color yet. Click &quot;+ Upload Photos&quot; above.
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
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

                      {p.description && p.description.trim() ? (
                        <p className="text-[10px] text-[#5C4D3C] line-clamp-2 mt-0.5 max-w-xl italic">
                          &ldquo;{p.description}&rdquo;
                        </p>
                      ) : null}

                      <p className="text-[10px] text-[#736555] line-clamp-1 mt-0.5">Sizes: {p.sizes.join(", ")}</p>

                      {p.colorVariants && p.colorVariants.length > 0 && (
                        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                          <span className="text-[8px] uppercase tracking-wider text-[#8C7A6B] font-semibold">
                            Colorways ({p.colorVariants.length}):
                          </span>
                          {p.colorVariants.map((cv) => (
                            <span
                              key={cv.name}
                              className="inline-flex items-center gap-1 text-[8px] uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-[#EDE5DC] border border-[#2C2621]/10 text-[#1E1B18]"
                            >
                              {cv.hex && (
                                <span
                                  className="w-2 h-2 rounded-full border border-black/20 shrink-0"
                                  style={{ backgroundColor: cv.hex }}
                                />
                              )}
                              <span>{cv.name}</span>
                              {cv.images && cv.images.length > 0 && (
                                <span className="text-[7.5px] text-[#8C6D46] font-medium">
                                  ({cv.images.length})
                                </span>
                              )}
                            </span>
                          ))}
                        </div>
                      )}
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
        </>
      )}
      </main>
    </div>
  );
}
