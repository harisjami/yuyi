import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, Heart, Menu, MoreHorizontal, PartyPopper, Search, ShoppingCart, X } from "lucide-react";
import { categoryStrip } from "../data";
import { PopBadge, useShop } from "../shop";

const iconBtn =
  "relative grid h-10 w-10 place-items-center rounded-full text-slate-700 transition-colors hover:bg-slate-100 active:bg-slate-200";

export default function TopChrome() {
  const { cartCount, cartPulse, wishIds, wishPulse, navigate, setMenuOpen } = useShop();
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      {/* announcement bar */}
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
        className="relative overflow-hidden bg-blue-700 px-4 py-2.5"
      >
        <div className="animate-shine pointer-events-none absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
        <button
          onClick={() => navigate({ name: "category", cat: "All" })}
          className="relative mx-auto flex w-full items-center justify-center gap-2 text-[13px] font-semibold text-white"
        >
          <PartyPopper className="h-4 w-4 text-amber-300" />
          <span>
            Mega Summer Sale is Live! <span className="text-amber-300">Get Up to 60% OFF</span>
          </span>
          <motion.span animate={{ x: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}>
            <ChevronRight className="h-4 w-4" />
          </motion.span>
        </button>
      </motion.div>

      {/* sticky header */}
      <div className="sticky top-0 z-40 bg-white/95 shadow-[0_1px_0_rgba(15,23,42,0.06)] backdrop-blur">
        <motion.header
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.45 }}
          className="flex items-center justify-between px-4 pb-2.5 pt-3"
        >
          <div className="flex items-center gap-2.5">
            <motion.button whileTap={{ scale: 0.88 }} onClick={() => setMenuOpen(true)} className={iconBtn} aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </motion.button>
            <div className="flex items-center gap-2.5">
              <motion.div
                whileHover={{ rotate: -6, scale: 1.05 }}
                className="grid h-10 w-10 place-items-center overflow-hidden rounded-xl bg-zinc-900 shadow-md shadow-zinc-900/40 ring-1 ring-white/10"
              >
                <img src="/images/logo.png" alt="Forge Of Ash" className="h-9 w-9 object-contain" />
              </motion.div>
              <div className="leading-tight">
                <p className="font-display text-[16px] font-extrabold tracking-tight text-zinc-900">Forge Of Ash</p>
                <p className="text-[10px] font-medium text-slate-400">Hand-Forged · Built to Last</p>
              </div>
            </div>
          </div>

          <div className="flex items-center">
            {/* search (replaces account) */}
            <motion.button
              whileTap={{ scale: 0.88 }}
              onClick={() => setSearchOpen((v) => !v)}
              className={`${iconBtn} ${searchOpen ? "bg-zinc-900 text-white hover:bg-zinc-800" : ""}`}
              aria-label="Search"
            >
              <AnimatePresence mode="wait" initial={false}>
                {searchOpen ? (
                  <motion.span key="x" initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0 }} transition={{ duration: 0.18 }}>
                    <X className="h-5 w-5" />
                  </motion.span>
                ) : (
                  <motion.span key="s" initial={{ scale: 0, rotate: 90 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0 }} transition={{ duration: 0.18 }}>
                    <Search className="h-5 w-5" />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
            <motion.button whileTap={{ scale: 0.88 }} onClick={() => navigate({ name: "wishlist" })} className={iconBtn} aria-label="Wishlist">
              <Heart className="h-5 w-5" />
              <span className="absolute right-1 top-1 grid place-items-center rounded-full bg-blue-700 text-white">
                <PopBadge count={wishIds.length} pulse={wishPulse} />
              </span>
            </motion.button>
            <motion.button whileTap={{ scale: 0.88 }} onClick={() => navigate({ name: "cart" })} className={iconBtn} aria-label="Cart">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute right-0.5 top-0.5 grid place-items-center rounded-full bg-blue-700 text-white">
                <PopBadge count={cartCount} pulse={cartPulse} />
              </span>
            </motion.button>
          </div>
        </motion.header>

        {/* slide-down search */}
        <AnimatePresence>
          {searchOpen && (
            <motion.form
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              onSubmit={(e) => {
                e.preventDefault();
                setSearchOpen(false);
                navigate({ name: "category", cat: "All" });
              }}
              className="overflow-hidden px-4"
            >
              <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 py-1.5 pl-4 pr-1.5 transition-all focus-within:border-zinc-900 focus-within:bg-white focus-within:ring-4 focus-within:ring-zinc-900/5">
                <Search className="h-4 w-4 shrink-0 text-slate-400" />
                <input
                  autoFocus
                  type="text"
                  placeholder="Search blades, steels, categories…"
                  className="w-full bg-transparent text-[13px] text-slate-700 outline-none placeholder:text-slate-400"
                />
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  type="submit"
                  className="grid h-8 w-9 shrink-0 place-items-center rounded-full bg-zinc-900 text-white shadow-sm transition-colors hover:bg-black"
                  aria-label="Search"
                >
                  <Search className="h-4 w-4" />
                </motion.button>
              </div>
              <div className="h-3" />
            </motion.form>
          )}
        </AnimatePresence>

        {/* category strip */}
        <motion.nav
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.24, duration: 0.5 }}
          className="no-scrollbar flex gap-4 overflow-x-auto px-4 pb-3 pt-0.5"
        >
          {categoryStrip.map((c, i) => (
            <motion.button
              key={c.name}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28 + i * 0.06, type: "spring", stiffness: 300, damping: 22 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => navigate({ name: "category", cat: c.name })}
              className="flex w-[62px] shrink-0 flex-col items-center gap-1.5"
            >
              <span className="block h-[58px] w-[58px] overflow-hidden rounded-2xl border border-slate-200 bg-white p-[3px] shadow-sm transition-shadow hover:shadow-md">
                <img src={c.img} alt={c.name} loading="lazy" className="h-full w-full rounded-[13px] object-cover" />
              </span>
              <span className="text-center text-[10px] font-semibold leading-tight text-slate-700">{c.name}</span>
            </motion.button>
          ))}
          <motion.button
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28 + categoryStrip.length * 0.06, type: "spring", stiffness: 300, damping: 22 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => navigate({ name: "category", cat: "All" })}
            className="flex w-[62px] shrink-0 flex-col items-center gap-1.5"
          >
            <span className="grid h-[58px] w-[58px] place-items-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 text-slate-500">
              <MoreHorizontal className="h-5 w-5" />
            </span>
            <span className="text-center text-[10px] font-semibold leading-tight text-slate-700">All</span>
          </motion.button>
        </motion.nav>
      </div>
    </>
  );
}
