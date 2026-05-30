import { motion } from "motion/react";
import { HelpCircle, ChevronRight } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Link } from "react-router";

export function FAQ() {
  const faqs = [
    {
      q: "How does account delivery work?",
      a: "Once your payment is verified, the login credentials for your new MLBB account will be delivered instantly via our automated system to your email. You can also track and view your account login details directly in the 'Orders' page on our website when logged in with Discord."
    },
    {
      q: "What does the Lifetime Warranty cover?",
      a: "Our Lifetime Warranty guarantees that the account you purchase is yours forever. If the account becomes inaccessible due to recovery issues or Moonton errors, we will replace the account with an equivalent one or issue store credits. Note: This warranty is voided if the buyer violates terms, resells the account, or incurs bans due to hacking/third-party software."
    },
    {
      q: "Which payment methods do you accept?",
      a: "We support a wide variety of localized and global payment options, including eSewa, Khalti, IME Pay, and direct Bank Transfers. All transactions are securely processed and verified."
    },
    {
      q: "Are these Mobile Legends accounts safe to play on?",
      a: "Yes, 100%. Every single account listed on Megatron undergoes rigorous manual checks. We secure the accounts, clean them of any social links, and verify the Moonton login before they go live on our marketplace."
    },
    {
      q: "Can I change the email and password after purchasing?",
      a: "Absolutely. Once you receive the login details, you will have complete ownership of the account. You can bind your own email address, change the Moonton password, and link your Google, Facebook, or Apple accounts to secure it fully."
    },
    {
      q: "How do I contact support if I have an issue?",
      a: "We provide 24/7 human support. The fastest way to get help is to join our official Discord server and open a support ticket under the ticket category. Our average response time is under 5 minutes."
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
            <HelpCircle className="w-4 h-4" />
            Support Hub
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-black text-white mb-6 uppercase tracking-tight"
            style={{ fontFamily: "'Venite Adoremus', sans-serif" }}
          >
            Frequently Asked Questions
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-[var(--text-secondary)] text-lg max-w-xl mx-auto font-medium"
          >
            Everything you need to know about buying, payment verification, and our lifetime warranty.
          </motion.p>
        </div>

        {/* FAQ Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[2.5rem] p-6 sm:p-10 shadow-xl backdrop-blur-md"
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-b border-[var(--border-color)] py-2 last:border-0">
                <AccordionTrigger className="text-base sm:text-lg font-bold text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors py-4 no-underline hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-[var(--text-secondary)] text-sm leading-relaxed pb-4 pt-1 font-medium">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>

        {/* CTA Support */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-secondary)]/50 border border-[var(--border-color)] p-8 rounded-[2rem] text-center flex flex-col items-center shadow-lg"
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
