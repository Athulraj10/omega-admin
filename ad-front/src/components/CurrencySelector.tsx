import React, { useState } from 'react';
import { useCurrency } from '@/contexts/CurrencyContext';

interface CurrencySelectorProps {
  className?: string;
  showLabel?: boolean;
}

export default function CurrencySelector({ className = '', showLabel = true }: CurrencySelectorProps) {
  const { currencies, currentCurrency, setCurrentCurrency, loading } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);

  if (loading) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {showLabel && (
          <span className="text-sm text-gray-600 dark:text-gray-400">Currency:</span>
        )}
        <div className="h-6 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
      </div>
    );
  }

  if (!currentCurrency) {
    return null;
  }

  const activeCurrencies = currencies.filter(currency => currency.isActive);

  return (
    <div className={`relative ${className}`}>
      {showLabel && (
        <span className="text-sm text-gray-600 dark:text-gray-400 mr-2">Currency:</span>
      )}
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
      >
        <span className="text-lg">{currentCurrency.symbol}</span>
        <span>{currentCurrency.code}</span>
        <svg
          className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-1 w-48 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-600 dark:bg-gray-800">
          <div className="py-1">
            {activeCurrencies.map((currency) => (
              <button
                key={currency._id}
                onClick={() => {
                  setCurrentCurrency(currency);
                  setIsOpen(false);
                }}
                className={`flex w-full items-center justify-between px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  currency._id === currentCurrency._id
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
                    : 'text-gray-700 dark:text-gray-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{currency.symbol}</span>
                  <span>{currency.code}</span>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {currency.name}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Backdrop to close dropdown */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
} 