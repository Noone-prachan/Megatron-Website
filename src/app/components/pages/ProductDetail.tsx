import { useParams, Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useCurrency } from "../../context/CurrencyContext";
import { useProducts } from "../../context/ProductContext";
import { useReviews } from "../../context/ReviewContext";
import { useOrders } from "../../context/OrderContext";
import { useWishlist } from "../../context/WishlistContext";
import { motion } from "motion/react";
import { ArrowUpRight, ShieldCheck, Twitter, Instagram, Facebook, Star, CheckCircle2, X, ChevronLeft, ChevronRight, Heart, Bell, Zap, ChevronDown, Flame, Gem, TrendingUp, Clock, BadgeCheck, UserCheck } from "lucide-react";
import { toast } from "sonner";
import { api } from "../../../lib/api";
import { useLockBodyScroll } from "../../../hooks/useLockBodyScroll";

export function ProductDetail() {
  const { id } = useParams();
  const { products, deleteProduct, isLoaded } = useProducts();
  const { reviews } = useReviews();
  const { orders, addOrder } = useOrders();
  const product = products.find(p => p.id === id || (p.dedicatedId && p.dedicatedId.toLowerCase() === id?.toLowerCase()));
  const { formatPrice } = useCurrency();
  const [activeTab, setActiveTab] = useState("description");
  const [selectedImage, setSelectedImage] = useState(product?.image || "");
  const [purchaseStep, setPurchaseStep] = useState<'idle' | 'tos' | 'confirm' | 'success'>('idle');
  const [agreedToTos, setAgreedToTos] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [ticketUrl, setTicketUrl] = useState<string | null>(null);
  const userId = localStorage.getItem("discord_id");
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [selectedPackageIds, setSelectedPackageIds] = useState<string[]>([]);
  const [isPackageDropdownOpen, setIsPackageDropdownOpen] = useState(false);
  const packageDropdownRef = useRef<HTMLDivElement>(null);
  const [playerId, setPlayerId] = useState('');
  const [serverId, setServerId] = useState('');

  // Auto-select cheapest on load
  useEffect(() => {
    if (product && product.type !== "account" && product.currencyPackages && product.currencyPackages.length > 0) {
      if (selectedPackageIds.length === 0) {
        const cheapest = [...product.currencyPackages].sort((a, b) => a.price - b.price)[0];
        setSelectedPackageIds([cheapest.id]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.id]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (packageDropdownRef.current && !packageDropdownRef.current.contains(e.target as Node)) {
        setIsPackageDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const togglePackage = (id: string) => {
    setSelectedPackageIds(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const selectedPackages = product?.currencyPackages?.filter(p => selectedPackageIds.includes(p.id)) || [];
  const totalPrice = selectedPackages.reduce((sum, p) => sum + p.price, 0);
  const displayPrice = product?.type && product.type !== 'account'
    ? totalPrice
    : (product?.discountPrice ?? product?.price ?? 0);

  useLockBodyScroll(isLightboxOpen || (purchaseStep !== 'idle' && purchaseStep !== 'success'));

  const { wishlistIds, addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const isWished = product ? isInWishlist(product.id) : false;

  const handleWishlistClick = () => {
    if (!product) return;
    if (isWished) removeFromWishlist(product.id);
    else addToWishlist(product.id);
  };

  const handlePriceAlertClick = () => {
    toast.success("Price alert set! We'll notify you if the price drops.");
  };

  const allImages = product ? [product.image, ...(product.images?.filter(img => img !== product.image) || [])] : [];

  const recommendedProducts = product
    ? products
      .filter(p => p.id !== product.id && (p.type || "account") === (product.type || "account"))
      .sort((a, b) => Math.abs(a.price - product.price) - Math.abs(b.price - product.price))
      .slice(0, 2)
    : [];

  const finalRecommendations = recommendedProducts.length > 0
    ? recommendedProducts
    : (product ? products.filter(p => p.id !== product.id).slice(0, 2) : []);

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    const currentIndex = allImages.indexOf(selectedImage);
    const nextIndex = (currentIndex + 1) % allImages.length;
    setSelectedImage(allImages[nextIndex]);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    const currentIndex = allImages.indexOf(selectedImage);
    const prevIndex = (currentIndex - 1 + allImages.length) % allImages.length;
    setSelectedImage(allImages[prevIndex]);
  };

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

  const getUnitLabel = () => {
    switch (product?.type) {
      case 'pubg-uc': return 'UC';
      case 'mlbb-diamonds': return 'Diamonds';
      case 'valo-points': return 'VP';
      case 'netflix':
      case 'crunchyroll': return 'Months';
      case 'playstation':
      case 'steam':
      case 'apple': return 'USD';
      case 'fortnite': return 'V-Bucks';
      default: return 'Units';
    }
  };

  const getUnitIcon = () => {
    switch (product?.type) {
      case 'pubg-uc': return 'UC';
      case 'mlbb-diamonds': return <Gem className="w-3 h-3" />;
      case 'valo-points': return 'VP';
      case 'netflix':
      case 'crunchyroll': return 'M';
      case 'playstation':
      case 'steam':
      case 'apple': return '$';
      case 'fortnite': return 'VB';
      default: return getUnitLabel();
    }
  };

  const needsPlayerId = () => {
    return ['pubg-uc', 'mlbb-diamonds', 'valo-points', 'fortnite'].includes(product?.type || '');
  };

  const getPlayerIdPlaceholder = () => {
    switch (product?.type) {
      case 'pubg-uc': return 'Enter your PUBG Player ID';
      case 'mlbb-diamonds': return 'Enter your MLBB Player ID';
      case 'valo-points': return 'Enter your Riot ID';
      case 'fortnite': return 'Enter your Epic ID';
      default: return 'Enter your ID';
    }
  };

  const getPlayerIdLabel = () => {
    switch (product?.type) {
      case 'pubg-uc': return 'Player ID / UID';
      case 'mlbb-diamonds': return 'Player ID / UID';
      case 'valo-points': return 'Riot ID';
      case 'fortnite': return 'Epic ID';
      default: return 'ID';
    }
  };

  const handleInitialPurchaseClick = () => {
    if (!userId) {
      toast.error("You must be logged in to purchase an item.");
      return;
    }
    if (needsPlayerId() && !playerId.trim()) {
      toast.error(`Please enter your ${getPlayerIdLabel()}.`);
      return;
    }
    if (product?.type === 'mlbb-diamonds' && !serverId.trim()) {
      toast.error("Please enter your Server ID.");
      return;
    }
    setPurchaseStep('tos');
  };

  const handleFinalPurchase = async () => {
    setIsProcessing(true);
    try {
      const username = localStorage.getItem("discord_username") || "User";
      const chosenPackages = product.currencyPackages?.filter(p => selectedPackageIds.includes(p.id)) || [];
      const chosenTotal = chosenPackages.reduce((sum, p) => sum + p.price, 0);
      const packagesSummary = chosenPackages.length > 0
        ? chosenPackages.map(p => `${p.amount} ${getUnitLabel()}`).join(' + ')
        : product.title;
      const res = await api.createTicket({
        product: {
          ...product,
          price: chosenTotal || product.price,
          title: chosenPackages.length > 0 ? `${product.title} — ${packagesSummary}` : product.title
        },
        userId: userId!,
        username: username,
        playerId: needsPlayerId() ? playerId : undefined,
        serverId: product.type === 'mlbb-diamonds' ? serverId : undefined,
      });

      addOrder(product, userId!);
      if (!product.type || product.type === "account") {
        deleteProduct(product.id);
      }

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
    <div className="pt-24 pb-24 min-h-screen bg-[var(--bg-primary)] transition-colors duration-300 relative overflow-hidden">
      {/* Ambient background glows for premium feel */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-violet-600/5 rounded-full blur-[120px] pointer-events-none" />


      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/95 backdrop-blur-3xl"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Close Button */}
          <button className="absolute top-6 right-6 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors z-10 border border-white/20">
            <X className="w-6 h-6" />
          </button>

          {/* Main Image */}
          <motion.img
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            src={selectedImage}
            alt="Huge product view"
            className="max-w-full max-h-full object-contain drop-shadow-2xl z-0"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Nav Controls */}
          {allImages.length > 1 && (
            <>
              <button
                onClick={handlePrevImage}
                className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors z-10 border border-white/20"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors z-10 border border-white/20"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Thumbnails at bottom */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-10 max-w-full overflow-x-auto p-2" onClick={(e) => e.stopPropagation()}>
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-16 h-12 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${selectedImage === img ? 'border-[#bef264] scale-110 shadow-[0_0_15px_rgba(190,242,100,0.5)]' : 'border-transparent opacity-50 hover:opacity-100'}`}
                  >
                    <img src={img} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Purchase Flow Modals */}
      {purchaseStep !== 'idle' && purchaseStep !== 'success' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[2.5rem] p-8 sm:p-10 max-w-xl w-full shadow-[0_0_50px_rgba(0,0,0,0.3)] relative overflow-hidden"
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
                    <h2 className="text-3xl sm:text-4xl font-black text-[var(--text-primary)] tracking-tight leading-none mb-1">Terms of Service</h2>
                    <p className="text-[#bef264] text-xs font-black uppercase tracking-[0.2em]">Please Read Carefully</p>
                  </div>
                </div>

                <div
                  className="bg-[var(--bg-primary)]/50 backdrop-blur-xl p-6 sm:p-8 rounded-3xl h-72 overflow-y-auto mb-8 text-sm text-[var(--text-secondary)] border border-[var(--border-color)] shadow-[inset_0_2px_20px_rgba(0,0,0,0.1)] custom-scrollbar relative"
                >
                  <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-[var(--bg-primary)] to-transparent pointer-events-none rounded-t-3xl" />
                  <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-[var(--bg-primary)] to-transparent pointer-events-none rounded-b-3xl" />

                  <p className="mb-6 leading-relaxed text-[var(--text-primary)] text-base">Welcome to the <strong className="font-black">Megatron Marketplace</strong>.</p>
                  <div className="space-y-6">
                    <div className="flex gap-4 group">
                      <span className="text-[#bef264] font-black text-lg group-hover:scale-125 transition-transform duration-300">01</span>
                      <p className="leading-relaxed"><strong className="text-[var(--text-primary)]">All Sales are Final:</strong> Due to the digital nature of the accounts, all purchases are non-refundable once the account details have been securely transferred to the buyer.</p>
                    </div>
                    <div className="flex gap-4 group">
                      <span className="text-[#bef264] font-black text-lg group-hover:scale-125 transition-transform duration-300">02</span>
                      <p className="leading-relaxed"><strong className="text-[var(--text-primary)]">Account Verification:</strong> You are responsible for verifying the account details provided in the Discord ticket. Our staff will act as middlemen to ensure safe delivery.</p>
                    </div>
                    <div className="flex gap-4 group">
                      <span className="text-[#bef264] font-black text-lg group-hover:scale-125 transition-transform duration-300">03</span>
                      <p className="leading-relaxed"><strong className="text-[var(--text-primary)]">Prohibited Conduct:</strong> Attempting to scam, chargeback, or manipulate the ticketing system will result in an immediate and permanent ban from the marketplace and our Discord server.</p>
                    </div>
                    <div className="flex gap-4 group">
                      <span className="text-[#bef264] font-black text-lg group-hover:scale-125 transition-transform duration-300">04</span>
                      <p className="leading-relaxed"><strong className="text-[var(--text-primary)]">Delivery Time:</strong> Staff will attend to your ticket within 24 hours. Please remain patient and do not spam ping the team.</p>
                    </div>
                    <div className="flex gap-4 group">
                      <span className="text-[#bef264] font-black text-lg group-hover:scale-125 transition-transform duration-300">05</span>
                      <p className="leading-relaxed"><strong className="text-[var(--text-primary)]">Security:</strong> Secure your account immediately after receiving the credentials. We are not responsible for accounts lost due to poor security practices after the handover is complete.</p>
                    </div>
                  </div>
                  <div className="mt-8 pt-6 border-t border-[var(--border-color)] text-center">
                    <p className="text-xs text-[var(--text-secondary)] font-bold tracking-[0.3em] uppercase">--- End of Terms ---</p>
                  </div>
                </div>

                <div
                  className={`flex items-center gap-4 mb-8 bg-gradient-to-r ${agreedToTos ? 'from-[#bef264]/20 to-transparent border-[#bef264]/50' : 'from-[var(--bg-primary)] to-transparent border-[var(--border-color)]'} p-5 rounded-2xl border transition-all duration-300 cursor-pointer group hover:from-[var(--border-color)]`}
                  onClick={() => setAgreedToTos(!agreedToTos)}
                >
                  <div className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${agreedToTos ? 'bg-[#bef264] border-[#bef264] shadow-[0_0_15px_rgba(190,242,100,0.5)] scale-110' : 'border-[var(--text-secondary)] group-hover:border-[#bef264]'}`}>
                    <CheckCircle2 className={`w-5 h-5 text-black transition-all duration-300 ${agreedToTos ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`} />
                  </div>
                  <label className={`text-base font-bold cursor-pointer select-none transition-colors duration-300 ${agreedToTos ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]'}`}>
                    I have read and agree to the Terms of Service
                  </label>
                </div>

                <div className="flex gap-4 mt-auto">
                  <button
                    onClick={() => setPurchaseStep('idle')}
                    className="flex-1 py-4 rounded-2xl font-bold border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--border-color)] transition-all hover:scale-[1.02] active:scale-95"
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

                <h2 className="text-4xl font-black text-[var(--text-primary)] mb-4 tracking-tight">Final Step!</h2>

                <p className="text-[var(--text-secondary)] mb-10 leading-relaxed max-w-sm mx-auto">
                  Clicking <strong className="text-[var(--text-primary)]">Secure Checkout</strong> will generate a private, encrypted Discord ticket where our staff will verify your payment and hand over the account details safely.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 w-full">
                  <button
                    onClick={() => setPurchaseStep('tos')}
                    className="w-full sm:w-1/3 py-4 rounded-xl font-bold border border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--border-color)] transition-all"
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
          <Link to={(!product.type || product.type === "account") ? "/accounts" : "/products"} className="hover:text-[var(--text-primary)] transition-colors capitalize">
            {(!product.type || product.type === "account") ? "Accounts" : "Products"}
          </Link>
          <span>/</span>
          <span className="text-[var(--accent)] truncate max-w-[200px]">{product.title}</span>
        </div>

        {/* BENTO GRID LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 auto-rows-[minmax(180px,auto)]">

          {/* 1. Main Hero Card (Spans 8 cols, 2 rows) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className={`lg:col-span-8 lg:row-span-2 bg-[var(--bg-secondary)]/80 backdrop-blur-md rounded-[2.5rem] p-8 sm:p-12 border border-[var(--border-color)] shadow-xl flex flex-col md:flex-row gap-8 group relative ${product.type && product.type !== 'account' ? 'overflow-visible' : 'overflow-hidden'
              }`}
          >
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-blue-500/5 to-transparent pointer-events-none transition-opacity duration-500 opacity-50 group-hover:opacity-100" />

            {/* Left Column Text Content */}
            <div className="flex flex-col justify-between z-10 w-full md:w-[55%]">
              {/* Top Badge */}
              <div className="inline-flex items-center gap-2 bg-[var(--bg-primary)]/80 border border-[var(--border-color)] px-4 py-2 rounded-full w-fit mb-8 shadow-sm relative z-10">
                <ShieldCheck className="w-4 h-4 text-[#10b981]" />
                <span className="text-xs font-bold text-[var(--text-primary)]">Megatron Verified</span>
              </div>

              {/* Title & Desc */}
              <div className="z-10 flex-1">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[var(--text-primary)] leading-[1.1] mb-6 tracking-tight break-words">
                  {product.title}
                </h1>

                <div className="flex items-center gap-4 mb-8">
                  <span className="text-4xl sm:text-5xl font-black text-[var(--text-secondary)] opacity-20">01</span>
                  <div className="h-[2px] w-8 sm:w-12 bg-dashed border-b-2 border-dotted border-[var(--border-color)]" />
                  <div>
                    <h3 className="font-bold text-[var(--text-primary)] text-sm">Premium Quality</h3>
                    <p className="text-[var(--text-secondary)] text-xs mt-1 leading-relaxed max-w-[200px]">
                      {product.description}
                    </p>
                  </div>
                </div>

                {/* Quick Stats in Main Card */}
                {(!product.type || product.type === "account") ? (
                  <>
                    <div className="grid grid-cols-3 gap-3 mb-8 bg-[var(--bg-primary)]/50 backdrop-blur-sm p-4 rounded-2xl border border-[var(--border-color)]">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#bef264] mb-1">Level</p>
                        <p className="font-black text-xl text-[var(--text-primary)]">{product.level}</p>
                      </div>
                      <div className="border-l border-r border-[var(--border-color)] px-3">
                        <p className="text-[10px] font-black uppercase tracking-widest text-purple-400 mb-1">Rank</p>
                        <p className="font-bold text-sm text-[var(--text-primary)] capitalize truncate">{product.collectionRank}</p>
                      </div>
                      <div className="pl-3">
                        <p className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-1">Win Rate</p>
                        <p className="font-black text-xl text-[var(--text-primary)]">{product.stats?.winRate || "0%"}</p>
                      </div>
                    </div>
                    {/* Purchase CTA */}
                    <button
                      onClick={handleInitialPurchaseClick}
                      className="group flex items-center gap-3 bg-gradient-to-r from-[#bef264] to-[#a3e635] text-black px-5 sm:px-6 py-3 rounded-full font-bold transition-all shadow-[0_0_20px_rgba(190,242,100,0.3)] hover:shadow-[0_0_30px_rgba(190,242,100,0.5)] hover:scale-105 active:scale-95 relative z-10 w-fit"
                    >
                      <span className="text-sm sm:text-base">Purchase for {formatPrice(displayPrice)}</span>
                      <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform shrink-0">
                        <ArrowUpRight className="w-4 h-4" />
                      </div>
                    </button>
                  </>
                ) : (
                  <div className="relative z-10 flex flex-col gap-0">
                    {product.currencyPackages && product.currencyPackages.length > 0 && (() => {
                      // Mark the middle package as best selling
                      const sorted = [...product.currencyPackages].sort((a, b) => a.price - b.price);
                      const bestSellingIdx = Math.floor(sorted.length / 2);
                      return (
                        <div className="mb-6" ref={packageDropdownRef}>
                          <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] mb-3">Select Packages</p>
                          <div className="relative">
                            {/* Trigger Button */}
                            <button
                              type="button"
                              onClick={() => setIsPackageDropdownOpen(o => !o)}
                              className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl border-2 transition-all duration-200 bg-[var(--bg-primary)] ${isPackageDropdownOpen
                                  ? 'border-[#bef264] shadow-[0_0_20px_rgba(190,242,100,0.15)]'
                                  : 'border-[var(--border-color)] hover:border-[var(--text-secondary)]/50'
                                }`}
                            >
                              <div className="flex items-center gap-2 flex-wrap">
                                {selectedPackageIds.length === 0 ? (
                                  <span className="text-sm font-black text-[var(--text-secondary)]">Choose packages...</span>
                                ) : (
                                  selectedPackages.map(pkg => (
                                    <span key={pkg.id} className="flex items-center gap-1 text-xs font-bold text-[#bef264] bg-[#bef264]/10 px-2 py-0.5 rounded-full">
                                      {pkg.amount} {getUnitIcon()}
                                    </span>
                                  ))
                                )}
                              </div>
                              <div className="flex items-center gap-2 shrink-0 ml-2">
                                {selectedPackageIds.length > 0 && (
                                  <span className="text-xs font-black text-[#bef264]">{formatPrice(totalPrice)}</span>
                                )}
                                <ChevronDown className={`w-5 h-5 text-[#bef264] transition-transform duration-300 ${isPackageDropdownOpen ? 'rotate-180' : ''}`} />
                              </div>
                            </button>

                            {/* Dropdown Panel */}
                            {isPackageDropdownOpen && (
                              <div className="absolute top-[calc(100%+8px)] left-0 right-0 z-[200] bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl">
                                {sorted.map((pkg, idx) => {
                                  const isSelected = selectedPackageIds.includes(pkg.id);
                                  return (
                                    <button
                                      key={pkg.id}
                                      type="button"
                                      onClick={() => togglePackage(pkg.id)}
                                      className={`w-full flex items-center justify-between px-5 py-4 transition-all group/row ${isSelected
                                          ? 'bg-[#bef264]/10 text-[var(--text-primary)]'
                                          : 'text-[var(--text-secondary)] hover:bg-[var(--bg-primary)] hover:text-[var(--text-primary)]'
                                        } ${idx > 0 ? 'border-t border-[var(--border-color)]' : ''}`}
                                    >
                                      <div className="flex items-center gap-3">
                                        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${isSelected ? 'bg-[#bef264] border-[#bef264]' : 'border-[var(--border-color)] group-hover/row:border-[var(--text-secondary)]'}`}>
                                          {isSelected && <CheckCircle2 className="w-3 h-3 text-black" />}
                                        </div>
                                        <span className="text-sm font-black">{pkg.amount} {getUnitLabel()}</span>
                                        {idx === bestSellingIdx && (
                                          <span className="flex items-center gap-1 text-[10px] font-black text-orange-400 bg-orange-400/10 border border-orange-400/20 px-2 py-0.5 rounded-full uppercase tracking-wider"><Flame className="w-2.5 h-2.5" /> Best</span>
                                        )}
                                      </div>
                                      <span className={`text-sm font-bold ${isSelected ? 'text-[#bef264]' : ''}`}>
                                        {formatPrice(pkg.price)}
                                      </span>
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })()}
                    {/* UID / Server ID Input for Currency Top-Up */}
                    {needsPlayerId() && (
                      <div className="flex flex-col gap-3 mb-4">
                        <div>
                          <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] mb-1.5 block">
                            {getPlayerIdLabel()}
                          </label>
                          <input
                            type="text"
                            inputMode={product.type === 'valo-points' || product.type === 'fortnite' ? 'text' : 'numeric'}
                            value={playerId}
                            onChange={(e) => setPlayerId(product.type === 'valo-points' || product.type === 'fortnite' ? e.target.value : e.target.value.replace(/[^0-9]/g, ''))}
                            placeholder={getPlayerIdPlaceholder()}
                            className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/50 focus:border-[#bef264] outline-none transition-colors"
                          />
                        </div>
                        {product.type === 'mlbb-diamonds' && (
                          <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] mb-1.5 block">
                              Server ID
                            </label>
                            <input
                              type="text"
                              inputMode="numeric"
                              value={serverId}
                              onChange={(e) => setServerId(e.target.value.replace(/[^0-9]/g, ''))}
                              placeholder="Enter your Server ID"
                              className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/50 focus:border-[#bef264] outline-none transition-colors"
                            />
                          </div>
                        )}
                      </div>
                    )}
                    {/* Purchase CTA */}
                    <button
                      onClick={handleInitialPurchaseClick}
                      disabled={selectedPackageIds.length === 0 && (!!product.currencyPackages && product.currencyPackages.length > 0)}
                      className="group flex items-center gap-3 bg-gradient-to-r from-[#bef264] to-[#a3e635] text-black px-5 sm:px-6 py-3 rounded-full font-bold transition-all shadow-[0_0_20px_rgba(190,242,100,0.3)] hover:shadow-[0_0_30px_rgba(190,242,100,0.5)] hover:scale-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none w-fit"
                    >
                      <span className="text-sm sm:text-base">Purchase for {formatPrice(displayPrice)}</span>
                      <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform shrink-0">
                        <ArrowUpRight className="w-4 h-4" />
                      </div>
                    </button>
                  </div>
                )}
              </div>

              {/* Action Buttons Bottom Left */}
              <div className="flex items-center gap-4 mt-12 flex-wrap">

                {/* Social Share */}
                <div className="flex items-center gap-3 mr-4">
                  <span className="text-xs font-bold text-[var(--text-secondary)]">Share on:</span>
                  <div className="flex gap-2">
                    {[Twitter, Instagram, Facebook].map((Icon, i) => (
                      <button key={i} className="w-8 h-8 rounded-full bg-[var(--bg-primary)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors border border-[var(--border-color)]">
                        <Icon className="w-3.5 h-3.5" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="w-[1px] h-6 bg-[var(--border-color)] hidden sm:block"></div>

                {/* Wishlist & Compare */}
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={handleWishlistClick}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${isWished ? 'bg-red-500/10 text-red-500 border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'bg-[var(--bg-primary)] text-[var(--text-secondary)] border-[var(--border-color)] hover:border-[var(--text-primary)]/30 hover:text-[var(--text-primary)]'}`}
                  >
                    <Heart className={`w-4 h-4 ${isWished ? 'fill-red-500' : ''}`} />
                    {isWished ? 'Saved' : 'Save'}
                  </button>

                  <button
                    onClick={handlePriceAlertClick}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[var(--bg-primary)] text-[var(--text-secondary)] border border-[var(--border-color)] hover:border-[#bef264]/50 hover:text-[#bef264] transition-all hover:shadow-[0_0_15px_rgba(190,242,100,0.2)]"
                  >
                    <Bell className="w-4 h-4" />
                    Alerts
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column Image */}
            <div
              className="w-full md:w-[45%] flex items-center justify-center cursor-zoom-in group/img z-10"
              onClick={() => setIsLightboxOpen(true)}
            >
              <div className="relative w-full aspect-[3/4] sm:aspect-square md:aspect-[3/4] rounded-2xl overflow-hidden border border-[var(--border-color)] bg-[var(--bg-primary)]/50 shadow-inner">
                <img
                  src={selectedImage || product.image}
                  alt="Product"
                  className="w-full h-full object-contain p-2 drop-shadow-2xl scale-100 transition-all duration-500 group-hover/img:scale-110"
                  onError={(e) => { e.currentTarget.src = '/images/placeholder.png'; }}
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                  <span className="bg-black/50 text-white px-4 py-2 rounded-full border border-white/20 text-xs font-bold tracking-widest uppercase shadow-xl">
                    Click to Enlarge
                  </span>
                </div>
              </div>
            </div>
          </motion.div>


          {/* 2. Top Right Small Card: for ACCOUNTS show Account Contents, for CURRENCIES show merged info card */}
          {(!product.type || product.type === 'account') ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="lg:col-span-4 bg-[var(--bg-secondary)]/80 backdrop-blur-md rounded-[2rem] p-8 border border-[var(--border-color)] shadow-xl flex flex-col justify-center relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[var(--bg-secondary)] to-purple-500/10 pointer-events-none" />
              <div className="relative z-10">
                <h3 className="font-black text-[var(--text-primary)] text-xl mb-6 flex items-center gap-2">
                  <ShieldCheck className="w-6 h-6 text-purple-400" />
                  Account Contents
                </h3>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-[var(--bg-primary)]/50 backdrop-blur-sm rounded-2xl p-4 border border-[var(--border-color)] flex flex-col items-center justify-center text-center">
                    <span className="text-3xl font-black text-[var(--text-primary)] mb-1">{product.heroes || 0}</span>
                    <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">Heroes</span>
                  </div>
                  <div className="bg-[var(--bg-primary)]/50 backdrop-blur-sm rounded-2xl p-4 border border-[var(--border-color)] flex flex-col items-center justify-center text-center">
                    <span className="text-3xl font-black text-[var(--text-primary)] mb-1">{product.skins || 0}</span>
                    <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">Skins</span>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3 text-sm font-bold text-[var(--text-primary)]">
                    <CheckCircle2 className="w-5 h-5 text-[#10b981]" />
                    Full Email Access
                  </div>
                  <div className="flex items-center gap-3 text-sm font-bold text-[var(--text-primary)]">
                    <CheckCircle2 className="w-5 h-5 text-[#10b981]" />
                    100% Clean Bindings
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            /* Right column: top selling card (top) + guarantee card (bottom) */
            <>
              {/* Top Selling Packs */}
              {(() => {
                const pkgLabel = getUnitLabel();
                const pkgOrders = orders.filter(o => o.product.id === product.id || o.product.type === product.type);
                const countMap: Record<string, number> = {};
                pkgOrders.forEach(o => {
                  const match = o.product.title.match(/(\d+)\s*(UC|Diamonds|💎|VP|Months|USD|V-Bucks)/i);
                  if (match) countMap[match[1]] = (countMap[String(match[1])] || 0) + 1;
                });
                const ranked = product.currencyPackages
                  ? [...product.currencyPackages]
                      .sort((a, b) => (countMap[String(b.amount)] || 0) - (countMap[String(a.amount)] || 0))
                      .slice(0, 3)
                  : [];
                return (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="lg:col-span-4 bg-[var(--bg-secondary)]/90 backdrop-blur-xl rounded-[2.5rem] border border-[var(--border-color)] shadow-2xl relative overflow-hidden flex flex-col group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-transparent pointer-events-none transition-opacity duration-500 group-hover:opacity-100 opacity-50" />
                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/20 blur-[50px] rounded-full pointer-events-none" />

                    <div className="relative z-10 p-6 flex flex-col h-full">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="font-black text-[var(--text-primary)] text-base flex items-center gap-2">
                          <Flame className="w-5 h-5 text-orange-500" /> 
                          <span className="text-[var(--text-primary)]">Top Selling {pkgLabel}</span>
                        </h3>
                        <span className="flex items-center gap-1.5 text-[10px] font-black text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2.5 py-1 rounded-full uppercase tracking-widest">
                          <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" /> Live
                        </span>
                      </div>
                      <div className="flex flex-col gap-3 flex-1 relative">

                        {ranked.map((pkg, idx) => {
                          const count = countMap[String(pkg.amount)] || 0;
                          
                          // Podium styling
                          let rankStyle = '';
                          let iconStyle = '';
                          let rankLabel = '';
                          
                          if (idx === 0) {
                            rankStyle = 'bg-amber-500/10 border-amber-500/30';
                            iconStyle = 'text-amber-500 bg-amber-500/20';
                            rankLabel = '1st';
                          } else if (idx === 1) {
                            rankStyle = 'bg-gray-400/10 border-gray-400/20';
                            iconStyle = 'text-gray-400 bg-gray-400/20';
                            rankLabel = '2nd';
                          } else {
                            rankStyle = 'bg-amber-700/10 border-amber-700/20';
                            iconStyle = 'text-amber-700 bg-amber-700/20';
                            rankLabel = '3rd';
                          }
                          
                          return (
                            <div key={pkg.id} className={`flex items-center justify-between px-4 py-3.5 rounded-2xl border transition-all duration-300 hover:scale-[1.03] group/item ${rankStyle}`}>
                              <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs ${iconStyle}`}>
                                  {idx === 0 ? <TrendingUp className="w-4 h-4" /> : rankLabel}
                                </div>
                                <div>
                                  <span className={`block text-base font-black ${idx === 0 ? 'text-amber-300' : 'text-[var(--text-primary)]'} group-hover/item:text-white transition-colors`}>
                                    {pkg.amount} {pkgLabel}
                                  </span>
                                  <span className="text-[10px] text-[var(--text-secondary)] font-bold tracking-wider uppercase">
                                    {count > 0 ? `${count} purchases today` : 'Trending Now'}
                                  </span>
                                </div>
                              </div>
                              <div className="flex flex-col items-end">
                                <span className={`text-sm font-black ${idx === 0 ? 'text-amber-400' : 'text-[#bef264]'}`}>
                                  {formatPrice(pkg.price)}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                );
              })()}

              {/* Guarantee card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="lg:col-span-4 bg-[var(--bg-secondary)]/90 backdrop-blur-xl rounded-[2.5rem] border border-[var(--border-color)] shadow-xl relative overflow-hidden flex flex-col group/guarantee"
              >
                
                <div className="absolute inset-0 bg-gradient-to-br from-[#bef264]/5 via-transparent to-transparent pointer-events-none" />

                <div className="relative z-10 p-6 flex flex-col h-full gap-5">
                  {/* Title */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#bef264]/10 border border-[#bef264]/20 flex items-center justify-center text-[#bef264] group-hover/guarantee:scale-110 transition-transform">
                        {product.type === 'pubg-uc' ? <Flame className="w-5 h-5" /> : (product.type === 'mlbb-diamonds' ? <Gem className="w-5 h-5" /> : <Zap className="w-5 h-5" />)}
                      </div>
                      <span className="text-lg font-black text-[var(--text-primary)] tracking-tight">
                        {product.title}
                      </span>
                    </div>
                    <span className="flex items-center gap-1.5 text-[10px] font-black text-[#10b981] bg-[#10b981]/10 border border-[#10b981]/20 px-2.5 py-1 rounded-full uppercase tracking-wider">
                      <ShieldCheck className="w-3 h-3" /> Verified
                    </span>
                  </div>

                  {/* 3 stat floating frosted glass cards */}
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { icon: Clock, label: 'Fast', sub: '~5 min', color: 'bg-orange-500/10', border: 'border-orange-500/20', text: 'text-orange-400' },
                      { icon: ShieldCheck, label: 'Safe', sub: 'Official', color: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-400' },
                      { icon: UserCheck, label: needsPlayerId() ? 'ID Only' : 'Instant', sub: needsPlayerId() ? 'No login' : 'Via Email', color: 'bg-[#bef264]/10', border: 'border-[#bef264]/20', text: 'text-[#bef264]' },
                    ].map((stat, i) => (
                      <div key={i} className={`flex flex-col items-center justify-center gap-1.5 ${stat.color} border ${stat.border} rounded-2xl py-3 px-2 transition-transform duration-300 hover:scale-105`}>
                        <stat.icon className={`w-5 h-5 ${stat.text} mb-1`} />
                        <span className="text-[11px] font-black uppercase tracking-wider text-[var(--text-primary)] leading-none">{stat.label}</span>
                        <span className="text-[9px] text-[var(--text-secondary)] font-bold text-center leading-tight uppercase">{stat.sub}</span>
                      </div>
                    ))}
                  </div>

                  {/* Feature Checklist */}
                  <div className="flex flex-col gap-2.5 mt-2 bg-[var(--bg-primary)]/40 p-4 rounded-2xl border border-[var(--border-color)]">
                    {(product.features?.length ? product.features : ['Safe & Secure', 'Instant Delivery']).map((feat, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-[#10b981]/10 border border-[#10b981]/20 flex items-center justify-center shrink-0">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981]" />
                        </div>
                        <span className="text-xs text-[var(--text-primary)] font-bold tracking-wide truncate">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </>
          )}

          {/* 3. Mid Right trust signal cards — only for ACCOUNTS */}
          {(!product.type || product.type === 'account') && (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="lg:col-span-2 bg-[var(--bg-secondary)]/80 backdrop-blur-md rounded-[2rem] border border-[var(--border-color)] shadow-xl flex flex-col items-center justify-center text-center group hover:border-[#bef264]/50 transition-colors"
              >
                <div className="w-10 h-10 bg-[#bef264]/10 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Zap className="w-5 h-5 text-[#bef264]" />
                </div>
                <h4 className="font-bold text-[var(--text-primary)] text-xs mb-0.5">Instant Delivery</h4>
                <p className="text-[9px] text-[var(--text-secondary)] leading-tight">Automated transfer via secure ticket.</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="lg:col-span-2 bg-[var(--bg-secondary)]/80 backdrop-blur-md rounded-[2rem] border border-[var(--border-color)] shadow-xl flex flex-col items-center justify-center text-center group hover:border-blue-500/50 transition-colors"
              >
                <div className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-5 h-5 text-blue-400" />
                </div>
                <h4 className="font-bold text-[var(--text-primary)] text-xs mb-0.5">Lifetime Warranty</h4>
                <p className="text-[9px] text-[var(--text-secondary)] leading-tight">100% safe & protected accounts.</p>
              </motion.div>
            </>
          )}


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

          {/* BOTTOM ROW 2: Featured Accounts & Reviews */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
            className="lg:col-span-7 bg-[var(--bg-secondary)]/80 backdrop-blur-md rounded-[2rem] p-8 border border-[var(--border-color)] shadow-xl relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-[var(--text-secondary)] opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none" />
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-[var(--text-primary)] text-xl">You Might Also Like</h3>
              <Link to="/products" className="text-[var(--accent)] text-sm font-bold hover:underline">View All</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {finalRecommendations.map((p) => (
                <div key={p.id} className="bg-[var(--bg-primary)] rounded-[1.5rem] p-4 border border-[var(--border-color)] group hover:border-[var(--accent)] transition-colors cursor-pointer" onClick={() => window.location.href = `/products/${p.dedicatedId || p.id}`}>
                  <div className="aspect-[4/3] rounded-xl overflow-hidden mb-4 relative">
                    <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    {p.badge && (
                      <div className="absolute top-2 right-2 bg-[var(--accent)] text-white text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full shadow-md z-10">
                        {p.badge}
                      </div>
                    )}
                  </div>
                  <h4 className="font-black text-sm text-[var(--text-primary)] mb-1 truncate">{p.title}</h4>
                  <div className="flex justify-between items-center">
                    <span className="text-[var(--text-secondary)] text-xs font-bold">
                      {(!p.type || p.type === "account") ? `Level ${p.level}` : `${p.amount} ${p.type === 'pubg-uc' ? 'UC' : 'Diamonds'}`}
                    </span>
                    <span className="text-[var(--accent)] font-black text-sm">{formatPrice(p.price)}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
            className="lg:col-span-5 bg-[var(--bg-secondary)]/80 backdrop-blur-md rounded-[2rem] p-8 border border-[var(--border-color)] shadow-xl flex flex-col relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-[var(--text-secondary)] opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none" />
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-[var(--text-primary)] text-xl flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                Real-Time Reviews
              </h3>
              <Link to="/reviews" className="text-[var(--accent)] text-sm font-bold hover:underline">All</Link>
            </div>
            <div className="flex-1 flex flex-col justify-center gap-4">
              {reviews.slice(0, 3).map((review, idx) => (
                <div key={review.id || idx} className="bg-[var(--bg-primary)] rounded-2xl p-4 border border-[var(--border-color)] hover:border-white/20 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--accent)] to-purple-500 flex items-center justify-center text-white font-bold text-xs shadow-md">
                        {review.name.charAt(0)}
                      </div>
                      <div>
                        <span className="font-bold text-[var(--text-primary)] text-xs block leading-tight">{review.name}</span>
                        <span className="text-[10px] text-[var(--text-secondary)]">{review.date}</span>
                      </div>
                    </div>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3 h-3 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "fill-[var(--bg-secondary)] text-[var(--border-color)]"}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-[var(--text-secondary)] text-xs italic line-clamp-2 font-medium">"{review.comment}"</p>
                </div>
              ))}
            </div>
          </motion.div>

        </div>

      </div>
    </div>
  );
}