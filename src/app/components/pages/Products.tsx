import { useState, useRef, useEffect } from "react";
import { ProductCard } from "../products/ProductCard";
import { useProducts } from "../../context/ProductContext";

const categories = [
  { id: "all", label: "All Accounts" },
  { id: "warrior", label: "Warrior" },
  { id: "elite", label: "Elite" },
  { id: "master", label: "Master" },
  { id: "grandmaster", label: "Grandmaster" },
  { id: "epic", label: "Epic" },
  { id: "legend", label: "Legend" },
  { id: "mythic", label: "Mythic" },
];

export function Products() {
  const { products } = useProducts();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("featured");

  const [isSortOpen, setIsSortOpen] = useState(false);

  const filteredProducts = products
    .filter(p => selectedCategory === "all" || p.rank.toLowerCase().includes(selectedCategory))
    .filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "level") return b.level - a.level;
      return 0;
    });

  const sortRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown when clicking outside or pressing Escape
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (isSortOpen && sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setIsSortOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setIsSortOpen(false);
    }
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [isSortOpen]);

  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-[var(--text-primary)] mb-4">Marketplace</h1>
            <p className="text-[var(--text-secondary)] max-w-2xl text-lg font-medium mx-auto md:mx-0">
              Browse our verified selection of Mobile Legends accounts. 
              Instant delivery, lifetime warranty, and full email access.
            </p>
          </div>
          
          <a 
            href="https://discord.gg/fKXBF3QyzB" 
            target="_blank" 
            rel="noreferrer" 
            className="w-full md:w-auto text-center shrink-0 bg-[#5865F2] hover:bg-[#4752C4] text-white px-8 py-4 rounded-full font-bold text-sm uppercase tracking-widest inline-flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all group"
          >
            <svg className="w-5 h-5 group-hover:rotate-12 transition-transform" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" /></svg>
            Sell Your Account
          </a>
        </div>

        {/* Filter Bar: categories row above search/sort to match screenshot */}
        <div className="mb-6">
          <div className="flex overflow-x-auto gap-3 pb-2 custom-scrollbar w-full">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`shrink-0 px-5 py-2.5 rounded-full text-sm font-bold transition-all border ${
                  selectedCategory === cat.id
                    ? "bg-[var(--text-primary)] border-[var(--text-primary)] text-[var(--bg-primary)] shadow-md"
                    : "bg-[var(--bg-secondary)] border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-primary)] shadow-sm"
                }`}
              >
                {cat.label}
                <span className={`ml-2 text-[10px] px-2 py-0.5 rounded-full ${
                  selectedCategory === cat.id ? "bg-[var(--bg-primary)]/20" : "bg-[var(--bg-primary)] border border-[var(--border-color)]"
                }`}>
                  {cat.id === "all" ? products.length : products.filter(p => p.rank.toLowerCase().includes(cat.id)).length}
                </span>
              </button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center w-full mt-4">
            <div className="relative flex items-center bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-full h-12 px-2 shadow-sm transition-shadow hover:shadow-md hover:border-[var(--text-primary)] w-full sm:w-80">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-none outline-none pl-4 pr-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]"
              />
              <button className="w-9 h-9 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] flex items-center justify-center shrink-0 hover:scale-105 transition-transform">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
              </button>
            </div>

            {/* Custom Sort Dropdown */}
            <div className="relative w-full sm:w-56" ref={sortRef}>
              <button
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="w-full flex items-center justify-between px-5 h-12 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-color)] text-sm font-bold text-[var(--text-primary)] transition-all cursor-pointer shadow-sm hover:shadow-md hover:border-[var(--text-primary)]"
              >
                <span>
                  {sortBy === "featured" && "Sort: Featured"}
                  {sortBy === "price-low" && "Sort: Price Low-High"}
                  {sortBy === "price-high" && "Sort: Price High-Low"}
                  {sortBy === "level" && "Sort: Level"}
                </span>
                <svg className={`w-4 h-4 transition-transform ${isSortOpen ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6" /></svg>
              </button>

              {isSortOpen && (
                <div className="absolute top-[calc(100%+0.5rem)] right-0 w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="flex flex-col py-2">
                    {[
                      { id: "featured", label: "Sort: Featured" },
                      { id: "price-low", label: "Sort: Price Low-High" },
                      { id: "price-high", label: "Sort: Price High-Low" },
                      { id: "level", label: "Sort: Level" },
                    ].map(option => (
                      <button
                        key={option.id}
                        onClick={() => {
                          setSortBy(option.id);
                          setIsSortOpen(false);
                        }}
                        className={`text-left px-5 py-3 text-sm font-bold hover:bg-[var(--bg-primary)] transition-colors ${
                          sortBy === option.id ? "text-[var(--accent)]" : "text-[var(--text-primary)]"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="py-32 text-center bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[2rem] shadow-sm">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mx-auto text-[var(--text-secondary)] mb-4"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
            <p className="text-[var(--text-secondary)] text-lg font-medium">No accounts found matching your criteria.</p>
            <button 
              onClick={() => { setSearchQuery(""); setSelectedCategory("all"); }}
              className="mt-6 text-[var(--bg-primary)] bg-[var(--text-primary)] px-6 py-3 rounded-full text-sm font-bold shadow-md hover:scale-105 transition-transform"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
