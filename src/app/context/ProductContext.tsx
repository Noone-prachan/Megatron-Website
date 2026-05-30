import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface Product {
  id: string;
  title: string;
  level: number;
  collectionRank: string;
  skins: number;
  heroes: number;
  price: number;
  discountPrice?: number;
  image: string; // Keep as primary thumbnail
  images?: string[]; // Array of additional images
  badge?: string; // Custom text badge
  featured?: boolean; // Flag to show on featured page/section
  category: "starter" | "mid-tier" | "premium" | "collector";
  description: string;
  features: string[];
  stats: {
    totalMatches: number;
    winRate: string;
    mvpCount: number;
  };
  dedicatedId?: string; // 3-letter admin ID
  tags?: string[]; // Admin tags
}

interface ProductContextType {
  products: Product[];
  isLoaded: boolean;
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
}

const defaultProducts: Product[] = [
  {
    id: "1", title: "HYPER BASED PREMIUM ACCOUNT", level: 69, collectionRank: "Exalted Collector", skins: 315, heroes: 131, price: 99.90,
    image: "/images/account-preview.png", badge: "Hot", category: "premium", dedicatedId: "HBP",
    description: "Why Choose Us for Your MLBB Account Purchase? Enjoy affordable prices with a massive skin collection.",
    features: ["13 Exquisite Skins", "10 Grand Skins", "1 Legend Skin"],
    stats: { totalMatches: 3450, winRate: "67%", mvpCount: 892 },
    tags: ["premium", "bestseller"]
  },
  {
    id: "2", title: "EPIC STARTER BUNDLE", level: 45, collectionRank: "Renowned Collector", skins: 150, heroes: 89, price: 49.90,
    image: "/images/skins-collection.png", badge: "New", category: "starter", dedicatedId: "ESB",
    description: "Perfect starter account for competitive play. Includes several Epic and Special skins with a solid win rate.",
    features: ["Epic Skins", "Full Email Access", "Instant Delivery"],
    stats: { totalMatches: 1800, winRate: "55%", mvpCount: 340 }
  },
  {
    id: "3", title: "MYTHIC GLORY ACCOUNT", level: 78, collectionRank: "Mega Collector", skins: 420, heroes: 150, price: 149.90,
    image: "/images/hero-banner.png", badge: "Premium", category: "premium", dedicatedId: "MGA",
    description: "Reach the top with this Mythic Glory account. Comes with an insane amount of skins and maxed emblems.",
    features: ["Maxed Emblems", "Collector Skins", "High Winrate"],
    stats: { totalMatches: 4200, winRate: "72%", mvpCount: 1200 }
  },
  {
    id: "4", title: "COLLECTOR'S EDITION", level: 82, collectionRank: "World Collector", skins: 500, heroes: 160, price: 199.90,
    image: "/images/account-preview.png", badge: "Rare", category: "collector", dedicatedId: "COL",
    description: "The ultimate collector's dream. Multiple Collector skins, Legend skins, and exclusive recalls.",
    features: ["5+ Collector Skins", "3 Legend Skins", "Limited Recalls"],
    stats: { totalMatches: 5600, winRate: "65%", mvpCount: 1500 }
  },
  {
    id: "5", title: "LEGEND RANK ACCOUNT", level: 55, collectionRank: "Renowned Collector", skins: 200, heroes: 95, price: 69.90,
    image: "/images/skins-collection.png", category: "mid-tier", dedicatedId: "LRA",
    description: "Solid mid-tier account perfect for grinding to Mythic. Includes many event skins.",
    features: ["Event Skins", "Good WR", "Secure"],
    stats: { totalMatches: 2100, winRate: "58%", mvpCount: 450 }
  },
  {
    id: "6", title: "MYTHIC ACCOUNT WITH EXCLUSIVES", level: 72, collectionRank: "Exalted Collector", skins: 380, heroes: 140, price: 129.90,
    image: "/images/hero-banner.png", badge: "Hot", category: "premium", dedicatedId: "MXA",
    description: "A highly sought-after Mythic account packed with exclusive skins and items.",
    features: ["Exclusive Avatars", "Premium Skins", "High Rank"],
    stats: { totalMatches: 3800, winRate: "62%", mvpCount: 950 }
  },
  {
    id: "7", title: "BEGINNER FRIENDLY ACCOUNT", level: 30, collectionRank: "Expert Collector", skins: 80, heroes: 60, price: 29.90,
    image: "/images/account-preview.png", badge: "New", category: "starter", dedicatedId: "BFA",
    description: "Great value for new players. Skip the early grind and jump straight into ranked.",
    features: ["Basic Emblems", "Starter Heroes", "Cheap"],
    stats: { totalMatches: 800, winRate: "50%", mvpCount: 120 }
  },
  {
    id: "8", title: "ULTIMATE SKIN COLLECTION", level: 85, collectionRank: "World Collector", skins: 600, heroes: 170, price: 249.90,
    image: "/images/skins-collection.png", badge: "Premium", category: "collector", dedicatedId: "USC",
    description: "Almost every skin in the game. An absolute behemoth of an account.",
    features: ["600+ Skins", "All Heroes", "Unranked"],
    stats: { totalMatches: 6200, winRate: "70%", mvpCount: 2100 }
  },
];

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("megatron_products");
    if (saved) {
      setProducts(JSON.parse(saved));
    } else {
      setProducts(defaultProducts);
      localStorage.setItem("megatron_products", JSON.stringify(defaultProducts));
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("megatron_products", JSON.stringify(products));
    }
  }, [products, isLoaded]);

  const addProduct = (product: Product) => {
    setProducts(prev => [product, ...prev]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  return (
    <ProductContext.Provider value={{ products, isLoaded, addProduct, updateProduct, deleteProduct }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
}
