import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface WishlistContextType {
  wishlistIds: string[];
  addToWishlist: (id: string) => void;
  removeFromWishlist: (id: string) => void;
  isInWishlist: (id: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("megatron_wishlist");
    if (saved) {
      setWishlistIds(JSON.parse(saved));
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("megatron_wishlist", JSON.stringify(wishlistIds));
    }
  }, [wishlistIds, isLoaded]);

  const addToWishlist = (id: string) => {
    setWishlistIds(prev => {
      if (!prev.includes(id)) return [...prev, id];
      return prev;
    });
  };

  const removeFromWishlist = (id: string) => {
    setWishlistIds(prev => prev.filter(itemId => itemId !== id));
  };

  const isInWishlist = (id: string) => {
    return wishlistIds.includes(id);
  };

  return (
    <WishlistContext.Provider value={{ wishlistIds, addToWishlist, removeFromWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
