"use client";

import React, { useState, useEffect } from 'react';
import api from '@/utils/api';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
}

interface Subcategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  slug: string;
  productCount: number;
  products?: Product[];
}

interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  slug: string;
  productCount: number;
  subcategories: Subcategory[];
}

interface CategorySelectorProps {
  onCategorySelect?: (category: Category | Subcategory) => void;
  onSubcategorySelect?: (subcategory: Subcategory) => void;
  onProductSelect?: (product: Product, subcategory: Subcategory) => void;
  className?: string;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  onCategorySelect,
  onSubcategorySelect,
  onProductSelect,
  className = ""
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/categories/hierarchical');
      
      if (response.data?.success) {
        setCategories(response.data.data);
        // Auto-select first category if available
        if (response.data.data.length > 0) {
          setSelectedCategory(response.data.data[0]);
        }
      } else {
        setError('Failed to fetch categories');
      }
    } catch (err: any) {
      console.error('Error fetching categories:', err);
      setError('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (category: Category) => {
    setSelectedCategory(category);
    onCategorySelect?.(category);
  };

  const handleSubcategoryClick = (subcategory: Subcategory) => {
    onSubcategorySelect?.(subcategory);
  };

  const handleProductClick = (product: Product, subcategory: Subcategory) => {
    onProductSelect?.(product, subcategory);
  };

  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      'cupcake': (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      ),
      'apple': (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      'beverage': (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      ),
      'grid': (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
      'default': (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      )
    };

    return iconMap[iconName] || iconMap['default'];
  };

  const getSampleProducts = (subcategoryName: string): string[] => {
    const productMap: { [key: string]: string[] } = {
      'Dairy': ['Fresh Milk', 'Cheese', 'Yogurt', 'Butter', 'Cream'],
      'Bakery': ['Bread & Buns', 'Cake And Pastry', 'Rusk Toast', 'Chocolate Brownie', 'Cream Roll'],
      'Fruits': ['Apple', 'Banana', 'Orange', 'Grapes', 'Mango'],
      'Vegetables': ['Cauliflower', 'Bell Peppers', 'Broccoli', 'Cabbage', 'Tomato'],
      'Snacks': ['Chips', 'Nuts', 'Cookies', 'Popcorn', 'Crackers'],
      'Spices': ['Black Pepper', 'Cinnamon', 'Turmeric', 'Cardamom', 'Cumin'],
      'Juices': ['Orange Juice', 'Apple Juice', 'Grape Juice', 'Pineapple Juice', 'Mango Juice'],
      'Beverages': ['Coffee', 'Tea', 'Soda', 'Energy Drinks', 'Hot Chocolate']
    };

    return productMap[subcategoryName] || ['Sample Product 1', 'Sample Product 2', 'Sample Product 3'];
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-4 ${className}`}>
        <div className="flex items-center justify-center h-32">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-4 ${className}`}>
        <div className="text-center text-red-600">
          <p>{error}</p>
          <button 
            onClick={fetchCategories}
            className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-md ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <button className="flex items-center justify-between w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
          <div className="flex items-center space-x-3">
            {getIconComponent('grid')}
            <span className="font-medium">All Categories</span>
          </div>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="flex">
        {/* Left Pane - Main Categories */}
        <div className="w-1/2 border-r border-gray-200">
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    selectedCategory?.id === category.id
                      ? 'bg-green-50 border-2 border-green-500 text-green-700'
                      : 'hover:bg-gray-50 border-2 border-transparent'
                  }`}
                >
                  {getIconComponent(category.icon)}
                  <div className="flex-1">
                    <div className="font-medium">{category.name}</div>
                    {category.description && (
                      <div className="text-sm text-gray-500">{category.description}</div>
                    )}
                  </div>
                  {category.productCount > 0 && (
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      {category.productCount}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Pane - Subcategories with Products */}
        <div className="w-1/2">
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {selectedCategory ? selectedCategory.name : 'Select a category'}
            </h3>
            
            {selectedCategory && selectedCategory.subcategories.length > 0 ? (
              <div className="space-y-6">
                {selectedCategory.subcategories.map((subcategory) => (
                  <div key={subcategory.id} className="border-b border-gray-100 pb-6 last:border-b-0">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-green-600 text-base">{subcategory.name}</h4>
                      {subcategory.productCount > 0 && (
                        <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">
                          {subcategory.productCount}
                        </span>
                      )}
                    </div>
                    
                    {/* Products for each subcategory */}
                    <div className="space-y-2">
                      {subcategory.products && subcategory.products.length > 0 ? (
                        subcategory.products.map((product) => (
                          <button
                            key={product.id}
                            onClick={() => handleProductClick(product, subcategory)}
                            className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded transition-colors"
                          >
                            {product.name}
                          </button>
                        ))
                      ) : (
                        <div className="text-sm text-gray-500 px-3 py-2">
                          No products available
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : selectedCategory ? (
              <div className="text-center text-gray-500 py-8">
                <p>No subcategories available</p>
                <p className="text-sm mt-2">This category has {selectedCategory.productCount} products</p>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <p>Select a category to view subcategories</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategorySelector; 