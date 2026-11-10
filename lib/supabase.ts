import { Product } from "@/data/products";

const SUPABASE_URL = (
  process.env.SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://sypxbucrlhyqxkxfartw.supabase.co"
).replace(/\/rest\/v1\/?$/, "").replace(/\/$/, "");

const SERVICE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "";

function getHeaders(contentType: string = "application/json") {
  return {
    apikey: SERVICE_KEY,
    Authorization: `Bearer ${SERVICE_KEY}`,
    ...(contentType ? { "Content-Type": contentType } : {}),
  };
}

// Convert DB snake_case record to camelCase Product
function mapDbToProduct(row: Record<string, unknown>): Product {
  const details = Array.isArray(row.details)
    ? (row.details as string[])
    : typeof row.details === "string"
    ? JSON.parse(row.details)
    : [];

  const sizes = Array.isArray(row.sizes)
    ? (row.sizes as string[])
    : typeof row.sizes === "string"
    ? JSON.parse(row.sizes)
    : ["XS", "S", "M", "L"];

  const images = Array.isArray(row.images)
    ? (row.images as string[])
    : typeof row.images === "string"
    ? JSON.parse(row.images)
    : [];

  const rawDesc = (row.description as string) || "";
  const description =
    rawDesc.toLowerCase().includes("hand-tailored") ||
    rawDesc.toLowerCase().includes("florentine") ||
    rawDesc.toLowerCase().includes("animalier statement piece")
      ? ""
      : rawDesc;

  const rawComp = (row.composition as string) || "";
  const composition =
    rawComp.toLowerCase().includes("silk charmeuse") ||
    rawComp.toLowerCase().includes("mother of pearl") ||
    rawComp.toLowerCase().includes("100% italian silk")
      ? ""
      : rawComp;

  const cleanDetails = details.filter(
    (d: string) =>
      !d.toLowerCase().includes("florence") &&
      !d.toLowerCase().includes("animalier print placement") &&
      !d.toLowerCase().includes("sustainable italian tailoring")
  );

  return {
    id: String(row.id),
    numberLabel: (row.number_label as string) || (row.numberLabel as string) || "",
    name: (row.name as string) || "Untitled Piece",
    subtitle: (row.subtitle as string) || "",
    price: Number(row.price) || 0,
    category: (row.category as Product["category"]) || "sets",
    theme: (row.theme as Product["theme"]) || "Atelier Co-Ords",
    image: (row.image as string) || "",
    secondaryImage: (row.secondary_image as string) || (row.secondaryImage as string) || (row.image as string) || "",
    images: images.length > 0 ? images : undefined,
    description,
    composition,
    details: cleanDetails,
    sizes,
    inStock: row.in_stock !== undefined ? Boolean(row.in_stock) : true,
    quantity: row.quantity !== undefined && row.quantity !== null ? Number(row.quantity) : undefined,
    isHeroFeatured: Boolean(row.is_hero_featured),
  };
}

// Convert camelCase Product to DB snake_case record
function mapProductToDb(p: Product): Record<string, unknown> {
  const record: Record<string, unknown> = {
    id: p.id,
    number_label: p.numberLabel || "",
    name: p.name,
    subtitle: p.subtitle || "",
    price: p.price,
    category: p.category,
    theme: p.theme,
    image: p.image,
    secondary_image: p.secondaryImage || p.image,
    images: p.images || [p.image, p.secondaryImage || p.image],
    description: p.description || "",
    composition: p.composition || "",
    details: p.details || [],
    sizes: p.sizes || ["XS", "S", "M", "L"],
    in_stock: p.inStock,
    is_hero_featured: Boolean(p.isHeroFeatured),
  };

  // Only include quantity if explicitly present
  if (p.quantity !== undefined) {
    record.quantity = p.quantity;
  }

  return record;
}

