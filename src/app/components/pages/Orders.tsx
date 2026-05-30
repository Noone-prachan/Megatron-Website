import { useOrders } from '../../context/OrderContext';
import { motion } from 'motion/react';
import { CheckCircle2, XCircle, Clock, Package, Hash, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Orders() {
  const { orders } = useOrders();
  const userId = localStorage.getItem("discord_id");
  const userOrders = orders.filter(order => order.userId === userId);

  return (
    <div className="pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-[var(--border-color)] pb-6">
        <div>
          <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 tracking-tight">My Orders</h2>
          <p className="text-[var(--text-secondary)] mt-2 font-medium">View the status of your purchased accounts.</p>
        </div>
        
        <div className="flex gap-4">
          <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl px-6 py-3 flex flex-col items-center shadow-lg">
            <span className="text-[var(--text-secondary)] text-xs font-bold uppercase tracking-wider mb-1">Total Purchases</span>
            <span className="text-2xl font-black text-white">{userOrders.length}</span>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="grid gap-6">
        {userOrders.length === 0 ? (
          <div className="text-center py-20 bg-[var(--bg-secondary)]/40 backdrop-blur-md rounded-3xl border border-[var(--border-color)]">
            <Package className="w-16 h-16 text-[var(--text-secondary)] mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">No orders found</h3>
            <p className="text-[var(--text-secondary)] mt-2 mb-6">You haven't made any purchases yet.</p>
            <Link to="/products" className="bg-[#bef264] text-black px-6 py-3 rounded-xl text-sm font-black uppercase tracking-wider hover:scale-105 transition-transform shadow-lg inline-block">
              Browse Marketplace
            </Link>
          </div>
        ) : (
          userOrders.map((order, idx) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              key={order.id}
              className="bg-black/40 backdrop-blur-md border border-[var(--border-color)] hover:border-white/20 rounded-[2rem] p-6 sm:p-8 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6 transition-all shadow-[0_4px_30px_rgba(0,0,0,0.3)] group relative overflow-hidden"
            >
              {/* Subtle accent glow based on status */}
              <div className={`absolute top-0 left-0 w-2 h-full ${
                order.status === 'Unverified' ? 'bg-yellow-500/50 shadow-[0_0_20px_rgba(234,179,8,0.5)]' :
                order.status === 'Sold' ? 'bg-[#bef264]/50 shadow-[0_0_20px_rgba(190,242,100,0.5)]' :
                'bg-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.5)]'
              }`} />

              <div className="flex-1 pl-4 w-full">
                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <div className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2 border shadow-lg ${
                    order.status === 'Unverified' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30' :
                    order.status === 'Sold' ? 'bg-[#bef264]/10 text-[#bef264] border-[#bef264]/30' :
                    'bg-red-500/10 text-red-400 border-red-500/30'
                  }`}>
                    {order.status === 'Unverified' && <Clock className="w-3.5 h-3.5" />}
                    {order.status === 'Sold' && <CheckCircle2 className="w-3.5 h-3.5" />}
                    {order.status === 'Cancelled' && <XCircle className="w-3.5 h-3.5" />}
                    {order.status}
                  </div>
                  <span className="text-xs text-[var(--text-secondary)] flex items-center gap-1 font-mono bg-white/5 px-3 py-1 rounded-lg">
                    <Hash className="w-3 h-3" /> {order.id}
                  </span>
                </div>

                <div className="grid sm:grid-cols-2 gap-6 w-full">
                  <div>
                    <span className="text-[var(--text-secondary)] text-xs font-bold uppercase tracking-wider mb-1 block">Purchased Product</span>
                    <h3 className="text-xl font-black text-white group-hover:text-[var(--accent)] transition-colors line-clamp-1">{order.product.title}</h3>
                  </div>
                  <div>
                    <span className="text-[var(--text-secondary)] text-xs font-bold uppercase tracking-wider mb-1 block">Account Level</span>
                    <p className="text-gray-300 font-medium font-mono bg-black/30 px-3 py-1.5 rounded-xl inline-block border border-white/5">Lv. {order.product.level || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Status Note */}
              <div className="w-full xl:w-auto xl:ml-6 shrink-0 border-t xl:border-t-0 xl:border-l border-[var(--border-color)] pt-6 xl:pt-0 xl:pl-6 pl-4 flex flex-col justify-center">
                {order.status === 'Unverified' && (
                  <p className="text-sm text-[var(--text-secondary)] max-w-[200px]">
                    Your order is currently being verified by our staff in your Discord ticket.
                  </p>
                )}
                {order.status === 'Sold' && (
                  <p className="text-sm text-green-400 max-w-[200px]">
                    This account has been successfully delivered to you. Enjoy!
                  </p>
                )}
                {order.status === 'Cancelled' && (
                  <p className="text-sm text-red-400 max-w-[200px]">
                    This order was cancelled by the administration.
                  </p>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}