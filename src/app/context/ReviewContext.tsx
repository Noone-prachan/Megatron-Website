import { createContext, useContext, useState, ReactNode, useEffect } from "react";

export interface Review {
  id: string;
  name: string;
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
    name: "1195056016409231463",
    comment: "Its my 2nd time buying id from here and every time they gain my trust more and more❤️ best store and better store keep going buddy❤️",
    rating: 5,
    verified: true,
    date: "2 days ago",
  },
  {
    id: "2",
    name: "1494357531357872128",
    comment: "I bought an account from here and had a very good experience. They guided me properly through the whole process and were very trustworthy and helpful. Everything worked smoothly, and their support was quick and professional. Highly recommended!",
    rating: 5,
    verified: true,
    date: "1 week ago",
  },
  {
    id: "3",
    name: "1251248171514855526",
    comment: "Its my second time selling And the service was fast Thanks for helping",
    rating: 5,
    verified: true,
    date: "3 weeks ago",
  },
  {
    id: "4",
    name: "839683580506406932",
    comment: "“It’s my 4th time selling AC here, and every time he earns my trust. The service is always fast and reliable.”",
    rating: 5,
    verified: true,
    date: "1 month ago",
  },
];

export function ReviewProvider({ children }: { children: ReactNode }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Clear old data and force a refresh from initialReviews
    localStorage.removeItem("megatron_reviews");
    setReviews(initialReviews);
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("megatron_reviews", JSON.stringify(reviews));
    }
  }, [reviews, isLoaded]);

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