import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Lang = "ar" | "en";

const dict = {
  brand: { ar: "هاشم للطيب", en: "HASHEM LELTEEB" },
  brand_sub: { ar: "للطيب", en: "LELTEEB" },
  tagline: {
    ar: "عطور فاخرة وبخور ملكي",
    en: "Luxury Perfumes & Royal Incense",
  },
  nav_home: { ar: "الرئيسية", en: "Home" },
  nav_shop: { ar: "منتجاتنا", en: "Our Products" },
  nav_offers: { ar: "العروض", en: "Offers" },
  nav_branches: { ar: "فروعنا", en: "Our Branches" },
  nav_about: { ar: "من نحن", en: "About Us" },
  nav_incense: { ar: "البخور واللبان", en: "Incense & Luban" },
  nav_perfumes: { ar: "العطور الفاخرة", en: "Fine Perfumes" },
  nav_admin: { ar: "لوحة التحكم", en: "Admin" },
  nav_orders: { ar: "طلباتي", en: "My Orders" },
  sign_in: { ar: "تسجيل الدخول", en: "Sign in" },
  sign_out: { ar: "تسجيل الخروج", en: "Sign out" },
  sign_up: { ar: "إنشاء حساب", en: "Create account" },
  email: { ar: "البريد الإلكتروني", en: "Email" },
  password: { ar: "كلمة المرور", en: "Password" },
  full_name: { ar: "الاسم الكامل", en: "Full name" },
  phone: { ar: "رقم الهاتف / الواتساب", en: "Phone / WhatsApp" },
  hero_kicker: { ar: "بخور وعطور ملكية فاخرة", en: "Royal Incense & Fine Perfume" },
  hero_title_1: { ar: "فخامة عبيرك...", en: "The Luxury of Your Scent..." },
  hero_title_2: { ar: "اختيارك.", en: "Your Choice." },
  hero_sub: {
    ar: "عطور مركّزة وبخور ملكي واللبان الحوجري الأصيل، مختارة بعناية من قلب الجزيرة.",
    en: "Concentrated perfumes, royal incense and authentic Hojari luban, curated with care.",
  },
  cta_explore: { ar: "تسوق الآن", en: "Shop now" },
  cta_featured: { ar: "اكتشف المزيد", en: "Discover more" },
  marquee: {
    ar: "شحن لجميع المناطق • بخور وعطور ملكية فاخرة • منتجات أصيلة ١٠٠٪",
    en: "Shipping to all areas • Royal incense & fine perfume • 100% genuine products",
  },
  value_1_title: { ar: "منتجات أصيلة ١٠٠٪", en: "100% Genuine Products" },
  value_1_body: { ar: "أجود أنواع العود واللبان الحوجري الطبيعي", en: "Finest natural oud and authentic Hojari luban" },
  value_2_title: { ar: "توصيل سريع", en: "Fast Delivery" },
  value_2_body: { ar: "توصيل لجميع مناطق السلطنة ودول الخليج", en: "Delivery across Oman and the GCC" },
  value_3_title: { ar: "خدمة عملاء واتساب", en: "WhatsApp Customer Care" },
  value_3_body: { ar: "تواصل مباشر مع المتجر لإتمام الطلبات", en: "Direct instant assistance to complete orders" },
  shop_by_category: { ar: "تصنيفات المتجر", en: "Shop by Category" },
  promo_videos: { ar: "من عالم هاشم (فيديوهات المنتجات)", en: "From House of Hashem (Product Videos)" },
  shop_tagged: { ar: "اشتري الآن", en: "Shop tagged product" },
  mute: { ar: "كتم الصوت", en: "Mute" },
  unmute: { ar: "تشغيل الصوت", en: "Unmute" },
  play: { ar: "تشغيل", en: "Play" },
  pause: { ar: "إيقاف", en: "Pause" },
  tab_videos: { ar: "الفيديوهات الترويجية", en: "Promo Videos" },
  video_title_ar: { ar: "العنوان (عربي)", en: "Title (Arabic)" },
  video_title_en: { ar: "العنوان (إنجليزي)", en: "Title (English)" },
  video_file: { ar: "ملف الفيديو", en: "Video file" },
  video_target_product: { ar: "المنتج المرتبط (اختياري)", en: "Target product (optional)" },
  video_cta_link: { ar: "رابط مخصص (اختياري)", en: "Custom link (optional)" },
  display_order: { ar: "ترتيب العرض", en: "Display order" },
  upload_video: { ar: "رفع فيديو جديد", en: "Upload new video" },
  no_videos_yet: { ar: "لا توجد فيديوهات مضافة بعد", en: "No promotional videos yet" },
  featured_products: { ar: "المنتجات المميزة", en: "Featured Products" },
  all_products: { ar: "جميع المنتجات", en: "All Products" },
  offers_title: { ar: "العروض الحصرية", en: "Exclusive Offers & Deals" },
  offers_subtitle: { ar: "تخفيضات خاصة على أجود العطور والبخور الملكي لفترة محدودة", en: "Special discounts on royal fragrances and incense for a limited time" },
  no_offers_now: { ar: "لا توجد عروض نشطة حالياً، ترقبوا جديدنا قريباً!", en: "No active offers at the moment, stay tuned!" },
  branches_title: { ar: "فروعنا", en: "Our Branches" },
  branches_subtitle: { ar: "يسعدنا تشريفكم وزيارتكم في فروع هاشم للطيب", en: "We are pleased to welcome you at Hashem Lelteeb branches" },
  about_title: { ar: "من نحن — هاشم للطيب", en: "About Us — HASHEM LELTEEB" },
  contact_us: { ar: "تواصل معنا", en: "Contact Us" },
  our_story: { ar: "قصتنا وفلسفتنا", en: "Our Story & Philosophy" },
  opening_hours: { ar: "أوقات العمل", en: "Opening Hours" },
  view_on_map: { ar: "عرض على خرائط Google", en: "View on Google Maps" },
  call_branch: { ar: "اتصال بالفرع", en: "Call Branch" },
  cart: { ar: "حقيبة الشراء", en: "Cart" },
  cart_empty: { ar: "حقيبتك فارغة حالياً", en: "Your bag is empty" },
  add_to_cart: { ar: "إضافة للحقيبة", en: "Add to bag" },
  checkout: { ar: "إتمام الطلب عبر واتساب", en: "Checkout via WhatsApp" },
  continue_shopping: { ar: "متابعة التسوق", en: "Continue shopping" },
  subtotal: { ar: "المجموع", en: "Subtotal" },
  total: { ar: "الإجمالي", en: "Total" },
  quantity: { ar: "الكمية", en: "Quantity" },
  remove: { ar: "إزالة", en: "Remove" },
  out_of_stock: { ar: "نفد من المخزون", en: "Out of stock" },
  low_stock: { ar: "متبقي قليل", en: "Low stock" },
  sale: { ar: "عرض خاص", en: "Special Offer" },
  delivery_method: { ar: "طريقة الاستلام / الشحن", en: "Delivery / Pickup Method" },
  home_delivery: { ar: "توصيل (تُحسب التكلفة حسب المنطقة)", en: "Delivery (cost calculated by area)" },
  pickup_from_branch: { ar: "استلام من الفرع (Pick up)", en: "Pick up from branch" },
  shipping_notice: {
    ar: "تنويه: التوصيل غير مجاني وتكلفته تُحسب حسب المنطقة/المحل، ويتم الدفع مسبقاً عبر التحويل البنكي.",
    en: "Notice: Delivery is not free and calculated by location. Payment is required in advance via bank transfer.",
  },
  bank_transfer: { ar: "التحويل البنكي (الدفع مسبقاً)", en: "Bank Transfer (Advance Payment)" },
  cash_on_delivery: { ar: "الدفع عند الاستلام", en: "Cash on delivery" },
  bank_details_title: { ar: "معلومات الحساب البنكي للدفع (بنك مسقط)", en: "Bank Muscat Transfer Information" },
  account_number: { ar: "رقم الحساب", en: "Account Number" },
  recipient_name: { ar: "اسم المستفيد", en: "Beneficiary Name" },
  phone_transfer: { ar: "تحويل برقم الجوال", en: "Mobile Transfer Number" },
  customer_notes: { ar: "ملاحظات إضافية على الطلب (اختياري)", en: "Order Notes (optional)" },
  step_details: { ar: "١. بيانات العميل", en: "1. Customer Info" },
  step_delivery: { ar: "٢. الاستلام والدفع", en: "2. Delivery & Payment" },
  step_review: { ar: "٣. مراجعة وتأكيد", en: "3. Review & Confirm" },
  next: { ar: "التالي", en: "Next" },
  back: { ar: "السابق", en: "Back" },
  confirm_and_whatsapp: { ar: "تأكيد وإرسال الطلب عبر واتساب 💬", en: "Confirm & Send via WhatsApp 💬" },
  order_placed: { ar: "تم تسجيل طلبك بنجاح!", en: "Order placed successfully!" },
  order_number_label: { ar: "رقم الطلب", en: "Order Number" },
  tab_overview: { ar: "نظرة عامة", en: "Overview" },
  tab_products: { ar: "المنتجات", en: "Products" },
  tab_orders: { ar: "الطلبات", en: "Orders" },
  tab_branches: { ar: "الفروع", en: "Branches" },
  tab_settings: { ar: "إعدادات المتجر والشريط الإعلاني واللوجو", en: "Store Settings & Logo" },
  add_product: { ar: "إضافة منتج جديد", en: "Add new product" },
  add_branch: { ar: "إضافة فرع جديد", en: "Add new branch" },
  edit: { ar: "تعديل", en: "Edit" },
  delete: { ar: "حذف", en: "Delete" },
  save: { ar: "حفظ التغييرات", en: "Save changes" },
  cancel: { ar: "إلغاء", en: "Cancel" },
  price: { ar: "السعر الأصلي", en: "Original Price" },
  cost_price: { ar: "سعر التكلفة", en: "Cost price" },
  discount_price: { ar: "سعر العرض (اختياري)", en: "Discount price (optional)" },
  stock: { ar: "المخزون المتوفر", en: "Available stock" },
  threshold: { ar: "حد التنبيه للمخزون", en: "Alert threshold" },
  category: { ar: "القسم", en: "Category" },
  images: { ar: "الصور", en: "Images" },
  upload_images: { ar: "رفع صور المنتج", en: "Upload images" },
  name_ar: { ar: "الاسم (عربي)", en: "Name (Arabic)" },
  name_en: { ar: "الاسم (إنجليزي)", en: "Name (English)" },
  desc_ar: { ar: "الوصف والتفاصيل (عربي)", en: "Description (Arabic)" },
  desc_en: { ar: "الوصف والتفاصيل (إنجليزي)", en: "Description (English)" },
  featured_flag: { ar: "عرض في قسم المنتجات المميزة بالرئيسية", en: "Show in featured section" },
  status: { ar: "الحالة", en: "Status" },
  profit: { ar: "الربح", en: "Profit" },
  customer: { ar: "العميل", en: "Customer" },
  date: { ar: "التاريخ", en: "Date" },
  actions: { ar: "الإجراءات", en: "Actions" },
  no_data: { ar: "لا توجد بيانات حالياً", en: "No data yet" },
  pending: { ar: "قيد الانتظار", en: "Pending" },
  processing: { ar: "قيد التجهيز", en: "Processing" },
  shipped: { ar: "تم الشحن", en: "Shipped" },
  delivered: { ar: "تم التوصيل", en: "Delivered" },
  cancelled: { ar: "ملغي", en: "Cancelled" },
  saved: { ar: "تم الحفظ بنجاح", en: "Saved successfully" },
  deleted: { ar: "تم الحذف بنجاح", en: "Deleted successfully" },
  added_to_cart: { ar: "أُضيف إلى الحقيبة بنجاح", en: "Added to your bag" },
  purchase_history: { ar: "سجل الشراء", en: "Purchase history" },
  items: { ar: "المنتجات", en: "Items" },
  admin_only: { ar: "هذه الصفحة للإدارة فقط", en: "Admins only" },
  footer_note: {
    ar: "جميع الحقوق محفوظة © هاشم للطيب",
    en: "All rights reserved © HASHEM LELTEEB",
  },
  language: { ar: "اللغة", en: "Language" },
} as const;

