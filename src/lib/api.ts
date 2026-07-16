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
    await this.request('/auth/logout', { method: 'POST' });
    this.token = null;
    localStorage.removeItem('auth_token');
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
}

export const api = new ApiClient();
export type { User };
