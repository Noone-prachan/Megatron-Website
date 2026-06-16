import React, { createContext, useContext, useState, useEffect } from 'react';
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
  const [whitelistedIds, setWhitelistedIds] = useState<string[]>(['913826949820997654', '570146481663770634', '850383604404322304']); // Fallback seed
  const [isLoading, setIsLoading] = useState(true);
  
  const currentDiscordId = localStorage.getItem('discord_id');
  const isAdmin = currentDiscordId ? whitelistedIds.includes(currentDiscordId) : false;

  const refreshWhitelist = async () => {
    try {
      // Create a specific fetch call for the whitelist
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/whitelist`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });
      const data = await response.json();
      if (data.success && data.admins) {
        setWhitelistedIds(data.admins);
      }
    } catch (error) {
      console.error('Failed to fetch admin whitelist:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addAdmin = async (discordId: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/whitelist/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({ discordId })
      });
      const data = await response.json();
      if (data.success) {
        await refreshWhitelist();
      }
      return { success: data.success, message: data.message || data.error };
    } catch (error: any) {
      return { success: false, message: 'Network error while adding admin.' };
    }
  };

  const removeAdmin = async (discordId: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/whitelist/remove`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({ discordId })
      });
      const data = await response.json();
      if (data.success) {
        await refreshWhitelist();
      }
      return { success: data.success, message: data.message || data.error };
    } catch (error: any) {
      return { success: false, message: 'Network error while removing admin.' };
    }
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
