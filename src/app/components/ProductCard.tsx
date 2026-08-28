import { Link } from "react-router-dom";
import { Product } from "../context/ProductContext";
import { useCurrency } from "../context/CurrencyContext";
import { useWishlist } from "../context/WishlistContext";
import { motion } from "motion/react";
import { ArrowUpRight, Heart } from "lucide-react";

const getBadgeStyle = (badge?: string) => {
  const lowerBadge = badge?.toLowerCase();
  switch (lowerBadge) {
    case "hot":
      return { bg: "bg-red-500/10", text: "text-red-500", border: "border-red-500/20" };
    case "new":
      return { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/20" };
    case "premium":
      return { bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/20" };
    case "rare":
      return { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20" };
    default:
      return { bg: "bg-gray-500/10", text: "text-gray-400", border: "border-gray-500/20" };
  }
};

export function ProductCard({ product }: { product: Product }) {
  const { formatPrice } = useCurrency();
  const { wishlistIds, addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  
  const badgeStyle = getBadgeStyle(product.badge);
  const isWished = isInWishlist(product.id);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isWished) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product.id);
    }
  };

  const linkBase = (!product.type || product.type === "account") ? "/accounts" : "/products";
  const linkPath = `${linkBase}/${product.dedicatedId ? product.dedicatedId.toLowerCase() : product.id}`;

  return (
    <Link to={linkPath} className="block group h-full">
      <motion.div
        whileHover={{ y: -6 }}
        className="bg-[var(--bg-secondary)] rounded-[2rem] overflow-hidden shadow-sm border border-[var(--border-color)] h-full flex flex-col transition-all duration-300 hover:shadow-xl hover:border-[var(--text-secondary)]/30"
      >
        {/* Image container */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <img src={product.image} alt={product.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>
          {product.badge && (
            <span className={`absolute top-4 left-4 text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg ${badgeStyle.bg} ${badgeStyle.text} border ${badgeStyle.border} backdrop-blur-sm`}>
              {product.badge}
            </span>
          )}

          {/* Action Buttons */}
          <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button 
              onClick={handleWishlistClick}
              className={`w-10 h-10 backdrop-blur-md rounded-full flex items-center justify-center transition-all duration-300 ${isWished ? 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)] border border-red-400' : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'}`}
            >
              <Heart className={`w-5 h-5 ${isWished ? 'fill-white' : ''}`} />
            </button>
          </div>

          <div className="absolute bottom-4 right-4 w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <ArrowUpRight className="w-5 h-5" />
          </div>
        </div>
        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          <p className="text-xs font-bold text-[var(--accent)] uppercase tracking-wider mb-2">{product.category}</p>
          <h3 className="font-bold text-[var(--text-primary)] text-base leading-snug mb-4 flex-1 line-clamp-2">{product.title}</h3>

          {/* Stats */}
          {(!product.type || product.type === "account") ? (
            <div className="grid grid-cols-3 gap-2 text-center mb-4 border-t border-b border-[var(--border-color)] py-3">
              <div>
                <p className="text-sm font-bold text-[var(--text-primary)]">{product.level}</p>
                <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">Level</p>
              </div>
              <div>
                <p className="text-sm font-bold text-[var(--text-primary)]">{product.skins}</p>
                <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">Skins</p>
              </div>
              <div>
                <p className="text-sm font-bold text-[var(--text-primary)]">{product.heroes}</p>
                <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">Heroes</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 text-center mb-4 border-t border-b border-[var(--border-color)] py-3">
              <div>
                <p className="text-sm font-bold text-[var(--text-primary)]">{product.currencyPackages?.length || 0}</p>
                <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">Packages</p>
              </div>
              <div>
                <p className="text-sm font-bold text-[var(--text-primary)]">Global</p>
                <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">Region</p>
              </div>
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline justify-end gap-2 mt-auto">
            {(!product.type || product.type === "account") ? (
              <>
                {product.discountPrice != null && (
                  <span className="text-base font-medium text-[var(--text-secondary)] line-through">{formatPrice(product.price)}</span>
                )}
                <span className="text-2xl font-black text-[var(--text-primary)]">
                  {formatPrice(product.discountPrice ?? product.price)}
                </span>
              </>
            ) : (
              <div className="flex flex-col items-end">
                <span className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Starting from</span>
                <span className="text-2xl font-black text-[var(--text-primary)]">
                  {formatPrice(product.price)}
                </span>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}