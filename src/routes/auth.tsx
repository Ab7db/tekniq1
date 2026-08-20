import { createFileRoute, useRouter } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Lock, Mail, Phone, Sparkles, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n";
import { LogoMark } from "@/components/brand/Logo";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "تسجيل الدخول — هاشم للطيب | Sign in" },
      {
        name: "description",
        content: "تسجيل الدخول أو إنشاء حساب جديد في متجر هاشم للطيب لمتابعة طلبات العطور والبخور الملكي.",
      },
      { property: "og:title", content: "تسجيل الدخول — هاشم للطيب" },
      { property: "og:description", content: "الوصول إلى حسابك في متجر هاشم للطيب." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { t } = useI18n();
  const router = useRouter();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "in") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { full_name: fullName, phone },
          },
        });
        if (error) throw error;
      }
      toast.success(t("saved"));
      router.navigate({ to: "/" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "حدث خطأ في عملية تسجيل الدخول");
    } finally {
      setBusy(false);
    }
  };

  const googleSignIn = async () => {
    setGoogleBusy(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) {
        toast.error(error.message || "تعذر الاتصال بمزود Google");
      }
    } catch (e) {
      toast.error("حدث خطأ أثناء تسجيل الدخول عبر Google");
    } finally {
      setGoogleBusy(false);
    }
  };

  const field =
    "w-full rounded-xl border border-border bg-background/70 px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary";

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-16 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass rounded-3xl p-8 shadow-gold-glow border border-border/80"
      >
        <div className="flex flex-col items-center text-center mb-6">
          <LogoMark size={56} />
          <h1 className="font-display text-xl font-bold text-gold-gradient mt-3">{t("brand")}</h1>
          <p className="text-xs text-muted-foreground mt-1">{t("tagline")}</p>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 rounded-xl bg-secondary/80 p-1 mb-6 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setMode("in")}
            className={`py-2 rounded-lg transition-all cursor-pointer ${
              mode === "in" ? "bg-background text-foreground shadow-xs font-bold" : "text-muted-foreground"
            }`}
          >
            {t("sign_in")}
          </button>
          <button
            type="button"
            onClick={() => setMode("up")}
            className={`py-2 rounded-lg transition-all cursor-pointer ${
              mode === "up" ? "bg-background text-foreground shadow-xs font-bold" : "text-muted-foreground"
            }`}
          >
            {t("sign_up")}
          </button>
        </div>

        {/* Google Sign-in */}
        <button
          type="button"
          onClick={googleSignIn}
          disabled={googleBusy}
          className="w-full flex items-center justify-center gap-3 rounded-xl border border-border bg-background/80 py-3 text-xs font-semibold text-foreground hover:bg-accent transition-all cursor-pointer shadow-xs disabled:opacity-50"
        >
          {googleBusy ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <svg className="size-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
          )}
          <span>المتابعة باستخدام Google</span>
        </button>

        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <span className="relative bg-card px-3 text-[11px] text-muted-foreground">أو بالبريد الإلكتروني</span>
        </div>

        <form onSubmit={submit} className="space-y-3.5">
          {mode === "up" ? (
            <>
              <div>
                <label className="text-[11px] font-medium text-muted-foreground block mb-1">{t("full_name")}</label>
                <input
                  className={field}
                  placeholder="مثال: خالد العماني"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="text-[11px] font-medium text-muted-foreground block mb-1">{t("phone")}</label>
                <input
                  className={field}
                  dir="ltr"
                  placeholder="96877036097"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            </>
          ) : null}

          <div>
            <label className="text-[11px] font-medium text-muted-foreground block mb-1">{t("email")}</label>
            <input
              className={field}
              type="email"
              dir="ltr"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-[11px] font-medium text-muted-foreground block mb-1">{t("password")}</label>
            <input
              className={field}
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            disabled={busy}
            className="w-full rounded-xl bg-gold-gradient py-3 text-xs font-bold text-primary-foreground shadow-gold-glow disabled:opacity-50 cursor-pointer mt-2"
          >
            {busy ? (
              <Loader2 className="size-4 animate-spin mx-auto" />
            ) : mode === "in" ? (
              t("sign_in")
            ) : (
              t("sign_up")
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
