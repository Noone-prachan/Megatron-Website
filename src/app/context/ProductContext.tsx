import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type ProductType = "account" | "pubg-uc" | "mlbb-diamonds" | "valo-points" | "netflix" | "crunchyroll" | "playstation" | "steam" | "apple" | "fortnite" | string;

export interface Product {
  id: string;
  type?: ProductType; // Defaults to "account"
  title: string;
  price: number;
  discountPrice?: number;
  image: string; // Keep as primary thumbnail
  images?: string[]; // Array of additional images
  badge?: string; // Custom text badge
  featured?: boolean; // Flag to show on featured page/section
  description: string;
  features: string[];
  dedicatedId?: string; // 3-letter admin ID
  tags?: string[]; // Admin tags
  discordThreadId?: string; // Discord forum thread ID for account-listing post
  sellerId?: string; // Linked seller account ID
  sellerName?: string;
  sellerCategory?: string;
  sellerPhone?: string;
  sellerDiscordId?: string;
  sellerDiscordUsername?: string;
  sellerDiscordAvatar?: string;

  // Account specific
  category?: "starter" | "mid-tier" | "premium" | "collector";
  level?: number;
  collectionRank?: string;
  skins?: number;
  heroes?: number;
  stats?: {
    totalMatches: number;
    winRate: string;
    mvpCount: number;
  };

