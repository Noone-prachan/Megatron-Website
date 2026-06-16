import { createContext, useContext, useState, ReactNode, useEffect, useRef } from "react";
import { toast } from "sonner";
import { motion } from "motion/react";
import { Star } from "lucide-react";

export interface Review {
  id: string;
  name: string;
  avatar?: string;
  comment: string;
  rating: number;
  verified: boolean;
  date: string;
}

interface ReviewContextType {
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'date'>) => void;
  removeReview: (id: string) => void;
}

const CustomReviewToast = ({ t, title, description }: { t: string | number, title: string, description: string }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-[#1a1b26]/90 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl flex items-center gap-3 w-80 relative overflow-hidden group cursor-pointer"
      onClick={() => toast.dismiss(t)}
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-white/10 transition-colors"></div>
      
      <div className="shrink-0 w-8 h-8 rounded-full bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center relative z-10">
        <Star className="w-4 h-4 text-yellow-400" />
      </div>
      
      <div className="flex-1 relative z-10">
        <p className="text-sm font-bold text-white/90 leading-tight">
          {title}
        </p>
        <p className="text-xs text-white/70 mt-1 line-clamp-2">
          {description}
        </p>
      </div>
      
      <button 
        onClick={(e) => {
          e.stopPropagation();
          toast.dismiss(t);
        }} 
        className="absolute top-2 right-2 text-white/30 hover:text-white/60 transition-colors z-20"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
      </button>
    </motion.div>
  );
};

const ReviewContext = createContext<ReviewContextType | undefined>(undefined);

const initialReviews: Review[] = [
  {
    id: "1",
    name: "Verified Customer",
    comment: "Its my 2nd time buying id from here and every time they gain my trust more and more❤️ best store and better store keep going buddy❤️",
    rating: 5,
    verified: true,
    date: "2 days ago",
  },
  {
    id: "2",
    name: "Verified Customer",
    comment: "I bought an account from here and had a very good experience. They guided me properly through the whole process and were very trustworthy and helpful. Everything worked smoothly, and their support was quick and professional. Highly recommended!",
    rating: 5,
    verified: true,
    date: "1 week ago",
  },
  {
    id: "3",
    name: "Verified Customer",
    comment: "Its my second time selling And the service was fast Thanks for helping",
    rating: 5,
    verified: true,
    date: "3 weeks ago",
  },
  {
    id: "4",
    name: "Verified Customer",
    comment: "“It’s my 4th time selling AC here, and every time he earns my trust. The service is always fast and reliable.”",
    rating: 5,
    verified: true,
    date: "1 month ago",
  },
  {
    id: "5",
    name: "Verified Customer",
    comment: "Bought a mythical glory account and everything went perfectly. The transition was smooth and they were very helpful answering my questions. Best marketplace out there!",
    rating: 5,
    verified: true,
    date: "2 months ago",
  },
];

import { api } from "../../lib/api";

export function ReviewProvider({ children }: { children: ReactNode }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const reviewsRef = useRef<Review[]>([]);

  useEffect(() => {
    reviewsRef.current = reviews;
  }, [reviews]);

  useEffect(() => {
    const fetchReviews = async (isInitial = true) => {
      try {
        const res = await api.getReviews();
        if (res.success && res.reviews) {
          const formattedReviews = res.reviews.map(r => ({
            ...r,
            verified: true // all vouches from the vouch channel are assumed verified
          }));

          // Filter out deleted reviews
          const deletedIds = JSON.parse(localStorage.getItem("megatron_deleted_reviews") || "[]");
          const filteredReviews = formattedReviews.filter((r: Review) => !deletedIds.includes(r.id));

          // Check for new reviews if not initial load
          if (!isInitial) {
            const currentIds = new Set(reviewsRef.current.map(r => r.id));
            const newReviews = filteredReviews.filter((r: Review) => !currentIds.has(r.id));
            
            if (newReviews.length > 0) {
              newReviews.forEach((r: Review) => {
                toast.custom((t) => (
                  <CustomReviewToast 
                    t={t}
                    title={`New Review from ${r.name}`}
                    description={`"${r.comment}"`}
                  />
                ), { duration: 5000, position: 'bottom-left' });
              });
            }
          }

          setReviews(filteredReviews);
        } else if (isInitial) {
          const deletedIds = JSON.parse(localStorage.getItem("megatron_deleted_reviews") || "[]");
          setReviews(initialReviews.filter(r => !deletedIds.includes(r.id)));
        }
      } catch (error) {
        console.error("Failed to fetch Discord reviews:", error);
        if (isInitial) setReviews(initialReviews);
      } finally {
        if (isInitial) setIsLoaded(true);
      }
    };

    // Initial fetch
    fetchReviews(true);

    // Poll every 30 seconds for new reviews
    const interval = setInterval(() => {
      fetchReviews(false);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const addReview = (review: Omit<Review, 'id' | 'date'>) => {
    const newReview: Review = {
      ...review,
      id: Math.random().toString(36).substr(2, 9),
      date: "Just now",
    };
    setReviews(prev => [newReview, ...prev]);
  };

  const removeReview = (id: string) => {
    setReviews(prev => prev.filter(r => r.id !== id));
    const deletedIds = JSON.parse(localStorage.getItem("megatron_deleted_reviews") || "[]");
    if (!deletedIds.includes(id)) {
      deletedIds.push(id);
      localStorage.setItem("megatron_deleted_reviews", JSON.stringify(deletedIds));
    }
  };

  return (
    <ReviewContext.Provider value={{ reviews, addReview, removeReview }}>
      {children}
    </ReviewContext.Provider>
  );
}

export function useReviews() {
  const context = useContext(ReviewContext);
  if (context === undefined) {
    throw new Error("useReviews must be used within a ReviewProvider");
  }
  return context;
}