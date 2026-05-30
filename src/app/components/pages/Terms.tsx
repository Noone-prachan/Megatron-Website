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
      content: "All purchases of MLBB accounts are final. You agree to provide accurate billing and contact information and authorize third-party payment gateways (eSewa, Khalti, IME Pay) to process transactions. Megatron reserves the right to decline or cancel orders if fraud or pricing errors are suspected."
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
            <FileText className="w-4 h-4" />
            Legal Center
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-black text-white mb-6 uppercase tracking-tight"
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
