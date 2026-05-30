import { createContext, useContext, useState, ReactNode, useEffect } from "react";

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

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await api.getReviews();
        if (res.success && res.reviews) {
          const formattedReviews = res.reviews.map(r => ({
            ...r,
            verified: true // all vouches from the vouch channel are assumed verified
          }));
          setReviews(formattedReviews);
        } else {
          setReviews(initialReviews);
        }
      } catch (error) {
        console.error("Failed to fetch Discord reviews:", error);
        setReviews(initialReviews);
      } finally {
        setIsLoaded(true);
      }
    };
    fetchReviews();
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