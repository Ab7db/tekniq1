import { Link, useRouter } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Crown, Flame, LogOut, MapPin, ShoppingBag, Sparkles, User } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { LogoLockup } from "@/components/brand/Logo";
import { useQuery } from "@tanstack/react-query";
import { fetchStoreSettings } from "@/lib/settings";

function AnnouncementBar() {
  const { t } = useI18n();
  const { data: settings } = useQuery({
    queryKey: ["store-settings"],
    queryFn: fetchStoreSettings,
  });

  if (settings && !settings.announcement_bar_active) {
    return null;
  }

  const text = settings?.announcement_bar_text || t("marquee");

  return (
    <div className="overflow-hidden bg-teal-deep py-2 border-b border-primary/20">
      <div className="marquee-track gap-16 px-8 text-[11px] font-medium tracking-[0.2em] text-teal-foreground">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className="whitespace-nowrap flex items-center gap-4">
            <span>✨</span>
            <span>{text}</span>
            <span>✨</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export function Header() {
  const { t, lang, toggle } = useI18n();
  const { count, setOpen } = useCart();
  const { user, isAdmin } = useAuth();
  const router = useRouter();

  const linkClass =
    "relative py-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground";
  const activeClass =
    "text-foreground font-semibold after:absolute after:inset-x-0 after:-bottom-1 after:h-0.5 after:rounded-full after:bg-gold-gradient";

  return (
    <header className="sticky top-0 z-40">
      <AnnouncementBar />
      <div className="border-b border-border/70 bg-background/85 backdrop-blur-xl shadow-xs">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link to="/" aria-label={t("brand")}>
            <LogoLockup />
          </Link>

          <nav className="hidden items-center gap-7 lg:flex">
            <Link to="/" className={linkClass} activeProps={{ className: activeClass }}>
              {t("nav_home")}
            </Link>
            <Link to="/shop" className={linkClass} activeProps={{ className: activeClass }}>
              {t("nav_shop")}
            </Link>
            <Link
              to="/offers"
              className={`${linkClass} flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-semibold`}
              activeProps={{ className: activeClass }}
            >
              <Flame className="size-4 text-amber-500 animate-pulse" />
              {t("nav_offers")}
            </Link>
            <Link
              to="/shop"
              search={{ category: "incense" }}
              className={linkClass}
              activeProps={{ className: "" }}
            >
              {t("nav_incense")}
            </Link>
            <Link
              to="/shop"
              search={{ category: "fragrances" }}
              className={linkClass}
              activeProps={{ className: "" }}
            >
              {t("nav_perfumes")}
            </Link>
            <Link
              to="/branches"
              className={`${linkClass} flex items-center gap-1`}
              activeProps={{ className: activeClass }}
            >
              <MapPin className="size-3.5 text-primary" />
              {t("nav_branches")}
            </Link>
            <Link to="/about" className={linkClass} activeProps={{ className: activeClass }}>
              {t("nav_about")}
            </Link>
            {user ? (
              <Link to="/orders" className={linkClass} activeProps={{ className: activeClass }}>
                {t("nav_orders")}
              </Link>
            ) : null}
            {isAdmin ? (
              <Link
                to="/admin"
                className="flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/40 px-3 py-1 text-xs font-semibold text-primary shadow-xs transition-all hover:bg-primary hover:text-primary-foreground"
              >
                <Crown className="size-3.5 text-primary group-hover:text-primary-foreground" />
                {t("nav_admin")}
              </Link>
            ) : null}
          </nav>

          <div className="flex items-center gap-2.5">
            <button
              onClick={toggle}
              aria-label={t("language")}
              className="rounded-full border border-border px-3 py-1.5 text-xs font-bold tracking-widest text-primary transition-colors hover:bg-accent cursor-pointer"
            >
              {lang === "ar" ? "EN" : "عربي"}
            </button>

            {user ? (
              <button
                onClick={async () => {
                  await supabase.auth.signOut();
                  router.navigate({ to: "/" });
                }}
                aria-label={t("sign_out")}
                title={t("sign_out")}
                className="rounded-full border border-border p-2 text-muted-foreground transition-colors hover:text-primary cursor-pointer"
              >
                <LogOut className="size-4" />
              </button>
            ) : (
              <Link
                to="/auth"
                aria-label={t("sign_in")}
                title={t("sign_in")}
                className="rounded-full border border-border p-2 text-muted-foreground transition-colors hover:text-primary"
              >
                <User className="size-4" />
              </Link>
            )}

            <motion.button
              whileTap={{ scale: 0.94 }}
              onClick={() => setOpen(true)}
              className="flex items-center gap-2 rounded-full bg-teal px-4 py-2.5 text-xs font-semibold text-teal-foreground shadow-soft cursor-pointer hover:opacity-95 transition-opacity"
            >
              <ShoppingBag className="size-4" />
              <span className="hidden sm:inline">{t("cart")}</span>
              {count > 0 ? (
                <span className="flex size-5 items-center justify-center rounded-full bg-gold-gradient text-[10px] font-bold text-primary-foreground">
                  {count}
                </span>
              ) : null}
            </motion.button>
          </div>
        </div>
      </div>
    </header>
  );
}
