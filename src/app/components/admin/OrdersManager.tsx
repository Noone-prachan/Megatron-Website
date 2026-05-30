import { useOrders } from '../../context/OrderContext';
import { motion } from 'motion/react';
import { CheckCircle2, XCircle, Clock, Package, User, Hash, ShieldAlert } from 'lucide-react';

export function OrdersManager() {
  const { orders, updateOrderStatus } = useOrders();

  const pendingOrders = orders.filter(o => o.status === 'Unverified').length;

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-[var(--border-color)] pb-6">
        <div>
          <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 tracking-tight">Order Management</h2>
          <p className="text-[var(--text-secondary)] mt-2 font-medium">Review and verify user purchases securely.</p>
        </div>
        
        <div className="flex gap-4">
          <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl px-6 py-3 flex flex-col items-center shadow-lg">
            <span className="text-[var(--text-secondary)] text-xs font-bold uppercase tracking-wider mb-1">Total Orders</span>
            <span className="text-2xl font-black text-white">{orders.length}</span>
          </div>
          <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/5 border border-yellow-500/30 rounded-2xl px-6 py-3 flex flex-col items-center shadow-[0_0_15px_rgba(234,179,8,0.1)]">
            <span className="text-yellow-500/80 text-xs font-bold uppercase tracking-wider mb-1">Pending</span>
            <span className="text-2xl font-black text-yellow-400">{pendingOrders}</span>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="grid gap-6">
        {orders.length === 0 ? (
          <div className="text-center py-20 bg-[var(--bg-secondary)] rounded-3xl border border-[var(--border-color)]">
            <Package className="w-16 h-16 text-[var(--text-secondary)] mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-bold text-[var(--text-primary)]">No orders yet</h3>
            <p className="text-[var(--text-secondary)] mt-2">When users purchase accounts, they will appear here.</p>
          </div>
        ) : (
          orders.map((order, idx) => (
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
                    <span className="text-[var(--text-secondary)] text-xs font-bold uppercase tracking-wider mb-1 block">Product</span>
                    <h3 className="text-xl font-black text-white group-hover:text-[var(--accent)] transition-colors line-clamp-1">{order.product.title}</h3>
                  </div>
                  <div>
                    <span className="text-[var(--text-secondary)] text-xs font-bold uppercase tracking-wider mb-1 block flex items-center gap-1">
                      <User className="w-3 h-3" /> Buyer ID
                    </span>
                    <p className="text-gray-300 font-medium font-mono bg-black/30 px-3 py-1.5 rounded-xl inline-block border border-white/5">{order.userId}</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 w-full xl:w-auto xl:ml-6 shrink-0 border-t xl:border-t-0 xl:border-l border-[var(--border-color)] pt-6 xl:pt-0 xl:pl-6 pl-4">
                {order.status === 'Unverified' ? (
                  <>
                    <button
                      onClick={() => updateOrderStatus(order.id, 'Sold')}
                      className="flex-1 xl:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-bold bg-gradient-to-r from-[#bef264] to-[#a3e635] text-black hover:shadow-[0_0_25px_rgba(190,242,100,0.4)] transition-all hover:scale-105 active:scale-95"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                      Mark Sold
                    </button>
                    <button
                      onClick={() => updateOrderStatus(order.id, 'Cancelled')}
                      className="flex-1 xl:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-bold bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/50 transition-all hover:scale-105 active:scale-95"
                    >
                      <XCircle className="w-5 h-5" />
                      Cancel
                    </button>
                  </>
                ) : (
                  <div className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold bg-white/5 text-[var(--text-secondary)] border border-white/5 cursor-not-allowed">
                    <ShieldAlert className="w-5 h-5 opacity-50" />
                    No Actions Available
                  </div>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}