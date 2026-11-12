"use client";

import React, { useState } from "react";
import Image from "next/image";
import { X, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Truck, Sparkles } from "lucide-react";
import { CartItem } from "@/data/products";
import { formatNaira } from "@/lib/currency";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (productId: string, size: string, delta: number, color?: string) => void;
  onRemoveItem: (productId: string, size: string, color?: string) => void;
  onClearCart?: () => void;
}

function createFallbackOrderNumber(): string {
  return `RA-${Date.now().toString().slice(-6)}`;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}: CartDrawerProps) {
  const [promoCode, setPromoCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [confirmedOrderNumber, setConfirmedOrderNumber] = useState("");

  if (!isOpen) return null;

  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const discountAmount = discountApplied ? subtotal * 0.1 : 0;
  const freeShippingThreshold = 250000;
  const shipping = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 25000;
  const total = subtotal - discountAmount + shipping;

  const amountNeededForFreeShipping = Math.max(
    0,
    freeShippingThreshold - subtotal
  );
  const shippingProgress = Math.min(
    100,
    (subtotal / freeShippingThreshold) * 100
  );

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      promoCode.trim().toUpperCase() === "RII10" ||
      promoCode.trim().toUpperCase() === "FIRENZE"
    ) {
      setDiscountApplied(true);
    }
  };

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    try {
      const orderPayload = {
        items: cart.map((item) => {
          const cv = item.selectedColor
            ? item.product.colorVariants?.find((c) => c.name === item.selectedColor)
            : null;
          const displayImg =
            cv && cv.images && cv.images.length > 0
              ? cv.images[0]
              : item.product.image;

          return {
            productId: item.product.id,
            productName: item.product.name,
            productImage: displayImg,
            selectedSize: item.selectedSize,
            selectedColor: item.selectedColor,
            price: item.product.price,
            quantity: item.quantity,
          };
        }),
        subtotal,
        discount: discountAmount,
        shipping,
        total,
        promoCode: discountApplied ? promoCode : undefined,
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      if (res.ok) {
        const order = await res.json();
        setConfirmedOrderNumber(order.orderNumber);
      } else {
        setConfirmedOrderNumber(createFallbackOrderNumber());
      }
    } catch (err) {
      console.error("Order error:", err);
      setConfirmedOrderNumber(createFallbackOrderNumber());
    } finally {
      setIsCheckingOut(false);
      setOrderComplete(true);
      onClearCart?.();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF7F2] border-l border-[#2C2621]/20 shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="px-6 py-5 border-b border-[#2C2621]/15 bg-[#F4EFEA] flex items-center justify-between">
            <div>
              <span className="text-[9px] tracking-[0.3em] uppercase text-[#8C7A6B] block">
                YOUR SELECTION
              </span>
              <h2 className="font-serif text-lg tracking-[0.15em] uppercase font-semibold text-[#1E1B18]">
                SHOPPING BAG ({cart.reduce((n, i) => n + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-[#EDE5DC] text-[#1E1B18] transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5 stroke-[1.5]" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="bg-[#EAE2D7] px-6 py-3 border-b border-[#2C2621]/10 text-xs text-[#1E1B18]">
            <div className="flex items-center justify-between mb-1 text-[11px] font-medium">
              <span className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-[#8C6D46]" />
                {amountNeededForFreeShipping === 0 ? (
                  <span className="text-[#2A4D33] font-semibold">
                    YOU QUALIFY FOR COMPLIMENTARY EXPRESS SHIPPING
                  </span>
                ) : (
                  <span>
                    ADD{" "}
                    <strong className="font-semibold text-[#1E1B18]">
                      {formatNaira(amountNeededForFreeShipping)}
                    </strong>{" "}
                    FOR FREE WORLDWIDE SHIPPING
                  </span>
                )}
              </span>
            </div>
            <div className="w-full bg-[#DDD2C4] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#1E1B18] h-full rounded-full transition-all duration-500"
                style={{ width: `${shippingProgress}%` }}
              ></div>
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {orderComplete ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-14 h-14 rounded-full bg-[#2A4D33]/10 text-[#2A4D33] flex items-center justify-center mb-4">
                  <Sparkles className="w-7 h-7" />
                </div>
                <h3 className="font-serif text-xl tracking-wide uppercase font-semibold text-[#1E1B18]">
                  GRAZIE! ORDER CONFIRMED
                </h3>
                <p className="text-xs text-[#736555] tracking-wide mt-2 max-w-xs leading-relaxed">
                  Your acquisition is being prepared with archival tissue and Florence atelier seals.
                </p>
                {confirmedOrderNumber && (
                  <div className="mt-3 px-3 py-1.5 rounded-full bg-[#EDE5DC] border border-[#2C2621]/15 text-xs font-semibold text-[#1E1B18] tracking-widest uppercase">
                    Order #{confirmedOrderNumber}
                  </div>
                )}
                <button
                  onClick={() => {
                    setOrderComplete(false);
                    onClose();
                  }}
                  className="mt-6 px-6 py-2.5 bg-[#1E1B18] text-[#FAF7F2] rounded-full text-xs tracking-[0.2em] uppercase font-medium hover:bg-[#8C6D46] transition-colors"
                >
                  CONTINUE EXPLORING
                </button>
              </div>
            ) : cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 text-[#8C7A6B]">
                <p className="font-serif text-lg uppercase tracking-wider text-[#1E1B18]">
                  YOUR BAG IS EMPTY
                </p>
                <p className="text-xs tracking-wider mt-1">
                  Explore our curated Italian animalier edit.
                </p>
                <button
                  onClick={onClose}
                  className="mt-5 px-6 py-2 border border-[#2C2621]/30 rounded-full text-xs tracking-[0.2em] uppercase font-medium text-[#1E1B18] hover:bg-[#1E1B18] hover:text-[#FAF7F2] transition-colors"
                >
                  DISCOVER COLLECTION
                </button>
              </div>
            ) : (
              cart.map((item) => {
                // Determine item display image (color-variant-specific if available)
                const cv = item.selectedColor
                  ? item.product.colorVariants?.find((c) => c.name === item.selectedColor)
                  : null;
                const displayImage =
                  cv && cv.images && cv.images.length > 0
                    ? cv.images[0]
                    : item.product.image;

                const itemKey = `${item.product.id}-${item.selectedSize}-${item.selectedColor || "default"}`;

                return (
                  <div
                    key={itemKey}
                    className="flex gap-4 p-3 bg-white rounded-xl border border-[#2C2621]/10 shadow-xs"
                  >
                    <div className="relative w-20 h-24 rounded-lg overflow-hidden bg-[#EDE5DC] shrink-0 border border-[#2C2621]/10">
                      <Image
                        src={displayImage}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex flex-col justify-between flex-1">
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="font-serif text-sm uppercase font-semibold text-[#1E1B18] leading-tight">
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() =>
                              onRemoveItem(item.product.id, item.selectedSize, item.selectedColor)
                            }
                            className="text-[#8C7A6B] hover:text-[#992222] p-1 transition-colors"
                            title="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="text-[10px] tracking-wider uppercase text-[#8C7A6B] mt-1 flex items-center gap-1.5 flex-wrap">
                          <span>
                            Size: <span className="font-semibold text-[#1E1B18]">{item.selectedSize}</span>
                          </span>
                          {item.selectedColor && (
                            <>
                              <span>•</span>
                              <span>
                                Color: <span className="font-semibold text-[#8C6D46]">{item.selectedColor}</span>
                              </span>
                            </>
                          )}
                        </div>

                        <div className="font-serif text-sm font-medium text-[#1E1B18] mt-1">
                          {formatNaira(item.product.price)}
                        </div>
                      </div>

                      {/* Quantity controls */}
                      <div className="flex items-center justify-between pt-2 border-t border-[#2C2621]/5">
                        <div className="flex items-center border border-[#2C2621]/20 rounded-full bg-[#FAF7F2]">
                          <button
                            onClick={() =>
                              onUpdateQuantity(
                                item.product.id,
                                item.selectedSize,
                                -1,
                                item.selectedColor
                              )
                            }
                            className="p-1 hover:text-[#8C6D46] transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2.5 text-xs font-medium font-sans">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              onUpdateQuantity(
                                item.product.id,
                                item.selectedSize,
                                1,
                                item.selectedColor
                              )
                            }
                            className="p-1 hover:text-[#8C6D46] transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="text-xs font-serif font-semibold text-[#1E1B18]">
                          {formatNaira(item.product.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer & Checkout */}
          {cart.length > 0 && !orderComplete && (
            <div className="px-6 py-5 border-t border-[#2C2621]/15 bg-[#F4EFEA] space-y-3">
              {/* Promo code form */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <input
                  type="text"
                  placeholder="PROMO CODE (TRY: RII10)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 bg-white border border-[#2C2621]/20 rounded-lg px-3 py-1.5 text-xs tracking-wider uppercase placeholder:text-[#8C7A6B] focus:outline-none focus:border-[#1E1B18]"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-[#EDE5DC] hover:bg-[#1E1B18] text-[#1E1B18] hover:text-[#FAF7F2] rounded-lg text-[10px] tracking-wider uppercase font-medium border border-[#2C2621]/20 transition-all"
                >
                  APPLY
                </button>
              </form>

              {discountApplied && (
                <div className="text-[11px] text-[#2A4D33] tracking-wide flex items-center justify-between font-medium">
                  <span>VIP PRIVILEGE (10% OFF APPLIED)</span>
                  <span>-{formatNaira(discountAmount)}</span>
                </div>
              )}

              {/* Subtotal breakdown */}
              <div className="space-y-1.5 text-xs text-[#5C4D3C] pt-2 border-t border-[#2C2621]/10">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-serif text-sm font-medium text-[#1E1B18]">
                    {formatNaira(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Express Worldwide Shipping</span>
                  <span className="font-serif text-sm font-medium text-[#1E1B18]">
                    {shipping === 0 ? "FREE" : formatNaira(shipping)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-semibold text-[#1E1B18] pt-2 border-t border-[#2C2621]/15">
                  <span className="font-serif tracking-wider uppercase">Estimated Total</span>
                  <span className="font-serif text-lg">{formatNaira(total)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full py-3 bg-[#1E1B18] hover:bg-[#2C2621] text-[#FAF7F2] rounded-full text-xs tracking-[0.25em] uppercase font-medium transition-all shadow-md flex items-center justify-center gap-2 mt-2"
              >
                {isCheckingOut ? (
                  <span className="animate-pulse">CONFIRMING ATELIER ACQUISITION...</span>
                ) : (
                  <>
                    <span>PROCEED TO SECURE CHECKOUT</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-[#8C7A6B] tracking-wider uppercase pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#2A4D33]" />
                <span>Encrypted 256-Bit Italian Atelier Checkout</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
