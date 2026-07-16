import { Link, useLocation } from "react-router-dom";

// NOTE: This app uses RouterProvider + createBrowserRouter.
// If you ever see errors like "Cannot destructure property 'basename' of useContext(...) as it is null",
// it usually means Link/useLocation is being rendered outside a router context.

import { Menu, X, Sun, Moon, Home, ShoppingBag, Star, Users, User, BarChart, Heart } from "lucide-react";
import { useEffect, useState } from "react";

import { motion, AnimatePresence } from "motion/react";
import { useCurrency } from "../../context/CurrencyContext";
import { MiniGame } from "../ui/MiniGame";
import { useAdmin } from "../../context/AdminContext";
import { useLockBodyScroll } from "../../../hooks/useLockBodyScroll";

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

export function Header({ toggleTheme, isDarkMode }: { toggleTheme?: () => void, isDarkMode?: boolean }) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMiniGameOpen, setIsMiniGameOpen] = useState(false);
  const { currency, setCurrency } = useCurrency();

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/products", label: "Products" },
    { path: "/reviews", label: "Reviews" },
    { path: "/team", label: "Team" },
    { path: "/orders", label: "Orders" },
  ];

  const { isAdmin } = useAdmin();
  const [discordId, setDiscordId] = useState<string | null>(localStorage.getItem("discord_id"));
  const [discordUsername, setDiscordUsername] = useState<string | null>(localStorage.getItem("discord_username"));
  const [discordGlobalName, setDiscordGlobalName] = useState<string | null>(localStorage.getItem("discord_global_name"));
  const [discordAvatar, setDiscordAvatar] = useState<string | null>(localStorage.getItem("discord_avatar"));

  useLockBodyScroll(mobileMenuOpen);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) return;

    try {
      const payloadBase64 = token.split(".")[1];
      const payloadJson = atob(payloadBase64.replace(/-/g, "+").replace(/_/g, "/"));
      const payload = JSON.parse(payloadJson);
      if (payload?.id) {
        localStorage.setItem("discord_id", String(payload.id));
        setDiscordId(String(payload.id));
      }

      if (payload?.username) {
        localStorage.setItem("discord_username", String(payload.username));
        setDiscordUsername(String(payload.username));
      }

      if (payload?.global_name) {
        localStorage.setItem("discord_global_name", String(payload.global_name));
        setDiscordGlobalName(String(payload.global_name));
      }

      if (payload?.avatar) {
        localStorage.setItem("discord_avatar", String(payload.avatar));
        setDiscordAvatar(String(payload.avatar));
      }

    } catch {
      // ignore decoding errors
    }
  }, []);


  const handleDiscordLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/discord`;
  };

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("discord_id");
    localStorage.removeItem("discord_username");
    localStorage.removeItem("discord_global_name");
    localStorage.removeItem("discord_avatar");
    setDiscordId(null);
    setDiscordUsername(null);
    setDiscordGlobalName(null);
    setDiscordAvatar(null);
    window.location.href = '/';
  };

  const avatarUrl = discordAvatar
    ? `https://cdn.discordapp.com/avatars/${discordId}/${discordAvatar}.png`
    : `https://api.dicebear.com/7.x/avataaars/svg?seed=${discordId}`;

  return (
    <>
    <header className="fixed top-12 left-0 right-0 z-50 flex justify-center items-start pointer-events-none">

      {/* 1. Top Left: Logo */}
      <div className="absolute left-6 top-0 pointer-events-auto flex items-center shrink-0 mt-1">
        <button onClick={() => setIsMiniGameOpen(true)} className="flex items-center gap-3 group" title="Click for a surprise!">
          <img src="/images/megatronlogo.png" alt="Logo" className="h-14 w-auto object-contain drop-shadow-xl group-hover:scale-105 transition-transform" />
        </button>
      </div>

      {/* 2. Top Middle: The Nav Pill */}
      <div className="hidden md:flex pointer-events-auto shrink-0 flex-col items-center">
        <div className="nav-pill rounded-full px-2 py-2 flex items-center justify-center transition-colors duration-300 shadow-lg">
          <nav className="flex items-center gap-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={(e) => {
                    if (isActive) {
                      e.preventDefault();
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                  className={`text-sm font-bold transition-all duration-200 px-5 py-2 rounded-full ${isActive
                    ? "bg-[var(--text-primary)] text-[var(--bg-primary)] shadow-md"
                    : "text-[var(--nav-text)] hover:text-[var(--nav-text-hover)] hover:bg-[var(--bg-secondary)]"
                    }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* 3. Top Right: Controls & Login */}
      <div className="absolute right-6 top-0 pointer-events-auto flex items-center gap-4 shrink-0 mt-1">

        {/* Desktop Currency Toggle */}
        <div className="hidden md:flex bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-full p-1 shadow-inner h-[40px] items-center">
          <button onClick={() => setCurrency('USD')} className={`px-3 py-1 rounded-full text-[11px] font-bold transition-colors ${currency === 'USD' ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] shadow-sm' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}>USD</button>
          <button onClick={() => setCurrency('NPR')} className={`px-3 py-1 rounded-full text-[11px] font-bold transition-colors ${currency === 'NPR' ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] shadow-sm' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}>NPR</button>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="hidden md:flex p-2.5 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--nav-text)] hover:text-[var(--text-primary)] hover:border-[var(--text-primary)] transition-all shadow-md"
          title="Toggle Theme"
        >
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* New Login Button Design */}
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="flex items-center bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-[var(--text-secondary)] text-[var(--text-primary)] rounded-full p-1.5 pr-4 transition-all shadow-md hover:shadow-lg group h-12"
        >
          <div className="w-9 h-9 bg-[var(--bg-primary)] rounded-full flex items-center justify-center text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors shrink-0 border border-[var(--border-color)] overflow-hidden">
            {discordId ? (
              <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>
            )}
          </div>

          <div className="flex flex-col items-start justify-center ml-3 mr-4 text-left hidden sm:flex">
            <span className="text-[13px] font-bold leading-none text-[var(--text-primary)]">
              {discordGlobalName ? discordGlobalName : (discordUsername ? `@${discordUsername}` : "Sign In")}
            </span>
            {discordId && (
              <span className={`text-[10px] font-bold whitespace-nowrap leading-none uppercase tracking-wider mt-1 ${isAdmin ? 'text-red-500' : 'text-[var(--text-secondary)]'}`}>
                {isAdmin ? "Admin" : `@${discordUsername}`}
              </span>
            )}
          </div>

          <div className="w-[1px] h-6 bg-[var(--border-color)] mx-1"></div>

          <div className="flex flex-col gap-[3px] ml-2 opacity-70 group-hover:opacity-100 transition-opacity">
            <div className="w-4 h-[2px] bg-[var(--text-secondary)] group-hover:bg-[var(--text-primary)] transition-colors rounded-full"></div>
            <div className="w-4 h-[2px] bg-[var(--text-secondary)] group-hover:bg-[var(--text-primary)] transition-colors rounded-full"></div>
            <div className="w-3 h-[2px] bg-[var(--text-secondary)] group-hover:bg-[var(--text-primary)] transition-colors rounded-full"></div>
          </div>
        </button>
      </div>

      {/* Slide-out Mobile/Sidebar Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55] pointer-events-auto"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[340px] bg-[var(--bg-secondary)] border-l border-[var(--border-color)] z-[60] p-6 flex flex-col pointer-events-auto shadow-2xl"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="font-bold text-xl text-[var(--text-primary)]">Menu</h2>
                <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-full hover:bg-[var(--bg-primary)] transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Sidebar Login Area */}
              <div
                className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-2xl p-4 flex items-center justify-between gap-4 cursor-pointer hover:border-[#5865F2] transition-colors mb-8"
                onClick={discordId ? handleLogout : handleDiscordLogin}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-full flex items-center justify-center text-[var(--text-secondary)] overflow-hidden">
                    {discordId ? <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" /> : <User className="w-6 h-6" />}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-[var(--text-primary)]">
                      {discordGlobalName ? discordGlobalName : (discordUsername ? `@${discordUsername}` : "Not logged in")}
                    </h3>
                    <p className="text-xs text-[var(--text-secondary)]">
                      {discordId ? "Click to logout" : "Click to login with Discord"}
                    </p>
                  </div>
                </div>
                {isAdmin && (
                  <span className="text-[10px] font-black uppercase tracking-widest bg-red-500/10 text-red-500 px-2 py-1 rounded">Admin</span>
                )}
              </div>

              <div className="flex-1 flex flex-col gap-1">
                {navItems.map((item) => {
                  let NavIcon = Menu;
                  if (item.label === 'Home') NavIcon = Home;
                  if (item.label === 'Products') NavIcon = ShoppingBag;
                  if (item.label === 'Reviews') NavIcon = Star;
                  if (item.label === 'Team') NavIcon = Users;
                  if (item.label === 'Orders') NavIcon = BarChart;

                  const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));

                  return (
                    <Link
                      key={item.label}
                      to={item.path}
                      onClick={(e) => {
                        if (isActive) {
                          e.preventDefault();
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }
                        setMobileMenuOpen(false);
                      }}
                      className={`font-bold text-lg ${isActive ? 'text-[var(--text-primary)] bg-[var(--bg-primary)] border border-[var(--border-color)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-primary)]'} py-3 px-4 rounded-xl transition-colors flex justify-between items-center group`}
                    >
                      <div className="flex items-center gap-3">
                        <NavIcon className="w-5 h-5 text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors" />
                        {item.label}
                      </div>
                      <svg className="text-[var(--text-secondary)] opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m9 18 6-6-6-6" /></svg>
                    </Link>
                  )
                })}

                {/* Wishlist — standalone section */}
                <div className="mt-4 pt-4 border-t border-[var(--border-color)]">
                  <Link
                    to="/wishlist"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`font-bold text-lg flex justify-between items-center group py-3 px-4 rounded-xl transition-all ${
                      location.pathname === '/wishlist'
                        ? 'bg-pink-500/15 border border-pink-500/30 text-pink-400'
                        : 'text-[var(--text-secondary)] hover:text-pink-400 hover:bg-pink-500/10'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Heart className={`w-5 h-5 transition-colors ${
                        location.pathname === '/wishlist' ? 'text-pink-400 fill-pink-400' : 'text-pink-500 group-hover:text-pink-400'
                      }`} />
                      Wishlist
                    </div>
                    <svg className="opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-pink-500" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m9 18 6-6-6-6" /></svg>
                  </Link>
                </div>

                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="font-bold text-lg text-red-500 hover:text-red-400 py-3 px-4 rounded-xl hover:bg-red-500/10 transition-colors flex justify-between items-center group mt-2"
                  >
                    <div className="flex items-center gap-3">
                      <Star className="w-5 h-5 text-red-500" />
                      Admin Panel
                    </div>
                    <svg className="text-red-500 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m9 18 6-6-6-6" /></svg>
                  </Link>
                )}
              </div>

              <div className="mt-auto flex flex-col gap-5 pt-6 border-t border-[var(--border-color)]">
                {/* Currency Toggle */}
                <div className="flex justify-between items-center px-1">
                  <span className="text-sm font-bold text-[var(--text-secondary)]">Currency</span>
                  <div className="flex bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-full p-1 shadow-inner">
                    <button onClick={() => setCurrency('USD')} className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${currency === 'USD' ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] shadow-sm' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}>USD</button>
                    <button onClick={() => setCurrency('NPR')} className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${currency === 'NPR' ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] shadow-sm' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}>NPR</button>
                  </div>
                </div>

                {/* Theme Toggle */}
                <div className="flex justify-between items-center px-1">
                  <span className="text-sm font-bold text-[var(--text-secondary)]">Theme</span>
                  <button
                    onClick={toggleTheme}
                    className="p-3 rounded-full text-[var(--text-primary)] bg-[var(--bg-primary)] border border-[var(--border-color)] hover:border-[var(--text-primary)] transition-colors shadow-sm"
                  >
                    {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
    <MiniGame isOpen={isMiniGameOpen} onClose={() => setIsMiniGameOpen(false)} />
    </>
  );
}