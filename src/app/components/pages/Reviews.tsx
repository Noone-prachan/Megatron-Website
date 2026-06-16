import { Star, ShieldCheck, Quote, Trash2, Filter, ChevronDown } from "lucide-react";
import { useReviews, Review } from "../../context/ReviewContext";
import { toast } from "sonner";
import { useState, useEffect, useMemo } from "react";
import { api } from "../../../lib/api";
import { useAdmin } from "../../context/AdminContext";

function ReviewCard({ review, onRemove }: { review: Review, onRemove: (id: string) => void }) {
  const { isAdmin } = useAdmin();
  const [isExpanded, setIsExpanded] = useState(false);

  const avatarUrl = review.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${review.name}`;
  const isLong = review.comment.length > 250;

  return (
    <div className={`relative break-inside-avoid mb-6 p-8 rounded-[2rem] border border-[var(--border-color)] bg-[var(--bg-secondary)] shadow-sm hover:shadow-2xl hover:shadow-yellow-500/10 hover:-translate-y-2 hover:border-yellow-500/30 transition-all duration-500 overflow-hidden group`}>
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
        <div className="mb-8 flex-1 relative z-10">
          <p className={`text-[var(--text-primary)] font-medium text-base leading-relaxed transition-colors duration-300 ${!isExpanded && isLong ? 'line-clamp-5' : ''}`}>
            "{review.comment}"
          </p>
          {isLong && (
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-yellow-500 hover:text-yellow-400 text-sm font-bold mt-2 transition-colors"
            >
              {isExpanded ? 'Read less' : 'Read more'}
            </button>
          )}
        </div>
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
  const [displayedCount, setDisplayedCount] = useState(12);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highest'>('newest');
  const [isSortOpen, setIsSortOpen] = useState(false);

  const sortOptions = {
    newest: 'Sort by: Newest',
    oldest: 'Sort by: Oldest',
    highest: 'Sort by: Highest Rated'
  };

  const sortedReviews = useMemo(() => {
    return [...reviews].sort((a, b) => {
      if (sortBy === 'highest') return b.rating - a.rating;
      // Date format is something like '2026-05-31T10:44:09.446Z'
      const dateA = new Date(a.date).getTime() || 0;
      const dateB = new Date(b.date).getTime() || 0;
      if (sortBy === 'oldest') return dateA - dateB;
      return dateB - dateA;
    });
  }, [reviews, sortBy]);

  const confirmDelete = () => {
    if (deleteId) {
      removeReview(deleteId);
      toast.success("Review removed successfully.");
      setDeleteId(null);
    }
  };

  return (
    <div className="pt-32 pb-24 min-h-screen flex flex-col items-center relative overflow-hidden bg-[var(--bg-primary)]">
      {/* Background gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[50rem] bg-gradient-to-b from-yellow-500/10 via-amber-500/5 to-transparent pointer-events-none blur-3xl opacity-50 z-0" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-yellow-500/20 rounded-full blur-[100px] pointer-events-none z-0" />
      <div className="absolute top-40 -left-40 w-96 h-96 bg-orange-500/10 rounded-full blur-[100px] pointer-events-none z-0" />
      
      <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-6">
            <span className="text-[var(--text-primary)]">Trusted by</span><br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400">Thousands</span>
          </h1>
          <p className="text-[var(--text-secondary)] max-w-xl mx-auto text-lg font-medium">
            Don't just take our word for it. Read what our customers have to say about their verified purchases.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4 bg-[var(--bg-secondary)] p-4 rounded-2xl border border-[var(--border-color)]">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-yellow-500" />
            </div>
            <div>
              <p className="text-sm text-[var(--text-secondary)] font-medium">Total Reviews</p>
              <p className="text-lg font-bold text-[var(--text-primary)]">{reviews.length} Verified</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Filter className="w-5 h-5 text-[var(--text-secondary)]" />
            <div className="relative">
              <button 
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="flex items-center gap-2 bg-[var(--bg-primary)] border border-[var(--border-color)] hover:border-yellow-500/50 text-[var(--text-primary)] text-sm font-medium rounded-xl px-4 py-2.5 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500/20"
              >
                {sortOptions[sortBy]}
                <ChevronDown className={`w-4 h-4 text-[var(--text-secondary)] transition-transform duration-200 ${isSortOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isSortOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsSortOpen(false)} />
                  <div className="absolute right-0 mt-2 w-48 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                    {(Object.keys(sortOptions) as Array<keyof typeof sortOptions>).map((key) => (
                      <button
                        key={key}
                        onClick={() => {
                          setSortBy(key as any);
                          setDisplayedCount(12);
                          setIsSortOpen(false);
                        }}
                        className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors hover:bg-[var(--bg-primary)] ${sortBy === key ? 'text-yellow-500 bg-[var(--bg-primary)]' : 'text-[var(--text-primary)]'}`}
                      >
                        {sortOptions[key as keyof typeof sortOptions]}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-6">
          {sortedReviews.slice(0, displayedCount).map((review) => (
            <ReviewCard key={review.id} review={review} onRemove={setDeleteId} />
          ))}
        </div>

        <div className="mt-12 flex justify-center items-center gap-4">
          {displayedCount > 12 && (
            <button
              onClick={() => {
                setDisplayedCount(12);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="relative px-8 py-3 rounded-full font-bold text-yellow-500 bg-[var(--bg-primary)] border border-yellow-500/30 hover:border-yellow-500 hover:text-yellow-400 hover:shadow-[0_0_20px_rgba(234,179,8,0.2)] transition-all overflow-hidden group"
            >
              <div className="absolute inset-0 bg-yellow-500/5 group-hover:bg-yellow-500/10 transition-colors" />
              <span className="relative z-10">Collapse</span>
            </button>
          )}
          
          {displayedCount < reviews.length && (
            <button
              onClick={() => setDisplayedCount(prev => prev + 12)}
              className="relative px-8 py-3 rounded-full font-bold text-yellow-500 bg-[var(--bg-primary)] border border-yellow-500/30 hover:border-yellow-500 hover:text-yellow-400 hover:shadow-[0_0_20px_rgba(234,179,8,0.2)] transition-all overflow-hidden group"
            >
              <div className="absolute inset-0 bg-yellow-500/5 group-hover:bg-yellow-500/10 transition-colors" />
              <span className="relative z-10">Load More Reviews</span>
            </button>
          )}
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