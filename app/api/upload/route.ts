import { NextResponse } from "next/server";
import fs from "fs";
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

    // 1. Try uploading to Supabase Storage bucket 'product-images'
    const supabaseUrl = await uploadImageToSupabaseStorage(
      buffer,
      filename,
      contentType
    );

    if (supabaseUrl) {
      return NextResponse.json({
        success: true,
        url: supabaseUrl,
        filename,
        storage: "supabase",
      });
    }

    // 2. Fallback to local storage in public/uploads/
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, filename);
    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/${filename}`;
    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename,
      storage: "local",
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload file from device" },
      { status: 500 }
    );
  }
}
