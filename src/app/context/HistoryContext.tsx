import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface Transaction {
  id: string;
  dedicatedId: string;
  title: string;
  buyer: string;
  date: string;
  price: number;
  method: string;
}

interface HistoryContextType {
  transactions: Transaction[];
  addTransaction: (tx: Transaction) => void;
  clearHistory: () => void;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export function HistoryProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("megatron_history");
    if (saved) {
      setTransactions(JSON.parse(saved));
    }
    // Removed the mockRealTransactions fallback so it starts empty if cleared
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("megatron_history", JSON.stringify(transactions));
    }
  }, [transactions, isLoaded]);

  const addTransaction = (tx: Transaction) => {
    setTransactions(prev => [tx, ...prev]);
  };

  const clearHistory = () => {
    setTransactions([]);
  };

  return (
    <HistoryContext.Provider value={{ transactions, addTransaction, clearHistory }}>
      {children}
    </HistoryContext.Provider>
  );
}

export function useHistory() {
  const context = useContext(HistoryContext);
  if (context === undefined) {
    throw new Error("useHistory must be used within a HistoryProvider");
  }
  return context;
}
