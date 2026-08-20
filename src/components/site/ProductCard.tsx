import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";
import { useCart } from "@/lib/cart";
import { effectivePrice, type Product } from "@/lib/products";
import { StockBadge } from "./StockBadge";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { t, money, pick } = useI18n();
  const { add, setOpen } = useCart();
  const price = effectivePrice(product);
  const hasDiscount = !!product.discount_price && product.discount_price > 0;
  const soldOut = product.stock_quantity <= 0;

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.06, 0.4) }}
      whileHover={{ y: -6 }}
      className="group relative"
    >
      <div className="pointer-events-none absolute -inset-3 rounded-3xl bg-primary/10 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
      <div className="glass relative overflow-hidden rounded-xl">
        <Link
          to="/product/$id"
          params={{ id: product.id }}
          className="relative block aspect-[4/5] overflow-hidden"
        >
          <img
            src={product.images?.[0] ?? "/favicon.ico"}
            alt={pick(product.name_ar, product.name_en)}
            loading="lazy"
            className="size-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background/90 to-transparent" />
          <div className="absolute start-3 top-3 flex flex-col gap-2">
            {hasDiscount ? (
              <span className="pulse-gold rounded-full bg-gold-gradient px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
                {t("sale")}
              </span>
            ) : null}
            <StockBadge product={product} />
          </div>
        </Link>

        <div className="space-y-2 p-4">
          <Link to="/product/$id" params={{ id: product.id }}>
            <h3 className="line-clamp-1 font-display text-sm text-foreground transition-colors group-hover:text-primary sm:text-base">
              {pick(product.name_ar, product.name_en)}
            </h3>
          </Link>
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-semibold text-primary sm:text-base">{money(price)}</span>
            {hasDiscount ? (
              <span className="text-xs text-muted-foreground line-through">
                {money(Number(product.price))}
              </span>
            ) : null}
          </div>

          <motion.button
            whileHover={{ scale: soldOut ? 1 : 1.03 }}
            whileTap={{ scale: soldOut ? 1 : 0.94 }}
            disabled={soldOut}
            onClick={() => {
              add(
                {
                  id: product.id,
                  name_ar: product.name_ar,
                  name_en: product.name_en,
                  price,
                  cost_price: Number(product.cost_price),
                  image: product.images?.[0] ?? null,
                  stock: product.stock_quantity,
                },
                1,
              );
              setOpen(true);
              toast.success(t("added_to_cart"));
            }}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-primary/40 bg-primary/10 py-2 text-xs font-semibold text-primary transition-colors hover:bg-gold-gradient hover:text-primary-foreground disabled:cursor-not-allowed disabled:opacity-40 sm:text-sm"
          >
            <Plus className="size-4" />
            {soldOut ? t("out_of_stock") : t("add_to_cart")}
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
}
