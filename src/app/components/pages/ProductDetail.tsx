import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useCurrency } from "../../context/CurrencyContext";
import { useProducts } from "../../context/ProductContext";
import { useOrders } from "../../context/OrderContext";
import { motion } from "motion/react";
import { ArrowUpRight, ShieldCheck, Twitter, Instagram, Facebook, Star, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { api } from "../../../lib/api";

export function ProductDetail() {
  const { id } = useParams();
  const { products, deleteProduct, isLoaded } = useProducts();
  const { addOrder } = useOrders();
  const product = products.find(p => p.id === id || (p.dedicatedId && p.dedicatedId.toLowerCase() === id?.toLowerCase()));
  const { formatPrice } = useCurrency();
  const [activeTab, setActiveTab] = useState("description");
  const [selectedImage, setSelectedImage] = useState(product?.image || "");
  const [purchaseStep, setPurchaseStep] = useState<'idle' | 'tos' | 'confirm' | 'success'>('idle');
  const [agreedToTos, setAgreedToTos] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [ticketUrl, setTicketUrl] = useState<string | null>(null);
  const userId = localStorage.getItem("discord_id");

  // Keep selected image in sync if product changes
  useEffect(() => {
    if (product) {
      setSelectedImage(product.image);
    }
  }, [product]);

  if (!isLoaded) {
    return (
      <div className="pt-32 pb-24 min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
        <div className="w-12 h-12 border-4 border-transparent border-t-[#bef264] rounded-full animate-spin shadow-[0_0_15px_rgba(190,242,100,0.3)]"></div>
      </div>
    );
  }

  if (purchaseStep === 'success') {
    return (
      <div className="pt-32 pb-24 min-h-screen bg-[var(--bg-primary)] flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[2.5rem] p-10 max-w-md w-full text-center shadow-2xl relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-[#bef264]/20 to-transparent opacity-50 pointer-events-none" />
          
          <div className="w-20 h-20 bg-[#bef264] rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(190,242,100,0.5)] z-10 relative">
            <CheckCircle2 className="w-10 h-10 text-black" />
          </div>
          
          <h2 className="text-3xl font-black text-[var(--text-primary)] mb-4 z-10 relative tracking-tight">
            Ticket Created!
          </h2>
          
          <p className="text-[var(--text-secondary)] mb-8 z-10 relative leading-relaxed">
            Thank you for showing interest! A private ticket has been created for you in our Discord server. Our staff will take over from there and assist you with your purchase.
          </p>
          
          <div className="flex flex-col gap-3 z-10 relative">
            {ticketUrl && (
              <a
                href={ticketUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white py-4 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
              >
                Open Discord Ticket
                <ArrowUpRight className="w-5 h-5" />
              </a>
            )}
            <Link
              to="/products"
              className="w-full bg-[var(--bg-primary)] hover:bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] py-4 rounded-xl font-bold transition-colors"
            >
              Back to Marketplace
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-32 pb-24 min-h-screen flex flex-col items-center justify-center gap-4 bg-[var(--bg-primary)]">
        <h1 className="text-8xl font-black text-[var(--text-primary)] mb-2">404</h1>
        <h2 className="text-2xl font-bold text-[var(--text-primary)] uppercase tracking-wider mb-2">PAGE NOT FOUND</h2>
        <p className="text-[var(--text-secondary)] text-sm mb-4">The page you're looking for doesn't exist or has been moved.</p>
        
        {/* Debug Info for User */}
        <div className="text-left bg-[var(--bg-secondary)] border border-red-500/50 rounded-xl p-4 w-full max-w-xl text-xs text-red-400 mb-8 overflow-auto max-h-64 custom-scrollbar">
          <p className="font-bold mb-2">Diagnostic Data (Please share with dev):</p>
          <p><strong>Searched URL ID:</strong> "{id}"</p>
          <p><strong>Total Products Loaded:</strong> {products.length}</p>
          <p><strong>Is Context Loaded:</strong> {isLoaded.toString()}</p>
          <p className="mt-2 font-bold border-b border-red-500/20 pb-1 mb-2">Available Products in Memory:</p>
          {products.map(p => (
            <div key={p.id} className="mb-1">
              • id: "{p.id}", dedicatedId: "{p.dedicatedId}"
            </div>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-sm font-bold text-[var(--text-primary)] hover:text-[#bef264] transition-colors bg-[var(--bg-secondary)] px-4 py-2 rounded-lg border border-[var(--border-color)]">
            Go Home
          </Link>
          <Link to="/products" className="flex items-center gap-2 text-sm font-bold text-[var(--text-primary)] hover:text-[#bef264] transition-colors bg-[var(--bg-secondary)] px-4 py-2 rounded-lg border border-[var(--border-color)]">
            Browse Accounts
          </Link>
        </div>
      </div>
    );
  }

  const handleInitialPurchaseClick = () => {
    if (!userId) {
      toast.error("You must be logged in to purchase an item.");
      return;
    }
    setPurchaseStep('tos');
  };

  const handleFinalPurchase = async () => {
    setIsProcessing(true);
    try {
      const username = localStorage.getItem("discord_username") || "User";
      const res = await api.createTicket({
        product: product,
        userId: userId!,
        username: username,
      });

      addOrder(product, userId!);
      deleteProduct(product.id);
      
      if (res && res.ticketUrl) {
        setTicketUrl(res.ticketUrl);
      }
      setPurchaseStep('success');
      toast.success("A ticket has been created in our Discord server! Please check your DMs.");
    } catch (error: any) {
      console.error("Ticket Creation Error:", error);
      toast.error(`Failed to create a ticket: ${error.message || "Unknown error"}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="pt-24 pb-24 min-h-screen bg-[var(--bg-primary)] transition-colors duration-300 relative">
      
      {/* Purchase Flow Modals */}
      {purchaseStep !== 'idle' && purchaseStep !== 'success' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-gradient-to-br from-[#1E1E1E]/90 to-[#121212]/95 border border-white/10 rounded-[2.5rem] p-8 sm:p-10 max-w-xl w-full shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden"
          >
            {/* Ambient Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-[#bef264]/10 blur-[100px] pointer-events-none rounded-full" />
            
            {purchaseStep === 'tos' && (
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center gap-4 mb-6 relative">
                  <div className="absolute -inset-4 bg-[#bef264]/10 blur-xl rounded-full" />
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#bef264]/40 to-[#bef264]/10 flex items-center justify-center border border-[#bef264]/40 shadow-[0_0_20px_rgba(190,242,100,0.3)] relative z-10">
                    <ShieldCheck className="w-7 h-7 text-[#bef264]" />
                  </div>
                  <div className="relative z-10">
                    <h2 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 tracking-tight leading-none mb-1">Terms of Service</h2>
                    <p className="text-[#bef264] text-xs font-black uppercase tracking-[0.2em]">Please Read Carefully</p>
                  </div>
                </div>

                <div 
                  className="bg-black/50 backdrop-blur-xl p-6 sm:p-8 rounded-3xl h-72 overflow-y-auto mb-8 text-sm text-gray-300 border border-white/10 shadow-[inset_0_2px_20px_rgba(0,0,0,0.5)] custom-scrollbar relative"
                >
                  <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-black/60 to-transparent pointer-events-none rounded-t-3xl" />
                  <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-black/60 to-transparent pointer-events-none rounded-b-3xl" />
                  
                  <p className="mb-6 leading-relaxed text-gray-100 text-base">Welcome to the <strong className="text-white font-black">Megatron Marketplace</strong>.</p>
                  <div className="space-y-6">
                    <div className="flex gap-4 group">
                      <span className="text-[#bef264] font-black text-lg group-hover:scale-125 transition-transform duration-300">01</span>
                      <p className="leading-relaxed"><strong className="text-white">All Sales are Final:</strong> Due to the digital nature of the accounts, all purchases are non-refundable once the account details have been securely transferred to the buyer.</p>
                    </div>
                    <div className="flex gap-4 group">
                      <span className="text-[#bef264] font-black text-lg group-hover:scale-125 transition-transform duration-300">02</span>
                      <p className="leading-relaxed"><strong className="text-white">Account Verification:</strong> You are responsible for verifying the account details provided in the Discord ticket. Our staff will act as middlemen to ensure safe delivery.</p>
                    </div>
                    <div className="flex gap-4 group">
                      <span className="text-[#bef264] font-black text-lg group-hover:scale-125 transition-transform duration-300">03</span>
                      <p className="leading-relaxed"><strong className="text-white">Prohibited Conduct:</strong> Attempting to scam, chargeback, or manipulate the ticketing system will result in an immediate and permanent ban from the marketplace and our Discord server.</p>
                    </div>
                    <div className="flex gap-4 group">
                      <span className="text-[#bef264] font-black text-lg group-hover:scale-125 transition-transform duration-300">04</span>
                      <p className="leading-relaxed"><strong className="text-white">Delivery Time:</strong> Staff will attend to your ticket within 24 hours. Please remain patient and do not spam ping the team.</p>
                    </div>
                    <div className="flex gap-4 group">
                      <span className="text-[#bef264] font-black text-lg group-hover:scale-125 transition-transform duration-300">05</span>
                      <p className="leading-relaxed"><strong className="text-white">Security:</strong> Secure your account immediately after receiving the credentials. We are not responsible for accounts lost due to poor security practices after the handover is complete.</p>
                    </div>
                  </div>
                  <div className="mt-8 pt-6 border-t border-white/10 text-center">
                    <p className="text-xs text-gray-500 font-bold tracking-[0.3em] uppercase">--- End of Terms ---</p>
                  </div>
                </div>
                
                <div 
                  className={`flex items-center gap-4 mb-8 bg-gradient-to-r ${agreedToTos ? 'from-[#bef264]/20 to-transparent border-[#bef264]/50' : 'from-white/5 to-transparent border-white/10'} p-5 rounded-2xl border transition-all duration-300 cursor-pointer group hover:from-white/10`} 
                  onClick={() => setAgreedToTos(!agreedToTos)}
                >
                  <div className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${agreedToTos ? 'bg-[#bef264] border-[#bef264] shadow-[0_0_15px_rgba(190,242,100,0.5)] scale-110' : 'border-gray-500 group-hover:border-[#bef264]'}`}>
                    <CheckCircle2 className={`w-5 h-5 text-black transition-all duration-300 ${agreedToTos ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`} />
                  </div>
                  <label className={`text-base font-bold cursor-pointer select-none transition-colors duration-300 ${agreedToTos ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}>
                    I have read and agree to the Terms of Service
                  </label>
                </div>

                <div className="flex gap-4 mt-auto">
                  <button 
                    onClick={() => setPurchaseStep('idle')}
                    className="flex-1 py-4 rounded-2xl font-bold border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all hover:scale-[1.02] active:scale-95"
                  >
                    Cancel
                  </button>
                  <button 
                    disabled={!agreedToTos}
                    onClick={() => setPurchaseStep('confirm')}
                    className="flex-1 py-4 rounded-2xl font-black bg-gradient-to-r from-[#bef264] to-[#a3e635] text-black disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed hover:shadow-[0_0_30px_rgba(190,242,100,0.4)] transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
                  >
                    Proceed to Verification
                    <ArrowUpRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {purchaseStep === 'confirm' && (
              <div className="relative z-10 flex flex-col items-center text-center py-6">
                <div className="w-20 h-20 bg-[#5865F2]/20 rounded-full flex items-center justify-center mb-6 border border-[#5865F2]/50 shadow-[0_0_30px_rgba(88,101,242,0.3)] relative">
                  <div className="absolute inset-0 rounded-full border-t-2 border-[#5865F2] animate-spin opacity-50" />
                  <img src="/images/discord-icon.svg" alt="Discord" className="w-10 h-10 drop-shadow-lg opacity-80" onError={(e) => { e.currentTarget.style.display = 'none' }} />
                </div>
                
                <h2 className="text-4xl font-black text-white mb-4 tracking-tight">Final Step!</h2>
                
                <p className="text-gray-300 mb-10 leading-relaxed max-w-sm mx-auto">
                  Clicking <strong className="text-white">Secure Checkout</strong> will generate a private, encrypted Discord ticket where our staff will verify your payment and hand over the account details safely.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 w-full">
                  <button 
                    onClick={() => setPurchaseStep('tos')}
                    className="w-full sm:w-1/3 py-4 rounded-xl font-bold border border-white/10 text-gray-300 hover:bg-white/10 transition-all"
                  >
                    Go Back
                  </button>
                  <button 
                    onClick={handleFinalPurchase}
                    disabled={isProcessing}
                    className="w-full sm:w-2/3 py-4 rounded-xl font-bold bg-[#5865F2] text-white disabled:opacity-50 disabled:cursor-wait hover:bg-[#4752C4] transition-all flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(88,101,242,0.4)] hover:shadow-[0_0_30px_rgba(88,101,242,0.6)] group"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Generating Ticket...
                      </>
                    ) : (
                      <>
                        <span>Secure Checkout</span>
                        <ArrowUpRight className="w-5 h-5 group-hover:scale-125 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}

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
                onClick={handleInitialPurchaseClick}
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
                  className={`w-32 h-24 shrink-0 rounded-xl overflow-hidden border-2 transition-all duration-300 ${selectedImage === img ? 'border-[var(--accent)] scale-105 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'
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
            className="lg:col-span-2 bg-[var(--bg-secondary)] rounded-[2rem] p-6 border border-[var(--border-color)] shadow-sm relative overflow-hidden group"
          >
            <h3 className="font-bold text-[var(--text-primary)] text-sm mb-1 z-10 relative">Level {product.level}</h3>
            <p className="text-xs text-[var(--text-secondary)] z-10 relative">Rank: {product.collectionRank}</p>
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
              <h3 className="font-bold text-[var(--text-primary)] mb-1">Win Rate {product.stats?.winRate || "0%"}</h3>
              <p className="text-xs text-[var(--text-secondary)]">{product.stats?.totalMatches || 0} Matches</p>
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
              {product.features?.map((f: string, i: number) => (
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
              {[1, 2, 3].map((n) => (
                <img key={n} src={`https://i.pravatar.cc/100?img=${n + 10}`} alt="Avatar" className="w-12 h-12 rounded-full border-2 border-[var(--bg-secondary)] -ml-3 first:ml-0 shadow-sm" />
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