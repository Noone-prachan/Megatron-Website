import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface SeoTags {
  title: string;
  description: string;
  keywords: string;
}

interface SeoContextType {
  seoData: Record<string, SeoTags>;
  updateSeo: (path: string, tags: SeoTags) => void;
  getSeoForPath: (path: string) => SeoTags | null;
}

const defaultSeoData: Record<string, SeoTags> = {
  "/": {
    title: "Megatron | Premium Gaming Accounts",
    description: "Buy and sell premium MLBB, Valorant, and other gaming accounts safely and securely.",
    keywords: "MLBB, gaming accounts, buy sell accounts, premium accounts"
  }
};

const SeoContext = createContext<SeoContextType | undefined>(undefined);

export function SeoProvider({ children }: { children: ReactNode }) {
  const [seoData, setSeoData] = useState<Record<string, SeoTags>>(() => {
    try {
      const stored = localStorage.getItem("megatron_seo");
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return defaultSeoData;
  });

  useEffect(() => {
    localStorage.setItem("megatron_seo", JSON.stringify(seoData));
  }, [seoData]);

  const updateSeo = (path: string, tags: SeoTags) => {
    setSeoData((prev) => ({
      ...prev,
      [path]: tags
    }));
  };

  const getSeoForPath = (path: string) => {
    // If it's a dynamic route like /products/123, we could match against a pattern
    // but for now exact match or fallback to home
    return seoData[path] || null;
  };

  return (
    <SeoContext.Provider value={{ seoData, updateSeo, getSeoForPath }}>
      {children}
    </SeoContext.Provider>
  );
}

export const useSeo = () => {
  const context = useContext(SeoContext);
  if (context === undefined) {
    throw new Error("useSeo must be used within a SeoProvider");
  }
  return context;
};
