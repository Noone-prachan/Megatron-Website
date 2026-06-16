import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AnnouncementContextType {
  isActive: boolean;
  text: string;
  color: string;
  countdownTarget: string; // ISO String
  linkUrl: string;
  showTimer: boolean;
  layoutMode: 'marquee' | 'centered';
  isGradient: boolean;
  textColor: string;
  iconType: 'Megaphone' | 'Star' | 'Sparkles' | 'Zap' | 'Gift' | 'None';
  bannerSize: 'Slim' | 'Normal' | 'Thick';
  marqueeSpeed: 'Slow' | 'Normal' | 'Fast';
  timerTheme: 'Dark' | 'Light' | 'Outline';
  
  setIsActive: (val: boolean) => void;
  setText: (val: string) => void;
  setColor: (val: string) => void;
  setCountdownTarget: (val: string) => void;
  setLinkUrl: (val: string) => void;
  setShowTimer: (val: boolean) => void;
  setLayoutMode: (val: 'marquee' | 'centered') => void;
  setIsGradient: (val: boolean) => void;
  setTextColor: (val: string) => void;
  setIconType: (val: 'Megaphone' | 'Star' | 'Sparkles' | 'Zap' | 'Gift' | 'None') => void;
  setBannerSize: (val: 'Slim' | 'Normal' | 'Thick') => void;
  setMarqueeSpeed: (val: 'Slow' | 'Normal' | 'Fast') => void;
  setTimerTheme: (val: 'Dark' | 'Light' | 'Outline') => void;
}

const AnnouncementContext = createContext<AnnouncementContextType | undefined>(undefined);

export function AnnouncementProvider({ children }: { children: ReactNode }) {
  const [isActive, setIsActive] = useState(true);
  const [text, setText] = useState("Boost For Less MegatronLucky, 24% Off");
  const [color, setColor] = useState("#4f46e5"); // Default indigo
  const [linkUrl, setLinkUrl] = useState("");
  const [showTimer, setShowTimer] = useState(true);
  const [layoutMode, setLayoutMode] = useState<'marquee'|'centered'>('centered');
  const [isGradient, setIsGradient] = useState(true);
  const [textColor, setTextColor] = useState("#ffffff");
  const [iconType, setIconType] = useState<'Megaphone' | 'Star' | 'Sparkles' | 'Zap' | 'Gift' | 'None'>('Megaphone');
  const [bannerSize, setBannerSize] = useState<'Slim' | 'Normal' | 'Thick'>('Normal');
  const [marqueeSpeed, setMarqueeSpeed] = useState<'Slow' | 'Normal' | 'Fast'>('Normal');
  const [timerTheme, setTimerTheme] = useState<'Dark' | 'Light' | 'Outline'>('Dark');
  
  // Default to 2 hours from now
  const [countdownTarget, setCountdownTarget] = useState(
    new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString()
  );

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("megatron_announcement");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setIsActive(parsed.isActive ?? true);
        setText(parsed.text || "Boost For Less MegatronLucky, 24% Off");
        setColor(parsed.color || "#4f46e5");
        setLinkUrl(parsed.linkUrl || "");
        setShowTimer(parsed.showTimer ?? true);
        setLayoutMode(parsed.layoutMode || 'centered');
        setIsGradient(parsed.isGradient ?? true);
        setTextColor(parsed.textColor || "#ffffff");
        setIconType(parsed.iconType || 'Megaphone');
        setBannerSize(parsed.bannerSize || 'Normal');
        setMarqueeSpeed(parsed.marqueeSpeed || 'Normal');
        setTimerTheme(parsed.timerTheme || 'Dark');
        if (parsed.countdownTarget) {
          setCountdownTarget(parsed.countdownTarget);
        }
      } catch (e) {
        console.error(e);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("megatron_announcement", JSON.stringify({
        isActive, text, color, countdownTarget, linkUrl, showTimer, layoutMode, isGradient, textColor,
        iconType, bannerSize, marqueeSpeed, timerTheme
      }));
    }
  }, [isActive, text, color, countdownTarget, linkUrl, showTimer, layoutMode, isGradient, textColor, iconType, bannerSize, marqueeSpeed, timerTheme, isLoaded]);

  return (
    <AnnouncementContext.Provider value={{
      isActive, setIsActive,
      text, setText,
      color, setColor,
      countdownTarget, setCountdownTarget,
      linkUrl, setLinkUrl,
      showTimer, setShowTimer,
      layoutMode, setLayoutMode,
      isGradient, setIsGradient,
      textColor, setTextColor,
      iconType, setIconType,
      bannerSize, setBannerSize,
      marqueeSpeed, setMarqueeSpeed,
      timerTheme, setTimerTheme
    }}>
      {children}
    </AnnouncementContext.Provider>
  );
}

export function useAnnouncement() {
  const context = useContext(AnnouncementContext);
  if (context === undefined) {
    throw new Error("useAnnouncement must be used within a AnnouncementProvider");
  }
  return context;
}
