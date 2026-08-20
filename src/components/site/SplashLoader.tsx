import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LogoLockup } from "@/components/brand/Logo";

/** Animated brand splash shown once per browser session. */
export function SplashLoader() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("hashem-splash") === "seen") return;
    setShow(true);
    sessionStorage.setItem("hashem-splash", "seen");
    const timer = setTimeout(() => setShow(false), 1900);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 90, damping: 16 }}
            className="flex flex-col items-center gap-6"
          >
            <LogoLockup size={92} stacked />
            <motion.span
              initial={{ width: 0 }}
              animate={{ width: "9rem" }}
              transition={{ duration: 1.4, ease: "easeInOut" }}
              className="h-0.5 rounded-full bg-gold-gradient"
            />
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
