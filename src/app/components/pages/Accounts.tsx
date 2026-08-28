import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { ProductCard } from "../ProductCard";
import { useProducts, ProductType } from "../../context/ProductContext";
import { useReviews } from "../../context/ReviewContext";
import { Zap, Medal, Gem, Crown, Search, X, ChevronDown, Filter, Star, Loader2, MessageSquare, Quote, CheckCircle2, SlidersHorizontal } from "lucide-react";
import { api } from "../../../lib/api";

const collectionRanks = [
  {
    id: "all",
    label: "All",
    icon: <svg className="w-4 h-4 text-yellow-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 2L2 13h9l-1 9 11-12h-9l1-8z" /></svg>
  },
  {
    id: "expert collector",
    label: "Expert Collector",
    icon: <svg className="w-4 h-4 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7" /><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" /></svg>
  },
  {
    id: "renowned collector",
    label: "Renowned Collector",
    icon: <svg className="w-4 h-4 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
  },
  {
    id: "exalted collector",
    label: "Exalted Collector",
    icon: <svg className="w-4 h-4 text-yellow-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3 6 7 1-5 5 1.5 7-6.5-3.5L5.5 21 7 14l-5-5 7-1z" /><circle cx="12" cy="11.5" r="2.5" fill="currentColor" /></svg>
  },
  {
    id: "mega collector",
    label: "Mega Collector",
    icon: <svg className="w-4 h-4 text-cyan-400" viewBox="0 0 24 24" fill="currentColor"><path d="M6 2L2 8l10 14L22 8l-4-6H6zM12 19L5 9h14l-7 10z" /></svg>
  },
  {
    id: "world collector",
    label: "World Collector",
    icon: <svg className="w-4 h-4 text-yellow-500" viewBox="0 0 24 24" fill="currentColor"><path d="M2 4l3 11h14l3-11-5 4-5-6-5 6-5-4zm2 14h16v2H4z" /></svg>
  },
  {
    id: "galaxy collector",
    label: "Galaxy Collector",
    icon: <svg className="w-4 h-4 text-purple-400" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3 5 6-1-4 4 2 6-6-3-6 3 2-6-4-4 6 1z" /><path d="M5 21a10 10 0 0 0 14 0" stroke="currentColor" strokeWidth="2" fill="none" /></svg>
  },
];

const DISCORD_SVG = (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
  </svg>
);

import { SEO } from "../SEO";

