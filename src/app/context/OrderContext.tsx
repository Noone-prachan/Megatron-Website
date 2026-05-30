import { createContext, useContext, useState, ReactNode } from 'react';
import { Product } from './ProductContext';

export interface Order {
  id: string;
  product: Product;
  userId: string;
  status: 'Unverified' | 'Sold' | 'Cancelled';
}

interface OrderContextType {
  orders: Order[];
  addOrder: (product: Product, userId: string) => void;
  updateOrderStatus: (orderId: string, status: 'Sold' | 'Cancelled') => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);

  const addOrder = (product: Product, userId: string) => {
    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9),
      product,
      userId,
      status: 'Unverified',
    };
    setOrders((prevOrders) => [...prevOrders, newOrder]);
  };

  const updateOrderStatus = (orderId: string, status: 'Sold' | 'Cancelled') => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status } : order
      )
    );
  };

  return (
    <OrderContext.Provider value={{ orders, addOrder, updateOrderStatus }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
}