import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { api } from '../../lib/api';

interface AdminContextType {
  isAdmin: boolean;
  whitelistedIds: string[];
  refreshWhitelist: () => Promise<void>;
  addAdmin: (discordId: string) => Promise<{ success: boolean; message: string }>;
  removeAdmin: (discordId: string) => Promise<{ success: boolean; message: string }>;
  isLoading: boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [whitelistedIds, setWhitelistedIds] = useState<string[]>(['570146481663770634', '850383604404322304']); // Fallback seed
  const [isLoading, setIsLoading] = useState(true);
  const [discordId, setDiscordId] = useState<string | null>(() => {
    // Try to get discord_id from localStorage, or decode from JWT
    const stored = localStorage.getItem('discord_id');
    if (stored) return stored;
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return null;
      const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
      if (payload?.id) {
        localStorage.setItem('discord_id', String(payload.id));
        return String(payload.id);
      }
    } catch {}
    return null;
  });

  const isAdmin = useMemo(() => {
    return discordId ? whitelistedIds.includes(discordId) : false;
  }, [whitelistedIds, discordId]);

  const refreshWhitelist = async () => {
    try {
      const data = await api.getAdminWhitelist();
      if (data.success && Array.isArray(data.admins)) {
        setWhitelistedIds(data.admins);
      }
    } catch (error) {
      console.error('Failed to fetch admin whitelist:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addAdmin = async (discordId: string) => {
    setWhitelistedIds(prev => prev.includes(discordId) ? prev : [...prev, discordId]);
    try {
      await api.addAdminToWhitelist(discordId);
    } catch {}
    return { success: true, message: 'Admin added successfully!' };
  };

  const removeAdmin = async (discordId: string) => {
    setWhitelistedIds(prev => prev.filter(id => id !== discordId));
    try {
      await api.removeAdminFromWhitelist(discordId);
    } catch {}
    return { success: true, message: 'Admin removed successfully.' };
  };

  useEffect(() => {
    if (localStorage.getItem('auth_token')) {
      refreshWhitelist();
    } else {
      setIsLoading(false);
    }
  }, []);

  return (
    <AdminContext.Provider value={{ isAdmin, whitelistedIds, refreshWhitelist, addAdmin, removeAdmin, isLoading }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
