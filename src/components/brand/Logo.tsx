import { useI18n } from "@/lib/i18n";
import { useQuery } from "@tanstack/react-query";
import { fetchStoreSettings } from "@/lib/settings";

export function LogoMark({ size = 44, customUrl }: { size?: number; customUrl?: string }) {
  const { data: settings } = useQuery({
    queryKey: ["store-settings"],
    queryFn: fetchStoreSettings,
    staleTime: 1000 * 60 * 5,
  });

  const logoUrl = customUrl || settings?.logo_url || "/hashem-logo.jpg";

  return (
    <span
      className="inline-block shrink-0 overflow-hidden rounded-full ring-1 ring-primary/30 bg-background/80"
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <img
        src={logoUrl}
        alt="هاشم للطيب"
        className="size-full object-cover object-center transition-transform duration-300 hover:scale-105"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src = "/hashem-logo.jpg";
        }}
      />
    </span>
  );
}

export function LogoLockup({
  size = 44,
  stacked = false,
  customUrl,
}: {
  size?: number;
  stacked?: boolean;
  customUrl?: string;
}) {
  const { t } = useI18n();
  return (
    <span className={`flex items-center gap-3 ${stacked ? "flex-col text-center" : ""}`}>
      <LogoMark size={size} customUrl={customUrl} />
      <span className="flex flex-col leading-none">
        <span className="font-display text-sm tracking-[0.22em] text-gold-gradient sm:text-base font-bold">
          HASHEM
        </span>
        <span className="mt-1 text-[10px] tracking-[0.32em] text-muted-foreground font-medium">
          {t("brand_sub")} · هاشم
        </span>
      </span>
    </span>
  );
}