export async function fetchProductsFromSupabase(): Promise<Product[] | null> {
  if (!SERVICE_KEY) return null;

  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/products?select=*&order=created_at.desc`,
      {
        headers: getHeaders(),
        cache: "no-store",
      }
    );

    if (!res.ok) {
      console.warn("Supabase fetch returned status:", res.status);
      return null;
    }

    const rows = await res.json();
    if (Array.isArray(rows) && rows.length > 0) {
      return rows.map(mapDbToProduct);
    }
    return rows.length === 0 ? [] : null;
  } catch (error) {
    console.error("Failed to query Supabase products:", error);
    return null;
  }
}

export async function insertProductToSupabase(product: Product): Promise<boolean> {
  if (!SERVICE_KEY) return false;

  try {
    const payload = mapProductToDb(product);
    let res = await fetch(`${SUPABASE_URL}/rest/v1/products`, {
      method: "POST",
      headers: {
        ...getHeaders(),
        Prefer: "return=minimal",
      },
      body: JSON.stringify(payload),
    });

    // If quantity column doesn't exist yet in Supabase schema, retry without it
    if (!res.ok && payload.quantity !== undefined) {
      const errText = await res.text();
      if (errText.includes("quantity")) {
        const fallbackPayload = { ...payload };
        delete fallbackPayload.quantity;
        res = await fetch(`${SUPABASE_URL}/rest/v1/products`, {
          method: "POST",
          headers: {
            ...getHeaders(),
            Prefer: "return=minimal",
          },
          body: JSON.stringify(fallbackPayload),
        });
      } else {
        console.error("Supabase insert error:", res.status, errText);
        return false;
      }
    }

    if (!res.ok) {
      const errText = await res.text();
      console.error("Supabase insert error:", res.status, errText);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Supabase insert exception:", error);
    return false;
  }
}

export async function updateProductInSupabase(
  id: string,
  product: Partial<Product>
): Promise<boolean> {
  if (!SERVICE_KEY) return false;

  try {
    const updatePayload: Record<string, unknown> = {};
    if (product.name !== undefined) updatePayload.name = product.name;
    if (product.subtitle !== undefined) updatePayload.subtitle = product.subtitle;
    if (product.numberLabel !== undefined) updatePayload.number_label = product.numberLabel;
    if (product.price !== undefined) updatePayload.price = product.price;
    if (product.category !== undefined) updatePayload.category = product.category;
    if (product.theme !== undefined) updatePayload.theme = product.theme;
    if (product.image !== undefined) updatePayload.image = product.image;
    if (product.secondaryImage !== undefined) updatePayload.secondary_image = product.secondaryImage;
    if (product.images !== undefined) updatePayload.images = product.images;
    if (product.description !== undefined) updatePayload.description = product.description;
    if (product.composition !== undefined) updatePayload.composition = product.composition;
    if (product.details !== undefined) updatePayload.details = product.details;
    if (product.sizes !== undefined) updatePayload.sizes = product.sizes;
    if (product.inStock !== undefined) updatePayload.in_stock = product.inStock;
    if (product.quantity !== undefined) updatePayload.quantity = product.quantity;
    if (product.isHeroFeatured !== undefined) updatePayload.is_hero_featured = product.isHeroFeatured;

    let res = await fetch(
      `${SUPABASE_URL}/rest/v1/products?id=eq.${encodeURIComponent(id)}`,
      {
        method: "PATCH",
        headers: {
          ...getHeaders(),
          Prefer: "return=minimal",
        },
        body: JSON.stringify(updatePayload),
      }
    );

    // If quantity column doesn't exist yet in Supabase schema, retry without it
    if (!res.ok && updatePayload.quantity !== undefined) {
      const errText = await res.text();
      if (errText.includes("quantity")) {
        delete updatePayload.quantity;
        res = await fetch(
          `${SUPABASE_URL}/rest/v1/products?id=eq.${encodeURIComponent(id)}`,
          {
            method: "PATCH",
            headers: {
              ...getHeaders(),
              Prefer: "return=minimal",
            },
            body: JSON.stringify(updatePayload),
          }
        );
      }
    }

    return res.ok;
  } catch (error) {
    console.error("Supabase update error:", error);
    return false;
  }
}

export async function deleteProductFromSupabase(id: string): Promise<boolean> {
  if (!SERVICE_KEY) return false;

  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/products?id=eq.${encodeURIComponent(id)}`,
      {
        method: "DELETE",
        headers: getHeaders(),
      }
    );
    return res.ok;
  } catch (error) {
    console.error("Supabase delete error:", error);
    return false;
  }
}

export async function uploadImageToSupabaseStorage(
  fileBuffer: Buffer | ArrayBuffer,
  filename: string,
  contentType: string
): Promise<string | null> {
  if (!SERVICE_KEY) return null;

  try {
    const bucket = "product-images";
    const uploadUrl = `${SUPABASE_URL}/storage/v1/object/${bucket}/${encodeURIComponent(filename)}`;

    const res = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        apikey: SERVICE_KEY,
        Authorization: `Bearer ${SERVICE_KEY}`,
        "Content-Type": contentType || "image/jpeg",
        "x-upsert": "true",
      },
      body: fileBuffer as unknown as BodyInit,
    });

    if (res.ok) {
      // Public URL format
      return `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${encodeURIComponent(filename)}`;
    } else {
      const err = await res.text();
      console.warn("Supabase storage upload failed, falling back to local:", res.status, err);
      return null;
    }
  } catch (error) {
    console.error("Supabase storage exception:", error);
    return null;
  }
}

