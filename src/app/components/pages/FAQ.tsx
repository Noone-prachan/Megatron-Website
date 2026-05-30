import { motion, AnimatePresence } from "motion/react";
import { HelpCircle, ChevronRight } from "lucide-react";
import { useState } from "react";

export function FAQ() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: "How does account delivery work?",
      category: "DELIVERY",
      a: "Once your payment is verified, the login credentials for your new MLBB account will be delivered instantly via our automated system to your email. You can also track and view your account login details directly in the 'Orders' page on our website when logged in with Discord."
    },
    {
      q: "What does the Lifetime Warranty cover?",
      category: "WARRANTY",
      a: "Our Lifetime Warranty guarantees that the account you purchase is yours forever. If the account becomes inaccessible due to recovery issues or Moonton errors, we will replace the account with an equivalent one or issue store credits. Note: This warranty is voided if the buyer violates terms, resells the account, or incurs bans due to hacking/third-party software."
    },
    {
      q: "Which payment methods do you accept?",
      category: "PAYMENTS",
      a: "We support a wide variety of localized and global payment options, including eSewa, Khalti, IME Pay, and direct Bank Transfers. All transactions are securely processed and verified."
    },
    {
      q: "Are these Mobile Legends accounts safe to play on?",
      category: "SECURITY",
      a: "Yes, 100%. Every single account listed on Megatron undergoes rigorous manual checks. We secure the accounts, clean them of any social links, and verify the Moonton login before they go live on our marketplace."
    },
    {
      q: "Can I change the email and password after purchasing?",
      category: "OWNERSHIP",
      a: "Absolutely. Once you receive the login details, you will have complete ownership of the account. You can bind your own email address, change the Moonton password, and link your Google, Facebook, or Apple accounts to secure it fully."
    },
    {
      q: "How do I contact support if I have an issue?",
      category: "SUPPORT",
      a: "We provide 24/7 human support. The fastest way to get help is to join our official Discord server and open a support ticket under the ticket category. Our average response time is under 5 minutes."
    }
  ];

  return (
    <div className="min-h-screen pt-32 pb-24 relative overflow-hidden bg-[var(--bg-primary)]">
      {/* Subtle background glow */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[400px] bg-[var(--accent)]/5 blur-[120px] pointer-events-none rounded-full"></div>
      <div className="absolute bottom-1/4 right-10 w-[300px] h-[300px] bg-red-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div 
          layout
          transition={{ type: "spring", stiffness: 220, damping: 26 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start"
        >
          
          {/* Left Column: FAQ Header & Active Card */}
          <motion.div
            layout
            transition={{ type: "spring", stiffness: 220, damping: 26 }}
            className="lg:col-span-5 text-left flex flex-col justify-start"
          >
            <motion.div layout className="mb-4">
              <span className="inline-flex items-center gap-2 bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">
                <HelpCircle className="w-4 h-4" />
                Support Hub
              </span>
            </motion.div>
            
            <motion.h1
              layout="position"
              className={`font-black text-white mb-6 uppercase tracking-tight transition-all duration-500 ${
                openFaq !== null 
                  ? "text-2xl md:text-3xl lg:text-4xl" 
                  : "text-4xl md:text-5xl lg:text-6xl"
              }`}
              style={{ fontFamily: "'Venite Adoremus', sans-serif", lineHeight: "1.1" }}
            >
              Frequently Asked<br />Questions
            </motion.h1>
            
            <motion.p
              layout="position"
              className={`text-[var(--text-secondary)] font-medium max-w-sm transition-all duration-500 ${
                openFaq !== null ? "text-xs opacity-60" : "text-lg"
              }`}
            >
              Everything you need to know about buying, payment verification, and our lifetime warranty.
            </motion.p>

            {/* Active opened card container under FAQ Header */}
            <div className="relative">
              <AnimatePresence>
                {openFaq !== null && (
                  <motion.div
                    layoutId={`faq-item-page-${openFaq}`}
                    className="mt-8 bg-[var(--bg-secondary)]/50 border border-[var(--accent)]/30 rounded-[2.5rem] p-6 lg:p-8 text-left shadow-2xl border-l-4 border-l-[var(--accent)] relative overflow-hidden"
                    transition={{ type: "spring", stiffness: 220, damping: 26 }}
                  >
                    <div className="flex items-center justify-between gap-4 mb-4">
                      <span className="text-[10px] font-black tracking-widest text-[var(--accent)] uppercase bg-[var(--accent)]/10 border border-[var(--accent)]/20 px-2.5 py-0.5 rounded-md w-fit">
                        {faqs[openFaq].category}
                      </span>
                      <button
                        onClick={() => setOpenFaq(null)}
                        className="w-7 h-7 rounded-full bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-red-500 hover:border-red-500/20 flex items-center justify-center transition-all duration-300 active:scale-95 shadow-md"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <h3 className="text-base font-bold text-white mb-4 leading-snug">
                      {faqs[openFaq].q}
                    </h3>
                    <p className="text-xs md:text-sm text-[var(--text-secondary)] font-medium leading-relaxed">
                      {faqs[openFaq].a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Right Column: FAQ List */}
          <motion.div
            layout
            transition={{ type: "spring", stiffness: 220, damping: 26 }}
            className="lg:col-span-7 space-y-0"
          >
            <div className="border-t border-[var(--border-color)]">
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;

                // Hide opened item in the list on the right, other items slide up
                if (isOpen) return null;

                return (
                  <motion.div
                    key={idx}
                    layoutId={`faq-item-page-${idx}`}
                    transition={{ type: "spring", stiffness: 220, damping: 26 }}
                    className="border-b border-[var(--border-color)] hover:bg-[var(--bg-secondary)]/5 hover:pl-2 transition-all duration-300"
                  >
                    <button
                      onClick={() => setOpenFaq(idx)}
                      className="w-full flex items-center justify-between gap-6 py-6 text-left focus:outline-none"
                    >
                      <div className="flex flex-col gap-1.5 md:flex-row md:items-center md:gap-4">
                        <span className="text-[9px] font-black tracking-widest uppercase text-[var(--text-secondary)] shrink-0">
                          {faq.category}
                        </span>
                        <span className="text-sm md:text-base font-bold text-[var(--text-primary)]/80 hover:text-[var(--text-primary)] transition-colors">
                          {faq.q}
                        </span>
                      </div>
                      <div className="w-6 h-6 flex items-center justify-center shrink-0 text-[var(--text-secondary)] transition-all">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                      </div>
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

        </motion.div>

        {/* CTA Support */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24 bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-secondary)]/50 border border-[var(--border-color)] p-8 rounded-[2rem] text-center flex flex-col items-center shadow-lg"
        >
          <h3 className="text-xl font-bold text-white mb-3">Still have questions?</h3>
          <p className="text-[var(--text-secondary)] text-sm mb-6 max-w-md font-medium">
            Our support agents are online 24/7 on Discord to help you with purchases, custom queries, or accounts.
          </p>
          <a
            href="https://discord.gg/fKXBF3QyzB"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 bg-[var(--text-primary)] text-[var(--bg-primary)] px-6 py-3.5 rounded-full font-bold text-xs uppercase tracking-widest transition-all hover:scale-105 hover:shadow-lg"
          >
            <span>Open Support Ticket</span>
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </a>
        </motion.div>

      </div>
    </div>
  );
}
