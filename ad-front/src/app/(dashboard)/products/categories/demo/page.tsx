"use client";

import React, { useState, useEffect } from 'react';
import CategorySelector from '@/components/CategorySelector';
import { getCurrentTime } from '@/utils/dateUtils';

interface SelectedItem {
  type: 'category' | 'subcategory' | 'product';
  name: string;
  description?: string;
  price?: number;
  timestamp?: string;
}

const CategoryDemo = () => {
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCategorySelect = (category: any) => {
    const newItem: SelectedItem = {
      type: 'category',
      name: category.name,
      description: category.description,
      timestamp: mounted ? getCurrentTime() : ''
    };
    setSelectedItems(prev => [newItem, ...prev.slice(0, 4)]); // Keep last 5 items
  };

  const handleSubcategorySelect = (subcategory: any) => {
    const newItem: SelectedItem = {
      type: 'subcategory',
      name: subcategory.name,
      description: subcategory.description,
      timestamp: mounted ? getCurrentTime() : ''
    };
    setSelectedItems(prev => [newItem, ...prev.slice(0, 4)]);
  };

  const handleProductSelect = (product: any, subcategory: any) => {
    const newItem: SelectedItem = {
      type: 'product',
      name: product.name,
      description: product.description,
      price: product.price,
      timestamp: mounted ? getCurrentTime() : ''
    };
    setSelectedItems(prev => [newItem, ...prev.slice(0, 4)]);
  };

  const clearSelections = () => {
    setSelectedItems([]);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-purple-100 rounded-lg">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Category Selector Demo</h1>
            <p className="text-gray-600">See how the category selector works for users</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Category Selector */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Category Selector</h2>
            <CategorySelector
              onCategorySelect={handleCategorySelect}
              onSubcategorySelect={handleSubcategorySelect}
              onProductSelect={handleProductSelect}
              className="w-full"
            />
          </div>
        </div>

        {/* Selection Details */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Selection History</h2>
              <button
                onClick={clearSelections}
                className="text-sm text-red-600 hover:text-red-700 font-medium"
              >
                Clear All
              </button>
            </div>

            {selectedItems.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <p className="text-gray-500">No selections yet</p>
                <p className="text-sm text-gray-400">Click on categories, subcategories, or products to see them here</p>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedItems.map((item, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border-l-4 ${
                      item.type === 'category' ? 'border-blue-500 bg-blue-50' :
                      item.type === 'subcategory' ? 'border-green-500 bg-green-50' :
                      'border-purple-500 bg-purple-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                            item.type === 'category' ? 'bg-blue-100 text-blue-800' :
                            item.type === 'subcategory' ? 'bg-green-100 text-green-800' :
                            'bg-purple-100 text-purple-800'
                          }`}>
                            {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                          </span>
                          {mounted && item.timestamp && (
                            <span className="text-xs text-gray-500">
                              {item.timestamp}
                            </span>
                          )}
                        </div>
                        <h3 className="font-medium text-gray-900">{item.name}</h3>
                        {item.description && (
                          <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                        )}
                        {item.price && (
                          <p className="text-sm font-medium text-green-600 mt-1">
                            ${item.price.toFixed(2)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 rounded-lg p-4 mt-6">
            <h3 className="text-sm font-medium text-blue-900 mb-2">How to use:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Click on main categories to select them</li>
              <li>• View subcategories and products for each category</li>
              <li>• Click on subcategories or products to select them</li>
              <li>• Your selections will appear in the history panel</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Features Overview */}
      <div className="mt-12 bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Category Selector Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="font-medium text-gray-900 mb-1">Hierarchical Structure</h3>
            <p className="text-sm text-gray-600">Main categories with nested subcategories</p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2" />
              </svg>
            </div>
            <h3 className="font-medium text-gray-900 mb-1">Product Integration</h3>
            <p className="text-sm text-gray-600">Direct access to products within categories</p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h3 className="font-medium text-gray-900 mb-1">Visual Icons</h3>
            <p className="text-sm text-gray-600">Custom icons for each category type</p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 bg-orange-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-medium text-gray-900 mb-1">Interactive Selection</h3>
            <p className="text-sm text-gray-600">Real-time selection feedback and history</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryDemo; 