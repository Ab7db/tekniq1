import { Link } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { LogoLockup } from "@/components/brand/Logo";
import { useQuery } from "@tanstack/react-query";
import { fetchStoreSettings } from "@/lib/settings";
import { Instagram, Mail, MapPin, MessageCircle, Phone } from "lucide-react";

export function Footer() {
  const { t } = useI18n();
  const { data: settings } = useQuery({
    queryKey: ["store-settings"],
    queryFn: fetchStoreSettings,
  });

  const whatsapp = settings?.whatsapp_number || "96877036097";
  const instagram = settings?.instagram_handle || "hashem_lelteeb";
  const email = settings?.email || "abdualhidry@gmail.com";

  return (
    <footer className="mt-24 border-t border-border/70 bg-card/70 py-14">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <LogoLockup size={52} />
          <p className="text-xs leading-relaxed text-muted-foreground">{t("tagline")}</p>
          <p className="text-xs leading-relaxed text-muted-foreground/80">
            {t("hero_sub")}
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="font-display text-sm font-semibold text-foreground">روابط سريعة</h3>
          <nav className="flex flex-col gap-2 text-xs text-muted-foreground">
            <Link to="/" className="hover:text-primary transition-colors">
              {t("nav_home")}
            </Link>
            <Link to="/shop" className="hover:text-primary transition-colors">
              {t("nav_shop")}
            </Link>
            <Link to="/offers" className="hover:text-primary transition-colors">
              {t("nav_offers")}
            </Link>
            <Link to="/branches" className="hover:text-primary transition-colors">
              {t("nav_branches")}
            </Link>
            <Link to="/about" className="hover:text-primary transition-colors">
              {t("nav_about")}
            </Link>
            <Link to="/orders" className="hover:text-primary transition-colors">
              {t("nav_orders")}
            </Link>
          </nav>
        </div>

        <div className="space-y-3">
          <h3 className="font-display text-sm font-semibold text-foreground">طرق الدفع والتوصيل</h3>
          <div className="space-y-2 text-xs text-muted-foreground">
            <p className="flex items-center gap-1.5 font-medium text-foreground">
              💳 التحويل البنكي (بنك مسقط)
            </p>
            <p className="text-[11px] text-muted-foreground">
              يتم الدفع مسبقاً لحساب المحل قبل إرسال الطلب.
            </p>
            <p className="flex items-center gap-1.5 font-medium text-foreground mt-2">
              🚚 التوصيل والاستلام
            </p>
            <p className="text-[11px] text-muted-foreground">
              التوصيل لجميع مناطق السلطنة ودول الخليج، أو الاستلام من فروعنا.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="font-display text-sm font-semibold text-foreground">{t("contact_us")}</h3>
          <div className="space-y-2.5 text-xs text-muted-foreground">
            <a
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-emerald-600 hover:text-emerald-500 font-medium transition-colors"
            >
              <MessageCircle className="size-4" />
              <span>واتساب: +{whatsapp}</span>
            </a>
            <a
              href={`https://instagram.com/${instagram}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-rose-500 hover:text-rose-400 font-medium transition-colors"
            >
              <Instagram className="size-4" />
              <span>@{instagram}</span>
            </a>
            <a
              href={`mailto:${email}`}
              className="flex items-center gap-2 hover:text-primary transition-colors"
            >
              <Mail className="size-4" />
              <span>{email}</span>
            </a>
            <Link
              to="/branches"
              className="flex items-center gap-2 hover:text-primary transition-colors"
            >
              <MapPin className="size-4" />
              <span>فروعنا في سلطنة عمان</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-7xl border-t border-border/50 pt-6 px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground/80">
        <p>{t("footer_note")}</p>
        <p className="text-[11px]">فخامة العبير الملكي واللبان الحوجري الأصيل</p>
      </div>
    </footer>
  );
}
