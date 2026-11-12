import { Product, ColorVariant, Order, OrderItem } from "@/data/products";

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

  let colorVariants: ColorVariant[] | undefined;
  const rawCV = row.color_variants ?? row.colorVariants;
  if (rawCV) {
    try {
      const parsed = typeof rawCV === "string" ? JSON.parse(rawCV) : rawCV;
      if (Array.isArray(parsed) && parsed.length > 0) {
        colorVariants = parsed.map((item: Record<string, unknown>) => ({
          name: String(item.name || "").trim(),
          hex: item.hex ? String(item.hex) : undefined,
          images: Array.isArray(item.images) ? (item.images as string[]) : [],
          quantity:
            item.quantity !== undefined && item.quantity !== null && item.quantity !== ""
              ? Number(item.quantity)
              : undefined,
          price:
            item.price !== undefined && item.price !== null && item.price !== ""
              ? Number(item.price)
              : undefined,
          sizes: Array.isArray(item.sizes) ? (item.sizes as string[]) : undefined,
        })) as ColorVariant[];
      }
    } catch {
      // ignore malformed color_variants
    }
  }

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
    colorVariants,
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

  // Only include color_variants if explicitly present
  if (p.colorVariants && p.colorVariants.length > 0) {
    record.color_variants = p.colorVariants;
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
        delete fallbackPayload.color_variants;
        res = await fetch(`${SUPABASE_URL}/rest/v1/products`, {
          method: "POST",
          headers: {
            ...getHeaders(),
            Prefer: "return=minimal",
          },
          body: JSON.stringify(fallbackPayload),
        });
      } else if (errText.includes("color_variants")) {
        const fallbackPayload = { ...payload };
        delete fallbackPayload.color_variants;
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

    // If color_variants column doesn't exist, retry without it
    if (!res.ok && payload.color_variants !== undefined) {
      const errText2 = await res.text();
      if (errText2.includes("color_variants")) {
        const fallbackPayload = { ...payload };
        delete fallbackPayload.color_variants;
        res = await fetch(`${SUPABASE_URL}/rest/v1/products`, {
          method: "POST",
          headers: {
            ...getHeaders(),
            Prefer: "return=minimal",
          },
          body: JSON.stringify(fallbackPayload),
        });
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
    if (product.colorVariants !== undefined) updatePayload.color_variants = product.colorVariants;

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
        delete updatePayload.color_variants;
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

    // If color_variants column doesn't exist, retry without it
    if (!res.ok && updatePayload.color_variants !== undefined) {
      const errText2 = await res.text();
      if (errText2.includes("color_variants")) {
        delete updatePayload.color_variants;
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

export function extractStorageFilename(
  imageUrl: string,
  bucket = "product-images"
): string | null {
  if (!imageUrl || typeof imageUrl !== "string") return null;
  const marker = `/${bucket}/`;
  const idx = imageUrl.indexOf(marker);
  if (idx !== -1) {
    const raw = imageUrl.substring(idx + marker.length).split("?")[0];
    try {
      return decodeURIComponent(raw);
    } catch {
      return raw;
    }
  }
  return null;
}

export async function deleteImagesFromSupabaseStorage(
  filenames: string[],
  bucket = "product-images"
): Promise<boolean> {
  if (!SERVICE_KEY || !filenames.length) return false;

  const valid = Array.from(new Set(filenames.filter(Boolean)));
  if (!valid.length) return false;

  try {
    const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${bucket}`, {
      method: "DELETE",
      headers: {
        apikey: SERVICE_KEY,
        Authorization: `Bearer ${SERVICE_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prefixes: valid,
      }),
    });

    if (res.ok) {
      return true;
    }

    // Fallback: try individual delete
    for (const fn of valid) {
      try {
        await fetch(
          `${SUPABASE_URL}/storage/v1/object/${bucket}/${encodeURIComponent(fn)}`,
          {
            method: "DELETE",
            headers: {
              apikey: SERVICE_KEY,
              Authorization: `Bearer ${SERVICE_KEY}`,
            },
          }
        );
      } catch {
        // continue
      }
    }
    return true;
  } catch (error) {
    console.error("Supabase storage delete error:", error);
    return false;
  }
}

export async function deleteProductFromSupabase(id: string): Promise<boolean> {
  if (!SERVICE_KEY) return false;

  try {
    // 1. Fetch the piece first to discover all associated images in bucket
    const imagesToDelete: string[] = [];
    try {
      const productRes = await fetch(
        `${SUPABASE_URL}/rest/v1/products?id=eq.${encodeURIComponent(id)}&select=*`,
        {
          headers: getHeaders(),
        }
      );
      if (productRes.ok) {
        const rows = await productRes.json();
        if (Array.isArray(rows) && rows.length > 0) {
          const p = rows[0];
          if (typeof p.image === "string") imagesToDelete.push(p.image);
          if (typeof p.secondary_image === "string") imagesToDelete.push(p.secondary_image);
          if (Array.isArray(p.images)) {
            for (const img of p.images) {
              if (typeof img === "string") imagesToDelete.push(img);
            }
          }
          if (Array.isArray(p.color_variants)) {
            for (const cv of p.color_variants) {
              if (cv && Array.isArray(cv.images)) {
                for (const cImg of cv.images) {
                  if (typeof cImg === "string") imagesToDelete.push(cImg);
                }
              }
            }
          }
        }
      }
    } catch (err) {
      console.warn("Failed to retrieve images prior to product deletion:", err);
    }

    // 2. Delete the product row from the database
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/products?id=eq.${encodeURIComponent(id)}`,
      {
        method: "DELETE",
        headers: getHeaders(),
      }
    );

    if (res.ok) {
      // 3. Automatically delete all associated images from the storage bucket
      const filenames = imagesToDelete
        .map((url) => extractStorageFilename(url, "product-images"))
        .filter((name): name is string => Boolean(name));

      if (filenames.length > 0) {
        await deleteImagesFromSupabaseStorage(filenames, "product-images");
      }
      return true;
    }

    return false;
  } catch (error) {
    console.error("Supabase delete error:", error);
    return false;
  }
}

export async function uploadImageToSupabaseStorage(
  fileBuffer: Buffer | ArrayBuffer,
  filename: string,
  contentType: string
): Promise<{ url: string | null; error?: string }> {
  if (!SERVICE_KEY) {
    return {
      url: null,
      error: "Supabase service key is not configured in environment variables",
    };
  }

  const bucket = "product-images";
  const uploadUrl = `${SUPABASE_URL}/storage/v1/object/${bucket}/${encodeURIComponent(filename)}`;
  const uint8 = fileBuffer instanceof Buffer ? new Uint8Array(fileBuffer) : new Uint8Array(fileBuffer);
  const mime = contentType || "image/jpeg";

  // Retry up to 3 times to recover from transient socket drops / Cloudflare keep-alive resets
  const maxAttempts = 3;
  let lastErrorMessage = "Unknown upload error";

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const res = await fetch(uploadUrl, {
        method: "POST",
        headers: {
          apikey: SERVICE_KEY,
          Authorization: `Bearer ${SERVICE_KEY}`,
          "Content-Type": mime,
          "Content-Length": String(uint8.byteLength),
          "x-upsert": "true",
          Connection: attempt > 1 ? "close" : "keep-alive",
        },
        body: uint8,
        // @ts-expect-error duplex is required in Node fetch for binary uploads
        duplex: "half",
      });

      if (res.ok) {
        return {
          url: `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${encodeURIComponent(filename)}`,
        };
      } else {
        const errText = await res.text();
        console.error(`Supabase storage upload error (attempt ${attempt}):`, res.status, errText);
        lastErrorMessage = `Supabase Storage error (${res.status}): ${errText}`;
        if (res.status === 400 || res.status === 401 || res.status === 403) {
          // Authentication or validation errors should not retry
          break;
        }
      }
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      lastErrorMessage = err.message;
      console.warn(`Supabase storage upload socket drop on attempt ${attempt}:`, err.message);
      if (attempt < maxAttempts) {
        // Wait briefly before retrying with a fresh socket connection
        await new Promise((resolve) => setTimeout(resolve, 500 * attempt));
      }
    }
  }

  return {
    url: null,
    error: lastErrorMessage,
  };
}

// ── ORDERS PERSISTENCE IN SUPABASE ──────────────────────────────────────

function mapDbToOrder(row: Record<string, unknown>): Order {
  const items = Array.isArray(row.items)
    ? (row.items as OrderItem[])
    : typeof row.items === "string"
    ? JSON.parse(row.items)
    : [];

  return {
    id: String(row.id),
    orderNumber: (row.order_number as string) || "",
    items,
    subtotal: Number(row.subtotal) || 0,
    discount: Number(row.discount) || 0,
    shipping: Number(row.shipping) || 0,
    total: Number(row.total) || 0,
    promoCode: (row.promo_code as string) || undefined,
    status: (row.status as Order["status"]) || "confirmed",
    customerNote: (row.customer_note as string) || undefined,
    createdAt: (row.created_at as string) || new Date().toISOString(),
  };
}

export async function fetchOrdersFromSupabase(): Promise<Order[]> {
  if (!SERVICE_KEY) return [];

  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/orders?select=*&order=created_at.desc`,
      {
        headers: getHeaders(),
        cache: "no-store",
      }
    );

    if (!res.ok) {
      console.warn("Supabase orders fetch returned status:", res.status);
      return [];
    }

    const rows = await res.json();
    if (Array.isArray(rows)) {
      return rows.map(mapDbToOrder);
    }
    return [];
  } catch (error) {
    console.error("Failed to query Supabase orders:", error);
    return [];
  }
}

export async function insertOrderToSupabase(order: Order): Promise<boolean> {
  if (!SERVICE_KEY) return false;

  try {
    const payload = {
      id: order.id,
      order_number: order.orderNumber,
      items: order.items,
      subtotal: order.subtotal,
      discount: order.discount,
      shipping: order.shipping,
      total: order.total,
      promo_code: order.promoCode || null,
      status: order.status,
      customer_note: order.customerNote || null,
    };

    const res = await fetch(`${SUPABASE_URL}/rest/v1/orders`, {
      method: "POST",
      headers: {
        ...getHeaders(),
        Prefer: "return=minimal",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Supabase order insert error:", res.status, err);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Supabase order insert exception:", error);
    return false;
  }
}

export async function updateOrderStatusInSupabase(
  id: string,
  status: Order["status"]
): Promise<boolean> {
  if (!SERVICE_KEY) return false;

  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/orders?id=eq.${encodeURIComponent(id)}`,
      {
        method: "PATCH",
        headers: {
          ...getHeaders(),
          Prefer: "return=minimal",
        },
        body: JSON.stringify({ status }),
      }
    );
    return res.ok;
  } catch (error) {
    console.error("Supabase order update error:", error);
    return false;
  }
}

