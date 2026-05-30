import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AnnouncementContextType {
  isActive: boolean;
  text: string;
  color: string;
  countdownTarget: string; // ISO String
  setIsActive: (val: boolean) => void;
  setText: (val: string) => void;
  setColor: (val: string) => void;
  setCountdownTarget: (val: string) => void;
}

const AnnouncementContext = createContext<AnnouncementContextType | undefined>(undefined);

export function AnnouncementProvider({ children }: { children: ReactNode }) {
  const [isActive, setIsActive] = useState(true);
  const [text, setText] = useState("Boost For Less MegatronLucky, 24% Off");
  const [color, setColor] = useState("#2e1065"); // Default dark purple
  
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
        setColor(parsed.color || "#2e1065");
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
        isActive, text, color, countdownTarget
      }));
    }
  }, [isActive, text, color, countdownTarget, isLoaded]);

  return (
    <AnnouncementContext.Provider value={{
      isActive, setIsActive,
      text, setText,
      color, setColor,
      countdownTarget, setCountdownTarget
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
