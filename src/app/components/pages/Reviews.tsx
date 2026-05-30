import { Star, ShieldCheck, Quote, Trash2 } from "lucide-react";
import { useReviews, Review } from "../../context/ReviewContext";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { api } from "../../../lib/api";

function ReviewCard({ review, onRemove }: { review: Review, onRemove: (id: string) => void }) {
  const ADMIN_IDS = ['913826949820997654', '570146481663770634', '850383604404322304'];
  const discordId = localStorage.getItem("discord_id");
  const isAdmin = discordId ? ADMIN_IDS.includes(discordId) : false;

  const avatarUrl = review.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${review.name}`;

  return (
    <div className={`relative p-8 rounded-[2rem] border border-[var(--border-color)] bg-[var(--bg-secondary)] shadow-sm hover:shadow-2xl hover:shadow-yellow-500/10 hover:-translate-y-2 hover:border-yellow-500/30 transition-all duration-500 overflow-hidden group`}>
      {/* Subtle Background Glow on Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <Quote className="absolute -top-4 -right-4 w-24 h-24 text-[var(--border-color)] opacity-10 group-hover:scale-110 group-hover:-rotate-12 group-hover:text-yellow-500/20 transition-all duration-700 ease-out z-0" />
      
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
            <Star key={i} className={`w-5 h-5 transition-all duration-300 ${i < review.rating ? 'fill-yellow-400 text-yellow-400 group-hover:scale-110' : 'fill-[var(--border-color)] text-[var(--border-color)]'} ${i < review.rating ? `delay-[${i * 50}ms]` : ''}`} />
          ))}
        </div>
        <p className="text-[var(--text-primary)] font-medium text-base leading-relaxed mb-8 flex-1 group-hover:text-white transition-colors duration-300 relative z-10">
          "{review.comment}"
        </p>
        <div className="flex items-center gap-4 pt-6 border-t border-[var(--border-color)] mt-auto group-hover:border-yellow-500/20 transition-colors duration-300">
          <div className={`w-12 h-12 rounded-full border-2 border-[var(--border-color)] group-hover:border-yellow-500/50 group-hover:shadow-[0_0_15px_rgba(234,179,8,0.3)] transition-all duration-500 overflow-hidden shrink-0 bg-[var(--bg-primary)]`}>
            <img src={avatarUrl} alt={review.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
          </div>
          <div>
            <h4 className="font-bold text-[var(--text-primary)] text-sm flex items-center gap-1.5">
              {review.name || 'Verified Customer'}
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
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-6">
            <span className="text-white">Trusted by</span><br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400">Thousands</span>
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