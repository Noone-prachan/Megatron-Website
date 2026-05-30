import { Link } from "react-router";
import { useCurrency } from "../../context/CurrencyContext";

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    level: number;
    rank: string;
    skins: number;
    heroes: number;
    price: number;
    discountPrice?: number;
    image: string;
    badge?: string;
  };
  sold?: boolean;
}

export function ProductCard({ product, sold = false }: ProductCardProps) {
  const { formatPrice } = useCurrency();

  return (
    <Link 
      to={sold ? "#" : `/products/${product.id}`} 
      className={`group flex flex-col rounded-3xl border border-[var(--border-color)] bg-gradient-to-b from-[var(--bg-secondary)] to-[var(--bg-primary)] hover:border-[var(--text-primary)] hover:shadow-2xl transition-all duration-300 overflow-hidden ${sold ? "opacity-60 pointer-events-none grayscale" : ""}`}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] w-full bg-[var(--bg-primary)] overflow-hidden">
        <img 
          src={product.image} 
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-secondary)] via-transparent to-transparent opacity-80" />
        
        {/* Badges */}
        <div className="absolute top-3 right-3 flex gap-2">
          {sold ? (
            <div className="bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-bold text-white uppercase tracking-widest shadow-sm">
              Sold
            </div>
          ) : product.badge ? (
            <div className="bg-[#ef4444] px-3 py-1.5 rounded-full text-[10px] font-bold text-white uppercase tracking-widest shadow-sm">
              {product.badge}
            </div>
          ) : null}
        </div>
      </div>

      {/* Content Container */}
      <div className="p-6 flex flex-col flex-1">
        {/* Title */}
        <h3 className="font-black text-[var(--text-primary)] text-lg line-clamp-1 mb-5">{product.title}</h3>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 text-[10px] uppercase tracking-widest font-bold text-[var(--text-secondary)] mb-6">
          <div className="bg-[var(--bg-primary)]/50 backdrop-blur-sm border border-[var(--border-color)] px-4 py-2.5 rounded-2xl flex justify-between items-center transition-colors group-hover:border-[var(--text-secondary)]/50 shadow-inner">
            <span>Rank</span> 
            <span className="text-[var(--text-primary)] truncate ml-2 max-w-[60px]" title={product.rank}>{product.rank}</span>
          </div>
          <div className="bg-[var(--bg-primary)]/50 backdrop-blur-sm border border-[var(--border-color)] px-4 py-2.5 rounded-2xl flex justify-between items-center transition-colors group-hover:border-[var(--text-secondary)]/50 shadow-inner">
            <span>Level</span> 
            <span className="text-[var(--text-primary)]">{product.level}</span>
          </div>
          <div className="bg-[var(--bg-primary)]/50 backdrop-blur-sm border border-[var(--border-color)] px-4 py-2.5 rounded-2xl flex justify-between items-center transition-colors group-hover:border-[var(--text-secondary)]/50 shadow-inner">
            <span>Skins</span> 
            <span className="text-[var(--text-primary)]">{product.skins}</span>
          </div>
          <div className="bg-[var(--bg-primary)]/50 backdrop-blur-sm border border-[var(--border-color)] px-4 py-2.5 rounded-2xl flex justify-between items-center transition-colors group-hover:border-[var(--text-secondary)]/50 shadow-inner">
            <span>Heroes</span> 
            <span className="text-[var(--text-primary)]">{product.heroes}</span>
          </div>
        </div>

        {/* Price & Action */}
        <div className="flex justify-between items-center mt-auto pt-2 border-t border-[var(--border-color)]/50">
          <div className="flex flex-col">
            {product.discountPrice ? (
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-[var(--accent)]">{formatPrice(product.discountPrice)}</span>
                <span className="text-sm font-bold text-[var(--text-secondary)] line-through">{formatPrice(product.price)}</span>
              </div>
            ) : (
              <span className="text-2xl font-black text-[var(--text-primary)]">{formatPrice(product.price)}</span>
            )}
          </div>
          <div className="w-12 h-12 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] flex items-center justify-center group-hover:-rotate-45 transition-transform duration-300 shadow-lg group-hover:shadow-[var(--text-primary)]/20 group-hover:scale-105">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </div>
        </div>
      </div>
    </Link>
  );
}
