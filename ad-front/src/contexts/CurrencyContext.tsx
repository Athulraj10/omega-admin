import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Currency {
  _id: string;
  name: string;
  code: string;
  symbol: string;
  exchangeRate: number;
  isDefault: boolean;
  isActive: boolean;
  decimalPlaces: number;
}

interface CurrencyContextType {
  currencies: Currency[];
  currentCurrency: Currency | null;
  defaultCurrency: Currency | null;
  loading: boolean;
  error: string | null;
  setCurrentCurrency: (currency: Currency) => void;
  formatPrice: (amount: number, currency?: Currency) => string;
  convertPrice: (amount: number, fromCurrency: Currency, toCurrency: Currency) => number;
  fetchCurrencies: () => Promise<void>;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

interface CurrencyProviderProps {
  children: ReactNode;
}

export const CurrencyProvider: React.FC<CurrencyProviderProps> = ({ children }) => {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [currentCurrency, setCurrentCurrency] = useState<Currency | null>(null);
  const [defaultCurrency, setDefaultCurrency] = useState<Currency | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCurrencies = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const API = (await import('@/utils/api')).default;
      const response = await API.get('/admin/currencies');
      
      if (response.data?.meta?.code === 200 || response.data?.success) {
        const fetchedCurrencies = response.data.data || [];
        setCurrencies(fetchedCurrencies);
        
        // Find default currency
        const defaultCurr = fetchedCurrencies.find((curr: Currency) => curr.isDefault);
        setDefaultCurrency(defaultCurr || null);
        
        // Set current currency to default if not set
        if (!currentCurrency && defaultCurr) {
          setCurrentCurrency(defaultCurr);
        } else if (!currentCurrency && fetchedCurrencies.length > 0) {
          setCurrentCurrency(fetchedCurrencies[0]);
        }
      } else {
        throw new Error(response.data?.meta?.message || 'Failed to fetch currencies');
      }
    } catch (err: any) {
      console.error('Error fetching currencies:', err);
      setError(err.message || 'Failed to fetch currencies');
      
      // Fallback to default currencies if API fails
      const fallbackCurrencies: Currency[] = [
        {
          _id: '1',
          name: 'US Dollar',
          code: 'USD',
          symbol: '$',
          exchangeRate: 1.0,
          isDefault: true,
          isActive: true,
          decimalPlaces: 2,
        },
        {
          _id: '2',
          name: 'Euro',
          code: 'EUR',
          symbol: '€',
          exchangeRate: 0.85,
          isDefault: false,
          isActive: true,
          decimalPlaces: 2,
        },
        {
          _id: '3',
          name: 'British Pound',
          code: 'GBP',
          symbol: '£',
          exchangeRate: 0.73,
          isDefault: false,
          isActive: true,
          decimalPlaces: 2,
        },
      ];
      
      setCurrencies(fallbackCurrencies);
      setDefaultCurrency(fallbackCurrencies[0]);
      setCurrentCurrency(fallbackCurrencies[0]);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (amount: number, currency?: Currency): string => {
    const targetCurrency = currency || currentCurrency || defaultCurrency;
    
    if (!targetCurrency) {
      return `$${amount.toFixed(2)}`; // Fallback
    }

    // Convert amount if needed
    let convertedAmount = amount;
    if (currentCurrency && currency && currentCurrency._id !== currency._id) {
      convertedAmount = convertPrice(amount, currency, currentCurrency);
    }

    const formattedAmount = convertedAmount.toFixed(targetCurrency.decimalPlaces);
    
    // Handle different currency symbol positions
    switch (targetCurrency.code) {
      case 'USD':
      case 'CAD':
      case 'AUD':
        return `${targetCurrency.symbol}${formattedAmount}`;
      case 'EUR':
      case 'GBP':
        return `${targetCurrency.symbol}${formattedAmount}`;
      case 'JPY':
        return `${formattedAmount}${targetCurrency.symbol}`;
      default:
        return `${targetCurrency.symbol}${formattedAmount}`;
    }
  };

  const convertPrice = (amount: number, fromCurrency: Currency, toCurrency: Currency): number => {
    if (fromCurrency._id === toCurrency._id) {
      return amount;
    }

    // Convert to base currency (USD) first, then to target currency
    const baseAmount = amount / fromCurrency.exchangeRate;
    return baseAmount * toCurrency.exchangeRate;
  };

  useEffect(() => {
    fetchCurrencies();
  }, []);

  const value: CurrencyContextType = {
    currencies,
    currentCurrency,
    defaultCurrency,
    loading,
    error,
    setCurrentCurrency,
    formatPrice,
    convertPrice,
    fetchCurrencies,
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}; 