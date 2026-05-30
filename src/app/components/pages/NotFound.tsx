import { Link } from "react-router";
import { motion } from "motion/react";
import { Home, Search } from "lucide-react";

export function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-lg">
        {/* Animated 404 */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", bounce: 0.4 }}
          className="text-[140px] font-black leading-none gradient-text mb-4"
        >
          404
        </motion.div>

        <h1 className="text-2xl font-bold text-white mb-3">Page Not Found</h1>
        <p className="text-white/35 mb-10">The page you're looking for doesn't exist or has been moved.</p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/">
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              className="btn-primary flex items-center gap-2 px-6 py-3 text-sm"
            >
              <span className="relative z-10 flex items-center gap-2"><Home className="w-4 h-4" /> Go Home</span>
            </motion.button>
          </Link>
          <Link to="/products">
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              className="btn-ghost flex items-center gap-2 px-6 py-3 text-sm"
            >
              <Search className="w-4 h-4" /> Browse Accounts
            </motion.button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
