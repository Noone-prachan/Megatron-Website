import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { useWishlist } from "../../context/WishlistContext";
import { useProducts } from "../../context/ProductContext";
import { ProductCard } from "../ProductCard";
import { Heart, ArrowRight } from "lucide-react";
import { SEO } from "../SEO";

export function Wishlist() {
  const { wishlistIds } = useWishlist();
  const { products } = useProducts();

  const savedProducts = products.filter(p => wishlistIds.includes(p.id));

  return (
    <div className="min-h-screen pt-32 pb-24 relative overflow-hidden bg-[var(--bg-primary)]">
      <SEO title="Wishlist | Megatron Marketplace" description="View your saved accounts." url="https://megatron-marketplace.com/wishlist" />
      
      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-red-600/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-pink-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex items-center gap-4 mb-12">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
            <Heart className="w-8 h-8 fill-red-500" />
          </div>
          <div>
            <h1 className="text-4xl sm:text-5xl font-black text-[var(--text-primary)] tracking-tight">Your Wishlist</h1>
            <p className="text-[var(--text-secondary)] font-medium mt-1">
              You have {savedProducts.length} saved account{savedProducts.length !== 1 ? 's' : ''}.
            </p>
          </div>
        </div>

        {savedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {savedProducts.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center text-center py-20 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[3rem] shadow-xl backdrop-blur-sm"
          >
            <div className="w-24 h-24 mb-6 rounded-full bg-[var(--bg-primary)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-secondary)] opacity-50">
              <Heart className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-[var(--text-primary)] mb-3">Your wishlist is empty</h3>
            <p className="text-[var(--text-secondary)] max-w-sm mb-8">
              Looks like you haven't saved any accounts yet. Browse the marketplace and click the heart icon to save your favorites!
            </p>
            <Link 
              to="/products"
              className="flex items-center gap-2 bg-[var(--text-primary)] text-[var(--bg-primary)] px-8 py-4 rounded-xl font-black uppercase tracking-widest hover:scale-105 transition-transform shadow-lg"
            >
              Browse Accounts
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}
