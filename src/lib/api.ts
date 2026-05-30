/**
 * API Client for MLBB Market
 * Handles all communication with the backend server
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

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

  // Payments
  async getPaymentMethods() {
    return this.request<{
      methods: Array<{
        id: string;
        name: string;
        logo: string;
        enabled: boolean;
      }>;
    }>('/payments/methods');
  }

  async verifyEsewaPayment(data: { oid: string; amt: number; refId: string }) {
    return this.request<{
      success: boolean;
      message: string;
      orderId: string;
      amount: number;
      reference: string;
    }>('/payments/esewa/verify', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async verifyKhaltiPayment(data: { token: string; amount: number }) {
    return this.request<{
      success: boolean;
      message: string;
      paymentId: string;
      amount: number;
    }>('/payments/khalti/verify', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async verifyImepayPayment(data: { transactionId: string; amount: number }) {
    return this.request<{
      success: boolean;
      message: string;
      transactionId: string;
      amount: number;
    }>('/payments/imepay/verify', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export const api = new ApiClient();
export type { User };
