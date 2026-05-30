import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ProductCard } from "../products/ProductCard";
import { useProducts } from "../../context/ProductContext";

const categories = [
  { id: "all", label: "All", icon: "⚡" },
  { id: "warrior", label: "Warrior", icon: "🗡️" },
  { id: "elite", label: "Elite", icon: "🛡️" },
  { id: "master", label: "Master", icon: "⚔️" },
  { id: "grandmaster", label: "Grandmaster", icon: "🏆" },
  { id: "epic", label: "Epic", icon: "💎" },
  { id: "legend", label: "Legend", icon: "👑" },
  { id: "mythic", label: "Mythic", icon: "🌟" },
];

const DISCORD_SVG = (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
  </svg>
);

export function Products() {
  const { products } = useProducts();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement | null>(null);

  const filteredProducts = products
    .filter(p => selectedCategory === "all" || p.rank.toLowerCase().includes(selectedCategory))
    .filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "level") return b.level - a.level;
      return 0;
    });

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (isSortOpen && sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setIsSortOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") setIsSortOpen(false); }
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("click", onDocClick); document.removeEventListener("keydown", onKey); };
  }, [isSortOpen]);

  const sortLabels: Record<string, string> = {
    featured: "Featured",
    "price-low": "Price: Low → High",
    "price-high": "Price: High → Low",
    level: "Highest Level",
  };

  return (
    <div className="min-h-screen pt-28 pb-24 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-violet-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-red-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* ── Hero Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-14"
        >
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
            <div>
              <span className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                Live Marketplace
              </span>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1] mb-4">
                <span className="text-white">The </span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-sky-300">Marketplace</span>
              </h1>
              <p className="text-[var(--text-secondary)] text-lg max-w-xl font-medium leading-relaxed">
                Verified MLBB accounts with instant delivery, lifetime warranty &amp; full email access.
              </p>
            </div>

            <a
              href="https://discord.gg/fKXBF3QyzB"
              target="_blank"
              rel="noreferrer"
              className="group shrink-0 bg-gradient-to-r from-[#5865F2] to-indigo-500 hover:from-[#4752C4] hover:to-indigo-600 text-white px-7 py-4 rounded-2xl font-bold text-sm uppercase tracking-widest inline-flex items-center gap-3 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all"
            >
              {DISCORD_SVG}
              Sell Your Account
            </a>
          </div>

          {/* Stats bar */}
          <div className="mt-8 flex flex-wrap gap-6">
            {[
              { label: "Total Listings", value: products.length },
              { label: "Delivered Today", value: "24+" },
              { label: "Satisfaction Rate", value: "100%" },
              { label: "Avg. Delivery", value: "< 5 min" },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-3 bg-[var(--bg-secondary)]/50 border border-[var(--border-color)] rounded-2xl px-5 py-3 backdrop-blur-sm">
                <span className="text-xl font-black text-white">{stat.value}</span>
                <span className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">{stat.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Filter & Search Bar ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8 space-y-4"
        >
          {/* Category chips */}
          <div className="flex overflow-x-auto gap-2 pb-1 scrollbar-none">
            {categories.map((cat) => {
              const count = cat.id === "all"
                ? products.length
                : products.filter(p => p.rank.toLowerCase().includes(cat.id)).length;
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 border ${
                    active
                      ? "bg-white text-black border-white shadow-lg shadow-white/10"
                      : "bg-[var(--bg-secondary)]/60 border-[var(--border-color)] text-[var(--text-secondary)] hover:text-white hover:border-white/20 backdrop-blur-sm"
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-black ${active ? "bg-black/10 text-black" : "bg-[var(--bg-primary)] text-[var(--text-secondary)]"}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search + Sort */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative flex items-center bg-[var(--bg-secondary)]/60 border border-[var(--border-color)] rounded-xl h-12 px-2 backdrop-blur-sm focus-within:border-white/30 transition-colors">
              <svg className="ml-3 shrink-0 w-4 h-4 text-[var(--text-secondary)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
              </svg>
              <input
                type="text"
                placeholder="Search accounts, ranks, skins..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none pl-3 pr-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="mr-1 w-6 h-6 rounded-full bg-[var(--bg-primary)] text-[var(--text-secondary)] flex items-center justify-center hover:text-white transition-colors">
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              )}
            </div>

            <div className="relative w-full sm:w-52" ref={sortRef}>
              <button
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="w-full flex items-center justify-between px-5 h-12 rounded-xl bg-[var(--bg-secondary)]/60 border border-[var(--border-color)] text-sm font-bold text-[var(--text-primary)] transition-all backdrop-blur-sm hover:border-white/20"
              >
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-[var(--text-secondary)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M7 12h10M11 18h2"/></svg>
                  {sortLabels[sortBy]}
                </span>
                <svg className={`w-4 h-4 text-[var(--text-secondary)] transition-transform ${isSortOpen ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
              </button>

              <AnimatePresence>
                {isSortOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-[calc(100%+0.5rem)] right-0 w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl shadow-2xl z-50 overflow-hidden"
                  >
                    {Object.entries(sortLabels).map(([id, label]) => (
                      <button
                        key={id}
                        onClick={() => { setSortBy(id); setIsSortOpen(false); }}
                        className={`w-full text-left px-5 py-3 text-sm font-bold transition-colors flex items-center justify-between ${sortBy === id ? "text-blue-400 bg-blue-500/5" : "text-[var(--text-primary)] hover:bg-[var(--bg-primary)]"}`}
                      >
                        {label}
                        {sortBy === id && <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" d="M5 13l4 4L19 7"/></svg>}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-[var(--text-secondary)] font-medium">
            Showing <span className="text-white font-bold">{filteredProducts.length}</span> account{filteredProducts.length !== 1 ? "s" : ""}
            {selectedCategory !== "all" && <> in <span className="text-blue-400 font-bold capitalize">{selectedCategory}</span></>}
          </p>
        </div>

        {/* ── Product Grid ── */}
        <AnimatePresence mode="wait">
          {filteredProducts.length > 0 ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
            >
              {filteredProducts.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                >
                  <ProductCard product={product as any} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="py-32 text-center bg-[var(--bg-secondary)]/40 border border-[var(--border-color)] rounded-[2.5rem] backdrop-blur-sm"
            >
              <div className="w-16 h-16 rounded-full bg-[var(--bg-primary)] border border-[var(--border-color)] flex items-center justify-center mx-auto mb-6">
                <svg className="w-7 h-7 text-[var(--text-secondary)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              </div>
              <h3 className="text-xl font-black text-white mb-2">No accounts found</h3>
              <p className="text-[var(--text-secondary)] text-sm font-medium mb-8 max-w-xs mx-auto">
                Try adjusting your search or filters to find what you're looking for.
              </p>
              <button
                onClick={() => { setSearchQuery(""); setSelectedCategory("all"); }}
                className="bg-white text-black px-6 py-3 rounded-xl text-sm font-black uppercase tracking-wider hover:scale-105 transition-transform shadow-lg"
              >
                Clear All Filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
