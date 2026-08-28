import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CurrencyCard } from "../CurrencyCard";
import { useProducts, ProductType } from "../../context/ProductContext";
import { Search, X, ChevronDown, CheckCircle2 } from "lucide-react";
import { SEO } from "../SEO";
import { Link, useLocation } from "react-router-dom";

interface CurrencyProductsProps {
  type: ProductType;
  title: string;
  description: string;
  seoTitle: string;
}

export function CurrencyProducts({ type, title, description, seoTitle }: CurrencyProductsProps) {
  const { products } = useProducts();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const location = useLocation();

  const filteredProducts = products
    .filter(p => p.type === type)
    .filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "amount-high") return (b.amount || 0) - (a.amount || 0);
      return 0;
    });

  const sortLabels: Record<string, string> = {
    featured: "Featured",
    "price-low": "Price: Low → High",
    "price-high": "Price: High → Low",
    "amount-high": "Highest Amount",
  };

  const navLinks = [
    { path: "/products/accounts", label: "MLBB Accounts" },
    { path: "/products/pubg-uc", label: "PUBG UC" },
    { path: "/products/mlbb-diamonds", label: "MLBB Diamonds" },
  ];

  return (
    <div className="min-h-screen pt-28 pb-24 relative overflow-hidden">
      <SEO title={seoTitle} description={description} url={`https://megatron-marketplace.com${location.pathname}`} />
      
      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-violet-600/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Navigation Tabs */}
        <div className="flex gap-4 mb-8 overflow-x-auto pb-4 custom-scrollbar">
          {navLinks.map((link) => {
            const isActive = location.pathname.includes(link.path);
            return (
              <Link 
                key={link.path}
                to={link.path}
                className={`whitespace-nowrap px-6 py-3 rounded-full text-sm font-black uppercase tracking-wider transition-all duration-300 ${
                  isActive 
                    ? "bg-[var(--text-primary)] text-[var(--bg-primary)] shadow-lg" 
                    : "bg-[var(--bg-secondary)]/80 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--border-color)] backdrop-blur-md border border-[var(--border-color)]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-14"
        >
          <h1 className="flex flex-col font-black tracking-tight leading-[0.9] mb-4 uppercase">
            <span className="text-3xl min-[375px]:text-4xl min-[400px]:text-5xl sm:text-7xl lg:text-[5.5rem] text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-sky-300 break-all sm:break-words -ml-1">
              {title}
            </span>
          </h1>
          <p className="text-[var(--text-secondary)] text-base sm:text-lg max-w-xl font-medium leading-relaxed">
            {description}
          </p>
        </motion.div>

        {/* Filter & Search */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8 space-y-4 relative z-50"
        >
          <div className="flex flex-col sm:flex-row gap-4 w-full bg-[var(--bg-secondary)]/30 backdrop-blur-md p-2 rounded-3xl border border-[var(--border-color)] shadow-inner">
            
            {/* Search Bar */}
            <div className="w-full sm:flex-1 relative flex items-center bg-[var(--bg-primary)]/60 border border-[var(--border-color)] rounded-2xl h-14 px-4 shadow-sm focus-within:ring-2 focus-within:ring-blue-500/50 focus-within:border-[var(--text-primary)]/50 transition-all hover:border-[var(--text-secondary)]/30">
              <Search className="shrink-0 w-5 h-5 text-[var(--text-secondary)] mr-3" />
              <input
                type="text"
                placeholder="Search packages..."
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

            {/* Sort Dropdown */}
            <div className="relative flex-1 sm:w-56">
              <button
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="w-full flex items-center justify-center sm:justify-between px-6 h-14 rounded-2xl bg-[var(--bg-primary)]/60 border border-[var(--border-color)] text-sm font-bold text-[var(--text-primary)] transition-all focus:ring-2 focus:ring-blue-500/50 hover:border-[var(--text-primary)]/30"
              >
                <span className="flex items-center gap-3">
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
        </motion.div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-[var(--text-secondary)] font-medium">
            Showing <span className="text-[var(--text-primary)] font-bold">{filteredProducts.length}</span> package{filteredProducts.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Product Grid */}
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
                  <CurrencyCard product={product} />
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
              <h3 className="text-xl font-black text-[var(--text-primary)] mb-2">No packages found</h3>
              <p className="text-[var(--text-secondary)] text-sm font-medium mb-8 max-w-xs mx-auto">
                Try adjusting your search to find what you're looking for.
              </p>
              <button
                onClick={() => setSearchQuery("")}
                className="bg-white text-black px-6 py-3 rounded-xl text-sm font-black uppercase tracking-wider hover:scale-105 transition-transform shadow-lg"
              >
                Clear Search
              </button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
