import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { fetchCategories, fetchProducts } from "@/lib/products";
import { ProductCard } from "@/components/site/ProductCard";
import { ProductGridSkeleton } from "@/components/site/Skeletons";

type Search = { category?: string | undefined };

export const Route = createFileRoute("/shop")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    category: typeof search["category"] === "string" ? (search["category"] as string) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "The Boutique — HASHEM LELTEEB" },
      {
        name: "description",
        content:
          "Browse the full HASHEM LELTEEB catalogue: fine fragrances, timepieces, jewellery and leather goods.",
      },
      { property: "og:title", content: "The Boutique — HASHEM LELTEEB" },
      {
        property: "og:description",
        content: "Fine fragrances, timepieces, jewellery and leather goods.",
      },
    ],
  }),
  component: Shop,
});

function Shop() {
  const { t, pick } = useI18n();
  const { category } = Route.useSearch();
  const navigate = Route.useNavigate();
  const products = useQuery({ queryKey: ["products"], queryFn: fetchProducts });
  const categories = useQuery({ queryKey: ["categories"], queryFn: fetchCategories });

  const activeCat = (categories.data ?? []).find((c) => c.slug === category);
  const list = (products.data ?? []).filter((p) =>
    activeCat ? p.category_id === activeCat.id : true,
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <motion.h1
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl text-foreground sm:text-4xl"
      >
        {t("nav_shop")}
      </motion.h1>

      <div className="mt-6 flex flex-wrap gap-2">
        <button
          onClick={() => navigate({ search: {} })}
          className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors ${
            !category
              ? "border-primary bg-gold-gradient text-primary-foreground"
              : "border-border text-muted-foreground hover:text-primary"
          }`}
        >
          {t("all")}
        </button>
        {(categories.data ?? []).map((c) => (
          <button
            key={c.id}
            onClick={() => navigate({ search: { category: c.slug } })}
            className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors ${
              category === c.slug
                ? "border-primary bg-gold-gradient text-primary-foreground"
                : "border-border text-muted-foreground hover:text-primary"
            }`}
          >
            {pick(c.name_ar, c.name_en)}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {products.isLoading ? (
          <ProductGridSkeleton count={6} />
        ) : list.length === 0 ? (
          <p className="py-20 text-center text-sm text-muted-foreground">{t("no_data")}</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
            {list.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
