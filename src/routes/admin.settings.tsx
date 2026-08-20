import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Check,
  CreditCard,
  Image as ImageIcon,
  Layout,
  Loader2,
  Megaphone,
  MessageCircle,
  Save,
  Sparkles,
  Upload,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { fetchStoreSettings, updateStoreSettings, type StoreSettings } from "@/lib/settings";
import { uploadProductImage } from "@/lib/uploads";
import { LogoMark } from "@/components/brand/Logo";

export const Route = createFileRoute("/admin/settings")({
  component: AdminSettingsPage,
});

const field =
  "w-full rounded-xl border border-border bg-background/70 px-4 py-2.5 text-xs sm:text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary";

function AdminSettingsPage() {
  const { t } = useI18n();
  const qc = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ["store-settings"],
    queryFn: fetchStoreSettings,
  });

  const [form, setForm] = useState<Partial<StoreSettings>>({});
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingHero, setUploadingHero] = useState(false);

  useEffect(() => {
    if (settings) {
      setForm(settings);
    }
  }, [settings]);

  const updateMutation = useMutation({
    mutationFn: (data: Partial<StoreSettings>) => updateStoreSettings(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["store-settings"] });
      toast.success(t("saved"));
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "حدث خطأ أثناء حفظ الإعدادات");
    },
  });

  const handleLogoUpload = async (file: File) => {
    setUploadingLogo(true);
    try {
      const url = await uploadProductImage(file);
      const updated = { ...form, logo_url: url };
      setForm(updated);
      await updateStoreSettings(updated);
      qc.invalidateQueries({ queryKey: ["store-settings"] });
      toast.success("تم رفع وحفظ الشعار الجديد بنجاح!");
    } catch (e) {
      toast.error("فشل رفع صورة الشعار");
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleHeroUpload = async (file: File) => {
    setUploadingHero(true);
    try {
      const url = await uploadProductImage(file);
      const updated = { ...form, hero_image_url: url };
      setForm(updated);
      await updateStoreSettings(updated);
      qc.invalidateQueries({ queryKey: ["store-settings"] });
      toast.success("تم رفع وحفظ صورة الواجهة الجديدة بنجاح!");
    } catch (e) {
      toast.error("فشل رفع صورة الواجهة");
    } finally {
      setUploadingHero(false);
    }
  };

  if (isLoading) {
    return <div className="p-12 text-center text-muted-foreground">جاري تحميل الإعدادات...</div>;
  }

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Page Title */}
      <div>
        <h2 className="font-display text-xl font-bold text-foreground sm:text-2xl">
          إعدادات المتجر العامة والمظهر
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          التحكم في اللوجو، صورة واجهة الهيرو، الشريط الإعلاني، بيانات التواصل وبنك مسقط
        </p>
      </div>

      {/* 1. Hero Image Management (Prominently placed at top) */}
      <div className="glass rounded-3xl p-6 sm:p-8 border-2 border-primary/40 shadow-gold-glow space-y-5 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-primary font-bold text-base">
            <Layout className="size-5" />
            <span>صورة واجهة الصفحة الرئيسية (Hero Image)</span>
          </div>
          <span className="rounded-full bg-primary/20 text-primary px-3 py-1 text-[11px] font-bold">
            الصفحة الرئيسية
          </span>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed">
          هذه هي الصورة الدائرية الفاخرة التي تظهر في أول الصفحة الرئيسية بجانب العنوان الرئيسي وزر الطلب السريع.
        </p>

        <div className="flex flex-col md:flex-row items-center gap-6 pt-2 bg-card/60 p-5 rounded-2xl border border-border">
          {/* Circular Frame Preview */}
          <div className="flex flex-col items-center gap-2">
            <span className="text-[11px] font-semibold text-muted-foreground">معاينة الصورة الحالية:</span>
            <div className="relative size-32 sm:size-36 rounded-full overflow-hidden border-4 border-primary shadow-gold-glow bg-black/40 flex items-center justify-center">
              <img
                src={form.hero_image_url || "/hashem-logo.jpg"}
                alt="معاينة الواجهة"
                className="size-full object-cover"
              />
            </div>
          </div>

          {/* Upload and Link controls */}
          <div className="flex-1 w-full space-y-4">
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1.5">
                اختر صورة جديدة من جهازك:
              </label>
              <label className="inline-flex items-center justify-center gap-2 rounded-xl bg-gold-gradient px-5 py-3 text-xs font-bold text-primary-foreground shadow-gold-glow cursor-pointer transition-all hover:opacity-95 w-full sm:w-auto">
                {uploadingHero ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
                <span>{uploadingHero ? "جاري الرفع والحفظ..." : "رفع صورة هيرو جديدة (Upload)"}</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleHeroUpload(f);
                  }}
                />
              </label>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1">
                أو اكتب رابط الصورة المباشر:
              </label>
              <input
                className={field}
                value={form.hero_image_url || ""}
                onChange={(e) => setForm((prev) => ({ ...prev, hero_image_url: e.target.value }))}
                placeholder="https://..."
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Logo Management */}
      <div className="glass rounded-3xl p-6 sm:p-8 border border-border/80 space-y-5">
        <div className="flex items-center gap-2.5 text-primary font-bold text-base">
          <ImageIcon className="size-5" />
          <span>شعار المتجر (Logo)</span>
        </div>
        <p className="text-xs text-muted-foreground">
          الشعار الرسمي الذي يظهر في الهيدر والفوتر وفوق أيقونة المتجر.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-6 pt-2 bg-card/40 p-5 rounded-2xl border border-border">
          <div className="flex flex-col items-center gap-2">
            <span className="text-[11px] font-semibold text-muted-foreground">معاينة الشعار:</span>
            <LogoMark size={80} customUrl={form.logo_url} />
          </div>

          <div className="flex-1 w-full space-y-4">
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1.5">
                رفع شعار جديد:
              </label>
              <label className="inline-flex items-center justify-center gap-2 rounded-xl bg-gold-gradient px-5 py-3 text-xs font-bold text-primary-foreground shadow-gold-glow cursor-pointer transition-all hover:opacity-95 w-full sm:w-auto">
                {uploadingLogo ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
                <span>{uploadingLogo ? "جاري الرفع والحفظ..." : "رفع لوجو جديد من جهازك"}</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleLogoUpload(f);
                  }}
                />
              </label>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1">
                رابط صورة الشعار:
              </label>
              <input
                className={field}
                value={form.logo_url || ""}
                onChange={(e) => setForm((prev) => ({ ...prev, logo_url: e.target.value }))}
                placeholder="/hashem-logo.jpg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Announcement Bar */}
      <div className="glass rounded-3xl p-6 sm:p-8 border border-border/80 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-primary font-bold text-base">
            <Megaphone className="size-5" />
            <span>الشريط الإعلاني العلوي (Announcement Bar)</span>
          </div>

          <label className="flex items-center gap-2 text-xs cursor-pointer bg-accent/60 px-3 py-1.5 rounded-xl border border-border">
            <input
              type="checkbox"
              checked={form.announcement_bar_active ?? true}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, announcement_bar_active: e.target.checked }))
              }
              className="rounded accent-primary size-4"
            />
            <span className="font-semibold text-foreground">تفعيل الشريط</span>
          </label>
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground block mb-1.5">
            نص الشريط المتحرك
          </label>
          <input
            className={field}
            value={form.announcement_bar_text || ""}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, announcement_bar_text: e.target.value }))
            }
            placeholder="شحن لجميع المناطق • بخور وعطور ملكية فاخرة • منتجات أصيلة ١٠٠٪"
          />
        </div>
      </div>

      {/* 4. Contact Details */}
      <div className="glass rounded-3xl p-6 sm:p-8 border border-border/80 space-y-5">
        <div className="flex items-center gap-2.5 text-primary font-bold text-base">
          <MessageCircle className="size-5" />
          <span>بيانات التواصل وحسابات المتجر</span>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1.5">
              رقم الواتساب المعتمد (لاستقبال الطلبات)
            </label>
            <input
              className={field}
              dir="ltr"
              value={form.whatsapp_number || ""}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, whatsapp_number: e.target.value }))
              }
              placeholder="96877036097"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1.5">
              حساب الانستقرام
            </label>
            <input
              className={field}
              dir="ltr"
              value={form.instagram_handle || ""}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, instagram_handle: e.target.value }))
              }
              placeholder="hashem_lelteeb"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1.5">
              البريد الإلكتروني
            </label>
            <input
              className={field}
              dir="ltr"
              type="email"
              value={form.email || ""}
              onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
              placeholder="abdualhidry@gmail.com"
            />
          </div>
        </div>
      </div>

      {/* 5. Bank Muscat Payment Info */}
      <div className="glass rounded-3xl p-6 sm:p-8 border border-border/80 space-y-5">
        <div className="flex items-center gap-2.5 text-primary font-bold text-base">
          <CreditCard className="size-5" />
          <span>بيانات الحساب البنكي للدفع المسبق (بنك مسقط)</span>
        </div>
        <p className="text-xs text-muted-foreground">
          هذه البيانات تظهر للعميل في صفحة إتمام الطلب وصفحة "من نحن" للتحويل قبل الشحن.
        </p>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1.5">
              اسم البنك
            </label>
            <input
              className={field}
              value={form.bank_name || ""}
              onChange={(e) => setForm((prev) => ({ ...prev, bank_name: e.target.value }))}
              placeholder="بنك مسقط (Bank Muscat)"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1.5">
              {t("account_number")}
            </label>
            <input
              className={field}
              dir="ltr"
              value={form.bank_account_number || ""}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, bank_account_number: e.target.value }))
              }
              placeholder="0369063092490012"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1.5">
              {t("recipient_name")}
            </label>
            <input
              className={field}
              value={form.bank_recipient_name || ""}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, bank_recipient_name: e.target.value }))
              }
              placeholder="ABDULMALIK"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1.5">
              {t("phone_transfer")}
            </label>
            <input
              className={field}
              dir="ltr"
              value={form.bank_phone_transfer || ""}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, bank_phone_transfer: e.target.value }))
              }
              placeholder="77036097"
            />
          </div>
        </div>
      </div>

      {/* 6. About Us Content */}
      <div className="glass rounded-3xl p-6 sm:p-8 border border-border/80 space-y-5">
        <div className="flex items-center gap-2.5 text-primary font-bold text-base">
          <Sparkles className="size-5" />
          <span>محتوى صفحة "من نحن"</span>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1.5">
              العنوان الرئيسي (عربي)
            </label>
            <input
              className={field}
              value={form.about_title_ar || ""}
              onChange={(e) => setForm((prev) => ({ ...prev, about_title_ar: e.target.value }))}
            />
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1.5">
              الوصف والنبذة التعريفية (عربي)
            </label>
            <textarea
              className={`${field} min-h-[110px]`}
              value={form.about_description_ar || ""}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, about_description_ar: e.target.value }))
              }
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="sticky bottom-6 flex justify-end">
        <button
          type="button"
          onClick={() => updateMutation.mutate(form)}
          disabled={updateMutation.isPending}
          className="flex items-center gap-2 rounded-2xl bg-gold-gradient px-8 py-3.5 text-xs font-bold text-primary-foreground shadow-gold-glow hover:opacity-95 transition-all cursor-pointer"
        >
          {updateMutation.isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Save className="size-4" />
          )}
          <span>{t("save")}</span>
        </button>
      </div>
    </div>
  );
}