  // Currency specific
  amount?: number; // e.g. 60 (for 60 UC)
  currencyPackages?: {
    id: string;
    amount: number;
    price: number;
    title?: string;
  }[];
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
    id: "1", type: "account", title: "HYPER BASED PREMIUM ACCOUNT", level: 69, collectionRank: "Exalted Collector", skins: 315, heroes: 131, price: 99.90,
    image: "/images/account-preview.png", badge: "Hot", category: "premium", dedicatedId: "HBP",
    description: "Why Choose Us for Your MLBB Account Purchase? Enjoy affordable prices with a massive skin collection.",
    features: ["13 Exquisite Skins", "10 Grand Skins", "1 Legend Skin"],
    stats: { totalMatches: 3450, winRate: "67%", mvpCount: 892 },
    tags: ["premium", "bestseller"]
  },
  {
    id: "2", type: "account", title: "EPIC STARTER BUNDLE", level: 45, collectionRank: "Renowned Collector", skins: 150, heroes: 89, price: 49.90,
    image: "/images/skins-collection.png", badge: "New", category: "starter", dedicatedId: "ESB",
    description: "Perfect starter account for competitive play. Includes several Epic and Special skins with a solid win rate.",
    features: ["Epic Skins", "Full Email Access", "Instant Delivery"],
    stats: { totalMatches: 1800, winRate: "55%", mvpCount: 340 }
  },
  {
    id: "3", type: "account", title: "MYTHIC GLORY ACCOUNT", level: 78, collectionRank: "Mega Collector", skins: 420, heroes: 150, price: 149.90,
    image: "/images/hero-banner.png", badge: "Premium", category: "premium", dedicatedId: "MGA",
    description: "Reach the top with this Mythic Glory account. Comes with an insane amount of skins and maxed emblems.",
    features: ["Maxed Emblems", "Collector Skins", "High Winrate"],
    stats: { totalMatches: 4200, winRate: "72%", mvpCount: 1200 }
  },
  {
    id: "4", type: "account", title: "COLLECTOR'S EDITION", level: 82, collectionRank: "World Collector", skins: 500, heroes: 160, price: 199.90,
    image: "/images/account-preview.png", badge: "Rare", category: "collector", dedicatedId: "COL",
    description: "The ultimate collector's dream. Multiple Collector skins, Legend skins, and exclusive recalls.",
    features: ["5+ Collector Skins", "3 Legend Skins", "Limited Recalls"],
    stats: { totalMatches: 5600, winRate: "65%", mvpCount: 1500 }
  },
  {
    id: "5", type: "account", title: "LEGEND RANK ACCOUNT", level: 55, collectionRank: "Renowned Collector", skins: 200, heroes: 95, price: 69.90,
    image: "/images/skins-collection.png", category: "mid-tier", dedicatedId: "LRA",
    description: "Solid mid-tier account perfect for grinding to Mythic. Includes many event skins.",
    features: ["Event Skins", "Good WR", "Secure"],
    stats: { totalMatches: 2100, winRate: "58%", mvpCount: 450 }
  },
  {
    id: "6", type: "account", title: "MYTHIC ACCOUNT WITH EXCLUSIVES", level: 72, collectionRank: "Exalted Collector", skins: 380, heroes: 140, price: 129.90,
    image: "/images/hero-banner.png", badge: "Hot", category: "premium", dedicatedId: "MXA",
    description: "A highly sought-after Mythic account packed with exclusive skins and items.",
    features: ["Exclusive Avatars", "Premium Skins", "High Rank"],
    stats: { totalMatches: 3800, winRate: "62%", mvpCount: 950 }
  },
  {
    id: "7", type: "account", title: "BEGINNER FRIENDLY ACCOUNT", level: 30, collectionRank: "Expert Collector", skins: 80, heroes: 60, price: 29.90,
    image: "/images/account-preview.png", badge: "New", category: "starter", dedicatedId: "BFA",
    description: "Great value for new players. Skip the early grind and jump straight into ranked.",
    features: ["Basic Emblems", "Starter Heroes", "Cheap"],
    stats: { totalMatches: 800, winRate: "50%", mvpCount: 120 }
  },
  {
    id: "8", type: "account", title: "ULTIMATE SKIN COLLECTION", level: 85, collectionRank: "World Collector", skins: 600, heroes: 170, price: 249.90,
    image: "/images/skins-collection.png", badge: "Premium", category: "collector", dedicatedId: "USC",
    description: "Almost every skin in the game. An absolute behemoth of an account.",
    features: ["600+ Skins", "All Heroes", "Unranked"],
    stats: { totalMatches: 6200, winRate: "70%", mvpCount: 2100 }
  },
  {
    id: "uc-unified", type: "pubg-uc", title: "PUBG Mobile UC", price: 0.99,
    image: "https://www.midasbuy.com/midasbuy/images/itemIcon/pubgm_uc_60.png", category: "starter", dedicatedId: "UC",
    description: "Instant delivery PUBG Mobile UC via Player ID.",
    features: ["Instant Delivery", "Official Topup"],
    currencyPackages: [
      { id: "uc_60", amount: 60, price: 0.99 },
      { id: "uc_325", amount: 325, price: 4.99 },
      { id: "uc_660", amount: 660, price: 9.99 },
      { id: "uc_1800", amount: 1800, price: 24.99 },
    ]
  },
  {
    id: "dia-unified", type: "mlbb-diamonds", title: "MLBB Diamonds", price: 1.99,
    image: "https://shop.moonton.com/image/mlbb_diamonds.png", category: "starter", dedicatedId: "DIA",
    description: "Fast topup for MLBB Diamonds via ID & Server ID.",
    features: ["Fast Delivery", "Requires only Game ID"],
    currencyPackages: [
      { id: "dia_86", amount: 86, price: 1.99 },
      { id: "dia_277", amount: 277, price: 4.99 },
      { id: "dia_706", amount: 706, price: 12.99 },
      { id: "dia_2195", amount: 2195, price: 39.99 },
    ]
  },
  {
    id: "valo-points", type: "valo-points", title: "Valorant Points", price: 4.99,
    image: "/images/placeholder.png", category: "starter", dedicatedId: "VALO",
    description: "Fast topup for Valorant Points.",
    features: ["Fast Delivery", "Requires Riot ID"],
    currencyPackages: [
      { id: "vp_475", amount: 475, price: 4.99 },
      { id: "vp_1000", amount: 1000, price: 9.99 },
      { id: "vp_2050", amount: 2050, price: 19.99 },
    ]
  },
  {
    id: "netflix-sub", type: "netflix", title: "Netflix Subscription", price: 9.99,
    image: "/images/placeholder.png", category: "starter", dedicatedId: "NFLX",
    description: "Netflix premium subscription.",
    features: ["Instant Delivery", "Shared/Private Profiles"],
    currencyPackages: [
      { id: "nflx_1m", amount: 1, title: "1 Month", price: 9.99 },
      { id: "nflx_3m", amount: 3, title: "3 Months", price: 27.99 },
    ]
  },
  {
    id: "crunchyroll-sub", type: "crunchyroll", title: "Crunchyroll Premium", price: 7.99,
    image: "/images/placeholder.png", category: "starter", dedicatedId: "CRUN",
    description: "Crunchyroll premium subscription.",
    features: ["Instant Delivery", "Ad-Free Anime"],
    currencyPackages: [
      { id: "crun_1m", amount: 1, title: "1 Month", price: 7.99 },
    ]
  },
  {
    id: "playstation-gift", type: "playstation", title: "PlayStation Gift Card", price: 10.00,
    image: "/images/placeholder.png", category: "starter", dedicatedId: "PSN",
    description: "PlayStation Network gift cards.",
    features: ["Instant Delivery", "Various Regions"],
    currencyPackages: [
      { id: "psn_10", amount: 10, title: "$10 Card", price: 10.00 },
      { id: "psn_25", amount: 25, title: "$25 Card", price: 25.00 },
    ]
  },
  {
    id: "steam-gift", type: "steam", title: "Steam Wallet Card", price: 10.00,
    image: "/images/placeholder.png", category: "starter", dedicatedId: "STM",
    description: "Steam Wallet gift cards.",
    features: ["Instant Delivery", "Global/Region Specific"],
    currencyPackages: [
      { id: "stm_10", amount: 10, title: "$10 Card", price: 10.00 },
      { id: "stm_20", amount: 20, title: "$20 Card", price: 20.00 },
    ]
  },
  {
    id: "apple-gift", type: "apple", title: "Apple Gift Card", price: 10.00,
    image: "/images/placeholder.png", category: "starter", dedicatedId: "APL",
    description: "Apple iTunes/App Store gift cards.",
    features: ["Instant Delivery", "Various Regions"],
    currencyPackages: [
      { id: "apl_10", amount: 10, title: "$10 Card", price: 10.00 },
      { id: "apl_25", amount: 25, title: "$25 Card", price: 25.00 },
    ]
  },
  {
    id: "fortnite-vbucks", type: "fortnite", title: "Fortnite V-Bucks", price: 7.99,
    image: "/images/placeholder.png", category: "starter", dedicatedId: "FBR",
    description: "Fortnite V-Bucks topup.",
    features: ["Fast Delivery", "Requires Epic ID"],
    currencyPackages: [
      { id: "fbr_1000", amount: 1000, title: "1000 V-Bucks", price: 7.99 },
      { id: "fbr_2800", amount: 2800, title: "2800 V-Bucks", price: 19.99 },
    ]
  }
];

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Strip base64 image data before persisting to avoid localStorage QuotaExceededError.
  // Images are kept in React state; only the URL/small references are persisted.
  const stripBase64 = (product: Product): Product => ({
    ...product,
    image: product.image?.startsWith('data:') ? '' : (product.image || ''),
    images: product.images?.map(img => img.startsWith('data:') ? '' : img) || [],
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem("megatron_products");
      if (saved) {
        const parsedSaved = JSON.parse(saved);
        const productsToSet = [...parsedSaved.filter((p: Product) => p.id !== "uc1" && p.id !== "dia1")];
        
        // Ensure all non-account default products are in the local storage
        defaultProducts.forEach(defProd => {
          if (defProd.type !== "account") {
            if (!productsToSet.some(p => p.id === defProd.id)) {
              productsToSet.push(defProd);
            }
          }
        });
        
        setProducts(productsToSet);
      } else {
        setProducts(defaultProducts);
        localStorage.setItem("megatron_products", JSON.stringify(defaultProducts.map(stripBase64)));
      }
    } catch (err) {
      console.error("Failed to load products from storage, resetting:", err);
      setProducts(defaultProducts);
      localStorage.removeItem("megatron_products");
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem("megatron_products", JSON.stringify(products.map(stripBase64)));
      } catch (err) {
        console.error("localStorage quota exceeded — images will not be persisted:", err);
        // Try saving without images at all as fallback
        try {
          const minified = products.map(p => ({ ...stripBase64(p), images: [] }));
          localStorage.setItem("megatron_products", JSON.stringify(minified));
        } catch (e2) {
          console.error("Could not save even minified products:", e2);
        }
      }
    }
  }, [products, isLoaded]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "megatron_products" && e.newValue) {
        try {
          setProducts(JSON.parse(e.newValue));
        } catch (err) {
          console.error("Failed to parse products from storage sync");
        }
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

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
