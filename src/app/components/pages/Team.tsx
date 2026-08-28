import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { api } from "../../../lib/api";

const teamMembers = [
  {
    id: "570146481663770634",
    username: "blakeactual",
    displayName: "Blake",
    role: "OWNER",
    bioTag: "Purchase Handler",
    secondaryBioTag: "Stock Management",
    secondaryIcon: (
      <svg className="w-5 h-5 drop-shadow-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line>
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
        <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
        <line x1="12" y1="22.08" x2="12" y2="12"></line>
      </svg>
    ),
    icon: (
      <svg className="w-5 h-5 drop-shadow-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"></path>
      </svg>
    ),
    avatar: "https://cdn.discordapp.com/avatars/570146481663770634/d6bd981f5a7fbd7b48357d0e2f46f420.png?size=256",
    banner: "https://cdn.discordapp.com/banners/570146481663770634/ef386bce68955c1732855ed5dfe41350.png?size=512",
    bannerColor: "#000000",
    themeColor: "from-red-500 to-rose-500",
    glowColor: "shadow-red-500/20",
    textColor: "text-red-400",
    borderColor: "border-red-500/30",
    link: "https://discord.com/users/570146481663770634"
  },
  {
    id: "850383604404322304",
    username: "stingplayer",
    displayName: "Noone ✮",
    role: "DEVELOPER",
    bioTag: "Technical Management",
    secondaryBioTag: "Web & Bot Developer",
    secondaryIcon: (
      <svg className="w-5 h-5 drop-shadow-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6"></polyline>
        <polyline points="8 6 2 12 8 18"></polyline>
      </svg>
    ),
    icon: (
      <svg className="w-5 h-5 drop-shadow-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <polyline points="10 8 6 12 10 16"></polyline>
        <polyline points="14 8 18 12 14 16"></polyline>
      </svg>
    ),
    avatar: "https://cdn.discordapp.com/avatars/850383604404322304/80d23f978344d4ba2681f822d2402d06.png?size=256",
    banner: null,
    bannerColor: "#000000",
    themeColor: "from-emerald-400 to-cyan-400",
    glowColor: "shadow-emerald-500/20",
    textColor: "text-emerald-400",
    borderColor: "border-emerald-500/30",
    link: "https://discord.com/users/850383604404322304"
  },
  {
    id: "844877006634221598",
    username: "bauchaonfire",
    displayName: "baucha_store",
    role: "ADMIN",
    bioTag: "Community Manager",
    icon: (
      <svg className="w-5 h-5 drop-shadow-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        <circle cx="12" cy="11" r="3"></circle>
        <path d="M7.7 18.5a6 6 0 0 1 8.6 0"></path>
      </svg>
    ),
    avatar: "https://cdn.discordapp.com/avatars/844877006634221598/b7524ea6f9c6cada8e93f8e0fd555aba.png?size=256",
    banner: "https://cdn.discordapp.com/banners/844877006634221598/17990f6d474a2763e167a335aa0be07e.png?size=512",
    bannerColor: "#001d17",
    themeColor: "from-amber-400 to-yellow-500",
    glowColor: "shadow-amber-500/20",
    textColor: "text-amber-400",
    borderColor: "border-amber-500/30",
    link: "https://discord.com/users/844877006634221598"
  },
  {
    id: "896711755055632417",
    username: "akiro_g",
    displayName: "Akiro",
    role: "ADMIN",
    bioTag: "Community Manager",
    icon: (
      <svg className="w-5 h-5 drop-shadow-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        <circle cx="12" cy="11" r="3"></circle>
        <path d="M7.7 18.5a6 6 0 0 1 8.6 0"></path>
      </svg>
    ),
    avatar: "https://cdn.discordapp.com/avatars/896711755055632417/4eed496ca6f92b5ea14a0971abf83474.png?size=256",
    banner: null,
    bannerColor: "#141414",
    themeColor: "from-amber-400 to-yellow-500",
    glowColor: "shadow-amber-500/20",
    textColor: "text-amber-400",
    borderColor: "border-amber-500/30",
    link: "https://discord.com/users/896711755055632417"
  },
];

interface DiscordProfile {
  avatarUrl: string;
  bannerUrl: string | null;
  bannerColor: string | null;
}

