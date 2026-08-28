import { Outlet, useLocation } from "react-router-dom";
import { Header } from "./layout/Header";
import { Footer } from "./layout/Footer";
import { useState, useEffect, Suspense } from "react";
import { useAnnouncement } from "../context/AnnouncementContext";
import { useTheme } from "../context/ThemeContext";
import { useSeo } from "../context/SeoContext";
import { ScrollToTopButton } from "./ui/ScrollToTopButton";
import { GlobalLoader } from "./ui/GlobalLoader";
import { LiveChatWidget } from "./ui/LiveChatWidget";
import { PopupModal } from "./ui/PopupModal";
import { Megaphone, Star, Sparkles, Zap, Gift } from "lucide-react";
import { Helmet } from "react-helmet-async";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function AnnouncementTicker() {
  const { isActive, text, color, countdownTarget, linkUrl, showTimer, layoutMode, isGradient, textColor, iconType, bannerSize, marqueeSpeed, timerTheme } = useAnnouncement();
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
  const fmt = (v: number) => v.toString().padStart(2, '0');
  const timerString = `${fmt(d)}:${fmt(h)}:${fmt(m)}:${fmt(s)}`;

  const announcementBlock = (
    <div className={`flex items-center ${layoutMode === 'centered' ? 'w-full justify-center' : ''}`}>
      {iconType !== 'None' && (
        <>
          {iconType === 'Megaphone' && <Megaphone className={`ml-4 mr-2 ${bannerSize === 'Thick' ? 'w-5 h-5' : 'w-4 h-4'}`} style={{ color: textColor }} />}
          {iconType === 'Star' && <Star className={`ml-4 mr-2 ${bannerSize === 'Thick' ? 'w-5 h-5' : 'w-4 h-4'}`} style={{ color: textColor }} />}
          {iconType === 'Sparkles' && <Sparkles className={`ml-4 mr-2 ${bannerSize === 'Thick' ? 'w-5 h-5' : 'w-4 h-4'}`} style={{ color: textColor }} />}
          {iconType === 'Zap' && <Zap className={`ml-4 mr-2 ${bannerSize === 'Thick' ? 'w-5 h-5' : 'w-4 h-4'}`} style={{ color: textColor }} />}
          {iconType === 'Gift' && <Gift className={`ml-4 mr-2 ${bannerSize === 'Thick' ? 'w-5 h-5' : 'w-4 h-4'}`} style={{ color: textColor }} />}
        </>
      )}
      <span className={`font-bold uppercase tracking-widest px-2 ${bannerSize === 'Thick' ? 'text-sm' : 'text-xs'}`} style={{ color: textColor }}>
        {text}
      </span>
      {showTimer && (
        <span className={`font-mono font-bold px-2 py-0.5 rounded ml-2 mr-4 ${
          bannerSize === 'Thick' ? 'text-sm' : 'text-xs'
        } ${
          timerTheme === 'Light' ? 'bg-white/90 text-black shadow-sm' :
          timerTheme === 'Outline' ? 'bg-transparent text-white border border-white/40' :
          'bg-black/30 text-white shadow-inner'
        }`}>
          {timerString}
        </span>
      )}
      {layoutMode === 'marquee' && <span className="text-white/30 mr-4 ml-4">|</span>}
    </div>
  );

  const bannerContent = (
    <div
      className={`text-white flex items-center overflow-hidden border-b border-white/10 relative transition-all ${
        bannerSize === 'Slim' ? 'h-8' : bannerSize === 'Thick' ? 'h-14' : 'h-10'
      }`}
      style={isGradient ? {
        background: `linear-gradient(90deg, ${color}88 0%, ${color} 50%, ${color}88 100%)`,
        backdropFilter: 'blur(10px)'
      } : { backgroundColor: color }}
    >
      <div
        className={`${layoutMode === 'marquee' ? 'animate-marquee whitespace-nowrap flex items-center' : 'flex items-center w-full'}`}
        style={layoutMode === 'marquee' ? { animationDuration: marqueeSpeed === 'Fast' ? '15s' : marqueeSpeed === 'Slow' ? '40s' : '25s' } : undefined}
      >
        {announcementBlock}
        {layoutMode === 'marquee' && (<>{announcementBlock}{announcementBlock}{announcementBlock}</>)}
      </div>
    </div>
  );

  if (linkUrl) {
    const formattedLink = (!linkUrl.startsWith('http') && !linkUrl.startsWith('/')) ? `https://${linkUrl}` : linkUrl;
    return (
      <a href={formattedLink} target={formattedLink.startsWith('http') ? "_blank" : "_self"} rel="noreferrer" className="block hover:brightness-110 transition-all cursor-pointer relative z-50">
        {bannerContent}
      </a>
    );
  }

  return bannerContent;
}

function GlobalBackground() {
  const { isDarkMode } = useTheme();
  const location = useLocation();
  const path = location.pathname;

  let color1 = 'bg-[var(--accent)]';
  let color2 = 'bg-purple-600';

  if (path.startsWith('/products')) { color1 = 'bg-blue-500'; color2 = 'bg-cyan-500'; }
  else if (path.startsWith('/reviews')) { color1 = 'bg-yellow-500'; color2 = 'bg-amber-600'; }
  else if (path.startsWith('/team')) { color1 = 'bg-emerald-500'; color2 = 'bg-teal-500'; }
  else if (path.startsWith('/orders')) { color1 = 'bg-indigo-500'; color2 = 'bg-violet-600'; }
  else if (path.startsWith('/faq')) { color1 = 'bg-rose-500'; color2 = 'bg-pink-600'; }

  const blend = isDarkMode ? 'mix-blend-screen' : 'mix-blend-multiply';
  const opacity = isDarkMode ? '/10' : '/5';

  return (
    <div className={`fixed inset-0 z-40 pointer-events-none ${blend} overflow-hidden transition-colors duration-1000`}>
      <div className={`absolute top-0 right-0 w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] ${color1}${opacity} blur-[150px] rounded-full translate-x-1/3 -translate-y-1/3 animate-pulse-bg transition-colors duration-1000`} />
      <div className={`absolute bottom-0 left-0 w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] ${color2}${opacity} blur-[150px] rounded-full -translate-x-1/3 translate-y-1/3 animate-pulse-bg transition-colors duration-1000`} style={{ animationDelay: '2s' }} />
    </div>
  );
}

export function Root() {
  const { isDarkMode, toggleTheme } = useTheme();
  const location = useLocation();
  const { getSeoForPath } = useSeo();

  const seo = getSeoForPath(location.pathname) || {
    title: "Megatron | Premium Gaming Accounts",
    description: "Buy and sell premium MLBB, Valorant, and other gaming accounts safely and securely.",
    keywords: "MLBB, gaming accounts, buy sell accounts, premium accounts"
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
        {seo.keywords && <meta name="keywords" content={seo.keywords} />}
        <meta property="og:title" content={seo.title} />
        <meta property="og:description" content={seo.description} />
      </Helmet>
      <GlobalBackground />
      <ScrollToTop />
      <AnnouncementTicker />
      <Header toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
      <main className="flex-1">
        <Suspense fallback={<GlobalLoader />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      <ScrollToTopButton />
      <LiveChatWidget />
      <PopupModal />
    </div>
  );
}
