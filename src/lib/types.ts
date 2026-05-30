/**
 * TypeScript types and interfaces for the application
 */

export interface Product {
  id: string;
  title: string;
  level: number;
  rank: string;
  skins: number;
  heroes: number;
  price: number;
  image: string;
  badge?: string;
  category?: string;
  recentlySold?: boolean;
}

export interface ProductDetail extends Product {
  images: string[];
  description: string;
  features: string[];
  stats: {
    totalMatches: number;
    winRate: string;
    mvpCount: number;
    maniacKills: number;
  };
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
  verified?: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  bio: string;
  discord: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  logo: string;
  enabled: boolean;
}

export interface Ticket {
  id: string;
  productId: string;
  productTitle: string;
  userId: string;
  username: string;
  status: 'open' | 'pending' | 'closed';
  createdAt: string;
}

export interface User {
  id: string;
  username: string;
  discriminator: string;
  avatar: string;
  email: string;
}
