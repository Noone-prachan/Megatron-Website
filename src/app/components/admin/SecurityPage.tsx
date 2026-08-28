import { useState, useEffect } from "react";
import { Shield, ShieldAlert, History, ShieldX, Unlock, AlertTriangle, X } from "lucide-react";
import { toast } from "sonner";
import { api } from "../../../lib/api";
import { useAdmin } from "../../context/AdminContext";

interface AuditLog {
  id: string;
  adminId: string;
  action: string;
  details: string;
  timestamp: string;
}

interface DiscordProfile {
  username: string;
  avatarUrl: string;
}

export function SecurityPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [bannedIps, setBannedIps] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'audit' | 'bans' | 'admins'>('audit');
  const [confirmRemoveId, setConfirmRemoveId] = useState<string | null>(null);
  const [adminProfiles, setAdminProfiles] = useState<Record<string, DiscordProfile>>({});

  const { whitelistedIds, addAdmin, removeAdmin } = useAdmin();

  useEffect(() => {
    if (whitelistedIds.length === 0) return;
    Promise.allSettled(whitelistedIds.map(id => api.getDiscordUser(id))).then(results => {
      const map: Record<string, DiscordProfile> = {};
      results.forEach((r, i) => {
        if (r.status === 'fulfilled') {
          map[whitelistedIds[i]] = { username: r.value.username, avatarUrl: r.value.avatarUrl };
        }
      });
      setAdminProfiles(map);
    });
  }, [whitelistedIds]);

  const fetchSecurityData = async () => {
    try {
      const [auditData, bansData] = await Promise.all([
        api.getAuditLogs(),
        api.getBannedIps()
      ]);
      if (auditData.success) setLogs(auditData.logs);
      if (bansData.success) setBannedIps(bansData.ips);
    } catch (error) {
      console.error("Failed to fetch security data", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchSecurityData(); }, []);

  const handleUnban = async (ip: string) => {
    try {
      const data = await api.unbanIp(ip);
      if (data.success) { toast.success(`IP ${ip} unbanned`); fetchSecurityData(); }
      else toast.error(data.message || "Failed to unban IP");
    } catch { toast.error("An error occurred while unbanning"); }
  };

  const handleBan = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const ip = new FormData(e.currentTarget).get('ip') as string;
    if (!ip) return;
    try {
      const data = await api.banIp(ip);
      if (data.success) { toast.success(`IP ${ip} banned`); (e.target as HTMLFormElement).reset(); fetchSecurityData(); }
      else toast.error(data.message || "Failed to ban IP");
    } catch { toast.error("An error occurred while banning"); }
  };

  const handleAddAdmin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const discordId = new FormData(e.currentTarget).get('discordId') as string;
    if (!discordId) return;
    const result = await addAdmin(discordId);
    if (result.success) { toast.success(result.message); (e.target as HTMLFormElement).reset(); }
    else toast.error(result.message);
  };

  const confirmRemove = async () => {
    if (!confirmRemoveId) return;
    const result = await removeAdmin(confirmRemoveId);
    setConfirmRemoveId(null);
    if (result.success) toast.success(result.message);
    else toast.error(result.message);
  };

  if (isLoading) {
    return <div className="p-8 text-center text-[var(--text-secondary)] font-medium">Loading Security Center...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[var(--text-primary)] flex items-center gap-3">
            <Shield className="w-8 h-8 text-[var(--accent)]" /> Security & Audit
          </h1>
          <p className="text-[var(--text-secondary)] mt-1">Monitor admin activity and manage IP bans.</p>
        </div>
        <div className="flex items-center gap-2 bg-[var(--bg-secondary)] p-1 rounded-xl border border-[var(--border-color)]">
          <button onClick={() => setActiveTab('audit')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2 ${activeTab === 'audit' ? 'bg-[var(--accent)]/10 text-[var(--accent)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}>
            <History className="w-4 h-4" /> Audit Logs
          </button>
          <button onClick={() => setActiveTab('bans')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2 ${activeTab === 'bans' ? 'bg-red-500/10 text-red-500' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}>
            <ShieldAlert className="w-4 h-4" /> Ban Management
          </button>
          <button onClick={() => setActiveTab('admins')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2 ${activeTab === 'admins' ? 'bg-purple-500/10 text-purple-500' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}>
            <Unlock className="w-4 h-4" /> Admins
          </button>
        </div>
      </div>

      {activeTab === 'audit' && (
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[var(--bg-primary)] border-b border-[var(--border-color)] text-[var(--text-secondary)] text-xs uppercase tracking-widest">
                  <th className="p-4 font-bold">Time</th>
                  <th className="p-4 font-bold">Admin ID</th>
                  <th className="p-4 font-bold">Action</th>
                  <th className="p-4 font-bold">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)]">
                {logs.length === 0 ? (
                  <tr><td colSpan={4} className="p-8 text-center text-[var(--text-secondary)] font-medium">No audit logs recorded yet.</td></tr>
                ) : logs.map((log) => (
                  <tr key={log.id} className="hover:bg-[var(--bg-primary)] transition-colors">
                    <td className="p-4 text-sm text-[var(--text-secondary)] whitespace-nowrap">{new Date(log.timestamp).toLocaleString()}</td>
                    <td className="p-4"><span className="font-mono text-xs bg-[var(--bg-primary)] px-2 py-1 rounded border border-[var(--border-color)] text-[var(--text-primary)]">{log.adminId}</span></td>
                    <td className="p-4"><span className={`text-xs font-bold px-2 py-1 rounded-full ${log.action.includes('BAN') ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'}`}>{log.action}</span></td>
                    <td className="p-4 text-sm text-[var(--text-primary)] font-medium">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'bans' && (
        <div className="space-y-6">
          <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] p-6 rounded-2xl shadow-sm">
            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
              <ShieldX className="w-5 h-5 text-red-500" /> Manually Ban IP
            </h3>
            <form onSubmit={handleBan} className="flex gap-4">
              <input type="text" name="ip" placeholder="Enter IPv4 or IPv6 address..." className="flex-1 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl px-4 py-2 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]" required />
              <button type="submit" className="px-6 py-2 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-colors">Ban IP</button>
            </form>
          </div>
          <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-[var(--border-color)] bg-[var(--bg-primary)]">
              <h3 className="font-bold text-[var(--text-primary)] flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-orange-500" /> Currently Banned IPs ({bannedIps.length})
              </h3>
            </div>
            <ul className="divide-y divide-[var(--border-color)] max-h-[500px] overflow-y-auto">
              {bannedIps.length === 0 ? (
                <li className="p-8 text-center text-[var(--text-secondary)] font-medium">No IPs are currently banned.</li>
              ) : bannedIps.map((ip) => (
                <li key={ip} className="flex items-center justify-between p-4 hover:bg-[var(--bg-primary)] transition-colors">
                  <span className="font-mono text-sm text-[var(--text-primary)] bg-[var(--bg-primary)] px-3 py-1 rounded-lg border border-[var(--border-color)]">{ip}</span>
                  <button onClick={() => handleUnban(ip)} className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 text-green-500 hover:bg-green-500/20 rounded-lg text-xs font-bold transition-colors">
                    <Unlock className="w-3.5 h-3.5" /> Unban
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'admins' && (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-6">
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                <Unlock className="w-5 h-5 text-purple-500" /> Whitelist Admin
              </h3>
              <form onSubmit={handleAddAdmin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Discord User ID</label>
                  <input type="text" name="discordId" placeholder="e.g. 913826949820997654" className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-purple-500 transition-colors" required />
                </div>
                <button type="submit" className="w-full bg-purple-500/10 hover:bg-purple-500/20 text-purple-500 font-bold py-3 px-4 rounded-xl transition-colors border border-purple-500/20 hover:border-purple-500/40">
                  Add Admin
                </button>
              </form>
              <div className="mt-4 p-4 bg-purple-500/5 rounded-xl border border-purple-500/10 flex items-start gap-3 text-sm text-[var(--text-secondary)]">
                <AlertTriangle className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" />
                <p>Whitelisted users have full access to the admin dashboard, banning capabilities, and ticket management.</p>
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl overflow-hidden shadow-sm h-full flex flex-col">
              <div className="p-4 border-b border-[var(--border-color)] bg-[var(--bg-primary)]">
                <h3 className="font-bold text-sm uppercase tracking-widest text-[var(--text-secondary)]">Current Admins</h3>
              </div>
              <div className="overflow-x-auto flex-1">
                <table className="w-full text-left border-collapse">
                  <tbody className="divide-y divide-[var(--border-color)]">
                    {whitelistedIds.map((id) => (
                      <tr key={id} className="hover:bg-[var(--bg-primary)] transition-colors group">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full overflow-hidden border border-[var(--border-color)] bg-[var(--bg-primary)] shrink-0 flex items-center justify-center">
                              {adminProfiles[id]?.avatarUrl
                                ? <img src={adminProfiles[id].avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                                : <Shield className="w-5 h-5 text-[var(--accent)]" />
                              }
                            </div>
                            <div>
                              <p className="font-bold text-[var(--text-primary)]">{adminProfiles[id]?.username || id}</p>
                              <p className="text-xs text-[var(--text-secondary)] font-mono">{id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          <button onClick={() => setConfirmRemoveId(id)} className="p-2 text-[var(--text-secondary)] hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-colors opacity-0 group-hover:opacity-100" title="Remove Admin">
                            <ShieldX className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {confirmRemoveId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-black text-[var(--text-primary)] flex items-center gap-2">
                <ShieldX className="w-5 h-5 text-red-500" /> Remove Admin
              </h3>
              <button onClick={() => setConfirmRemoveId(null)} className="p-1 rounded-lg hover:bg-[var(--bg-primary)] text-[var(--text-secondary)] transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-[var(--text-secondary)] mb-2">Are you sure you want to remove this admin?</p>
            {adminProfiles[confirmRemoveId]?.username && (
              <p className="font-bold text-[var(--text-primary)] mb-1">{adminProfiles[confirmRemoveId].username}</p>
            )}
            <p className="font-mono text-xs bg-[var(--bg-primary)] border border-[var(--border-color)] px-3 py-2 rounded-lg text-[var(--text-secondary)] mb-6 break-all">{confirmRemoveId}</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmRemoveId(null)} className="flex-1 py-2.5 rounded-xl font-bold border border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--bg-primary)] transition-colors">Cancel</button>
              <button onClick={confirmRemove} className="flex-1 py-2.5 rounded-xl font-bold bg-red-500 text-white hover:bg-red-600 transition-colors">Yes, Remove</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
