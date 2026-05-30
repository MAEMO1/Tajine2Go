import { NextResponse } from "next/server";
import { checkAdminAuth } from "@/lib/auth/admin";
import { createAdminClient } from "@/lib/supabase/admin";

const BRAND_ASSETS_BUCKET = "brand-assets";
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/avif", "avif"],
]);

async function ensureBrandAssetsBucket() {
  const supabase = createAdminClient();
  const { data: buckets, error } = await supabase.storage.listBuckets();

  if (error) {
    return { supabase, error };
  }

  const bucketExists = (buckets ?? []).some((bucket) => bucket.name === BRAND_ASSETS_BUCKET);
  if (bucketExists) {
    return { supabase, error: null };
  }

  const { error: createError } = await supabase.storage.createBucket(BRAND_ASSETS_BUCKET, {
    public: true,
    fileSizeLimit: MAX_FILE_SIZE,
  });

  return { supabase, error: createError };
}

export async function POST(request: Request) {
  const auth = await checkAdminAuth();
  if (!auth.authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: auth.status });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing image file" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json(
      { error: "Only JPEG, PNG, WebP and AVIF are supported" },
      { status: 400 },
    );
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: "Image must be 5MB or smaller" },
      { status: 400 },
    );
  }

  const { supabase, error: bucketError } = await ensureBrandAssetsBucket();
  if (bucketError) {
    return NextResponse.json({ error: "Failed to prepare image bucket" }, { status: 500 });
  }

  const extension = ALLOWED_TYPES.get(file.type);
  const path = `branding/${Date.now()}-${crypto.randomUUID()}.${extension}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await supabase.storage
    .from(BRAND_ASSETS_BUCKET)
    .upload(path, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
  }

  const { data } = supabase.storage
    .from(BRAND_ASSETS_BUCKET)
    .getPublicUrl(path);

  return NextResponse.json({ url: data.publicUrl, path }, { status: 201 });
}