export type TKey = keyof typeof dict;

type Ctx = {
  lang: Lang;
  dir: "rtl" | "ltr";
  setLang: (l: Lang) => void;
  toggle: () => void;
  t: (k: TKey) => string;
  money: (v: number) => string;
  pick: (ar?: string | null, en?: string | null) => string;
};

const LangContext = createContext<Ctx | null>(null);
const STORAGE_KEY = "og-lang";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ar");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Lang | null;
    if (saved === "ar" || saved === "en") setLangState(saved);
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    localStorage.setItem(STORAGE_KEY, l);
  }, []);

  const dir = lang === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [lang, dir]);

  const value = useMemo<Ctx>(
    () => ({
      lang,
      dir,
      setLang,
      toggle: () => setLang(lang === "ar" ? "en" : "ar"),
      t: (k) => dict[k]?.[lang] ?? dict[k]?.ar ?? (k as string),
      money: (v) =>
        lang === "ar"
          ? `${new Intl.NumberFormat("ar-OM", { minimumFractionDigits: 3, maximumFractionDigits: 3 }).format(v)} ر.ع`
          : `OMR ${new Intl.NumberFormat("en-OM", { minimumFractionDigits: 3, maximumFractionDigits: 3 }).format(v)}`,
      pick: (ar, en) => (lang === "ar" ? (ar || en || "") : (en || ar || "")),
    }),
    [lang, dir, setLang],
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useI18n must be used inside LanguageProvider");
  return ctx;
}
