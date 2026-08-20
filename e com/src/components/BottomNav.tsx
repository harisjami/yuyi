import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Heart, Home, LayoutGrid, Percent, User } from "lucide-react";
import { PopBadge, useShop } from "../shop";

const routeToTab: Partial<Record<string, string>> = {
  home: "home",
  product: "home",
  custom: "home",
  category: "categories",
  wishlist: "wishlist",
};

export default function BottomNav() {
  const { route, navigate, wishIds, wishPulse, notify } = useShop();
  const [active, setActive] = useState("home");

  // keep the glass blob in sync whenever the route changes underneath
  useEffect(() => {
    const mapped = routeToTab[route.name];
    if (mapped) setActive(mapped);
  }, [route.name]);

  const scrollTo = (id: string) => {
    if (route.name !== "home") {
      navigate({ name: "home" });
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }), 380);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const tabs = [
    { id: "home", label: "Home", icon: Home, onTap: () => navigate({ name: "home" }) },
    { id: "categories", label: "Categories", icon: LayoutGrid, onTap: () => scrollTo("categories") },
    { id: "deals", label: "Deals", icon: Percent, onTap: () => scrollTo("deals") },
    { id: "wishlist", label: "Wishlist", icon: Heart, badge: true, onTap: () => navigate({ name: "wishlist" }) },
    { id: "account", label: "Account", icon: User, onTap: () => notify("Account — coming soon") },
  ];

  return (
    <motion.nav
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.45, type: "spring", stiffness: 240, damping: 24 }}
      className="fixed bottom-[max(env(safe-area-inset-bottom),16px)] left-1/2 z-50 -translate-x-1/2"
    >
      <div className="relative flex items-center gap-1 rounded-full bg-zinc-900/90 px-2 py-2 shadow-[0_18px_40px_-12px_rgba(0,0,0,0.6)] ring-1 ring-white/10 backdrop-blur-xl">
        {/* top sheen across the capsule */}
        <span className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

        {tabs.map((t) => {
          const isActive = active === t.id;
          return (
            <motion.button
              key={t.id}
              whileTap={{ scale: 0.86 }}
              onClick={() => {
                setActive(t.id);
                t.onTap();
              }}
              aria-label={t.label}
              className="relative grid h-11 w-12 place-items-center"
            >
              {/* liquid glass blob */}
              {isActive && (
                <motion.span
                  layoutId="liquid-glass"
                  transition={{ type: "spring", stiffness: 320, damping: 26, mass: 0.8 }}
                  className="absolute inset-0.5 rounded-full bg-gradient-to-b from-white/25 to-white/[0.06] shadow-[inset_0_1px_2px_rgba(255,255,255,0.4),inset_0_-2px_6px_rgba(0,0,0,0.3),0_4px_14px_rgba(0,0,0,0.4)] ring-1 ring-white/25 backdrop-blur-md"
                />
              )}
              <span className="relative">
                <t.icon
                  className={`relative z-10 h-[19px] w-[19px] transition-colors duration-300 ${isActive ? "text-amber-400" : "text-zinc-400"}`}
                  strokeWidth={isActive ? 2.4 : 2}
                />
                {t.badge && (
                  <span className="absolute -right-2 -top-1.5 grid place-items-center rounded-full bg-amber-400 text-slate-900 shadow-md shadow-amber-400/40">
                    <PopBadge count={wishIds.length} pulse={wishPulse} />
                  </span>
                )}
              </span>
            </motion.button>
          );
        })}
      </div>
    </motion.nav>
  );
}
