import { NextResponse } from "next/server";
import { getStoredProducts, saveStoredProducts } from "@/lib/productsStorage";
import {
  fetchProductsFromSupabase,
  insertProductToSupabase,
  updateProductInSupabase,
  deleteProductFromSupabase,
} from "@/lib/supabase";
import { Product } from "@/data/products";

// GET /api/products
export async function GET() {
  try {
    // 1. Try reading live from Supabase
    const supabaseProducts = await fetchProductsFromSupabase();
    if (supabaseProducts !== null) {
      // Sync to local file as backup cache
      saveStoredProducts(supabaseProducts);
      return NextResponse.json(supabaseProducts);
    }
  } catch (err) {
    console.warn("Supabase fetch fallback to local:", err);
  }

  // 2. Fallback to local stored products
  const products = getStoredProducts();
  return NextResponse.json(products);
}

// POST /api/products (Create new product)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const products = getStoredProducts();

    // Auto-generate ID if not provided
    const id =
      body.id ||
      body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") +
        "-" +
        Date.now().toString().slice(-4);

    const newProduct: Product = {
      id,
      numberLabel: body.numberLabel || undefined,
      name: body.name || "Untitled Piece",
      subtitle: body.subtitle || "",
      price: typeof body.price === "number" ? body.price : (Number(body.price) || 0),
      originalPrice: body.originalPrice ? Number(body.originalPrice) : undefined,
      category: body.category || "sets",
      theme: body.theme || "Atelier Co-Ords",
      image:
        body.image || (Array.isArray(body.images) && body.images[0]) || "",
      secondaryImage:
        body.secondaryImage ||
        body.image ||
        (Array.isArray(body.images) && (body.images[1] || body.images[0])) ||
        "",
      images: Array.isArray(body.images) && body.images.length > 0
        ? body.images
        : [body.image, body.secondaryImage || body.image].filter(Boolean),
      description: body.description || "",
      details: Array.isArray(body.details) ? body.details : [],
      composition: body.composition || "",
      sizes: Array.isArray(body.sizes) && body.sizes.length > 0
        ? body.sizes
        : ["Standard"],
      inStock: body.inStock !== undefined ? Boolean(body.inStock) : true,
      quantity: body.quantity !== undefined ? (Number(body.quantity) || 0) : undefined,
      isHeroFeatured: Boolean(body.isHeroFeatured),
    };

    // Save to Supabase (in background/async)
    await insertProductToSupabase(newProduct);

    // Also update local cache
    const updated = [newProduct, ...products];
    saveStoredProducts(updated);

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("Failed to create product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}

// PUT /api/products (Update existing product)
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ error: "Product id is required" }, { status: 400 });
    }

    const products = getStoredProducts();
    const index = products.findIndex((p) => p.id === body.id);

    const updatedProduct: Product = {
      ...(index !== -1 ? products[index] : {}),
      ...body,
      price:
        body.price !== undefined
          ? typeof body.price === "number"
            ? body.price
            : Number(body.price) || 0
          : index !== -1
          ? products[index].price
          : 0,
      quantity:
        body.quantity !== undefined
          ? Number(body.quantity) || 0
          : index !== -1
          ? products[index].quantity
          : undefined,
    };

    // Update in Supabase
    await updateProductInSupabase(body.id, updatedProduct);

    // Update local cache
    if (index !== -1) {
      products[index] = updatedProduct;
      saveStoredProducts(products);
    } else {
      saveStoredProducts([updatedProduct, ...products]);
    }

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("Failed to update product:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

// PATCH /api/products (Quick toggle inStock or partial update)
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ error: "Product id is required" }, { status: 400 });
    }

    // Update in Supabase
    await updateProductInSupabase(body.id, body);

    const products = getStoredProducts();
    const index = products.findIndex((p) => p.id === body.id);

    if (index !== -1) {
      products[index] = {
        ...products[index],
        ...body,
      };
      saveStoredProducts(products);
      return NextResponse.json(products[index]);
    }

    return NextResponse.json(body);
  } catch (error) {
    console.error("Failed to patch product:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

// DELETE /api/products (Delete product by ID)
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Product id is required" }, { status: 400 });
    }

    // Delete in Supabase
    await deleteProductFromSupabase(id);

    const products = getStoredProducts();
    const filtered = products.filter((p) => p.id !== id);
    saveStoredProducts(filtered);

    return NextResponse.json({ success: true, removedId: id });
  } catch (error) {
    console.error("Failed to delete product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
