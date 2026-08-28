import { useState, useEffect, useMemo } from "react";
import { Search, Download, Trash2, Users, Calendar } from "lucide-react";
import { toast } from "sonner";
import { api } from "../../../lib/api";
import { useProducts } from "../../context/ProductContext";

interface SellerAccount {
  id: string;
  name: string;
  category: string;
  dedicatedId?: string;
  phone?: string;
  notes?: string;
  status: "active" | "inactive" | "sold";
  createdAt: string;
  updatedAt: string;
}

export function SellerAccountsPage() {
  const { products, deleteProduct } = useProducts();
  const [accounts, setAccounts] = useState<SellerAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const fetchAccounts = async () => {
    try {
      const data = await api.getSellerAccounts(undefined, searchQuery || undefined, dateFrom || undefined, dateTo || undefined);
      if (data.success) setAccounts(data.accounts);
    } catch (error) {
      console.error("Failed to fetch accounts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, [searchQuery, dateFrom, dateTo]);

  const filteredAccounts = useMemo(() => {
    if (!searchQuery.trim()) return accounts;
    const q = searchQuery.toLowerCase();
    return accounts.filter(
      (a) =>
        (a.name && a.name.toLowerCase().includes(q)) ||
        (a.dedicatedId && a.dedicatedId.toLowerCase().includes(q)) ||
        (a.phone && a.phone.includes(q)) ||
        (a.notes && a.notes.toLowerCase().includes(q))
    );
  }, [accounts, searchQuery]);

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      const data = await api.deleteSellerAccount(deleteConfirmId);
      if (data.success) {
        toast.success("Account deleted.");
        setAccounts((prev) => prev.filter((a) => a.id !== deleteConfirmId));
        setDeleteConfirmId(null);
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete account.");
    }
  };

  const handleExportCSV = async () => {
    try {
      const blob = await api.exportSellerAccountsCSV();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `seller-accounts-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("CSV downloaded!");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export CSV.");
    }
  };

  const statusColors: Record<string, string> = {
    active: "bg-green-500/10 text-green-500 border-green-500/20",
    inactive: "bg-gray-500/10 text-gray-400 border-gray-500/20",
    sold: "bg-red-500/10 text-red-500 border-red-500/20",
  };

  const clearDateFilter = () => {
    setDateFrom("");
    setDateTo("");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-black text-[var(--text-primary)] flex items-center gap-3">
            <Users className="w-8 h-8 text-[var(--accent)]" /> Seller Accounts
          </h1>
          <p className="text-[var(--text-secondary)] mt-1">
            {accounts.length} total records
            {(dateFrom || dateTo) && (
              <span>
                {" "}
                from <span className="font-mono">{dateFrom || "..."}</span>
                {" to "}
                <span className="font-mono">{dateTo || "..."}</span>
              </span>
            )}
            {searchQuery && ` matching "${searchQuery}"`}
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-primary)] transition-colors"
        >
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, code, phone, notes..."
            className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl pl-10 pr-4 py-3 text-sm text-[var(--text-primary)] focus:border-[var(--accent)] outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl pl-10 pr-4 py-3 text-sm text-[var(--text-primary)] focus:border-[var(--accent)] outline-none cursor-pointer"
              placeholder="From"
            />
          </div>
          <span className="text-[var(--text-secondary)] text-sm">to</span>
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl pl-10 pr-4 py-3 text-sm text-[var(--text-primary)] focus:border-[var(--accent)] outline-none cursor-pointer"
              placeholder="To"
            />
          </div>
          {(dateFrom || dateTo) && (
            <button
              onClick={clearDateFilter}
              className="px-3 py-2.5 rounded-xl text-xs font-bold text-[var(--text-secondary)] hover:text-red-400 border border-[var(--border-color)] hover:border-red-400/30 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-12 text-center text-[var(--text-secondary)] font-medium">
            Loading accounts...
          </div>
        ) : filteredAccounts.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="w-12 h-12 text-[var(--text-secondary)]/30 mx-auto mb-3" />
            <p className="text-[var(--text-secondary)] font-medium">No accounts found</p>
            <p className="text-xs text-[var(--text-secondary)]/70 mt-1">
              {searchQuery || dateFrom || dateTo
                ? "Try adjusting your search or date filter."
                : "Add seller accounts via the Products page."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[var(--bg-primary)] border-b border-[var(--border-color)] text-[var(--text-secondary)] text-xs uppercase tracking-widest">
                  <th className="p-4 font-bold">Seller</th>
                  <th className="p-4 font-bold">Code</th>
                  <th className="p-4 font-bold">Phone</th>
                  <th className="p-4 font-bold">Notes</th>
                  <th className="p-4 font-bold">Status</th>
                  <th className="p-4 font-bold">Created</th>
                  <th className="p-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)]">
                {filteredAccounts.map((account) => (
                  <tr key={account.id} className="hover:bg-[var(--bg-primary)] transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {account.discordAvatar ? (
                          <img 
                            key={account.discordAvatar}
                            src={account.discordAvatar} 
                            alt="" 
                            className="w-8 h-8 rounded-full border border-[var(--border-color)] object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                              (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                        ) : null}
                        <div className={`w-8 h-8 rounded-full bg-[var(--border-color)] flex items-center justify-center text-xs font-bold text-[var(--text-secondary)] ${account.discordAvatar ? 'hidden' : ''}`}>
                          {(account.name || '?').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[var(--text-primary)]">{account.name || 'Unnamed Seller'}</p>
                          {account.discordUsername && (
                            <p className="text-xs text-[var(--accent)]">{account.discordUsername}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-[var(--text-secondary)] font-mono">
                      {account.dedicatedId ? (
                        <span className="text-xs font-bold bg-[var(--accent)]/10 text-[var(--accent)] px-2.5 py-1 rounded-lg border border-[var(--accent)]/20">
                          {account.dedicatedId}
                        </span>
                      ) : (
                        <span className="text-[var(--text-secondary)]/40">—</span>
                      )}
                    </td>
                    <td className="p-4 text-sm text-[var(--text-secondary)] font-mono">
                      {account.phone || <span className="text-[var(--text-secondary)]/40">—</span>}
                    </td>
                    <td className="p-4 text-sm text-[var(--text-secondary)] max-w-[200px] truncate">
                      {account.notes || <span className="text-[var(--text-secondary)]/40">—</span>}
                    </td>
                    <td className="p-4">
                      <button
                        onClick={async () => {
                          const newStatus = account.status === 'active' ? 'sold' : 'active';
                          try {
                            const data = await api.updateSellerAccount(account.id, { status: newStatus });
                            if (data.success) {
                              setAccounts(prev => prev.map(a => a.id === account.id ? { ...a, status: newStatus } : a));
                              if (newStatus === 'sold') {
                                const linkedProducts = products.filter(p => p.sellerId === account.id);
                                linkedProducts.forEach(p => deleteProduct(p.id));
                                if (linkedProducts.length > 0) {
                                  toast.success(`Seller and ${linkedProducts.length} linked product(s) marked as sold`);
                                } else {
                                  toast.success(`Status updated to ${newStatus}`);
                                }
                              } else {
                                toast.success(`Status updated to ${newStatus}`);
                              }
                            }
                          } catch (error) {
                            console.error("Failed to update status:", error);
                            toast.error("Failed to update status.");
                          }
                        }}
                        className={`text-xs font-bold px-2.5 py-1 rounded-lg border cursor-pointer transition-colors hover:opacity-80 ${statusColors[account.status] || statusColors.active}`}
                      >
                        {account.status}
                      </button>
                    </td>
                    <td className="p-4 text-xs text-[var(--text-secondary)] whitespace-nowrap">
                      {new Date(account.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 flex justify-end gap-2">
                      <button
                        onClick={() => setDeleteConfirmId(account.id)}
                        className="p-2 text-[var(--text-secondary)] hover:text-red-500 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {deleteConfirmId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-black text-[var(--text-primary)] mb-2">Delete Account?</h3>
            <p className="text-sm text-[var(--text-secondary)] mb-6">This will permanently remove this seller account. This action cannot be undone.</p>
            <div className="flex items-center gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl text-sm font-bold text-[var(--text-primary)] hover:bg-[var(--bg-primary)] transition-colors border border-transparent hover:border-[var(--border-color)]"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-xl text-sm font-bold bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
