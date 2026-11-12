import { NextResponse } from "next/server";
import path from "path";
import { uploadImageToSupabaseStorage } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate safe clean filename
    const ext = path.extname(file.name) || ".jpg";
    const cleanBase = path
      .basename(file.name, ext)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-");
    const filename = `${cleanBase || "piece"}-${Date.now()}${ext}`;
    const contentType = file.type || "image/jpeg";

    // Direct upload to Supabase Storage bucket 'product-images'
    const result = await uploadImageToSupabaseStorage(
      buffer,
      filename,
      contentType
    );

    if (result.url) {
      return NextResponse.json({
        success: true,
        url: result.url,
        filename,
        storage: "supabase",
      });
    }

    console.error("Supabase Storage upload failed:", result.error);
    return NextResponse.json(
      {
        error:
          result.error ||
          "Failed to upload to Supabase Storage. Please ensure the 'product-images' bucket exists and is public in Supabase.",
      },
      { status: 500 }
    );
  } catch (error) {
    console.error("Upload handler exception:", error);
    return NextResponse.json(
      { error: "Failed to process image upload." },
      { status: 500 }
    );
  }
}
