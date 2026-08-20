import { useI18n } from "@/lib/i18n";
import type { Product } from "@/lib/products";

export function StockBadge({
  product,
}: {
  product: Pick<Product, "stock_quantity" | "low_stock_threshold">;
}) {
  const { t } = useI18n();
  if (product.stock_quantity <= 0) {
    return (
      <span className="rounded-full bg-destructive/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-destructive-foreground ring-1 ring-destructive/50">
        {t("out_of_stock")}
      </span>
    );
  }
  if (product.stock_quantity <= product.low_stock_threshold) {
    return (
      <span className="pulse-gold rounded-full bg-warning/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-warning ring-1 ring-warning/50">
        {t("low_stock")} · {product.stock_quantity}
      </span>
    );
  }
  return null;
}
