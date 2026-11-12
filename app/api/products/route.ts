import { NextResponse } from "next/server";
import {
  fetchProductsFromSupabase,
  insertProductToSupabase,
  updateProductInSupabase,
  deleteProductFromSupabase,
} from "@/lib/supabase";
import { Product } from "@/data/products";

// GET /api/products — 100% from Supabase database
export async function GET() {
  try {
    const supabaseProducts = await fetchProductsFromSupabase();
    if (supabaseProducts !== null) {
      return NextResponse.json(supabaseProducts);
    }
    return NextResponse.json([]);
  } catch (err) {
    console.error("Supabase fetch error:", err);
    return NextResponse.json(
      { error: "Failed to load products from database" },
      { status: 500 }
    );
  }
}

// POST /api/products (Create new product in Supabase)
export async function POST(request: Request) {
  try {
    const body = await request.json();

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
      colorVariants: Array.isArray(body.colorVariants) && body.colorVariants.length > 0
        ? body.colorVariants
        : undefined,
    };

    const success = await insertProductToSupabase(newProduct);
    if (!success) {
      return NextResponse.json(
        { error: "Failed to insert product into Supabase" },
        { status: 500 }
      );
    }

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("Failed to create product:", error);
    return NextResponse.json(
      { error: "Failed to create product in database" },
      { status: 500 }
    );
  }
}

// PUT /api/products (Update existing product in Supabase)
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ error: "Product id is required" }, { status: 400 });
    }

    const updatedProduct: Partial<Product> = {
      ...body,
      price:
        body.price !== undefined
          ? typeof body.price === "number"
            ? body.price
            : Number(body.price) || 0
          : undefined,
      quantity:
        body.quantity !== undefined
          ? Number(body.quantity) || 0
          : undefined,
    };

    const success = await updateProductInSupabase(body.id, updatedProduct);
    if (!success) {
      return NextResponse.json(
        { error: "Failed to update product in Supabase" },
        { status: 500 }
      );
    }

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("Failed to update product:", error);
    return NextResponse.json(
      { error: "Failed to update product in database" },
      { status: 500 }
    );
  }
}

// PATCH /api/products (Quick toggle inStock or partial update in Supabase)
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ error: "Product id is required" }, { status: 400 });
    }

    const success = await updateProductInSupabase(body.id, body);
    if (!success) {
      return NextResponse.json(
        { error: "Failed to update product in Supabase" },
        { status: 500 }
      );
    }

    return NextResponse.json(body);
  } catch (error) {
    console.error("Failed to patch product:", error);
    return NextResponse.json(
      { error: "Failed to update product in database" },
      { status: 500 }
    );
  }
}

// DELETE /api/products (Delete product by ID from Supabase)
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Product id is required" }, { status: 400 });
    }

    const success = await deleteProductFromSupabase(id);
    if (!success) {
      return NextResponse.json(
        { error: "Failed to delete product from Supabase" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, removedId: id });
  } catch (error) {
    console.error("Failed to delete product:", error);
    return NextResponse.json(
      { error: "Failed to delete product from database" },
      { status: 500 }
    );
  }
}
