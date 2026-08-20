import { supabase } from "@/integrations/supabase/client";

export const PRODUCT_BUCKET = "product-images";
const TEN_YEARS = 60 * 60 * 24 * 365 * 10;

export function productImagePath(url: string): string | null {
  const match = url.match(new RegExp(`/${PRODUCT_BUCKET}/(.+?)(\\?|$)`));
  return match ? decodeURIComponent(match[1]!) : null;
}

/** Uploads one product image and returns a long-lived signed URL. */
export async function uploadProductImage(file: File): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(PRODUCT_BUCKET).upload(path, file, {
    contentType: file.type || "image/jpeg",
    upsert: false,
  });
  if (error) throw error;
  const { data, error: signError } = await supabase.storage
    .from(PRODUCT_BUCKET)
    .createSignedUrl(path, TEN_YEARS);
  if (signError || !data?.signedUrl) throw signError ?? new Error("Could not sign image URL");
  return data.signedUrl;
}

export async function uploadProductImages(files: File[]): Promise<string[]> {
  const urls: string[] = [];
  for (const f of files) urls.push(await uploadProductImage(f));
  return urls;
}

export async function removeProductImage(url: string) {
  const path = productImagePath(url);
  if (path) await supabase.storage.from(PRODUCT_BUCKET).remove([path]);
}
