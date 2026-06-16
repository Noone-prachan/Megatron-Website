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
      content: "The Lifetime Warranty and eligibility for replacements are immediately voided under the following circumstances:",
      subPoints: [
        "If you resell, share, or transfer the account credentials to any third party.",
        "If you modify, add, or alter secure social links (email, Facebook, TikTok) in a way that triggers Moonton security locks.",
        "If the account incurs bans or restrictions due to use of hacks, third-party software, scripts, toxic behavior, or plug-ins post-purchase."
      ]
    },
    {
      title: "4. Claim Verification Process",
      content: "To initiate a warranty or replacement claim:",
      subPoints: [
        "Join our Discord server.",
        "Open a Support Ticket.",
        "Provide your order details and proof of transaction (eSewa, Khalti, IME Pay, or Bank receipt).",
        "Cooperate with our support agents by providing necessary screenshots or video proof. Our team will review and verify your claim within 12-24 hours."
      ]
    }
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-24 relative overflow-clip bg-[var(--bg-primary)]">
      {/* Background gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[50rem] bg-gradient-to-b from-[var(--accent)]/10 via-[var(--accent)]/5 to-transparent pointer-events-none blur-3xl opacity-50 z-0" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-[var(--accent)]/20 rounded-full blur-[100px] pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">

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
            className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500 mb-6 uppercase tracking-tight drop-shadow-sm"
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

        <div className="flex flex-col lg:flex-row gap-12 items-start">
          {/* Sidebar TOC */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:w-1/3 shrink-0 lg:sticky lg:top-32 w-full bg-[var(--bg-secondary)]/50 backdrop-blur-xl border border-[var(--border-color)] rounded-3xl p-6"
          >
            <h3 className="text-sm font-black text-[var(--text-secondary)] uppercase tracking-wider mb-6 pl-2">Table of Contents</h3>
            <nav className="flex flex-col gap-2">
              {sections.map((section, index) => {
                const sectionId = `section-${index}`;
                return (
                  <button
                    key={index}
                    onClick={() => scrollToSection(sectionId)}
                    className="text-left px-4 py-3 rounded-xl text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--accent)] hover:bg-[var(--accent)]/10 transition-all border border-transparent hover:border-[var(--accent)]/20"
                  >
                    {section.title}
                  </button>
                );
              })}
            </nav>
          </motion.div>

          {/* Content Area */}
          <div className="lg:w-2/3 flex flex-col gap-6">
            {sections.map((section, index) => {
              const sectionId = `section-${index}`;
              return (
                <motion.div
                  key={index}
                  id={sectionId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-3xl p-8 shadow-sm hover:shadow-xl hover:border-[var(--accent)]/30 transition-all duration-500 group"
                >
                  <h2 className="text-2xl font-black text-[var(--text-primary)] mb-4 group-hover:text-[var(--accent)] transition-colors">{section.title}</h2>
                  <p className="text-[var(--text-secondary)] text-base leading-relaxed font-medium">
                    {section.content}
                  </p>
                  {(section as any).subPoints && (
                    <ul className="mt-4 space-y-3">
                      {(section as any).subPoints.map((point: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-3 text-[var(--text-secondary)] font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] mt-2.5 shrink-0 shadow-[0_0_8px_var(--accent)]" />
                          <span className="leading-relaxed">{point}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
