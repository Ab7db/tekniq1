import { supabase } from "@/integrations/supabase/client";
import { ADMIN_WHATSAPP, BANK_DETAILS, INSTAGRAM_HANDLE, OFFICIAL_EMAIL } from "./config";

export type StoreSettings = {
  id: string;
  logo_url: string;
  hero_image_url: string;
  announcement_bar_text: string;
  announcement_bar_active: boolean;
  whatsapp_number: string;
  instagram_handle: string;
  email: string;
  bank_name: string;
  bank_account_number: string;
  bank_recipient_name: string;
  bank_phone_transfer: string;
  about_title_ar: string;
  about_title_en: string;
  about_description_ar: string;
  about_description_en: string;
  updated_at?: string;
};

export const defaultSettings: StoreSettings = {
  id: "default",
  logo_url: "/hashem-logo.jpg",
  hero_image_url: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=1200&q=80",
  announcement_bar_text: "شحن لجميع المناطق • بخور وعطور ملكية فاخرة • منتجات أصيلة ١٠٠٪",
  announcement_bar_active: true,
  whatsapp_number: ADMIN_WHATSAPP,
  instagram_handle: INSTAGRAM_HANDLE,
  email: OFFICIAL_EMAIL,
  bank_name: BANK_DETAILS.bankName,
  bank_account_number: BANK_DETAILS.accountNumber,
  bank_recipient_name: BANK_DETAILS.recipientName,
  bank_phone_transfer: BANK_DETAILS.phoneTransfer,
  about_title_ar: "هاشم للطيب — فخامة العبير الملكي",
  about_title_en: "Hashem Lelteeb — Royal Fragrance Luxury",
  about_description_ar: "متجر هاشم للطيب، وجهتك الأولى للعطور المركزة الفاخرة والبخور الملكي واللبان الحوجري الأصيل. ننتقي أفضل المكونات الطبيعية والزيوت العطرية لنمنحك تجربة استثنائية تعكس أصالة وفخامة التراث العماني والخليجي.",
  about_description_en: "Hashem Lelteeb boutique, your premier destination for concentrated fine perfumes, royal incense, and authentic Hojari luban.",
};

export async function fetchStoreSettings(): Promise<StoreSettings> {
  try {
    const { data, error } = await supabase
      .from("store_settings")
      .select("*")
      .eq("id", "default")
      .maybeSingle();

    if (error || !data) {
      return defaultSettings;
    }
    return { ...defaultSettings, ...(data as unknown as StoreSettings) };
  } catch (e) {
    console.warn("fetchStoreSettings fallback:", e);
    return defaultSettings;
  }
}

export async function updateStoreSettings(settings: Partial<StoreSettings>): Promise<void> {
  const { error } = await supabase
    .from("store_settings")
    .upsert({
      id: "default",
      ...settings,
      updated_at: new Date().toISOString(),
    });
  if (error) throw error;
}