export function Team() {
  const [profiles, setProfiles] = useState<Record<string, DiscordProfile>>({});

  useEffect(() => {
    // Fetch live Discord profiles for all team members in parallel
    const fetchProfiles = async () => {
      const results = await Promise.allSettled(
        teamMembers.map(m => api.getDiscordUser(m.id))
      );
      const map: Record<string, DiscordProfile> = {};
      results.forEach((result, i) => {
        if (result.status === 'fulfilled') {
          map[teamMembers[i].id] = {
            avatarUrl: result.value.avatarUrl,
            bannerUrl: result.value.bannerUrl,
            bannerColor: result.value.bannerColor,
          };
        }
      });
      setProfiles(map);
    };
    fetchProfiles();
  }, []);

  return (
    <div className="min-h-screen pt-36 pb-24 relative overflow-hidden bg-[var(--bg-primary)]">
      {/* Dynamic Ambient Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] max-w-[1000px] h-[600px] bg-gradient-to-b from-violet-600/10 via-fuchsia-600/5 to-transparent rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[150px] pointer-events-none" />
      
      {/* Animated subtle grid */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* ── Premium Hero Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-24 relative"
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-[var(--bg-secondary)]/60 border border-[var(--border-color)] backdrop-blur-xl px-5 py-2 rounded-full text-xs font-bold uppercase tracking-[0.2em] mb-8 shadow-2xl"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
            </span>
            <span className="bg-gradient-to-r from-[var(--text-secondary)] to-[var(--text-primary)] bg-clip-text text-transparent">The Architects</span>
          </motion.div>
          
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tighter mb-6 leading-[1.1]">
            <span className="text-[var(--text-primary)] drop-shadow-sm">Meet the </span>
            <span className="relative inline-block">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 animate-gradient-x">Team.</span>
              <motion.span 
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="absolute bottom-0 left-0 h-1.5 bg-gradient-to-r from-indigo-500 to-pink-500 rounded-full"
              />
            </span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg sm:text-xl font-medium leading-relaxed">
            The masterminds behind every seamless transaction and premium experience on Megatron.
          </p>
        </motion.div>

        {/* ── Ultra-Premium Glassmorphic Grid ── */}
        <div className="flex flex-wrap justify-center gap-8 lg:gap-10">
          {teamMembers.map((member, i) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.15, duration: 0.6, type: "spring", stiffness: 100 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className={`w-full max-w-[360px] relative group`}
            >
              {/* Dynamic Glow Behind Card */}
              <div className={`absolute -inset-0.5 bg-gradient-to-b ${member.themeColor} rounded-[24px] blur opacity-0 group-hover:opacity-20 transition duration-500`}></div>

              {/* Main Card Body */}
              <div className="relative h-full bg-[var(--bg-secondary)]/90 dark:bg-[#0d0e12]/90 backdrop-blur-2xl rounded-[22px] overflow-hidden border border-[var(--border-color)] dark:border-white/10 group-hover:border-[var(--text-primary)]/20 transition-all duration-500 shadow-2xl flex flex-col">
                
                {/* Banner Section with Smooth Fade */}
                <div className="relative h-[130px] w-full overflow-hidden">
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ 
                      backgroundColor: profiles[member.id]?.bannerColor ?? member.bannerColor,
                      backgroundImage: (profiles[member.id]?.bannerUrl ?? member.banner)
                        ? `url(${profiles[member.id]?.bannerUrl ?? member.banner})`
                        : 'none'
                    }}
                  />
                  {/* Glass gradient overlay at bottom of banner to blend into card */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-[var(--bg-secondary)] dark:to-[#0d0e12]"></div>
                </div>

                <div className="relative px-6 pb-6 flex-1 flex flex-col">
                  {/* Floating Avatar & Role Badge Row */}
                  <div className="flex justify-between items-end mb-4 -mt-[56px] relative z-20">
                    {/* Glowing Avatar */}
                    <div className="relative group/avatar cursor-pointer">
                      <div className={`absolute -inset-1 bg-gradient-to-r ${member.themeColor} rounded-full opacity-50 blur-md group-hover/avatar:opacity-100 transition-opacity duration-300`}></div>
                      <div className="w-[112px] h-[112px] rounded-full border-[4px] border-[var(--bg-secondary)] dark:border-[#0d0e12] bg-[var(--bg-secondary)] dark:bg-[#0d0e12] relative z-10 overflow-hidden">
                        <img
                          src={profiles[member.id]?.avatarUrl ?? member.avatar}
                          alt={member.displayName}
                          crossOrigin="anonymous"
                          className="w-full h-full rounded-full object-cover transform transition-transform duration-500 group-hover/avatar:scale-110"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.id}`;
                          }}
                        />
                      </div>
                      {/* Premium Online Indicator */}
                      <div className="absolute bottom-1 right-1 w-6 h-6 bg-emerald-500 border-4 border-[var(--bg-secondary)] dark:border-[#0d0e12] rounded-full z-20 shadow-[0_0_10px_rgba(16,185,129,0.6)]">
                        <div className="w-full h-full bg-emerald-400 rounded-full animate-ping opacity-75"></div>
                      </div>
                    </div>

                    {/* Glassmorphic Role Badge */}
                    <div className={`mb-3 relative overflow-hidden backdrop-blur-md bg-white/[0.03] border ${member.borderColor} px-4 py-1.5 rounded-full shadow-lg`}>
                      <div className={`absolute inset-0 bg-gradient-to-r ${member.themeColor} opacity-10`}></div>
                      <div className="relative flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${member.themeColor} shadow-[0_0_8px_currentColor] ${member.textColor}`}></div>
                        <span className={`text-[11px] font-black uppercase tracking-widest bg-gradient-to-r ${member.themeColor} bg-clip-text text-transparent`}>
                          {member.role}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Name Info */}
                  <div className="mb-6">
                    <h3 className="text-2xl font-black text-[var(--text-primary)] tracking-tight flex items-center gap-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[var(--text-primary)] group-hover:to-[var(--text-secondary)] transition-all duration-300">
                      {member.displayName}
                    </h3>
                    <p className="text-sm text-gray-400 font-medium tracking-wide">@{member.username}</p>
                  </div>

                  {/* Ultra-Sleek Bio Tag(s) */}
                  <div className="mb-8 flex flex-col gap-2">
                    <div className="relative group/bio">
                      <div className={`absolute -inset-0.5 bg-gradient-to-r ${member.themeColor} rounded-xl blur opacity-20 group-hover/bio:opacity-40 transition duration-300`}></div>
                      <div className="relative flex items-center gap-3 bg-[var(--bg-secondary)]/60 dark:bg-black/40 backdrop-blur-xl border border-[var(--border-color)] dark:border-white/5 px-4 py-3 rounded-xl">
                        <span className={`${member.textColor} drop-shadow-md animate-pulse flex items-center justify-center`}>
                          {member.icon}
                        </span>
                        <span className="text-sm font-bold text-[var(--text-primary)] dark:text-gray-200 tracking-wide">
                          {member.bioTag}
                        </span>
                      </div>
                    </div>
                    {(member as any).secondaryBioTag && (
                      <div className="relative group/bio">
                        <div className={`absolute -inset-0.5 bg-gradient-to-r ${member.themeColor} rounded-xl blur opacity-20 group-hover/bio:opacity-40 transition duration-300`}></div>
                        <div className="relative flex items-center gap-3 bg-[var(--bg-secondary)]/60 dark:bg-black/40 backdrop-blur-xl border border-[var(--border-color)] dark:border-white/5 px-4 py-3 rounded-xl">
                          <span className={`${member.textColor} drop-shadow-md animate-pulse flex items-center justify-center`}>
                            {(member as any).secondaryIcon}
                          </span>
                          <span className="text-sm font-bold text-[var(--text-primary)] dark:text-gray-200 tracking-wide">
                            {(member as any).secondaryBioTag}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Spacer to push button to bottom if heights differ */}
                  <div className="flex-1"></div>

                  {/* Premium Action Button */}
                  <a
                    href={member.link}
                    target="_blank"
                    rel="noreferrer"
                    className={`relative w-full flex items-center justify-center py-3.5 rounded-xl font-bold text-sm tracking-wide overflow-hidden group/btn shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1`}
                  >
                    {/* Default State Background */}
                    <div className={`absolute inset-0 bg-gradient-to-r ${member.themeColor} opacity-80 group-hover/btn:opacity-100 transition-opacity duration-300`}></div>
                    
                    {/* Glare Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-[150%] group-hover/btn:translate-x-[150%] transition-transform duration-700 ease-in-out"></div>
                    
                    <span className="relative z-10 text-white flex items-center gap-2 drop-shadow-md">
                      Connect Profile
                      <svg className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </span>
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── Holographic Bottom CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-32 relative group cursor-pointer"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 rounded-[3rem] blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
          <div className="relative bg-[var(--bg-secondary)]/80 dark:bg-[#0d0e12]/80 backdrop-blur-2xl border border-[var(--border-color)] dark:border-white/10 rounded-[2.5rem] p-12 text-center overflow-hidden">
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-violet-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
            
            <h2 className="text-4xl font-black mb-4 relative z-10">
              <span className="text-[var(--text-primary)]">Become part of the </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">Legacy.</span>
            </h2>
            <p className="text-gray-400 text-base font-medium mb-8 max-w-lg mx-auto relative z-10">
              We're building the future of MLBB trading. Join our elite team of middlemen, support agents, and account evaluators.
            </p>
            
            <a
              href="https://discord.gg/fKXBF3QyzB"
              target="_blank"
              rel="noreferrer"
              className="relative inline-flex items-center gap-3 bg-[var(--text-primary)] text-[var(--bg-primary)] px-10 py-4 rounded-full font-black text-sm uppercase tracking-[0.15em] hover:scale-105 transition-transform shadow-lg z-10"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
              </svg>
              Apply on Discord
            </a>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
