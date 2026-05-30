import { Star, CheckCircle } from "lucide-react";
import { motion } from "motion/react";

interface ReviewCardProps {
  review: {
    id: string;
    name: string;
    rating: number;
    comment: string;
    date: string;
    verified?: boolean;
  };
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 120, damping: 18 }}
      viewport={{ once: true }}
      className="p-6 bg-gradient-to-br from-[#1a1a2e] to-[#16162a] border border-white/10 rounded-xl"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-bold">{review.name}</h4>
            {review.verified && (
              <CheckCircle className="w-4 h-4 text-green-500" />
            )}
          </div>
          <p className="text-xs text-gray-400">{review.date}</p>
        </div>
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <motion.span
              key={i}
              initial={{ scale: 0.8, opacity: 0.2 }}
              animate={{ scale: i < review.rating ? 1.0 : 0.9, opacity: i < review.rating ? 1 : 0.35 }}
              transition={{ delay: i * 0.04, duration: 0.25 }}
            >
              <Star
                className={`w-4 h-4 ${
                  i < review.rating ? "fill-yellow-500 text-yellow-500" : "text-gray-600"
                }`}
              />
            </motion.span>
          ))}
        </div>
      </div>
      <p className="text-gray-300 text-sm leading-relaxed">{review.comment}</p>
    </motion.div>
  );
}
