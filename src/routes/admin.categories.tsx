import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import {
  Edit2,
  FolderTree,
  Image as ImageIcon,
  Loader2,
  Plus,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import {
  createCategory,
  deleteCategory,
  fetchCategories,
  updateCategory,
  type Category,
} from "@/lib/products";
import { uploadProductImage } from "@/lib/uploads";

export const Route = createFileRoute("/admin/categories")({
  component: AdminCategoriesPage,
});

const field =
  "w-full rounded-xl border border-border bg-background/70 px-4 py-2.5 text-xs sm:text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary";

function AdminCategoriesPage() {
  const { t, pick } = useI18n();
  const qc = useQueryClient();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [form, setForm] = useState<Partial<Category>>({
    name_ar: "",
    name_en: "",
    slug: "",
    image_url: "",
  });

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!form.name_ar || !form.name_en || !form.slug) {
        throw new Error("يرجى إدخال اسم القسم بالعربي والإنجليزي والمعرّف (slug)");
      }
      if (editing) {
        await updateCategory(editing.id, form);
      } else {
        await createCategory(form as { name_ar: string; name_en: string; slug: string; image_url?: string });
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] });
      toast.success(t("saved"));
      setModalOpen(false);
      setEditing(null);
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "حدث خطأ أثناء حفظ التصنيف");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] });
      toast.success(t("deleted"));
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "تعذر حذف التصنيف");
    },
  });

  const handleImageUpload = async (file: File) => {
    setUploadingImage(true);
    try {
      const url = await uploadProductImage(file);
      setForm((p) => ({ ...p, image_url: url }));
      toast.success("تم رفع صورة التصنيف بنجاح");
    } catch (e) {
      toast.error("فشل رفع صورة التصنيف");
    } finally {
      setUploadingImage(false);
    }
  };

  const openAdd = () => {
    setEditing(null);
    setForm({
      name_ar: "",
      name_en: "",
      slug: "",
      image_url: "",
    });
    setModalOpen(true);
  };

  const openEdit = (c: Category) => {
    setEditing(c);
    setForm(c);
    setModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-bold text-foreground sm:text-2xl">
            إدارة تصنيفات وأقسام المتجر
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            إضافة أقسام جديدة مثل (عطور فاخرة، بخور ولبان، مخلطات ملكية) وتعديل صورها
          </p>
        </div>

        <button
          type="button"
          onClick={openAdd}
          className="inline-flex items-center gap-2 rounded-xl bg-gold-gradient px-5 py-2.5 text-xs font-bold text-primary-foreground shadow-gold-glow cursor-pointer"
        >
          <Plus className="size-4" />
          <span>إضافة قسم جديد</span>
        </button>
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-muted-foreground">جاري تحميل التصنيفات...</div>
      ) : categories.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <div
              key={c.id}
              className="glass relative overflow-hidden rounded-2xl border border-border/80 p-5 flex flex-col justify-between hover:border-primary/50 transition-all shadow-xs"
            >
              <div className="space-y-3">
                <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-card border border-border">
                  <img
                    src={c.image_url ?? "/hashem-logo.jpg"}
                    alt={pick(c.name_ar, c.name_en)}
                    className="size-full object-cover"
                  />
                </div>

                <div>
                  <h4 className="font-bold text-base text-foreground">{pick(c.name_ar, c.name_en)}</h4>
                  <span className="text-[11px] font-mono text-muted-foreground">Slug: {c.slug}</span>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-border/50 mt-4">
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => openEdit(c)}
                    className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-accent cursor-pointer"
                    title={t("edit")}
                  >
                    <Edit2 className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`هل أنت متأكد من حذف قسم "${c.name_ar}"؟`)) {
                        deleteMutation.mutate(c.id);
                      }
                    }}
                    className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                    title={t("delete")}
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>

                <span className="text-[11px] text-muted-foreground">
                  {c.name_en}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass rounded-2xl p-12 text-center max-w-md mx-auto">
          <p className="text-sm text-muted-foreground mb-4">لا توجد تصنيفات مضافة بعد.</p>
          <button
            type="button"
            onClick={openAdd}
            className="rounded-xl bg-gold-gradient px-6 py-2.5 text-xs font-bold text-primary-foreground"
          >
            إضافة تصنيف جديد
          </button>
        </div>
      )}

      {/* Category Modal */}
      {modalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm">
          <div className="glass relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-3xl p-6 sm:p-8 border border-border shadow-2xl">
            <div className="flex items-center justify-between border-b border-border/70 pb-4 mb-5">
              <h3 className="font-display text-lg font-bold text-foreground">
                {editing ? "تعديل بيانات التصنيف" : "إضافة تصنيف جديد"}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-medium text-muted-foreground block mb-1">
                  اسم القسم (عربي) <span className="text-primary">*</span>
                </label>
                <input
                  className={field}
                  placeholder="مثال: عطور فاخرة"
                  value={form.name_ar || ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    setForm((p) => ({
                      ...p,
                      name_ar: val,
                      slug: !editing && !p.slug ? val.toLowerCase().replace(/\s+/g, "-") : p.slug,
                    }));
                  }}
                />
              </div>

              <div>
                <label className="font-medium text-muted-foreground block mb-1">
                  اسم القسم (إنجليزي) <span className="text-primary">*</span>
                </label>
                <input
                  className={field}
                  placeholder="مثال: Fine Fragrances"
                  value={form.name_en || ""}
                  onChange={(e) => setForm((p) => ({ ...p, name_en: e.target.value }))}
                />
              </div>

              <div>
                <label className="font-medium text-muted-foreground block mb-1">
                  المعرّف الرابط (Slug) <span className="text-primary">*</span>
                </label>
                <input
                  className={field}
                  dir="ltr"
                  placeholder="مثال: fragrances / incense / oud"
                  value={form.slug || ""}
                  onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
                />
              </div>

              <div>
                <label className="font-medium text-muted-foreground block mb-1">
                  صورة التصنيف
                </label>

                {form.image_url ? (
                  <div className="space-y-2 mb-2">
                    <img
                      src={form.image_url}
                      alt="معاينة"
                      className="aspect-video w-full rounded-xl object-cover border border-border"
                    />
                    <div className="flex gap-2">
                      <input
                        className={field}
                        value={form.image_url}
                        onChange={(e) => setForm((p) => ({ ...p, image_url: e.target.value }))}
                        placeholder="رابط الصورة..."
                      />
                      <button
                        type="button"
                        onClick={() => setForm((p) => ({ ...p, image_url: "" }))}
                        className="p-2 rounded-xl text-destructive hover:bg-destructive/10 border border-border"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                ) : null}

                <label className="inline-flex items-center gap-2 rounded-xl border border-primary/40 bg-primary/10 px-4 py-2.5 text-xs font-semibold text-primary hover:bg-primary hover:text-primary-foreground cursor-pointer transition-all">
                  {uploadingImage ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
                  <span>{uploadingImage ? "جاري الرفع..." : "رفع صورة للقسم من جهازك"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleImageUpload(f);
                    }}
                  />
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border/70 mt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl border border-border px-5 py-2.5 text-xs font-medium text-foreground hover:bg-accent cursor-pointer"
                >
                  {t("cancel")}
                </button>
                <button
                  type="button"
                  onClick={() => saveMutation.mutate()}
                  disabled={saveMutation.isPending}
                  className="rounded-xl bg-gold-gradient px-7 py-2.5 text-xs font-bold text-primary-foreground shadow-gold-glow cursor-pointer disabled:opacity-50"
                >
                  {saveMutation.isPending ? <Loader2 className="size-4 animate-spin inline" /> : t("save")}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
