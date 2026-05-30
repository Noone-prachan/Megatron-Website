import { Outlet, useLocation } from "react-router-dom";
import { Header } from "./layout/Header";
import { Footer } from "./layout/Footer";
import { useState, useEffect } from "react";
import { useAnnouncement } from "../context/AnnouncementContext";
import { useTheme } from "../context/ThemeContext";
import { ScrollToTopButton } from "./ui/ScrollToTopButton";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// The Announcement Ticker with Timer
function AnnouncementTicker() {
  const { isActive, text, color, countdownTarget } = useAnnouncement();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  if (!isActive) return null;

  const targetDate = new Date(countdownTarget);
  const diff = Math.max(0, targetDate.getTime() - now.getTime());

  const d = Math.floor(diff / (1000 * 60 * 60 * 24));
  const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const m = Math.floor((diff / 1000 / 60) % 60);
  const s = Math.floor((diff / 1000) % 60);

  const formatTime = (v: number) => v.toString().padStart(2, '0');
  const timerString = `${formatTime(d)}:${formatTime(h)}:${formatTime(m)}:${formatTime(s)}`;

  const announcementBlock = (
    <div className="flex items-center">
      <span className="text-xs font-bold uppercase tracking-widest px-4 text-[#fde047]">
        {text}
      </span>
      <span className="text-white font-mono text-xs font-bold bg-black/30 px-2 py-0.5 rounded mr-4">
        {timerString}
      </span>
      <span className="text-white/30 mr-4">|</span>
    </div>
  );

  return (
    <div
      className="text-white h-10 flex items-center overflow-hidden border-b border-black/20 relative"
      style={{ backgroundColor: color }}
    >
      <div className="animate-marquee whitespace-nowrap flex items-center hover:animation-play-state-paused">
        {/* Render multiple blocks for marquee effect */}
        {announcementBlock}
        {announcementBlock}
        {announcementBlock}
        {announcementBlock}
      </div>
    </div>
  );
}

export function Root() {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <AnnouncementTicker />
      <Header toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <ScrollToTopButton />
    </div>
  );
}