import { NextResponse } from "next/server";
import { getStoredProducts, saveStoredProducts } from "@/lib/productsStorage";
import { Product } from "@/data/products";

// GET /api/products
export async function GET() {
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

    // Auto-assign next number label if needed (e.g. "9. TUSCAN SILK BLOUSE")
    const nextNum = products.length + 1;
    const numberLabel =
      body.numberLabel && body.numberLabel.trim() !== ""
        ? body.numberLabel
        : `${nextNum}. ${body.name.toUpperCase()}`;

    const newProduct: Product = {
      id,
      numberLabel,
      name: body.name || "Untitled Archive Piece",
      subtitle: body.subtitle || "Florentine Collection",
      price: Number(body.price) || 120000,
      originalPrice: body.originalPrice ? Number(body.originalPrice) : undefined,
      category: body.category || "outerwear",
      theme: body.theme || "Modern Muse",
      image:
        body.image ||
        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=85",
      secondaryImage:
        body.secondaryImage ||
        body.image ||
        "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=85",
      description:
        body.description ||
        "Hand-tailored Florentine animalier statement piece featuring artisanal print placement and sustainable Italian finishing.",
      details: Array.isArray(body.details) && body.details.length > 0
        ? body.details
        : [
            "Hand-finished in Florence atelier",
            "Archival animalier print placement",
            "100% Italian sustainable tailoring",
          ],
      composition:
        body.composition || "100% Italian Silk Charmeuse • Mother of Pearl buttons",
      sizes: Array.isArray(body.sizes) && body.sizes.length > 0
        ? body.sizes
        : ["XS", "S", "M", "L"],
      inStock: body.inStock !== undefined ? Boolean(body.inStock) : true,
      isHeroFeatured: Boolean(body.isHeroFeatured),
    };

    // Prepend or append to products list
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

    if (index === -1) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const updatedProduct: Product = {
      ...products[index],
      ...body,
      price: Number(body.price) || products[index].price,
    };

    products[index] = updatedProduct;
    saveStoredProducts(products);

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

    const products = getStoredProducts();
    const index = products.findIndex((p) => p.id === body.id);

    if (index === -1) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    products[index] = {
      ...products[index],
      ...body,
    };

    saveStoredProducts(products);
    return NextResponse.json(products[index]);
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

    const products = getStoredProducts();
    const filtered = products.filter((p) => p.id !== id);

    if (filtered.length === products.length) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

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

