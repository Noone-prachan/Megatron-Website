import { useParams, Link } from "react-router";
import { useState } from "react";
import { useCurrency } from "../../context/CurrencyContext";
import { useProducts } from "../../context/ProductContext";
import { useOrders } from "../../context/OrderContext";
import { motion } from "motion/react";
import { ArrowUpRight, ShieldCheck, Twitter, Instagram, Facebook, Star, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { api } from "../../../lib/api";

export function ProductDetail() {
  const { id } = useParams();
  const { products, removeProduct } = useProducts();
  const { addOrder } = useOrders();
  const product = products.find(p => p.id === id);
  const { formatPrice } = useCurrency();
  const [activeTab, setActiveTab] = useState("description");
  const [selectedImage, setSelectedImage] = useState(product?.image || "");
  const userId = localStorage.getItem("discord_id");

  if (!product) {
    return (
      <div className="pt-32 pb-24 min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Product not found</h1>
      </div>
    );
  }

  const handlePurchase = async () => {
    if (!userId) {
      toast.error("You must be logged in to purchase an item.");
      return;
    }

    try {
      await api.post("/tickets/create", {
        productId: product.id,
        productName: product.title,
        price: product.price,
      });

      addOrder(product, userId);
      removeProduct(product.id);
      toast.success("A ticket has been created in our Discord server! Please check your DMs.");
    } catch (error) {
      toast.error("Failed to create a ticket. Please try again later.");
    }
  };

  return (
    <div className="pt-24 pb-24 min-h-screen bg-[var(--bg-primary)] transition-colors duration-300">
      <div className="max-w-[1400px] mx-auto px-6">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text-secondary)] mb-6 ml-2">
          <Link to="/" className="hover:text-[var(--text-primary)] transition-colors">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-[var(--text-primary)] transition-colors">Products</Link>
          <span>/</span>
          <span className="text-[var(--accent)] truncate max-w-[200px]">{product.title}</span>
        </div>

        {/* BENTO GRID LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 auto-rows-[minmax(180px,auto)]">

          {/* 1. Main Hero Card (Spans 8 cols, 2 rows) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-8 lg:row-span-2 bg-[var(--bg-secondary)] rounded-[2.5rem] p-8 sm:p-12 border border-[var(--border-color)] shadow-sm relative overflow-hidden flex flex-col justify-between"
          >
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 bg-[var(--bg-primary)] border border-[var(--border-color)] px-4 py-2 rounded-full w-fit mb-8 shadow-sm">
              <ShieldCheck className="w-4 h-4 text-[#10b981]" />
              <span className="text-xs font-bold text-[var(--text-primary)]">Megatron Verified</span>
            </div>

            {/* Title & Desc */}
            <div className="max-w-md z-10">
              <h1 className="text-4xl sm:text-5xl font-black text-[var(--text-primary)] leading-[1.1] mb-6 tracking-tight">
                {product.title}
              </h1>
              
              <div className="flex items-center gap-4 mb-8">
                <span className="text-5xl font-black text-[var(--text-secondary)] opacity-20">01</span>
                <div className="h-[2px] w-12 bg-dashed border-b-2 border-dotted border-[var(--border-color)]" />
                <div>
                  <h3 className="font-bold text-[var(--text-primary)] text-sm">Premium Quality</h3>
                  <p className="text-[var(--text-secondary)] text-xs mt-1 leading-relaxed max-w-[200px]">
                    {product.description}
                  </p>
                </div>
              </div>

              {/* Purchase CTA */}
              <button 
                onClick={handlePurchase}
                className="group flex items-center gap-3 bg-[#bef264] hover:bg-[#a3e635] text-black px-6 py-3 rounded-full font-bold transition-all shadow-md hover:shadow-lg"
              >
                <span>Purchase for {formatPrice(product.price)}</span>
                <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </button>
            </div>

            {/* Socials Bottom Left */}
            <div className="flex items-center gap-4 mt-12 z-10">
              <span className="text-xs font-bold text-[var(--text-secondary)]">Share on:</span>
              <div className="flex gap-2">
                {[Twitter, Instagram, Facebook].map((Icon, i) => (
                  <button key={i} className="w-8 h-8 rounded-full bg-[var(--bg-primary)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors border border-[var(--border-color)]">
                    <Icon className="w-3.5 h-3.5" />
                  </button>
                ))}
              </div>
            </div>

            {/* Big Floating Image Right */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-[120%] pointer-events-none opacity-90 hidden sm:block">
              <img 
                src={selectedImage || product.image} 
                alt="Product" 
                className="w-full h-full object-contain object-right drop-shadow-2xl scale-110 transition-all duration-500"
              />
            </div>
          </motion.div>

          {/* New Image Gallery Row (if multiple images exist) */}
          {(product.images && product.images.length > 0) && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="lg:col-span-12 bg-[var(--bg-secondary)] rounded-[2.5rem] p-6 border border-[var(--border-color)] shadow-sm flex gap-4 overflow-x-auto custom-scrollbar"
            >
              {[product.image, ...product.images.filter(img => img !== product.image)].map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-32 h-24 shrink-0 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                    selectedImage === img ? 'border-[var(--accent)] scale-105 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </motion.div>
          )}

          {/* 2. Top Right Small Card: Features/Rarities */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="lg:col-span-4 bg-[var(--bg-secondary)] rounded-[2rem] p-8 border border-[var(--border-color)] shadow-sm flex flex-col justify-center"
          >
            <h3 className="font-bold text-[var(--text-primary)] mb-4">Included Rarities</h3>
            <div className="flex flex-wrap gap-3">
              {['#3b82f6', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6'].map((color, i) => (
                <div key={i} className="w-10 h-10 rounded-full border-4 border-[var(--bg-primary)] shadow-sm" style={{ backgroundColor: color }} />
              ))}
            </div>
          </motion.div>

          {/* 3. Mid Right Grid (2 small cards) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="lg:col-span-2 bg-[var(--bg-secondary)] rounded-[2rem] p-6 border border-[var(--border-color)] shadow-sm relative overflow-hidden group cursor-pointer"
          >
            <h3 className="font-bold text-[var(--text-primary)] text-sm mb-1 z-10 relative">Level {product.level}</h3>
            <p className="text-xs text-[var(--text-secondary)] z-10 relative">Rank: {product.rank}</p>
            <button className="absolute bottom-4 left-4 w-8 h-8 bg-[var(--bg-primary)] rounded-full flex items-center justify-center text-[var(--text-primary)] shadow-sm border border-[var(--border-color)] group-hover:bg-[var(--text-primary)] group-hover:text-[var(--bg-primary)] transition-colors z-10">
              <ArrowUpRight className="w-4 h-4" />
            </button>
            <div className="absolute right-[-20%] bottom-[-20%] w-32 h-32 opacity-20">
              <img src="/images/hero-banner.png" alt="Rank" className="w-full h-full object-cover rounded-full" />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="lg:col-span-2 bg-[var(--bg-secondary)] rounded-[2rem] p-6 border border-[var(--border-color)] shadow-sm relative overflow-hidden group"
          >
            <button className="absolute top-4 right-4 w-8 h-8 bg-[var(--bg-primary)] rounded-full flex items-center justify-center text-[var(--text-primary)] shadow-sm border border-[var(--border-color)] z-10 group-hover:scale-110 transition-transform">
              <ArrowUpRight className="w-4 h-4" />
            </button>
            <img src="/images/skins-collection.png" alt="Stats" className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-40 transition-opacity" />
            <div className="absolute bottom-6 left-6 z-10">
              <h3 className="font-bold text-[var(--text-primary)] mb-1">Win Rate {product.stats.winRate}</h3>
              <p className="text-xs text-[var(--text-secondary)]">{product.stats.totalMatches} Matches</p>
            </div>
          </motion.div>

          {/* BOTTOM ROW */}

          {/* 4. Bottom Left: More Accounts */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="lg:col-span-4 bg-[var(--bg-secondary)] rounded-[2rem] p-6 border border-[var(--border-color)] shadow-sm"
          >
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-bold text-[var(--text-primary)] text-sm">Top Features</h3>
                <p className="text-[var(--text-secondary)] text-xs mt-1">Highlighted perks</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-500">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {product.features.map((f: string, i: number) => (
                <div key={i} className="aspect-square bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-color)] flex flex-col items-center justify-center p-2 text-center shadow-sm">
                  <CheckCircle2 className="w-5 h-5 text-[var(--accent)] mb-2" />
                  <span className="text-[10px] font-bold text-[var(--text-primary)] leading-tight">{f}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* 5. Bottom Mid: Trusted Seller */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="lg:col-span-4 bg-[var(--bg-secondary)] rounded-[2rem] p-6 border border-[var(--border-color)] shadow-sm flex flex-col items-center justify-center text-center relative overflow-hidden"
          >
            <div className="flex justify-center mb-3">
              {[1,2,3].map((n) => (
                <img key={n} src={`https://i.pravatar.cc/100?img=${n+10}`} alt="Avatar" className="w-12 h-12 rounded-full border-2 border-[var(--bg-secondary)] -ml-3 first:ml-0 shadow-sm" />
              ))}
            </div>
            <div className="bg-[#3b82f6] text-white w-24 h-24 rounded-full flex flex-col items-center justify-center shadow-lg mb-3">
              <span className="text-xl font-black">5k+</span>
              <span className="text-[10px] uppercase tracking-wider font-semibold opacity-90">Sold</span>
            </div>
            <div className="flex items-center gap-2 bg-[var(--bg-primary)] border border-[var(--border-color)] px-4 py-1.5 rounded-full shadow-sm">
              <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
              <span className="text-xs font-bold text-[var(--text-primary)]">4.9 Reviews</span>
            </div>
          </motion.div>

          {/* 6. Bottom Right: Highlights */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
            className="lg:col-span-4 bg-[var(--bg-secondary)] rounded-[2rem] p-8 border border-[var(--border-color)] shadow-sm flex justify-between items-center group cursor-pointer"
          >
            <div>
              <div className="inline-flex items-center gap-1 bg-red-100 dark:bg-red-900/30 text-red-500 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">
                🔥 Hot Seller
              </div>
              <h3 className="font-bold text-[var(--text-primary)] text-lg mb-1 leading-tight max-w-[150px]">
                Ready for Competitive
              </h3>
              <p className="text-[var(--text-secondary)] text-xs">Full Access Provided</p>
            </div>
            <button className="w-10 h-10 bg-[var(--bg-primary)] rounded-full flex items-center justify-center text-[var(--text-primary)] shadow-sm border border-[var(--border-color)] group-hover:scale-110 transition-transform">
              <ArrowUpRight className="w-5 h-5" />
            </button>
          </motion.div>

        </div>

      </div>
    </div>
  );
}