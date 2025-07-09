"use client";

import React, { useState, useEffect } from "react";
import { PencilSquareIcon, TrashIcon } from "@/assets/icons";
import InputGroup from "@/components/FormElements/InputGroup";

interface Currency {
  id: string;
  name: string;
  code: string;
  symbol: string;
  exchangeRate: number;
  isDefault: boolean;
  isActive: boolean;
  decimalPlaces: number;
  createdAt: string;
  updatedAt: string;
}

export default function Currencies() {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCurrency, setEditingCurrency] = useState<Currency | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    symbol: "",
    exchangeRate: "",
    decimalPlaces: "2",
    isActive: true,
  });

  // Mock data for demonstration
  useEffect(() => {
    const mockCurrencies: Currency[] = [
      {
        id: "1",
        name: "US Dollar",
        code: "USD",
        symbol: "$",
        exchangeRate: 1.0,
        isDefault: true,
        isActive: true,
        decimalPlaces: 2,
        createdAt: "2024-01-15",
        updatedAt: "2024-01-20",
      },
      {
        id: "2",
        name: "Euro",
        code: "EUR",
        symbol: "€",
        exchangeRate: 0.85,
        isDefault: false,
        isActive: true,
        decimalPlaces: 2,
        createdAt: "2024-01-16",
        updatedAt: "2024-01-19",
      },
      {
        id: "3",
        name: "British Pound",
        code: "GBP",
        symbol: "£",
        exchangeRate: 0.73,
        isDefault: false,
        isActive: true,
        decimalPlaces: 2,
        createdAt: "2024-01-17",
        updatedAt: "2024-01-18",
      },
      {
        id: "4",
        name: "Japanese Yen",
        code: "JPY",
        symbol: "¥",
        exchangeRate: 110.5,
        isDefault: false,
        isActive: false,
        decimalPlaces: 0,
        createdAt: "2024-01-18",
        updatedAt: "2024-01-20",
      },
    ];

    setTimeout(() => {
      setCurrencies(mockCurrencies);
      setLoading(false);
    }, 1000);
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (editingCurrency) {
      // Update existing currency
      const updatedCurrency: Currency = {
        ...editingCurrency,
        name: formData.name,
        code: formData.code,
        symbol: formData.symbol,
        exchangeRate: parseFloat(formData.exchangeRate),
        decimalPlaces: parseInt(formData.decimalPlaces),
        isActive: formData.isActive,
        updatedAt: new Date().toISOString().split('T')[0],
      };
      
      setCurrencies(currencies.map(curr => 
        curr.id === editingCurrency.id ? updatedCurrency : curr
      ));
      setEditingCurrency(null);
    } else {
      // Add new currency
      const newCurrency: Currency = {
        id: Date.now().toString(),
        name: formData.name,
        code: formData.code,
        symbol: formData.symbol,
        exchangeRate: parseFloat(formData.exchangeRate),
        isDefault: false,
        isActive: formData.isActive,
        decimalPlaces: parseInt(formData.decimalPlaces),
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
      };
      
      setCurrencies([...currencies, newCurrency]);
    }
    
    setFormData({
      name: "",
      code: "",
      symbol: "",
      exchangeRate: "",
      decimalPlaces: "2",
      isActive: true,
    });
    setShowAddForm(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEdit = (currency: Currency) => {
    setEditingCurrency(currency);
    setFormData({
      name: currency.name,
      code: currency.code,
      symbol: currency.symbol,
      exchangeRate: currency.exchangeRate.toString(),
      decimalPlaces: currency.decimalPlaces.toString(),
      isActive: currency.isActive,
    });
    setShowAddForm(true);
  };

  const handleDelete = (currencyId: string) => {
    if (confirm("Are you sure you want to delete this currency?")) {
      console.log("Delete currency:", currencyId);
      setCurrencies(currencies.filter(curr => curr.id !== currencyId));
    }
  };

  const handleSetDefault = (currencyId: string) => {
    setCurrencies(currencies.map(curr => ({
      ...curr,
      isDefault: curr.id === currencyId,
    })));
  };

  const handleStatusChange = (currencyId: string, isActive: boolean) => {
    setCurrencies(currencies.map(curr => 
      curr.id === currencyId ? { ...curr, isActive } : curr
    ));
  };

  const filteredCurrencies = currencies.filter(currency => {
    const matchesSearch = currency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         currency.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || 
                         (statusFilter === "active" && currency.isActive) ||
                         (statusFilter === "inactive" && !currency.isActive);
    return matchesSearch && matchesStatus;
  });

  const resetForm = () => {
    setFormData({
      name: "",
      code: "",
      symbol: "",
      exchangeRate: "",
      decimalPlaces: "2",
      isActive: true,
    });
    setEditingCurrency(null);
    setShowAddForm(false);
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-dark dark:text-white">Currencies</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your store currencies and exchange rates</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-medium text-white transition-all hover:bg-opacity-90"
        >
          <svg width={24} height={24} viewBox="0 0 24 24" fill="currentColor">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 2.25a.75.75 0 01.75.75v8.25H21a.75.75 0 010 1.5h-8.25V21a.75.75 0 01-1.5 0v-8.25H3a.75.75 0 010-1.5h8.25V3a.75.75 0 01.75-.75z"
            />
          </svg>
          Add Currency
        </button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="mb-6 rounded-lg bg-white p-6 shadow-sm dark:bg-gray-dark dark:border dark:border-stroke-dark">
          <h2 className="mb-4 text-lg font-semibold text-dark dark:text-white">
            {editingCurrency ? "Edit Currency" : "Add New Currency"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <InputGroup
                type="text"
                label="Currency Name"
                name="name"
                placeholder="e.g., US Dollar"
                value={formData.name}
                handleChange={handleChange}
                required
              />
              <InputGroup
                type="text"
                label="Currency Code"
                name="code"
                placeholder="e.g., USD"
                value={formData.code}
                handleChange={handleChange}
                required
              />
              <InputGroup
                type="text"
                label="Currency Symbol"
                name="symbol"
                placeholder="e.g., $"
                value={formData.symbol}
                handleChange={handleChange}
                required
              />
              <InputGroup
                type="number"
                label="Exchange Rate"
                name="exchangeRate"
                placeholder="1.0"
                value={formData.exchangeRate}
                handleChange={handleChange}
                required
              />
              <div>
                <label className="mb-2.5 block text-black dark:text-white">
                  Decimal Places
                </label>
                <select
                  name="decimalPlaces"
                  value={formData.decimalPlaces}
                  onChange={handleChange}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  required
                >
                  <option value="0">0 (e.g., JPY)</option>
                  <option value="2">2 (e.g., USD, EUR)</option>
                  <option value="3">3 (e.g., BHD)</option>
                </select>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="mr-2 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary dark:border-stroke-dark dark:bg-dark-2"
              />
              <label htmlFor="isActive" className="text-sm font-medium text-black dark:text-white">
                Active Currency
              </label>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg border border-stroke px-4 py-2 font-medium text-black transition-all hover:shadow-1 dark:border-strokedark dark:text-white dark:hover:shadow-1"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-primary px-4 py-2 font-medium text-white transition-all hover:bg-opacity-90"
              >
                {editingCurrency ? "Update Currency" : "Add Currency"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative">
            <input
              type="text"
              placeholder="Search currencies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2 pl-10 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary sm:w-80"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="currentColor"
            >
              <g clipPath="url(#clip0_1699_11536)">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M8.625 2.0625C5.00063 2.0625 2.0625 5.00063 2.0625 8.625C2.0625 12.2494 5.00063 15.1875 8.625 15.1875C12.2494 15.1875 15.1875 12.2494 15.1875 8.625C15.1875 5.00063 12.2494 2.0625 8.625 2.0625ZM0.9375 8.625C0.9375 4.37931 4.37931 0.9375 8.625 0.9375C12.8707 0.9375 16.3125 4.37931 16.3125 8.625C16.3125 10.5454 15.6083 12.3013 14.4441 13.6487L16.8977 16.1023C17.1174 16.3219 17.1174 16.6781 16.8977 16.8977C16.6781 17.1174 16.3219 17.1174 16.1023 16.8977L13.6487 14.4441C12.3013 15.6083 10.5454 16.3125 8.625 16.3125C4.37931 16.3125 0.9375 12.8707 0.9375 8.625Z"
                />
              </g>
            </svg>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-stroke bg-transparent px-4 py-2 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {filteredCurrencies.length} of {currencies.length} currencies
        </div>
      </div>

      {/* Currencies Table */}
      <div className="rounded-lg bg-white shadow-sm dark:bg-gray-dark dark:border dark:border-stroke-dark">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-stroke dark:border-strokedark">
                <th className="px-6 py-4 text-left font-medium text-black dark:text-white">
                  Currency
                </th>
                <th className="px-6 py-4 text-left font-medium text-black dark:text-white">
                  Code
                </th>
                <th className="px-6 py-4 text-left font-medium text-black dark:text-white">
                  Exchange Rate
                </th>
                <th className="px-6 py-4 text-left font-medium text-black dark:text-white">
                  Decimal Places
                </th>
                <th className="px-6 py-4 text-left font-medium text-black dark:text-white">
                  Status
                </th>
                <th className="px-6 py-4 text-left font-medium text-black dark:text-white">
                  Default
                </th>
                <th className="px-6 py-4 text-left font-medium text-black dark:text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredCurrencies.map((currency) => (
                <tr
                  key={currency.id}
                  className="border-b border-stroke dark:border-strokedark hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                        {currency.symbol}
                      </div>
                      <div>
                        <div className="font-medium text-black dark:text-white">
                          {currency.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {currency.symbol}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-black dark:text-white">
                    {currency.code}
                  </td>
                  <td className="px-6 py-4 text-black dark:text-white">
                    {currency.exchangeRate.toFixed(4)}
                  </td>
                  <td className="px-6 py-4 text-black dark:text-white">
                    {currency.decimalPlaces}
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={currency.isActive ? "active" : "inactive"}
                      onChange={(e) => handleStatusChange(currency.id, e.target.value === "active")}
                      className={`rounded-full px-3 py-1 text-xs font-medium border-0 ${
                        currency.isActive
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      }`}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    {currency.isDefault ? (
                      <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        Default
                      </span>
                    ) : (
                      <button
                        onClick={() => handleSetDefault(currency.id)}
                        className="rounded bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                      >
                        Set Default
                      </button>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(currency)}
                        className="rounded p-1 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
                        title="Edit"
                      >
                        <PencilSquareIcon />
                      </button>
                      <button
                        onClick={() => handleDelete(currency.id)}
                        disabled={currency.isDefault}
                        className="rounded p-1 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        title={currency.isDefault ? "Cannot delete default currency" : "Delete"}
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCurrencies.length === 0 && (
          <div className="py-12 text-center">
            <div className="text-gray-500 dark:text-gray-400">
              No currencies found matching your criteria.
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="mt-4 rounded-lg bg-primary px-4 py-2 font-medium text-white transition-all hover:bg-opacity-90"
            >
              Add Currency
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 