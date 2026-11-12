import { NextResponse } from "next/server";
import { Order, OrderItem } from "@/data/products";
import {
  fetchOrdersFromSupabase,
  insertOrderToSupabase,
  updateOrderStatusInSupabase,
} from "@/lib/supabase";

function generateOrderNumber(): string {
  const now = new Date();
  const datePart = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `RA-${datePart}-${rand}`;
}

// GET /api/orders — fetch all orders directly from Supabase
export async function GET() {
  try {
    const orders = await fetchOrdersFromSupabase();
    return NextResponse.json(orders);
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders from database" },
      { status: 500 }
    );
  }
}

// POST /api/orders — insert order directly to Supabase
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const items: OrderItem[] = Array.isArray(body.items)
      ? body.items.map((item: Record<string, unknown>) => ({
          productId: String(item.productId || ""),
          productName: String(item.productName || ""),
          productImage: String(item.productImage || ""),
          selectedSize: String(item.selectedSize || ""),
          selectedColor: item.selectedColor ? String(item.selectedColor) : undefined,
          price: Number(item.price) || 0,
          quantity: Number(item.quantity) || 1,
        }))
      : [];

    if (items.length === 0) {
      return NextResponse.json({ error: "No items in order" }, { status: 400 });
    }

    const order: Order = {
      id: `order-${Date.now()}`,
      orderNumber: generateOrderNumber(),
      items,
      subtotal: Number(body.subtotal) || 0,
      discount: Number(body.discount) || 0,
      shipping: Number(body.shipping) || 0,
      total: Number(body.total) || 0,
      promoCode: body.promoCode || undefined,
      status: "confirmed",
      customerNote: body.customerNote || undefined,
      createdAt: new Date().toISOString(),
    };

    const saved = await insertOrderToSupabase(order);
    if (!saved) {
      console.warn("Supabase order insert failed; returning order response.");
    }

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Failed to create order:", error);
    return NextResponse.json(
      { error: "Failed to create order in database" },
      { status: 500 }
    );
  }
}

// PATCH /api/orders — update order status in Supabase
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    if (!body.id || !body.status) {
      return NextResponse.json(
        { error: "Order id and status are required" },
        { status: 400 }
      );
    }

    const success = await updateOrderStatusInSupabase(body.id, body.status);
    if (!success) {
      return NextResponse.json(
        { error: "Failed to update order status in database" },
        { status: 500 }
      );
    }

    return NextResponse.json({ id: body.id, status: body.status, success: true });
  } catch (error) {
    console.error("Failed to update order:", error);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}
