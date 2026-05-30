import { motion, AnimatePresence, useInView, useScroll, useTransform } from "motion/react";
import { Link } from "react-router";
import { useState, useRef, useEffect } from "react";
import { ProductCard } from "../products/ProductCard";
import { Star, Shield, Zap, Users, CheckCircle2 } from "lucide-react";
import { useProducts, Product } from "../../context/ProductContext";
import { useReviews } from "../../context/ReviewContext";
import { toast } from "sonner";
import { api } from "../../../lib/api";

const features = [
  { id: "01", title: "Instant Delivery", desc: "Credentials emailed within minutes of payment — fully automated, no delays." },
  { id: "02", title: "Lifetime Warranty", desc: "Account stops working? We replace it for free. No questions, no hassle." },
  { id: "03", title: "Encrypted & Private", desc: "All transactions secured. Your data is never stored beyond what's necessary." },
  { id: "04", title: "Lowest Prices", desc: "We monitor the market constantly to guarantee the most competitive rates." },
  { id: "05", title: "24/7 Live Support", desc: "Real humans available any time of day. Average response time under 5 minutes." },
  { id: "06", title: "Pre-Verified Accounts", desc: "Every account is tested before sale. You always receive a working product." },
];

const featuredProducts = [
  { id: "1", title: "HYPER BASED PREMIUM ACCOUNT", level: 69, rank: "Exalted 1", skins: 315, heroes: 131, price: 99.90, image: "/images/account-preview.png", badge: "Hot" as const },
  { id: "2", title: "EPIC STARTER BUNDLE", level: 45, rank: "Legend 3", skins: 150, heroes: 89, price: 49.90, image: "/images/skins-collection.png", badge: "New" as const },
  { id: "3", title: "MYTHIC GLORY ACCOUNT", level: 78, rank: "Mythic Glory", skins: 420, heroes: 150, price: 149.90, image: "/images/hero-banner.png", badge: "Premium" as const },
  { id: "4", title: "COLLECTOR'S EDITION", level: 82, rank: "Mythical Immortal", skins: 500, heroes: 160, price: 199.90, image: "/images/account-preview.png", badge: "Rare" as const },
];



