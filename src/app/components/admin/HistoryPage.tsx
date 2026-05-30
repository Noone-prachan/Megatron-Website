import { useState } from "react";
import { useCurrency } from "../../context/CurrencyContext";
import { useHistory } from "../../context/HistoryContext";
import { CheckCircle2, Trash2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

export function HistoryPage() {
  const { formatPrice } = useCurrency();
  const { transactions, clearHistory } = useHistory();
  const [showClearModal, setShowClearModal] = useState(false);

  const confirmClear = () => {
    clearHistory();
    toast.success("Transaction history cleared.");
    setShowClearModal(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-black text-[var(--text-primary)]">Transaction History</h1>
          <p className="text-[var(--text-secondary)] mt-1">A log of all accounts bought and sold on the marketplace.</p>
        </div>
        <button 
          onClick={() => setShowClearModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20 rounded-xl transition-colors font-bold text-sm"
        >
          <Trash2 className="w-4 h-4" />
          Clear History
        </button>
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--bg-primary)] border-b border-[var(--border-color)] text-[var(--text-secondary)] text-xs uppercase tracking-widest">
                <th className="p-4 font-bold">Transaction ID</th>
                <th className="p-4 font-bold">Dedicated ID</th>
                <th className="p-4 font-bold">Product</th>
                <th className="p-4 font-bold">Buyer</th>
                <th className="p-4 font-bold">Date</th>
                <th className="p-4 font-bold">Price</th>
                <th className="p-4 font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-[var(--bg-primary)] transition-colors">
                  <td className="p-4">
                    <span className="text-xs font-mono text-[var(--text-secondary)]">{tx.id}</span>
                  </td>
                  <td className="p-4">
                    <span className="bg-[var(--accent)]/10 text-[var(--accent)] px-2 py-1 rounded text-xs font-black tracking-widest border border-[var(--accent)]/20">
                      {tx.dedicatedId}
                    </span>
                  </td>
                  <td className="p-4">
                    <p className="text-sm font-bold text-[var(--text-primary)]">{tx.title}</p>
                  </td>
                  <td className="p-4">
                    <p className="text-sm text-[var(--text-secondary)]">{tx.buyer}</p>
                  </td>
                  <td className="p-4">
                    <p className="text-sm text-[var(--text-secondary)]">{tx.date}</p>
                  </td>
                  <td className="p-4">
                    <p className="text-sm font-bold text-[var(--text-primary)]">{formatPrice(tx.price)}</p>
                    <p className="text-[10px] uppercase text-[var(--text-secondary)]">{tx.method}</p>
                  </td>
                  <td className="p-4">
                    <span className="text-xs font-bold text-green-500 flex items-center gap-1.5 bg-green-500/10 px-2 py-1 rounded-full w-fit">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Clear Confirmation Modal */}
      {showClearModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-3 mb-4 text-red-500">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-xl font-black text-[var(--text-primary)]">Clear History?</h3>
            </div>
            <p className="text-sm text-[var(--text-secondary)] mb-6">Are you sure you want to completely clear the transaction history? This action cannot be undone and will permanently delete all records.</p>
            <div className="flex items-center gap-3 justify-end">
              <button 
                onClick={() => setShowClearModal(false)}
                className="px-4 py-2 rounded-xl text-sm font-bold text-[var(--text-primary)] hover:bg-[var(--bg-primary)] transition-colors border border-transparent hover:border-[var(--border-color)]"
              >
                Cancel
              </button>
              <button 
                onClick={confirmClear}
                className="px-4 py-2 rounded-xl text-sm font-bold bg-red-500 text-white hover:bg-red-600 transition-colors shadow-md"
              >
                Yes, Clear Everything
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
