import React, { createContext, useContext, useState, useEffect } from 'react';

type Currency = 'USD' | 'NPR';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  formatPrice: (usdAmount: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

// Assuming an exchange rate of 1 USD = 157 NPR for demonstration
const EXCHANGE_RATE = 157;

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  // Load from local storage or default to USD
  const [currency, setCurrencyState] = useState<Currency>(() => {
    const saved = localStorage.getItem('megatron-currency');
    return (saved === 'NPR' || saved === 'USD') ? saved : 'NPR';
  });

  useEffect(() => {
    localStorage.setItem('megatron-currency', currency);
  }, [currency]);

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
  };

  const formatPrice = (baseNprAmount: number) => {
    if (currency === 'USD') {
      const converted = baseNprAmount / EXCHANGE_RATE;
      return `$${converted.toFixed(2)}`;
    }
    // Format as NPR with commas (e.g. Rs. 13,000)
    return `Rs. ${Math.round(baseNprAmount).toLocaleString('en-IN')}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
