import { motion } from "motion/react";
import { Shield } from "lucide-react";

export function Privacy() {
  const sections = [
    {
      title: "1. Introduction",
      content: "Welcome to Megatron. We value your privacy and are committed to protecting your personal data. This Privacy Policy details how we collect, use, and safeguard your information when you browse our website and use our MLBB marketplace services."
    },
    {
      title: "2. Information We Collect",
      content: "We collect direct and indirect information, including: personal identifier data such as Discord ID, username, email address, avatar hash, and transaction records. We also collect automated usage data like IP addresses, browser info, cookies, and page analytics to improve website operations."
    },
    {
      title: "3. How We Use Your Information",
      content: "Your information is processed to provide core marketplace functionality: verifying payments, generating automated Discord purchase tickets, authentication via Discord OAuth, managing orders, detecting and preventing fraud, and offering customer support."
    },
    {
      title: "4. Information Sharing and Disclosure",
      content: "Megatron does not sell, lease, or distribute your personal information. We may share essential data with trusted third-party service providers solely to complete transactions, or as required under applicable laws."
    },
    {
      title: "5. Security of Your Data",
      content: "We implement robust security measures including SSL encryption, token-based session management, and restricted access protocols to secure data transmission and prevent unauthorized access, alteration, or disclosure."
    },
    {
      title: "6. Your Rights & Choices",
      content: "Depending on your location, you have rights to access, update, export, or delete the personal data we hold. You can unlink your Discord authorization anytime or request full account deletion by opening a ticket on our Discord server."
    },
    {
      title: "7. Policy Updates",
      content: "We reserve the right to modify this Privacy Policy at any time. Any changes will be posted here with an updated revision date. We encourage users to check this page periodically for updates."
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
            <Shield className="w-4 h-4" />
            Legal Center
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500 mb-6 uppercase tracking-tight drop-shadow-sm"
            style={{ fontFamily: "'Venite Adoremus', sans-serif" }}
          >
            Privacy Policy
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-[var(--text-secondary)] text-sm max-w-xl mx-auto font-medium"
          >
            Last Updated: May 30, 2026. Please read this policy carefully to understand how we protect your personal data.
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
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