export function Accounts() {
  const { products } = useProducts();
  const { reviews } = useReviews();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRank, setSelectedRank] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement | null>(null);
  const [isRankOpen, setIsRankOpen] = useState(false);
  const rankRef = useRef<HTMLDivElement | null>(null);

  const [isSelling, setIsSelling] = useState(false);
  const [sellStatus, setSellStatus] = useState<"idle" | "success" | "error">("idle");
  const [sellMessage, setSellMessage] = useState("");

  // Advanced Filters State
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [minHeroes, setMinHeroes] = useState(0);
  const [minSkins, setMinSkins] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const handleSellClick = async () => {
    const userId = localStorage.getItem("discord_id");
    const username = localStorage.getItem("discord_username") || "User";

    if (!userId) {
      setSellStatus("error");
      setSellMessage("Please login with Discord first to sell an account.");
      return;
    }

    setIsSelling(true);
    setSellStatus("idle");
    try {
      const res = await api.createTicket({
        product: { id: 'sell', title: 'Account Sell Request', price: 0, description: '', image: '', level: 0, heroes: 0, skins: 0, collectionRank: '' },
        userId,
        username
      });
      if (res.success) {
        setSellStatus("success");
        setSellMessage("Ticket created! Redirecting to Discord...");
        if (res.ticketUrl) {
          window.open(res.ticketUrl, "_blank");
        }
      } else {
        setSellStatus("error");
        setSellMessage(res.error || "Failed to create ticket.");
      }
    } catch (err) {
      setSellStatus("error");
      setSellMessage("An unexpected error occurred.");
    } finally {
      setIsSelling(false);
    }
  };

  const filteredProducts = products
    .filter(p => p.type === 'account' || !p.type)
    .filter(p => selectedRank === "all" || (p.collectionRank && p.collectionRank.toLowerCase() === selectedRank))
    .filter(p => selectedCategory === "all" || (p.category && p.category.toLowerCase() === selectedCategory))
    .filter(p => {
      const pPrice = Number(p.price) || 0;
      return pPrice >= priceRange[0] && (priceRange[1] === 1000 ? true : pPrice <= priceRange[1]);
    })
    .filter(p => (p.heroes || 0) >= minHeroes)
    .filter(p => (p.skins || 0) >= minSkins)
    .filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()));

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const isCurrencyA = a.type === "pubg-uc" || a.type === "mlbb-diamonds";
    const isCurrencyB = b.type === "pubg-uc" || b.type === "mlbb-diamonds";
    
    if (isCurrencyA && !isCurrencyB) return -1;
    if (!isCurrencyA && isCurrencyB) return 1;

    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    if (sortBy === "level") return b.level - a.level;
    return 0; // featured
  });

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (isSortOpen && sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setIsSortOpen(false);
      }
      if (isRankOpen && rankRef.current && !rankRef.current.contains(e.target as Node)) {
        setIsRankOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsSortOpen(false);
        setIsRankOpen(false);
      }
    }
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("click", onDocClick); document.removeEventListener("keydown", onKey); };
  }, [isSortOpen, isRankOpen]);

  const sortLabels: Record<string, string> = {
    featured: "Featured",
    "price-low": "Price: Low → High",
    "price-high": "Price: High → Low",
    level: "Highest Level",
  };

  return (
    <div className="min-h-screen pt-28 pb-24 relative overflow-hidden">
      <SEO title="Accounts | Megatron Marketplace" description="Browse our premium selection of verified MLBB accounts." url="https://megatron-marketplace.com/accounts" />
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
          <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
            <div className="flex-1">
              <span className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                Live Marketplace
              </span>
              <h1 className="flex flex-col font-black tracking-tight leading-[0.9] mb-4 uppercase">
                <span className="text-2xl min-[375px]:text-3xl min-[400px]:text-4xl sm:text-6xl lg:text-7xl text-[var(--text-primary)]">THE</span>
                <span className="text-3xl min-[375px]:text-4xl min-[400px]:text-5xl sm:text-7xl lg:text-[5.5rem] text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-sky-300 break-all sm:break-words -ml-1">ACCOUNTS</span>
              </h1>
              <p className="text-[var(--text-secondary)] text-base sm:text-lg max-w-xl font-medium leading-relaxed mb-6 lg:mb-0">
                Verified MLBB accounts with instant delivery, lifetime warranty &amp; full email access.
              </p>
            </div>

            {/* Right Side: Latest Reviews */}
            <div className="w-full lg:w-[400px] shrink-0 flex flex-col gap-4">
              {reviews && reviews.slice(0, 2).map((review, idx) => (
                <div key={review.id || idx} className="bg-[var(--bg-secondary)]/60 border border-[var(--border-color)] rounded-2xl p-4 backdrop-blur-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5">
                    <Star className="w-16 h-16" />
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "fill-[var(--bg-primary)] text-[var(--border-color)]"}`} />
                      ))}
                      {idx === 0 && <span className="ml-2 text-[10px] uppercase tracking-wider font-black text-[var(--text-secondary)]">Latest Review</span>}
                    </div>
                    <p className="text-sm text-[var(--text-primary)] font-medium line-clamp-3 italic mb-3">
                      "{review.comment}"
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-blue-400">{review.name.length > 15 ? `User ${review.name.substring(0, 10)}...` : review.name}</span>
                      <span className="text-[10px] font-bold text-[var(--text-secondary)]">{review.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── Filter & Search Bar ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8 space-y-4 relative z-50"
        >
          {/* Desktop Rank Chips */}
          <div className="hidden sm:flex flex-wrap gap-2 pb-1">
            {collectionRanks.map((rank) => {
              const count = rank.id === "all"
                ? products.length
                : products.filter(p => p.collectionRank && p.collectionRank.toLowerCase() === rank.id).length;
              const active = selectedRank === rank.id;
              return (
                <button
                  key={rank.id}
                  onClick={() => { setSelectedRank(rank.id); setIsRankOpen(false); }}
                  className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 border ${active
                    ? "bg-[var(--text-primary)] text-[var(--bg-primary)] border-[var(--text-primary)] shadow-lg shadow-[var(--text-primary)]/10"
                    : "bg-[var(--bg-secondary)]/60 border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-primary)]/20 backdrop-blur-sm"
                    }`}
                >
                  <span>{rank.icon}</span>
                  <span>{rank.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-black ${active ? "bg-[var(--bg-primary)] text-[var(--text-primary)] opacity-80" : "bg-[var(--bg-primary)] text-[var(--text-secondary)]"}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search + Sort + Mobile Rank */}
          <div className="flex flex-col sm:flex-row gap-4 w-full bg-[var(--bg-secondary)]/30 backdrop-blur-md p-2 rounded-3xl border border-[var(--border-color)] shadow-inner">

            {/* Mobile Rank Dropdown */}
            <div className="relative w-full sm:hidden" ref={rankRef}>
              <button
                onClick={() => setIsRankOpen(!isRankOpen)}
                className="w-full flex items-center justify-between px-6 h-14 rounded-2xl bg-[var(--bg-primary)]/60 border border-[var(--border-color)] text-sm font-bold text-[var(--text-primary)] transition-all focus:ring-2 focus:ring-blue-500/50 hover:border-[var(--text-primary)]/30"
              >
                <span className="flex items-center gap-3">
                  <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
                    <Filter className="w-4 h-4" />
                  </div>
                  {collectionRanks.find(r => r.id === selectedRank)?.label || "Rank"}
                </span>
                <ChevronDown className={`w-4 h-4 text-[var(--text-secondary)] transition-transform duration-300 ${isRankOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {isRankOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-[calc(100%+0.5rem)] left-0 w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl shadow-2xl z-50 overflow-hidden backdrop-blur-xl"
                  >
                    {collectionRanks.map((rank) => (
                      <button
                        key={rank.id}
                        onClick={() => { setSelectedRank(rank.id); setIsRankOpen(false); }}
                        className={`w-full text-left px-5 py-3.5 text-sm font-bold transition-all flex items-center justify-between group ${selectedRank === rank.id ? "bg-blue-500/10 text-blue-500" : "text-[var(--text-secondary)] hover:bg-[var(--bg-primary)]/50 hover:text-[var(--text-primary)]"}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-1.5 rounded-lg transition-colors ${selectedRank === rank.id ? "bg-blue-500/20" : "bg-[var(--bg-primary)] group-hover:bg-[var(--border-color)]"}`}>
                            {rank.icon}
                          </div>
                          {rank.label}
                        </div>
                        {selectedRank === rank.id && <CheckCircle2 className="w-4 h-4 text-blue-400" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Search Bar */}
            <div className="w-full sm:flex-1 relative flex items-center bg-[var(--bg-primary)]/60 border border-[var(--border-color)] rounded-2xl h-14 px-4 shadow-sm focus-within:ring-2 focus-within:ring-blue-500/50 focus-within:border-[var(--text-primary)]/50 transition-all hover:border-[var(--text-secondary)]/30">
              <Search className="shrink-0 w-5 h-5 text-[var(--text-secondary)] mr-3" />
              <input
                type="text"
                placeholder="Search accounts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 min-w-0 bg-transparent border-none outline-none w-full text-sm font-medium text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="ml-2 p-1.5 rounded-lg bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--border-color)] transition-colors">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex gap-4 w-full sm:w-auto shrink-0">
              {/* Advanced Filters Button */}
              <button
                onClick={() => setIsFiltersOpen(true)}
                className="flex-1 sm:flex-none flex items-center justify-center sm:justify-start gap-2 px-5 h-14 rounded-2xl bg-[var(--bg-primary)]/60 border border-[var(--border-color)] text-sm font-bold text-[var(--text-primary)] transition-all focus:ring-2 focus:ring-blue-500/50 hover:border-[var(--text-primary)]/30"
              >
                <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
                  <SlidersHorizontal className="w-4 h-4" />
                </div>
                Filters
              </button>

              {/* Sort Dropdown */}
              <div className="relative flex-1 sm:w-56" ref={sortRef}>
                <button
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  className="w-full flex items-center justify-center sm:justify-between px-6 h-14 rounded-2xl bg-[var(--bg-primary)]/60 border border-[var(--border-color)] text-sm font-bold text-[var(--text-primary)] transition-all focus:ring-2 focus:ring-blue-500/50 hover:border-[var(--text-primary)]/30"
                >
                <span className="flex items-center gap-3">
                  <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M7 12h10M11 18h2" /></svg>
                  </div>
                  {sortLabels[sortBy]}
                </span>
                <ChevronDown className={`w-4 h-4 text-[var(--text-secondary)] transition-transform duration-300 ${isSortOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {isSortOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-[calc(100%+0.5rem)] right-0 w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl shadow-2xl z-50 overflow-hidden backdrop-blur-xl"
                  >
                    {Object.entries(sortLabels).map(([id, label]) => (
                      <button
                        key={id}
                        onClick={() => { setSortBy(id); setIsSortOpen(false); }}
                        className={`w-full text-left px-5 py-3.5 text-sm font-bold transition-all flex items-center justify-between group ${sortBy === id ? "bg-blue-500/10 text-blue-500" : "text-[var(--text-secondary)] hover:bg-[var(--bg-primary)]/50 hover:text-[var(--text-primary)]"}`}
                      >
                        {label}
                        {sortBy === id && <CheckCircle2 className="w-4 h-4 text-blue-400" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            </div>
          </div>
        </motion.div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-[var(--text-secondary)] font-medium">
            Showing <span className="text-[var(--text-primary)] font-bold">{sortedProducts.length}</span> items
            {selectedRank !== "all" && <> in <span className="text-blue-400 font-bold capitalize">{selectedRank}</span></>}
          </p>
        </div>

        {/* ── Product Grid ── */}
        <AnimatePresence mode="wait">
          {sortedProducts.length > 0 ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
            >
              {sortedProducts.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                >
                  <ProductCard product={product} />
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
                <svg className="w-7 h-7 text-[var(--text-secondary)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
              </div>
              <h3 className="text-xl font-black text-[var(--text-primary)] mb-2">No items found</h3>
              <p className="text-[var(--text-secondary)] text-sm font-medium mb-8 max-w-xs mx-auto">
                Try adjusting your search or filters to find what you're looking for.
              </p>
              <button
                onClick={() => { setSearchQuery(""); setSelectedRank("all"); }}
                className="bg-white text-black px-6 py-3 rounded-xl text-sm font-black uppercase tracking-wider hover:scale-105 transition-transform shadow-lg"
              >
                Clear All Filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>



        {/* ── Sell Your Account CTA Section ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-20 relative overflow-hidden rounded-[3rem] bg-black/60 backdrop-blur-xl border border-white/10 shadow-2xl"
        >
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none translate-y-1/3 -translate-x-1/3" />

          <div className="relative z-10 p-10 sm:p-14 md:p-20 flex flex-col items-center text-center">
            <div className="w-24 h-24 mb-8 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-400 p-[2px] shadow-[0_0_30px_rgba(59,130,246,0.3)]">
              <div className="w-full h-full rounded-full bg-black/80 backdrop-blur-sm flex items-center justify-center text-blue-400">
                <MessageSquare className="w-10 h-10" />
              </div>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">
              Ready to Sell Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Account?</span>
            </h2>

            <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto mb-10 font-medium leading-relaxed">
              Skip the middleman. Create a ticket directly with our team to get a quick valuation and sell your account safely for the best market price.
            </p>

            <div className="flex flex-col items-center gap-4">
              <button
                onClick={handleSellClick}
                disabled={isSelling}
                className={`group bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 text-white px-10 py-5 rounded-2xl font-black text-sm sm:text-base uppercase tracking-widest inline-flex items-center gap-4 shadow-[0_0_30px_rgba(59,130,246,0.4)] hover:shadow-[0_0_50px_rgba(59,130,246,0.6)] hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none`}
              >
                {isSelling ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Creating Ticket...
                  </>
                ) : (
                  <>
                    {DISCORD_SVG}
                    Open Sell Ticket
                  </>
                )}
              </button>

              {sellStatus === "error" && (
                <div className="text-red-400 bg-red-500/10 border border-red-500/20 px-6 py-3 rounded-xl text-sm font-bold animate-in fade-in slide-in-from-bottom-2">
                  {sellMessage}
                </div>
              )}
              {sellStatus === "success" && (
                <div className="text-[#bef264] bg-[#bef264]/10 border border-[#bef264]/20 px-6 py-3 rounded-xl text-sm font-bold animate-in fade-in slide-in-from-bottom-2">
                  {sellMessage}
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* ── Sell Your Account CTA Section ── */}
        {/* ... (Omitted CTA section for brevity, assuming it remains mostly unchanged in layout structure) */}

        {/* Advanced Filters Slide-out Panel */}
        {createPortal(
          <AnimatePresence>
            {isFiltersOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsFiltersOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
              />
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed top-0 right-0 bottom-0 w-full max-w-[400px] bg-[var(--bg-secondary)] border-l border-[var(--border-color)] shadow-2xl z-[101] flex flex-col"
              >
                <div className="flex items-center justify-between p-6 border-b border-[var(--border-color)] bg-[var(--bg-primary)]">
                  <h3 className="text-lg font-black tracking-wide flex items-center gap-2">
                    <SlidersHorizontal className="w-5 h-5 text-blue-400" />
                    Advanced Filters
                  </h3>
                  <button onClick={() => setIsFiltersOpen(false)} className="p-2 hover:bg-[var(--bg-secondary)] rounded-full transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">

                  {/* Category Filter */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)]">Category</label>
                    <div className="grid grid-cols-2 gap-2">
                      {["all", "starter", "mid-tier", "premium", "collector"].map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setSelectedCategory(cat)}
                          className={`px-4 py-2.5 rounded-xl text-sm font-bold capitalize transition-colors border ${selectedCategory === cat ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] border-[var(--text-primary)]' : 'bg-[var(--bg-primary)] text-[var(--text-secondary)] border-[var(--border-color)] hover:border-[var(--text-secondary)]/50'}`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price Range Filter */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)] flex justify-between">
                      <span>Max Price</span>
                      <span className="text-blue-400">${priceRange[1]}{priceRange[1] === 1000 ? '+' : ''}</span>
                    </label>
                    <input
                      type="range"
                      min="0" max="1000" step="10"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                      className="w-full h-2 bg-[var(--border-color)] rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                  </div>

                  {/* Minimum Heroes Filter */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)] flex justify-between">
                      <span>Min Heroes</span>
                      <span className="text-[var(--text-primary)]">{minHeroes}</span>
                    </label>
                    <input
                      type="range"
                      min="0" max="130" step="5"
                      value={minHeroes}
                      onChange={(e) => setMinHeroes(parseInt(e.target.value))}
                      className="w-full h-2 bg-[var(--border-color)] rounded-lg appearance-none cursor-pointer accent-[var(--text-primary)]"
                    />
                  </div>

                  {/* Minimum Skins Filter */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)] flex justify-between">
                      <span>Min Skins</span>
                      <span className="text-[var(--text-primary)]">{minSkins}</span>
                    </label>
                    <input
                      type="range"
                      min="0" max="500" step="10"
                      value={minSkins}
                      onChange={(e) => setMinSkins(parseInt(e.target.value))}
                      className="w-full h-2 bg-[var(--border-color)] rounded-lg appearance-none cursor-pointer accent-[var(--text-primary)]"
                    />
                  </div>
                </div>

                <div className="p-6 border-t border-[var(--border-color)] bg-[var(--bg-primary)] flex gap-4">
                  <button
                    onClick={() => {
                      setPriceRange([0, 1000]);
                      setMinHeroes(0);
                      setMinSkins(0);
                      setSelectedCategory("all");
                    }}
                    className="flex-1 py-3 px-4 rounded-xl font-bold border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors"
                  >
                    Reset
                  </button>
                  <button
                    onClick={() => setIsFiltersOpen(false)}
                    className="flex-1 py-3 px-4 rounded-xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-400 hover:to-cyan-400 shadow-lg transition-colors"
                  >
                    Apply Filters
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
        )}

      </div>
    </div>
  );
}
