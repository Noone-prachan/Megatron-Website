import { motion } from "motion/react";
import { RefreshCw } from "lucide-react";

export function Refund() {
  const sections = [
    {
      title: "1. Refund Finality & Digital Goods",
      content: "Due to the digital nature of the products sold on Megatron (Mobile Legends game account credentials), all sales are strictly final. Once account details have been successfully delivered and transferred, we cannot accept returns or process refunds for change-of-mind purchases."
    },
    {
      title: "2. Replacement Policy & Warranty",
      content: "If you receive an account that is not functioning, does not match the specifications listed in the marketplace, or experiences recovery issues that are verified to be Moonton/server-side errors, you are fully covered under our Lifetime Warranty. We will issue a replacement account of equal value or provide store credit. Replacement claims are handled exclusively through Discord support tickets."
    },
    {
      title: "3. Voiding the Warranty",
      content: "The Lifetime Warranty and eligibility for replacements are immediately voided under the following circumstances: (a) If you resell, share, or transfer the account credentials to any third party; (b) If you modify, add, or alter secure social links (email, Facebook, TikTok) in a way that triggers Moonton security locks; (c) If the account incurs bans or restrictions due to use of hacks, third-party software, scripts, toxic behavior, or plug-ins post-purchase."
    },
    {
      title: "4. Claim Verification Process",
      content: "To initiate a warranty or replacement claim: (1) Join our Discord server; (2) Open a Support Ticket; (3) Provide your order details and proof of transaction (eSewa, Khalti, IME Pay, or Bank receipt); (4) Cooperate with our support agents by providing necessary screenshots or video proof. Our team will review and verify your claim within 12-24 hours."
    }
  ];

  return (
    <div className="min-h-screen pt-32 pb-24 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[400px] bg-[var(--accent)]/5 blur-[120px] pointer-events-none rounded-full"></div>

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6"
          >
            <RefreshCw className="w-4 h-4" />
            Legal Center
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-black text-white mb-6 uppercase tracking-tight"
            style={{ fontFamily: "'Venite Adoremus', sans-serif" }}
          >
            Refund Policy
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-[var(--text-secondary)] text-sm max-w-xl mx-auto font-medium"
          >
            Last Updated: May 30, 2026. Please understand our terms regarding refunds, store credits, and replacements.
          </motion.p>
        </div>

        {/* Content Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[2.5rem] p-8 sm:p-12 shadow-xl backdrop-blur-md space-y-8 text-left"
        >
          {sections.map((section, idx) => (
            <div key={idx} className="border-b border-[var(--border-color)] pb-6 last:border-0 last:pb-0">
              <h2 className="text-xl font-bold text-white mb-3">{section.title}</h2>
              <p className="text-[var(--text-secondary)] text-sm leading-relaxed font-medium">
                {section.content}
              </p>
            </div>
          ))}
        </motion.div>

      </div>
    </div>
  );
}
