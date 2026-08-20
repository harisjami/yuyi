import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, ShoppingBag } from "lucide-react";
import { byId } from "./data";

/* ---------------- routing ---------------- */
export type Route =
  | { name: "home" }
  | { name: "product"; id: string }
  | { name: "category"; cat: string }
  | { name: "cart" }
  | { name: "wishlist" }
  | { name: "custom" };

export const routeKey = (r: Route) => (r.name === "product" ? `product-${r.id}` : r.name === "category" ? `category-${r.cat}` : r.name);

/* ---------------- context ---------------- */
type ShopState = {
  // navigation
  route: Route;
  navigate: (r: Route) => void;
  back: () => void;
  // menu drawer
  menuOpen: boolean;
  setMenuOpen: (v: boolean) => void;
  // cart
  cartLines: { id: string; qty: number }[];
  cartCount: number;
  cartPulse: number;
  addToCart: (id: string, qty?: number) => void;
  setQty: (id: string, delta: number) => void;
  removeLine: (id: string) => void;
  // wishlist
  wishIds: string[];
  wishPulse: number;
  isWished: (id: string) => boolean;
  toggleWish: (id: string) => void;
  // toasts
  notify: (msg: string, kind?: "cart" | "info") => void;
};

const ShopContext = createContext<ShopState | null>(null);

export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error("useShop outside provider");
  return ctx;
}

type Toast = { id: number; msg: string; kind: "cart" | "info" };

export function ShopProvider({ children }: { children: ReactNode }) {
  const [route, setRoute] = useState<Route>({ name: "home" });
  const stack = useRef<Route[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);

  const [cartLines, setCartLines] = useState<{ id: string; qty: number }[]>([
    { id: "chef-single", qty: 1 },
    { id: "velvet", qty: 1 },
    { id: "veggiebox", qty: 1 },
  ]);
  const [cartPulse, setCartPulse] = useState(0);
  const [wishIds, setWishIds] = useState<string[]>(["knife-pocket", "chef-set-5"]);
  const [wishPulse, setWishPulse] = useState(0);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idRef = useRef(0);

  const notify = useCallback((msg: string, kind: "cart" | "info" = "info") => {
    const id = ++idRef.current;
    setToasts((t) => [...t, { id, msg, kind }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2600);
  }, []);

  const navigate = useCallback((r: Route) => {
    setRoute((cur) => {
      stack.current.push(cur);
      return r;
    });
    setMenuOpen(false);
    window.scrollTo({ top: 0 });
  }, []);

  const back = useCallback(() => {
    setRoute((cur) => {
      const prev = stack.current.pop();
      void cur;
      return prev ?? { name: "home" };
    });
    window.scrollTo({ top: 0 });
  }, []);

  const addToCart = useCallback(
    (id: string, qty = 1) => {
      setCartLines((lines) => {
        const hit = lines.find((l) => l.id === id);
        return hit ? lines.map((l) => (l.id === id ? { ...l, qty: l.qty + qty } : l)) : [...lines, { id, qty }];
      });
      setCartPulse((p) => p + 1);
      const p = byId(id);
      notify(`${p ? p.name : "Item"} added to cart`, "cart");
    },
    [notify],
  );

  const setQty = useCallback((id: string, delta: number) => {
    setCartLines((lines) =>
      lines
        .map((l) => (l.id === id ? { ...l, qty: l.qty + delta } : l))
        .filter((l) => l.qty > 0),
    );
  }, []);

  const removeLine = useCallback((id: string) => {
    setCartLines((lines) => lines.filter((l) => l.id !== id));
  }, []);

  const isWished = useCallback((id: string) => wishIds.includes(id), [wishIds]);

  const toggleWish = useCallback(
    (id: string) => {
      const has = wishIds.includes(id);
      setWishIds((ids) => (has ? ids.filter((x) => x !== id) : [...ids, id]));
      setWishPulse((p) => p + 1);
      const p = byId(id);
      notify(has ? `Removed ${p?.name ?? "item"} from wishlist` : `Saved ${p?.name ?? "item"} to wishlist`, "info");
    },
    [wishIds, notify],
  );

  const cartCount = useMemo(() => cartLines.reduce((s, l) => s + l.qty, 0), [cartLines]);

  const value: ShopState = {
    route,
    navigate,
    back,
    menuOpen,
    setMenuOpen,
    cartLines,
    cartCount,
    cartPulse,
    addToCart,
    setQty,
    removeLine,
    wishIds,
    wishPulse,
    isWished,
    toggleWish,
    notify,
  };

  return (
    <ShopContext.Provider value={value}>
      {children}
      {/* toast stack */}
      <div className="pointer-events-none fixed bottom-24 left-1/2 z-[80] w-full max-w-[430px] -translate-x-1/2 px-6">
        <div className="flex flex-col items-center gap-2">
          <AnimatePresence>
            {toasts.map((t) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 24, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 420, damping: 28 }}
                className="flex items-center gap-2.5 rounded-full bg-slate-900/95 py-2.5 pl-3 pr-5 text-xs font-semibold text-white shadow-xl shadow-slate-900/30 backdrop-blur"
              >
                {t.kind === "cart" ? (
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-blue-600">
                    <ShoppingBag className="h-3.5 w-3.5" />
                  </span>
                ) : (
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                )}
                <span className="line-clamp-1">{t.msg}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </ShopContext.Provider>
  );
}

/** animated numeric badge that pops whenever `pulse` changes */
export function PopBadge({ count, pulse, className = "" }: { count: number; pulse: number; className?: string }) {
  return (
    <span className={`relative grid h-4 min-w-4 place-items-center rounded-full px-1 ${className}`}>
      <AnimatePresence mode="popLayout">
        <motion.span
          key={pulse}
          initial={{ scale: 1.8, y: -4 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 22 }}
          className="text-[10px] font-bold leading-none"
        >
          {count}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
