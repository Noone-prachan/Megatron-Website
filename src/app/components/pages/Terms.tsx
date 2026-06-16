import { motion } from "motion/react";
import { FileText } from "lucide-react";

export function Terms() {
  const sections = [
    {
      title: "1. Agreement to Terms",
      content: "By accessing and using Megatron, you agree to comply with and be bound by these Terms & Conditions. If you disagree with any part of these terms, you must immediately cease using the website and its related services."
    },
    {
      title: "2. User Registration & Discord Authentication",
      content: "To utilize certain features, such as tracking orders, opening tickets, or verifying payments, you must authenticate through Discord OAuth2. You are responsible for maintaining the security of your Discord account and for all actions associated with your credentials on our platform."
    },
    {
      title: "3. Purchase & Payment Processing",
      content: "All purchases of MLBB accounts are final. You agree to provide accurate billing and contact information and authorize our staff to securely process your transactions via Discord tickets. Megatron reserves the right to decline or cancel orders if fraud or pricing errors are suspected."
    },
    {
      title: "4. Account Access & Security",
      content: "Upon completing a transaction, ownership and access details for the purchased MLBB account will be transferred. It is the buyer's absolute responsibility to immediately change login details (including Moonton passwords and linked emails). Megatron is not liable for unauthorized access occurring post-transfer."
    },
    {
      title: "5. Intellectual Property Rights",
      content: "Megatron, its logo, graphics, text layout, and custom styling are proprietary property. Mobile Legends: Bang Bang (MLBB), assets, and logos are registered trademarks of Moonton Games. Megatron is not affiliated with or endorsed by Moonton Games."
    },
    {
      title: "6. Limitation of Liability",
      content: "To the maximum extent permitted by law, Megatron and its staff shall not be liable for any indirect, incidental, special, or consequential damages resulting from the use or inability to use our website, marketplace accounts, or services."
    },
    {
      title: "7. Termination of Use",
      content: "We reserve the right to suspend or terminate your access to the platform and void any warranties if you are found attempting to exploit, spam, hack, or reverse-engineer the system, or engage in suspicious or fraudulent activities."
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
            <FileText className="w-4 h-4" />
            Legal Center
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500 mb-6 uppercase tracking-tight drop-shadow-sm"
            style={{ fontFamily: "'Venite Adoremus', sans-serif" }}
          >
            Terms & Conditions
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-[var(--text-secondary)] text-sm max-w-xl mx-auto font-medium"
          >
            Last Updated: May 30, 2026. Please review our Terms of Service before using our marketplace or making payments.
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
