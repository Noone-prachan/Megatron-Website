import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { Product } from "../context/ProductContext";
import { useCurrency } from "../context/CurrencyContext";

interface CurrencyCardProps {
  product: Product;
}

export function CurrencyCard({ product }: CurrencyCardProps) {
  const { formatPrice } = useCurrency();
  const isDiscounted = product.discountPrice !== undefined && product.discountPrice < product.price;

  return (
    <Link to={`/products/${product.id}`} className="group block h-full">
      <div className="h-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all duration-300 relative group-hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] group-hover:-translate-y-1 flex flex-col">
        
        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
          {product.badge && (
            <span className="bg-red-500 text-white px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider shadow-lg">
              {product.badge}
            </span>
          )}
          {product.featured && (
            <span className="bg-yellow-500 text-black px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider shadow-lg flex items-center gap-1">
              ★ Featured
            </span>
          )}
        </div>

        {/* Amount Badge */}
        <div className="absolute top-3 right-3 z-10 bg-[var(--bg-primary)]/80 backdrop-blur-md text-[var(--text-primary)] border border-[var(--border-color)] px-3 py-1.5 rounded-xl text-sm font-black shadow-lg flex items-center gap-1">
          {product.amount} {product.type === "pubg-uc" ? "UC" : "💎"}
        </div>

        {/* Image */}
        <div className="aspect-square w-full overflow-hidden bg-gradient-to-b from-[var(--bg-primary)] to-[var(--bg-secondary)] relative flex items-center justify-center p-6">
          <motion.img
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.4 }}
            src={product.image || "/images/placeholder.png"}
            alt={product.title}
            className="w-full h-full object-contain filter drop-shadow-2xl"
            onError={(e) => { e.currentTarget.src = '/images/placeholder.png'; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-secondary)] to-transparent opacity-60" />
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-grow">
          <div className="mb-2">
            <span className="text-[10px] uppercase tracking-widest font-bold text-blue-400 mb-1 block">
              {product.type === 'pubg-uc' ? 'PUBG Mobile' : 'Mobile Legends'}
            </span>
            <h3 className="text-lg font-black text-[var(--text-primary)] group-hover:text-blue-400 transition-colors line-clamp-2 leading-tight">
              {product.title}
            </h3>
          </div>

          <div className="mt-auto pt-4 flex items-center justify-between border-t border-[var(--border-color)]">
            <div>
              <p className="text-[10px] uppercase tracking-widest font-bold text-[var(--text-secondary)] mb-0.5">Price</p>
              {isDiscounted ? (
                <div className="flex items-center gap-2">
                  <span className="text-lg font-black text-blue-400">{formatPrice(product.discountPrice!)}</span>
                  <span className="text-xs font-bold text-[var(--text-secondary)] line-through">{formatPrice(product.price)}</span>
                </div>
              ) : (
                <span className="text-lg font-black text-[var(--text-primary)]">{formatPrice(product.price)}</span>
              )}
            </div>
            
            <button className="bg-[var(--bg-primary)] border border-[var(--border-color)] group-hover:bg-blue-500 group-hover:border-blue-400 group-hover:text-white text-[var(--text-primary)] p-2.5 rounded-xl transition-all duration-300 shadow-sm">
              <ShoppingCart className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
