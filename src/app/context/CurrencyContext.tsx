import React, { createContext, useContext, useState, useEffect } from 'react';

type Currency = 'USD' | 'NPR';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  formatPrice: (usdAmount: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

// Assuming an exchange rate of 1 USD = 133 NPR for demonstration
const EXCHANGE_RATE = 133;

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  // Load from local storage or default to USD
  const [currency, setCurrencyState] = useState<Currency>(() => {
    const saved = localStorage.getItem('megatron-currency');
    return (saved === 'USD' || saved === 'NPR') ? saved : 'USD';
  });

  useEffect(() => {
    localStorage.setItem('megatron-currency', currency);
  }, [currency]);

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
  };

  const formatPrice = (usdAmount: number) => {
    if (currency === 'NPR') {
      const converted = Math.round(usdAmount * EXCHANGE_RATE);
      // Format as NPR with commas (e.g. Rs. 13,000)
      return `Rs. ${converted.toLocaleString('en-IN')}`;
    }
    // Format as USD (e.g. $99.90)
    return `$${usdAmount.toFixed(2)}`;
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
