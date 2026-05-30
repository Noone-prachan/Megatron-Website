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
      content: "Megatron does not sell, lease, or distribute your personal information. We may share essential data with trusted third-party service providers (like payment processors: eSewa, Khalti, IME Pay) solely to complete transactions, or as required under applicable laws."
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
            <Shield className="w-4 h-4" />
            Legal Center
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-black text-white mb-6 uppercase tracking-tight"
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

        {/* Content Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[2.5rem] p-8 sm:p-12 shadow-xl backdrop-blur-md space-y-8 text-left"
        >
          {sections.map((section) => (
            <div key={section.title} className="border-b border-[var(--border-color)] pb-6 last:border-0 last:pb-0">
              <h2 className="text-xl font-bold text-[var(--text-primary)] mb-3">{section.title}</h2>
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
