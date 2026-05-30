import { motion } from "motion/react";

const teamMembers = [
  {
    id: "1",
    name: "Admin",
    role: "Founder & CEO",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&auto=format&fit=crop",
    bio: "Leading Megatron with 5+ years of MLBB trading expertise and a passion for building trust in digital marketplaces.",
    discord: "admin#0001",
    accent: "from-violet-500 to-indigo-500",
    accentLight: "violet",
    since: "2021",
    trades: "1,200+",
  },
  {
    id: "2",
    name: "Sarah Chen",
    role: "Account Specialist",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&auto=format&fit=crop",
    bio: "Expert in account verification, quality assurance, and ensuring every listed account meets Megatron's premium standard.",
    discord: "sarah#0002",
    accent: "from-pink-500 to-rose-500",
    accentLight: "pink",
    since: "2022",
    trades: "800+",
  },
  {
    id: "3",
    name: "Mike Johnson",
    role: "Customer Support",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&fit=crop",
    bio: "Available 24/7 on Discord to help buyers and sellers navigate every step of the purchase process seamlessly.",
    discord: "mike#0003",
    accent: "from-blue-500 to-cyan-500",
    accentLight: "blue",
    since: "2022",
    trades: "600+",
  },
  {
    id: "4",
    name: "Aisha Patel",
    role: "Payment Coordinator",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&auto=format&fit=crop",
    bio: "Handles all secure payment processing including eSewa, Khalti, IME Pay, and Bank transfers with zero failed transactions.",
    discord: "aisha#0004",
    accent: "from-emerald-500 to-teal-500",
    accentLight: "emerald",
    since: "2023",
    trades: "400+",
  },
];

export function Team() {
  return (
    <div className="min-h-screen pt-28 pb-24 relative overflow-hidden">
      {/* Ambient glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-violet-600/6 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* ── Hero Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-20"
        >
          <span className="inline-flex items-center gap-2 bg-violet-500/10 text-violet-400 border border-violet-500/20 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            The Crew
          </span>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-6 leading-[1]">
            <span className="text-white">Meet the </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400">Team.</span>
          </h1>
          <p className="text-[var(--text-secondary)] max-w-xl mx-auto text-lg font-medium leading-relaxed">
            The people behind every smooth trade, instant payout, and 5-star experience on Megatron.
          </p>
        </motion.div>

        {/* ── Team Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member, i) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="group relative bg-[var(--bg-secondary)]/40 border border-[var(--border-color)] rounded-[2.5rem] overflow-hidden backdrop-blur-sm hover:border-white/10 hover:shadow-2xl transition-all duration-500"
            >
              {/* Gradient top accent bar */}
              <div className={`h-1 w-full bg-gradient-to-r ${member.accent}`} />

              {/* Photo */}
              <div className="relative aspect-[4/4.5] overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-t from-[var(--bg-secondary)] via-transparent to-transparent z-10`} />
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-in-out"
                />

                {/* Role badge on photo */}
                <div className="absolute top-4 left-4 z-20">
                  <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full bg-gradient-to-r ${member.accent} text-white shadow-lg`}>
                    {member.role}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="p-6 pt-5">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <h3 className="text-lg font-black text-white">{member.name}</h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <svg className="w-3.5 h-3.5 text-[#5865F2]" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                      </svg>
                      <span className="text-[10px] text-[var(--text-secondary)] font-bold">{member.discord}</span>
                    </div>
                  </div>
                </div>

                <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed font-medium mb-5">
                  {member.bio}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2 mb-5">
                  <div className="bg-[var(--bg-primary)]/60 border border-[var(--border-color)] rounded-xl p-2.5 text-center">
                    <div className="text-sm font-black text-white">{member.trades}</div>
                    <div className="text-[9px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">Trades</div>
                  </div>
                  <div className="bg-[var(--bg-primary)]/60 border border-[var(--border-color)] rounded-xl p-2.5 text-center">
                    <div className="text-sm font-black text-white">Since {member.since}</div>
                    <div className="text-[9px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">Member</div>
                  </div>
                </div>

                {/* CTA */}
                <a
                  href="https://discord.gg/fKXBF3QyzB"
                  target="_blank"
                  rel="noreferrer"
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r ${member.accent} text-white text-xs font-black uppercase tracking-widest hover:opacity-90 hover:scale-[1.02] transition-all shadow-lg`}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                  </svg>
                  Message
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── Bottom CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-secondary)]/50 border border-[var(--border-color)] rounded-[2.5rem] p-10 text-center"
        >
          <h2 className="text-3xl font-black mb-3">
            <span className="text-white">Want to join the </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">team?</span>
          </h2>
          <p className="text-[var(--text-secondary)] text-sm font-medium mb-7 max-w-md mx-auto">
            We're always looking for dedicated MLBB enthusiasts to join us as middlemen, support agents, or account evaluators.
          </p>
          <a
            href="https://discord.gg/fKXBF3QyzB"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2.5 bg-white text-black px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-transform shadow-xl"
          >
            <svg className="w-5 h-5 text-[#5865F2]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
            </svg>
            Apply on Discord
          </a>
        </motion.div>

      </div>
    </div>
  );
}
