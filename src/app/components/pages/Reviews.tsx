import { Star, ShieldCheck, Quote, Trash2 } from "lucide-react";
import { useReviews, Review } from "../../context/ReviewContext";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { api } from "../../../lib/api";

function ReviewCard({ review, onRemove }: { review: Review, onRemove: (id: string) => void }) {
  const [user, setUser] = useState<{ global_name: string, avatar: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const ADMIN_IDS = ['913826949820997654', '570146481663770634', '850383604404322304'];
  const discordId = localStorage.getItem("discord_id");
  const isAdmin = discordId ? ADMIN_IDS.includes(discordId) : false;

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      try {
        const { data } = await api.get(`/user/${review.name}`);
        setUser(data);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, [review.name]);

  if (isLoading) {
    return (
      <div className="p-8 rounded-[2rem] border border-[var(--border-color)] bg-[var(--bg-secondary)] shadow-sm animate-pulse">
        <div className="flex gap-1 mb-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-5 h-5 bg-[var(--border-color)] rounded-sm" />
          ))}
        </div>
        <div className="h-4 bg-[var(--border-color)] rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-[var(--border-color)] rounded w-1/2 mb-8"></div>
        <div className="flex items-center gap-4 pt-6 border-t border-[var(--border-color)] mt-auto">
          <div className="w-12 h-12 rounded-full bg-[var(--border-color)]"></div>
          <div>
            <div className="h-4 bg-[var(--border-color)] rounded w-24 mb-2"></div>
            <div className="h-3 bg-[var(--border-color)] rounded w-16"></div>
          </div>
        </div>
      </div>
    );
  }

  const avatarUrl = user
    ? `https://cdn.discordapp.com/avatars/${review.name}/${user.avatar}.png`
    : `https://api.dicebear.com/7.x/initials/svg?seed=${review.name}`;

  return (
    <div className={`p-8 rounded-[2rem] border border-[var(--border-color)] bg-[var(--bg-secondary)] shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden group`}>
      <Quote className="absolute top-6 right-6 w-12 h-12 text-[var(--border-color)] opacity-20 group-hover:scale-110 group-hover:opacity-40 transition-all duration-500" />
      <div className="relative z-10 flex flex-col h-full">
        {isAdmin && (
          <button
            onClick={() => onRemove(review.id)}
            className="absolute top-0 right-0 p-2 text-red-500 bg-red-500/10 hover:bg-red-500/20 rounded-full transition-colors opacity-0 group-hover:opacity-100"
            title="Remove Review"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
        <div className="flex gap-1 mb-6">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`w-5 h-5 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'fill-[var(--border-color)] text-[var(--border-color)]'}`} />
          ))}
        </div>
        <p className="text-[var(--text-primary)] font-medium text-base leading-relaxed mb-8 flex-1">
          "{review.comment}"
        </p>
        <div className="flex items-center gap-4 pt-6 border-t border-[var(--border-color)] mt-auto">
          <div className={`w-12 h-12 rounded-full border border-[var(--border-color)] overflow-hidden shrink-0 bg-[var(--bg-primary)]`}>
            <img src={avatarUrl} alt={user?.global_name || review.name} className="w-full h-full object-cover" />
          </div>
          <div>
            <h4 className="font-bold text-[var(--text-primary)] text-sm flex items-center gap-1.5">
              {user?.global_name || 'Anonymous User'}
              {review.verified && (
                <ShieldCheck className="w-4 h-4 text-blue-500" />
              )}
            </h4>
            <p className="text-[var(--text-secondary)] text-xs font-medium mt-0.5">{review.date}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Reviews() {
  const { reviews, removeReview } = useReviews();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const confirmDelete = () => {
    if (deleteId) {
      removeReview(deleteId);
      toast.success("Review removed successfully.");
      setDeleteId(null);
    }
  };

  return (
    <div className="pt-32 pb-24 min-h-screen flex flex-col items-center">
      <div className="max-w-7xl mx-auto px-6 w-full">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[var(--text-primary)] mb-6">
            Trusted by<br/>Thousands
          </h1>
          <p className="text-[var(--text-secondary)] max-w-xl mx-auto text-lg font-medium">
            Don't just take our word for it. Read what our customers have to say about their verified purchases.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} onRemove={setDeleteId} />
          ))}
        </div>
        {deleteId && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 pointer-events-auto">
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-200">
              <h3 className="text-xl font-black text-[var(--text-primary)] mb-2">Remove Review?</h3>
              <p className="text-sm text-[var(--text-secondary)] mb-6">Are you sure you want to permanently delete this customer review?</p>
              <div className="flex items-center gap-3 justify-end">
                <button 
                  onClick={() => setDeleteId(null)}
                  className="px-4 py-2 rounded-xl text-sm font-bold text-[var(--text-primary)] hover:bg-[var(--bg-primary)] transition-colors border border-transparent hover:border-[var(--border-color)]"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDelete}
                  className="px-4 py-2 rounded-xl text-sm font-bold bg-red-500 text-white hover:bg-red-600 transition-colors shadow-md"
                >
                  Yes, Remove
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}