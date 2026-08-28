import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface PopupItem {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  linkUrl: string;
  enabled: boolean;
  showOnce: boolean;
}

interface PopupContextType {
  popups: PopupItem[];
  addPopup: (p: Omit<PopupItem, "id">) => void;
  updatePopup: (id: string, p: Partial<PopupItem>) => void;
  deletePopup: (id: string) => void;
  togglePopup: (id: string) => void;
}

const PopupContext = createContext<PopupContextType | undefined>(undefined);
const STORAGE_KEY = "megatron_popups";

export function PopupProvider({ children }: { children: ReactNode }) {
  const [popups, setPopups] = useState<PopupItem[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setPopups(JSON.parse(saved));
    } catch {}
  }, []);

  const save = (items: PopupItem[]) => {
    setPopups(items);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  };

  const addPopup = (p: Omit<PopupItem, "id">) =>
    save([...popups, { ...p, id: crypto.randomUUID() }]);

  const updatePopup = (id: string, p: Partial<PopupItem>) =>
    save(popups.map(x => (x.id === id ? { ...x, ...p } : x)));

  const deletePopup = (id: string) => save(popups.filter(x => x.id !== id));

  const togglePopup = (id: string) =>
    save(popups.map(x => (x.id === id ? { ...x, enabled: !x.enabled } : x)));

  return (
    <PopupContext.Provider value={{ popups, addPopup, updatePopup, deletePopup, togglePopup }}>
      {children}
    </PopupContext.Provider>
  );
}

export function usePopups() {
  const ctx = useContext(PopupContext);
  if (!ctx) throw new Error("usePopups must be used within PopupProvider");
  return ctx;
}
