import { Link } from "react-router-dom";
import {
  ShoppingCart,
  Star,
  Users,
  HelpCircle,
  BarChart2,
  Shield,
  FileText,
  RefreshCw,
  Instagram
} from "lucide-react";

// Custom SVG icons for Discord and TikTok
const DiscordIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
  </svg>
);

const TikTokIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
  </svg>
);

export function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { href: "https://www.tiktok.com/@megatron.mlstore?_r=1&_t=ZS-96lfryZhdI2", icon: TikTokIcon },
    { href: "https://discord.gg/fKXBF3QyzB", icon: DiscordIcon },
  ];

  const pagesList = [
    { href: "/products", label: "Store", desc: "Get premium accounts", icon: ShoppingCart },
    { href: "/reviews", label: "Reviews", desc: "Verified buyer feedback", icon: Star },
    { href: "/team", label: "Team", desc: "Meet the staff behind us", icon: Users },
    { href: "/faq", label: "FAQ", desc: "Got questions?", icon: HelpCircle },
    { href: "/orders", label: "Orders", desc: "Track purchases", icon: BarChart2 },
    { href: "https://discord.gg/fKXBF3QyzB", label: "Discord", desc: "Join our server", icon: DiscordIcon, external: true }
  ];

  const legalLinks = [
    { href: "/privacy", label: "Privacy Policy", icon: Shield },
    { href: "/terms", label: "Terms & Conditions", icon: FileText },
    { href: "/refund", label: "Refund Policy", icon: RefreshCw },
  ];

  return (
    <footer className="bg-[var(--bg-primary)] border-t border-[var(--border-color)] pt-20 pb-10 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-xl h-48 bg-[var(--accent)]/5 blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 lg:gap-16 mb-16">

          {/* Brand Column (Left) */}
          <div className="lg:col-span-4 flex flex-col">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <img src="/images/megatronlogo.png" alt="Megatron Logo" className="h-12 w-auto object-contain" />
              <span className="text-2xl tracking-tight text-[var(--text-primary)]" style={{ fontFamily: "'Venite Adoremus', sans-serif" }}>Megatron</span>
            </Link>
            <p className="text-[var(--text-secondary)] text-sm mb-8 leading-relaxed max-w-xs">
              The premier marketplace for premium MLBB accounts. Engineered for trust, speed, and absolute quality.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map(({ href, icon: Icon }, i) => (
                <a key={i} href={href} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-primary)] transition-all shadow-sm">
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* PAGES Grid Column (Middle-Left) */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="flex items-center gap-2 mb-6">
              <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
              <h3 className="text-xs font-bold text-[var(--text-primary)] tracking-widest uppercase">Pages</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {pagesList.map(({ href, label, desc, icon: Icon, external }) => {
                const content = (
                  <div className="group flex items-center gap-3 p-3 rounded-2xl bg-[var(--bg-secondary)]/40 hover:bg-[var(--bg-secondary)]/80 border border-[var(--border-color)] hover:border-[var(--text-secondary)]/50 transition-all duration-300 shadow-sm hover:shadow-md hover:scale-[1.02] backdrop-blur-sm cursor-pointer h-full">
                    <div className="w-9 h-9 rounded-xl bg-[var(--accent)]/10 border border-[var(--accent)]/20 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-[var(--accent)]" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-extrabold text-[12px] tracking-wider uppercase text-[var(--text-primary)] leading-tight">{label}</span>
                      <span className="text-[10px] font-semibold text-[var(--text-secondary)] mt-0.5 line-clamp-1 leading-none">{desc}</span>
                    </div>
                  </div>
                );

                if (external) {
                  return (
                    <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="no-underline">
                      {content}
                    </a>
                  );
                }

                return (
                  <Link key={label} to={href} className="no-underline">
                    {content}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* LEGAL Column (Middle-Right) */}
          <div className="lg:col-span-3 flex flex-col lg:justify-self-end">
            <h3 className="text-xs font-bold text-[var(--text-primary)] tracking-widest uppercase mb-6">Legal</h3>
            <div className="flex flex-col gap-2">
              {legalLinks.map(({ href, label, icon: Icon }) => (
                <Link key={href} to={href} className="group flex items-center gap-3 p-2 -ml-2 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors">
                  <div className="w-8 h-8 rounded-md bg-[var(--bg-secondary)] border border-[var(--border-color)] flex items-center justify-center group-hover:border-[var(--text-secondary)] transition-colors shadow-sm">
                    <Icon className="w-4 h-4 text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors" />
                  </div>
                  <span className="text-sm font-bold text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">{label}</span>
                </Link>
              ))}
            </div>
          </div>

        </div>

        {/* Footer Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-[var(--border-color)]">
          <p className="text-[var(--text-secondary)] text-[11px] font-bold tracking-widest uppercase">
            © {currentYear} Megatron. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/team" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-[11px] font-bold tracking-widest uppercase transition-colors">Staff</Link>
            <Link to="/reviews" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-[11px] font-bold tracking-widest uppercase transition-colors">Vote</Link>
            <a href="https://discord.gg/fKXBF3QyzB" target="_blank" rel="noopener noreferrer" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-[11px] font-bold tracking-widest uppercase transition-colors">Discord</a>
          </div>
        </div>

      </div>
    </footer>
  );
}