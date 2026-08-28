/**
 * API Client for MLBB Market
 * Handles all communication with the backend server
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

interface User {
  id: string;
  username: string;
  discriminator: string;
  avatar: string;
  email: string;
}

interface ApiResponse<T> {
  success?: boolean;
  data?: T;
  error?: string;
  message?: string;
}

class ApiClient {
  private token: string | null = null;

  constructor() {
    // Load token from localStorage on initialization
    this.token = localStorage.getItem('auth_token');
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || error.message || 'Request failed');
    }

    return response.json();
  }

  // Generic methods
  async post<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'GET',
    });
  }

  // Authentication
  async loginWithDiscord() {
    window.location.href = `${API_BASE_URL}/auth/discord`;
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await this.request<{ user: User }>('/auth/me');
      return response.user;
    } catch (error) {
      this.token = null;
      localStorage.removeItem('auth_token');
      return null;
    }
  }

  async logout() {
    try {
      // The server-side logout is fire-and-forget, but we try it.
      await this.request('/auth/logout', { method: 'POST' });
    } catch (error) {
      // Ignore if it fails, the client-side logout is the most important part.
      console.error('Server-side logout failed, proceeding with client-side logout.', error);
    } finally {
      // Clear all session-related data from storage
      this.token = null;
      localStorage.removeItem('auth_token');
      localStorage.removeItem('discord_id');
      localStorage.removeItem('discord_username');
      localStorage.removeItem('discord_global_name');
      localStorage.removeItem('discord_avatar');
    }
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  // Tickets
  async createTicket(data: {
    product: any;
    userId: string;
    username: string;
    playerId?: string;
    serverId?: string;
  }) {
    return this.request<{
      success: boolean;
      ticketId: string;
      ticketUrl: string;
      message: string;
    }>('/tickets/create', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async closeTicket(ticketId: string) {
    return this.request<{ success: boolean; message: string }>('/tickets/close', {
      method: 'POST',
      body: JSON.stringify({ ticketId }),
    });
  }

  // Reviews
  async getReviews() {
    return this.request<{
      success: boolean;
      reviews: Array<{
        id: string;
        name: string;
        avatar: string;
        rating: number;
        comment: string;
        date: string;
      }>;
    }>('/reviews');
  }
  // Chat
  async initLiveChat(username: string, userId?: string) {
    return this.request<{ success: boolean; ticketId: string }>('/chat/init', {
      method: 'POST',
      body: JSON.stringify({ username, userId }),
    });
  }

  async sendLiveChatMessage(ticketId: string, message: string, username: string) {
    return this.request<{ success: boolean }>('/chat/send', {
      method: 'POST',
      body: JSON.stringify({ ticketId, message, username }),
    });
  }

  // Analytics
  async recordVisit() {
    return this.request<{ success: boolean, visits: number }>('/analytics/visit', {
      method: 'POST',
    });
  }

  async getVisits() {
    return this.request<Record<string, number>>('/analytics/visits');
  }

  // Game
  async getLeaderboard() {
    return this.request<{ success: boolean; leaderboard: Array<{id: string, username: string, avatar: string, score: number, date: string}> }>('/game/leaderboard');
  }

  async submitScore(score: number) {
    return this.request<{ success: boolean; message: string }>('/game/score', {
      method: 'POST',
      body: JSON.stringify({ score }),
    });
  }

   // Discord user profiles
   async getDiscordUser(userId: string): Promise<{
     id: string;
     username: string;
     avatarUrl: string;
     bannerUrl: string | null;
     bannerColor: string | null;
   }> {
     return this.request(`/users/${userId}`);
   }

   // Admin endpoints
   async getAuditLogs() {
     return this.request<{ success: boolean; logs: any[] }>('/admin/audit');
   }

   async getBannedIps() {
     return this.request<{ success: boolean; ips: string[] }>('/admin/bans');
   }

   async banIp(ip: string) {
     return this.request<{ success: boolean; message: string }>('/admin/bans/ban', {
       method: 'POST',
       body: JSON.stringify({ ip }),
     });
   }

   async unbanIp(ip: string) {
     return this.request<{ success: boolean; message: string }>('/admin/bans/unban', {
       method: 'POST',
       body: JSON.stringify({ ip }),
     });
   }

   async getAdminWhitelist() {
     return this.request<{ success: boolean; admins: string[] }>('/admin/whitelist');
   }

   async addAdminToWhitelist(discordId: string) {
     return this.request<{ success: boolean; message: string }>('/admin/whitelist/add', {
       method: 'POST',
       body: JSON.stringify({ discordId }),
     });
   }

    async removeAdminFromWhitelist(discordId: string) {
      return this.request<{ success: boolean; message: string }>('/admin/whitelist/remove', {
        method: 'POST',
        body: JSON.stringify({ discordId }),
      });
    }

    // Seller Accounts
    async getSellerAccounts(category?: string, search?: string, from?: string, to?: string) {
      const params = new URLSearchParams();
      if (category && category !== 'all') params.set('category', category);
      if (search) params.set('search', search);
      if (from) params.set('from', from);
      if (to) params.set('to', to);
      const qs = params.toString() ? `?${params.toString()}` : '';
      return this.request<{ success: boolean; accounts: any[] }>(`/admin/seller-accounts${qs}`);
    }

    async getSellerCategories() {
      return this.request<{ success: boolean; categories: string[] }>('/admin/seller-accounts/categories');
    }

    async getSellerAccount(id: string) {
      return this.request<{ success: boolean; account: any }>(`/admin/seller-accounts/${id}`);
    }

    async createSellerAccount(data: { name: string; category: string; dedicatedId?: string; phone?: string; discordId?: string; discordUsername?: string; discordAvatar?: string; notes?: string; status?: string }) {
      return this.request<{ success: boolean; account: any }>('/admin/seller-accounts', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    }

    async updateSellerAccount(id: string, data: Partial<{ name: string; category: string; dedicatedId?: string; phone?: string; discordId?: string; discordUsername?: string; discordAvatar?: string; notes?: string; status: string }>) {
      return this.request<{ success: boolean; account: any }>(`/admin/seller-accounts/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    }

    async deleteSellerAccount(id: string) {
      return this.request<{ success: boolean; message: string }>(`/admin/seller-accounts/${id}`, {
        method: 'DELETE',
      });
    }

    async exportSellerAccountsCSV() {
      const apiBase = import.meta.env.VITE_API_URL || '/api';
      const token = localStorage.getItem('auth_token');
      const headers: HeadersInit = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;
      
      const response = await fetch(`${apiBase}/admin/seller-accounts/export/csv`, { headers });
      if (!response.ok) throw new Error('Export failed');
      return response.blob();
    }
  }

export const api = new ApiClient();
export type { User };