export function Home() {
  const [activeFeature, setActiveFeature] = useState<string>("04");
  const [showTopBtn, setShowTopBtn] = useState(false);
  const { products } = useProducts();
  const { reviews } = useReviews();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showAllFaqs, setShowAllFaqs] = useState(false);

  const [discordStats, setDiscordStats] = useState({
    totalMembers: 2500,
    onlineMembers: 400
  });

  useEffect(() => {
    const fetchDiscordStats = async () => {
      try {
        const response = await fetch('/api/tickets/guild-stats');
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setDiscordStats({
              totalMembers: data.totalMembers,
              onlineMembers: data.onlineMembers
            });
          }
        }
      } catch (err) {
        console.warn("Could not fetch Discord statistics, using cache/defaults", err);
      }
    };
    fetchDiscordStats();
    // Poll every 60 seconds
    const interval = setInterval(fetchDiscordStats, 60000);
    return () => clearInterval(interval);
  }, []);

  // Get featured products from context, fallback to static array if none exist
  const contextFeatured = products.filter(p => p.featured).slice(0, 4);
  const displayFeatured = contextFeatured.length > 0 ? contextFeatured : featuredProducts as unknown as Product[];

  const [isCreatingTicket, setIsCreatingTicket] = useState(false);

  const handleSellAccountTicket = async () => {
    const userId = localStorage.getItem("discord_id");
    const username = localStorage.getItem("discord_username");

    if (!userId) {
      toast.info("Please sign in with Discord to create a ticket.");
      setTimeout(() => {
        window.location.href = `${import.meta.env.VITE_API_URL}/auth/discord`;
      }, 1500);
      return;
    }

    try {
      setIsCreatingTicket(true);
      const res = await api.post("/tickets/create", {
        productId: "sell",
        productTitle: "Sell Account Request",
        userId,
        username: username || "Unknown",
      });

      toast.success("A selling ticket has been successfully created in our Discord server!");
      if (res && (res as any).ticketUrl) {
        window.open((res as any).ticketUrl, "_blank");
      }
    } catch (error: any) {
      console.error(error);
      toast.error("Failed to create a ticket. Please try again later.");
    } finally {
      setIsCreatingTicket(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300">

      {/* ═══ HERO ═══ */}
      <section className="relative min-h-[90vh] flex items-center border-b border-[var(--border-color)] overflow-hidden pt-24 pb-12">
        {/* Background Image */}
        <div className="absolute inset-0 bg-[url('/images/hero-banner.png')] bg-cover bg-center opacity-40 animate-pulse-bg" />

        {/* Animated Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg-primary)] via-[var(--bg-primary)]/80 to-[var(--bg-primary)]/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-transparent to-transparent opacity-90" />

        <div className="relative z-20 max-w-[100rem] mx-auto px-6 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-40 xl:gap-64 items-center justify-between">

            {/* Left Column: Big Animated Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1, type: "spring", bounce: 0.4 }}
              className="flex justify-center lg:justify-end"
            >
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500 rounded-full blur-3xl opacity-20 group-hover:opacity-40 animate-pulse transition-opacity duration-500"></div>
                <img
                  src="/images/megatronlogo.png"
                  alt="Megatron Logo"
                  className="w-64 h-64 sm:w-80 sm:h-80 lg:w-[28rem] lg:h-[28rem] object-contain drop-shadow-2xl relative z-10 hover:rotate-[360deg] transition-transform duration-[2000ms] ease-in-out"
                />
              </div>
            </motion.div>

            {/* Right Column: Text & Buttons */}
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-2 bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6"
              >
                <Zap className="w-3.5 h-3.5" />
                Official Extended Services
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-widest mb-6 leading-[1.1] text-[var(--text-primary)] uppercase drop-shadow-lg"
                style={{ fontFamily: "'Venite Adoremus', sans-serif" }}
              >
                DIGITAL PRODUCTS<br />& SERVICES
              </motion.h1>

              <motion.ul
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-left space-y-4 mb-10 text-[var(--text-secondary)] font-medium max-w-md mx-auto lg:mx-0"
              >
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[var(--accent)] shrink-0" />
                  <span><strong className="text-[var(--text-primary)]">MLBB</strong> Topups & Premium Accounts</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[var(--accent)] shrink-0" />
                  <span><strong className="text-[var(--text-primary)]">Robux</strong> & Discord Nitro</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[var(--accent)] shrink-0" />
                  <span><strong className="text-[var(--text-primary)]">Valorant Points</strong> & Minecoins</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[var(--accent)] shrink-0" />
                  <span><strong className="text-[var(--text-primary)]">Gift Cards:</strong> Steam, PSN, Apple & More</span>
                </li>
              </motion.ul>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4 w-full justify-center lg:justify-start mb-16"
              >
                <Link to="/products" className="group flex items-center justify-center gap-2 bg-[var(--text-primary)] text-[var(--bg-primary)] px-6 py-3 rounded-full font-bold text-xs uppercase tracking-widest transition-all shadow-lg hover:shadow-xl hover:scale-105">
                  <span>Browse Products</span>
                  <div className="w-5 h-5 bg-[var(--bg-primary)] text-[var(--text-primary)] rounded-full flex items-center justify-center group-hover:translate-x-1 transition-transform">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                  </div>
                </Link>
                <Link to="/reviews" className="group flex items-center justify-center gap-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] px-6 py-3 rounded-full font-bold text-xs uppercase tracking-widest transition-all shadow-sm hover:shadow-md hover:border-[var(--text-primary)]">
                  <span>Read Reviews</span>
                </Link>
              </motion.div>
            </div>

          </div>
        </div>
        {/* Scroll indicator (bottom center) */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-8 z-10">
          <button
            aria-label="Scroll down"
            onClick={() => document.getElementById('why-megatron')?.scrollIntoView({ behavior: 'smooth' })}
            className="flex flex-col items-center gap-2 text-[12px] text-[var(--text-secondary)] uppercase tracking-widest opacity-90"
          >
            <span className="select-none">Scroll</span>
            <span className="w-6 h-6 flex items-center justify-center rounded-full border border-[var(--border-color)] text-[var(--text-secondary)]">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-bounce">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </span>
          </button>
        </div>
      </section>

      {/* ═══ WHY MEGATRON ═══ */}
      <section id="why-megatron" className="py-24 border-b border-[var(--border-color)] bg-[var(--bg-primary)] relative">

        {/* Animated Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-[var(--accent)]/5 to-transparent opacity-50 pointer-events-none"></div>

        {/* Transparent Sticky Header */}
        <div className="sticky top-[72px] z-30 pt-12 pb-16 pointer-events-none">
          <div className="max-w-7xl mx-auto px-6 w-full text-center flex flex-col items-center relative z-20 pointer-events-auto">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4"
            >
              <Shield className="w-4 h-4" />
              Why Megatron?
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-4 leading-[1.1] text-[var(--text-primary)] drop-shadow-md"
            >
              Built different.<br />By design.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-[var(--text-secondary)] text-lg max-w-2xl leading-relaxed mx-auto"
            >
              We're not just another seller. Every detail is engineered for trust, speed, and your peace of mind.
            </motion.p>
          </div>
        </div>

        {/* Timeline starts naturally without extra margin since there's no black block to hide under */}
        <div className="max-w-7xl mx-auto px-6 w-full relative z-10 pt-10">

          {/* Branching Design (Timeline) */}
          <div className="relative">
            {/* Central Vertical Line */}
            <div className="absolute left-6 md:left-1/2 top-4 bottom-4 w-[2px] bg-gradient-to-b from-[var(--border-color)] via-[var(--border-color)] to-transparent md:-translate-x-1/2"></div>

            <div className="flex flex-col gap-12 sm:gap-16">
              {features.map((feature, index) => (
                <TimelineFeature key={feature.id} feature={feature} index={index} />
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ═══ FEATURED ACCOUNTS ═══ */}
      <section className="py-24 border-b border-[var(--border-color)] relative overflow-hidden">
        {/* Subtle mesh background for featured */}
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-primary)] via-[var(--bg-secondary)]/30 to-[var(--bg-primary)] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
          <div className="text-center mb-16 flex flex-col items-center">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-500 border border-blue-500/20 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6"
            >
              <Star className="w-4 h-4" />
              Marketplace
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black text-[var(--text-primary)] mb-6"
            >
              Featured Accounts
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayFeatured.map((product, i) => (
              <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <ProductCard product={product as any} />
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 flex justify-center"
          >
            <Link to="/products" className="group flex items-center gap-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-[var(--text-primary)] text-[var(--text-primary)] px-8 py-4 rounded-full font-bold text-sm uppercase tracking-widest transition-all shadow-sm hover:shadow-md">
              <span>View All Accounts</span>
              <div className="group-hover:translate-x-1 transition-transform">
                →
              </div>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ═══ SELL ACCOUNT SECTION ═══ */}
      <section className="py-24 border-b border-[var(--border-color)] relative overflow-hidden bg-[var(--bg-primary)]">
        {/* Subtle glowing elements */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-72 h-72 bg-[var(--accent)]/5 blur-[120px] pointer-events-none rounded-full" />
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-72 h-72 bg-blue-500/5 blur-[120px] pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">

            {/* Left Column: Visual description & Timeline steps */}
            <div className="lg:col-span-7 flex flex-col text-left">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6 w-fit"
              >
                <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
                Want to sell?
              </motion.div>

              <h2
                className="text-4xl sm:text-5xl lg:text-6xl font-black text-[var(--text-primary)] mb-6 uppercase tracking-tight leading-[1.1]"
                style={{ fontFamily: "'Venite Adoremus', sans-serif" }}
              >
                Turn Your Skins<br />Into Real Cash
              </h2>

              <p
                className="text-[var(--text-secondary)] text-lg mb-10 max-w-xl font-medium leading-relaxed"
              >
                Tired of your MLBB account? Hand it over to us! Megatron offers the most competitive valuations, quick evaluations, and instant payouts via secure middleman systems.
              </p>

              {/* Vertical steps */}
              <div className="space-y-6">
                {[
                  { step: "01", title: "Submit Account Specs", desc: "List your rare skins, current rank, and match statistics in your ticket." },
                  { step: "02", title: "Professional Evaluation", desc: "Our specialists inspect and offer a real-time market value quote." },
                  { step: "03", title: "Instant Payout", desc: "Receive your payment via eSewa, Khalti, IME Pay, or Bank transfer immediately." }
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex gap-4 items-start group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] group-hover:border-[var(--accent)] flex items-center justify-center shrink-0 font-bold text-sm text-[var(--text-secondary)] group-hover:text-[var(--accent)] transition-colors">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="font-bold text-base text-[var(--text-primary)] mb-1">{item.title}</h4>
                      <p className="text-sm text-[var(--text-secondary)] max-w-md font-medium leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right Column: Premium Interactive Form Preview Card */}
            <div className="lg:col-span-5">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[3rem] p-8 sm:p-10 shadow-2xl backdrop-blur-md relative overflow-hidden"
              >
                {/* Accent glow on card */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-[var(--accent)]/10 rounded-full blur-2xl pointer-events-none" />

                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-6 flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent)]" />
                  Request Valuation
                </h3>

                <div className="space-y-4 mb-8 text-left">
                  <div>
                    <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider block mb-2">Estimate Skins Count</label>
                    <div className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm text-[var(--text-secondary)] font-medium">
                      e.g., 200+ Skins (Collector, Lightborn)
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider block mb-2">Current Rank</label>
                    <div className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm text-[var(--text-secondary)] font-medium">
                      e.g., Mythic Glory
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider block mb-2">Your Target Price</label>
                    <div className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm text-[var(--text-secondary)] font-medium">
                      e.g., NPR 15,000 / USD 120
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleSellAccountTicket}
                  disabled={isCreatingTicket}
                  className="w-full group bg-[var(--text-primary)] text-[var(--bg-primary)] hover:bg-[var(--text-primary)]/90 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest inline-flex items-center justify-center gap-3 shadow-lg transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  <span>{isCreatingTicket ? "Connecting to Bot..." : "Create Selling Ticket"}</span>
                  <div className="w-7 h-7 rounded-full bg-[var(--bg-primary)] text-[var(--text-primary)] flex items-center justify-center group-hover:translate-x-1 transition-transform">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                  </div>
                </button>

                <p className="text-[var(--text-secondary)] text-[10px] font-bold tracking-wide text-center mt-4 uppercase">
                  ⚡ Powered by Megatron Bot • Secure Escrow
                </p>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* ═══ DISCORD COMMUNITY SECTION ═══ */}
      <section className="py-24 relative overflow-hidden bg-[var(--bg-primary)] border-b border-[var(--border-color)]">
        {/* Glowing background circles */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-[#5865F2]/5 blur-[160px] pointer-events-none rounded-full" />
        <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[250px] bg-red-500/3 blur-[120px] pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-6 w-full relative z-10 text-center">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 flex flex-col items-center"
          >
            <div className="inline-flex items-center gap-2 bg-[#5865F2]/10 text-[#5865F2] border border-[#5865F2]/20 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
              <span className="w-2 h-2 rounded-full bg-[#5865F2] animate-pulse" />
              Community Hub
            </div>
            <h2
              className="text-4xl sm:text-5xl lg:text-6xl font-black text-[var(--text-primary)] mb-6 uppercase tracking-tight leading-[1.1]"
              style={{ fontFamily: "'Venite Adoremus', sans-serif" }}
            >
              Enter The <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5865F2] to-blue-400">Megatron Corps</span>
            </h2>
            <p className="text-[var(--text-secondary)] text-lg max-w-2xl font-medium leading-relaxed">
              Connect with thousands of Mobile Legends players. Trade under secure middleman escrow, get live stock alerts, and win exclusive giveaways.
            </p>
          </motion.div>

          {/* Three-Column Bento Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">

            {/* Card 1: The Community Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-[var(--bg-secondary)]/40 border border-[var(--border-color)] hover:border-[#5865F2]/30 rounded-[2.5rem] p-8 md:p-10 flex flex-col justify-between text-left relative overflow-hidden group transition-all duration-300 shadow-xl backdrop-blur-md"
            >
              {/* Giant Discord Watermark Logo */}
              <div className="absolute -bottom-10 -right-10 text-[#5865F2]/5 group-hover:text-[#5865F2]/8 group-hover:-translate-y-3 transition-all duration-500 pointer-events-none">
                <svg width="240" height="240" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
              </div>

              <div>
                <span className="text-[10px] font-bold tracking-widest text-[#5865F2] uppercase bg-[#5865F2]/10 border border-[#5865F2]/20 px-3.5 py-1 rounded-full mb-6 inline-block">The Guild</span>
                <h3 className="text-2xl font-black text-[var(--text-primary)] mb-6 leading-tight uppercase" style={{ fontFamily: "'Venite Adoremus', sans-serif" }}>
                  Join the<br />Corps
                </h3>
                <div className="space-y-6 relative z-10">
                  <div>
                    <span className="block text-4xl font-black text-white leading-none">
                      {discordStats.totalMembers.toLocaleString()}
                    </span>
                    <span className="text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-wider mt-1 block">Registered Members</span>
                  </div>
                  <div>
                    <span className="block text-4xl font-black text-[#10b981] leading-none flex items-center gap-2">
                      {discordStats.onlineMembers.toLocaleString()}
                      <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] animate-ping" />
                    </span>
                    <span className="text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-wider mt-1 block">Online Gamers</span>
                  </div>
                  <div>
                    <span className="block text-4xl font-black text-amber-500 leading-none">
                      {reviews.length.toLocaleString()}
                    </span>
                    <span className="text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-wider mt-1 block">Verified Vouches</span>
                  </div>
                </div>
              </div>

              <a
                href="https://discord.gg/fKXBF3QyzB"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative w-full bg-[#5865F2] hover:bg-[#4752C4] text-white py-4 rounded-2xl font-bold text-xs uppercase tracking-widest inline-flex items-center justify-center gap-3 shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] mt-8 overflow-hidden z-10"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-glare pointer-events-none" />
                <span>Invite Link</span>
                <div className="w-7 h-7 rounded-full bg-white/20 text-white flex items-center justify-center group-hover:rotate-12 transition-transform">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
                  </svg>
                </div>
              </a>
            </motion.div>

            {/* Card 2: Features List */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-[var(--bg-secondary)]/40 border border-[var(--border-color)] hover:border-red-500/20 rounded-[2.5rem] p-8 md:p-10 flex flex-col justify-between text-left relative overflow-hidden transition-all duration-300 shadow-xl backdrop-blur-md"
            >
              <div>
                <span className="text-[10px] font-bold tracking-widest text-red-500 uppercase bg-red-500/10 border border-red-500/20 px-3.5 py-1 rounded-full mb-6 inline-block">The Perks</span>
                <h3 className="text-2xl font-black text-[var(--text-primary)] mb-6 leading-tight uppercase" style={{ fontFamily: "'Venite Adoremus', sans-serif" }}>
                  Exclusive<br />Benefits
                </h3>
                <div className="space-y-4">
                  {[
                    {
                      label: "Verified Escrow",
                      val: "Trade safely via certified server middlemen.",
                      icon: (
                        <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      ),
                      tag: "SECURE"
                    },
                    {
                      label: "Flash Restocks",
                      val: "Instant ping alerts on new account drops.",
                      icon: (
                        <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      ),
                      tag: "FAST"
                    },
                    {
                      label: "Account Valuations",
                      val: "Get free worth appraisals on your MLBB accounts.",
                      icon: (
                        <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ),
                      tag: "FREE"
                    },
                    {
                      label: "24/7 Live Support",
                      val: "Open support tickets directly in the guild.",
                      icon: (
                        <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.58 9 8z" />
                        </svg>
                      ),
                      tag: "ONLINE"
                    }
                  ].map((item, idx) => (
                    <div key={idx} className="flex gap-4 items-start p-3.5 rounded-2xl bg-[var(--bg-primary)]/40 border border-[var(--border-color)] hover:border-[var(--text-secondary)]/30 transition-all duration-300 group">
                      <div className="w-10 h-10 rounded-xl bg-[var(--bg-secondary)] flex items-center justify-center shrink-0 border border-[var(--border-color)] group-hover:scale-110 transition-transform duration-300 shadow-md">
                        {item.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2 mb-0.5">
                          <span className="text-xs font-bold text-[var(--text-primary)]">{item.label}</span>
                          <span className="text-[8px] font-black tracking-widest text-[var(--text-secondary)] uppercase bg-[var(--bg-primary)] border border-[var(--border-color)] px-2 py-0.5 rounded-md">{item.tag}</span>
                        </div>
                        <span className="text-[11px] text-[var(--text-secondary)] font-medium leading-relaxed block">{item.val}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Card 3: The Live Widget */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex flex-col items-center justify-center p-0 min-h-[400px]"
            >
              <iframe
                src="https://discord.com/widget?id=1486062330466013409&theme=dark"
                width="350"
                height="500"
                allowTransparency={true}
                frameBorder="0"
                sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
                className="rounded-[2rem] border border-[var(--border-color)] shadow-inner max-w-full"
              >
              </iframe>
            </motion.div>

          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 relative overflow-hidden bg-[var(--bg-primary)] border-t border-[var(--border-color)]">
        {/* Subtle Background Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[var(--accent)]/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-red-500/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <span className="text-[10px] font-bold tracking-widest text-[var(--accent)] uppercase bg-[var(--accent)]/10 border border-[var(--accent)]/20 px-3.5 py-1 rounded-full mb-6 inline-block">
            Support Center
          </span>
          <h2 
            className="text-4xl md:text-5xl font-black text-[var(--text-primary)] mb-4 tracking-tight uppercase"
            style={{ fontFamily: "'Venite Adoremus', sans-serif" }}
          >
            Frequently Asked<br />Questions
          </h2>
          <p className="text-xs md:text-sm text-[var(--text-secondary)] font-medium max-w-lg mx-auto mb-16 uppercase tracking-wider">
            Got questions? We've got answers. Explore our comprehensive FAQ or contact support.
          </p>

          {/* Accordion List */}
          <div className="space-y-4 text-left">
            {[
              {
                q: "How do I purchase a Mobile Legends account?",
                category: "BUYING",
                a: "Browse our marketplace, select your desired account, and click 'Buy Now'. You can complete your payment via eSewa, Khalti, or other options, after which a secure delivery ticket is opened automatically."
              },
              {
                q: "What happens after my payment is successfully verified?",
                category: "DELIVERY",
                a: "Our automated system creates a private ticket channel on our official Discord server. Our staff will immediately guide you through securing and transferring the account credentials to you."
              },
              {
                q: "Can I sell or trade-in my own MLBB account here?",
                category: "SELLING",
                a: "Yes! Use the 'Sell Account' CTA on our homepage. This connects to our Discord bot to spin up a private ticket where our appraisers will verify your account skins, level, and offer a competitive payout."
              },
              {
                q: "What safety measures do you take against account recovery?",
                category: "SECURITY",
                a: "We implement a strict vetting process for all sellers, check original creation details, and require complete account binding transfers. We stand behind our sales with reliable buyer protection guidelines."
              },
              {
                q: "Which localized payment gateways are supported?",
                category: "PAYMENTS",
                a: "We support a range of secure payment options, including eSewa, Khalti, IME Pay, and select credit/debit options. Contact support in the Discord server if you require alternative methods."
              },
              {
                q: "How does the Megatron Escrow service work?",
                category: "ESCROW",
                a: "Our verified server middlemen secure the seller's account credentials and hold the buyer's payment. Once the buyer completes securing the account, we release the funds to the seller, preventing any fraud."
              }
            ]
              .slice(0, showAllFaqs ? 6 : 3)
              .map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <motion.div
                    key={idx}
                    layout="position"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3 }}
                    className="bg-[var(--bg-secondary)]/30 border border-[var(--border-color)] hover:border-[var(--text-secondary)]/20 rounded-[2rem] transition-all duration-300 overflow-hidden shadow-md"
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full flex items-center justify-between gap-4 p-6 md:p-8 text-left focus:outline-none"
                    >
                      <div className="flex flex-col gap-2">
                        <span className="text-[9px] font-black tracking-widest text-[var(--text-secondary)] uppercase bg-[var(--bg-primary)] border border-[var(--border-color)] px-2.5 py-0.5 rounded-md w-fit">
                          {faq.category}
                        </span>
                        <span className="text-sm md:text-base font-bold text-[var(--text-primary)]">
                          {faq.q}
                        </span>
                      </div>
                      <div className={`w-8 h-8 rounded-full bg-[var(--bg-primary)] border border-[var(--border-color)] flex items-center justify-center shrink-0 transition-transform duration-500 ${isOpen ? 'rotate-180 text-red-500 border-red-500/20' : 'text-[var(--text-secondary)]'}`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                        </svg>
                      </div>
                    </button>

                    {/* Expandable answer panel */}
                    <motion.div
                      initial={false}
                      animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 md:px-8 md:pb-8 pt-1 text-xs md:text-sm text-[var(--text-secondary)] font-medium leading-relaxed border-t border-[var(--border-color)] bg-[var(--bg-primary)]/10">
                        {faq.a}
                      </div>
                    </motion.div>
                  </motion.div>
                );
              })}
          </div>

          {/* Show More / Collapse Button */}
          <div className="mt-12 flex justify-center">
            <button
              onClick={() => {
                setShowAllFaqs(!showAllFaqs);
                setOpenFaq(null);
              }}
              className="group relative px-8 py-3 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-[var(--text-secondary)]/30 text-xs font-bold uppercase tracking-widest text-[var(--text-primary)] inline-flex items-center gap-2 transition-all duration-300 hover:scale-105 active:scale-95 shadow-md"
            >
              <span>{showAllFaqs ? "Collapse FAQs" : "Show More FAQs"}</span>
              <svg 
                className={`w-3 h-3 transition-transform duration-300 ${showAllFaqs ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2.5" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}

// Scroll-to-top behavior: show button when scrolled down
// (Placed after component to avoid interfering with SSR)
const useScrollToTop = () => {
  useEffect(() => {
    function onScroll() {
      setTimeout(() => { }, 0); // noop to ensure effect hook captured
    }
  }, []);
};

function TimelineFeature({ feature, index }: { feature: any, index: number }) {
  const ref = useRef<HTMLDivElement>(null);

  // Track this element's position in the viewport
  const { scrollYProgress } = useScroll({
    target: ref,
    // Start fading when the top of the element hits 300px from the top of the viewport
    // Fully faded out when it hits 150px from the top
    offset: ["start 300px", "start 150px"]
  });

  // Map scroll progress to opacity (1 down to 0)
  const opacityFade = useTransform(scrollYProgress, [0, 1], [1, 0]);

  const isEven = index % 2 === 0;

  return (
    <motion.div
      ref={ref}
      style={{ opacity: opacityFade }}
      className={`relative flex flex-col md:flex-row items-center w-full group ${isEven ? 'md:flex-row-reverse' : ''}`}
    >
      {/* Node on Line */}
      <div className="absolute left-6 md:left-1/2 w-10 h-10 rounded-full bg-[var(--bg-primary)] border-4 border-[var(--border-color)] group-hover:border-[var(--accent)] shadow-lg -translate-x-1/2 flex items-center justify-center z-10 text-[var(--text-secondary)] group-hover:text-[var(--accent)] transition-all duration-300">
        <span className="font-bold text-sm">{index + 1}</span>
      </div>

      {/* Content Box (Removed md:w-full to fix overlapping numbers!) */}
      <div className={`ml-16 md:ml-0 md:w-1/2 ${isEven ? 'md:pl-16' : 'md:pr-16'} w-[calc(100%-4rem)] flex ${isEven ? 'justify-start' : 'justify-end'}`}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="bg-[var(--bg-secondary)] border border-[var(--border-color)] p-8 rounded-[2rem] shadow-sm hover:shadow-2xl hover:border-[var(--text-secondary)] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden w-full max-w-lg text-left"
        >
          {/* Smaller Background Number to prevent overlap */}
          <div className="absolute top-4 right-6 text-[var(--border-color)] font-black text-6xl opacity-20 pointer-events-none group-hover:text-[var(--accent)] group-hover:-translate-y-2 group-hover:opacity-10 transition-all duration-500 origin-top-right">
            {feature.id}
          </div>

          <div className="relative z-10 pr-12">
            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3 flex items-center gap-3">
              {feature.title}
            </h3>

            <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
              {feature.desc}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Empty Space for the other side */}
      <div className="hidden md:block md:w-1/2"></div>
    </motion.div>
  );
}