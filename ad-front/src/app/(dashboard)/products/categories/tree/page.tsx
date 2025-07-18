"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PlusIcon } from "@/components/Layouts/sidebar/icons";
import { PencilSquareIcon, TrashIcon } from "@/assets/icons";
import { fetchCategories, createCategory, updateCategory, deleteCategory, updateCategoryStatus } from "@/components/redux/action/categories/categoryAction";
import { RootState } from "@/components/redux/reducer";
import { formatDate } from "@/utils/dateUtils";

interface Category {
  id: string;
  name: string;
  description: string;
  icon?: string;
  parentCategory?: any;
  subcategories?: any[];
  isMainCategory?: boolean;
  sortOrder?: number;
  status: 'active' | 'inactive';
  productCount: number;
  image?: string;
  slug?: string;
  createdAt: string;
  updatedAt: string;
}

const CategoryTreePage = () => {
  const dispatch = useDispatch();
  const { categories, loading, error } = useSelector((state: RootState) => state.categories);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [expandedParents, setExpandedParents] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: 'grid',
    parentCategory: '',
    isMainCategory: true,
    sortOrder: 0,
    status: '1',
    image: '',
    metaTitle: '',
    metaDescription: ''
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchCategoriesData();
  }, []);

  // Debug: Monitor categories state changes
  useEffect(() => {
    console.log('Categories state updated:', categories.length, 'categories');
  }, [categories]);

  const fetchCategoriesData = () => {
    dispatch(fetchCategories({
      page: 1,
      limit: 50,
      search: searchTerm,
      status: statusFilter
    }));
  };

  const handleAddCategory = () => {
    setFormData({
      name: '',
      description: '',
      icon: 'grid',
      parentCategory: '',
      isMainCategory: true,
      sortOrder: 0,
      status: '1',
      image: '',
      metaTitle: '',
      metaDescription: ''
    });
    setShowAddModal(true);
  };

  const getParentCategoryName = (parentCategoryId: string) => {
    const parentCategory = categories.find(cat => cat.id === parentCategoryId);
    return parentCategory ? parentCategory.name : parentCategoryId;
  };

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      icon: category.icon || 'grid',
      parentCategory: category.parentCategory?._id || (typeof category.parentCategory === 'string' ? category.parentCategory : ''),
      isMainCategory: category.isMainCategory || false,
      sortOrder: category.sortOrder || 0,
      status: category.status === 'active' ? '1' : '0',
      image: category.image || '',
      metaTitle: '',
      metaDescription: ''
    });
    setShowEditModal(true);
  };

  const handleDeleteCategory = async (category: Category) => {
    if (window.confirm(`Are you sure you want to delete "${category.name}"?`)) {
      try {
        await dispatch(deleteCategory(category.id));
        // Redux will automatically update the state, no need to fetch again
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (showEditModal && selectedCategory) {
        await dispatch(updateCategory(selectedCategory.id, formData));
      } else {
        await dispatch(createCategory(formData));
      }
      
      setShowAddModal(false);
      setShowEditModal(false);
      setSelectedCategory(null);
      // Redux will automatically update the state, no need to fetch again
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  const handleStatusToggle = async (category: Category) => {
    try {
      const newStatus = category.status === 'active' ? '0' : '1';
      await dispatch(updateCategoryStatus(category.id, newStatus));
      // Redux will automatically update the state, no need to fetch again
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const toggleParentExpansion = (parentId: string) => {
    setExpandedParents(prev => 
      prev.includes(parentId) 
        ? prev.filter(id => id !== parentId)
        : [...prev, parentId]
    );
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

  // Organize categories into parent-child structure
  const mainCategories = categories.filter(category => category.isMainCategory);
  const subcategories = categories.filter(category => !category.isMainCategory);
  
  const categoryTree = mainCategories.map(parent => ({
    ...parent,
    children: subcategories.filter(child => 
      child.parentCategory?._id === parent.id || child.parentCategory === parent.id
    )
  }));

  const filteredTree = categoryTree.filter(parent => {
    const matchesSearch = parent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         parent.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         parent.children.some(child => 
                           child.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           child.description.toLowerCase().includes(searchTerm.toLowerCase())
                         );
    const matchesStatus = statusFilter === 'all' || parent.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Category Tree</h1>
        <p className="text-gray-600">View categories in hierarchical structure</p>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-4">
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <button
            onClick={handleAddCategory}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <PlusIcon className="w-5 h-5" />
            <span>Add Category</span>
          </button>
        </div>
      </div>

      {/* Category Tree */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          </div>
        ) : filteredTree.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No categories found
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredTree.map((parent) => (
              <div key={parent.id} className="p-6">
                {/* Parent Category */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => toggleParentExpansion(parent.id)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      {expandedParents.includes(parent.id) ? (
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      )}
                    </button>
                    {getIconComponent(parent.icon || 'grid')}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {parent.name}
                      </h3>
                      {parent.description && (
                        <p className="text-sm text-gray-500">{parent.description}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {parent.productCount} products
                      </div>
                      <div className="text-sm text-gray-500">
                        {parent.children.length} subcategories
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleStatusToggle(parent)}
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          parent.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {parent.status === 'active' ? 'Active' : 'Inactive'}
                      </button>
                      
                      <button
                        onClick={() => handleEditCategory(parent)}
                        className="text-indigo-600 hover:text-indigo-900 p-1"
                      >
                        <PencilSquareIcon className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => handleDeleteCategory(parent)}
                        className="text-red-600 hover:text-red-900 p-1"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Child Categories */}
                {expandedParents.includes(parent.id) && (
                  <div className="ml-8 space-y-3">
                    {parent.children.length === 0 ? (
                      <div className="text-sm text-gray-500 italic">
                        No subcategories
                      </div>
                    ) : (
                      parent.children.map((child) => (
                        <div key={child.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            {getIconComponent(child.icon || 'grid')}
                            <div>
                              <h4 className="text-sm font-medium text-gray-900">
                                {child.name}
                              </h4>
                              {child.description && (
                                <p className="text-xs text-gray-500">{child.description}</p>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <div className="text-xs font-medium text-gray-900">
                                {child.productCount} products
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleStatusToggle(child)}
                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  child.status === 'active'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                }`}
                              >
                                {child.status === 'active' ? 'Active' : 'Inactive'}
                              </button>
                              
                              <button
                                onClick={() => handleEditCategory(child)}
                                className="text-indigo-600 hover:text-indigo-900 p-1"
                              >
                                <PencilSquareIcon className="w-4 h-4" />
                              </button>
                              
                              <button
                                onClick={() => handleDeleteCategory(child)}
                                className="text-red-600 hover:text-red-900 p-1"
                              >
                                <TrashIcon className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {showEditModal ? 'Edit Category' : 'Add New Category'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Icon
                  </label>
                  <select
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="grid">Grid</option>
                    <option value="cupcake">Cupcake</option>
                    <option value="apple">Apple</option>
                    <option value="beverage">Beverage</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category Type
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="categoryType"
                        checked={formData.isMainCategory}
                        onChange={() => setFormData({ ...formData, isMainCategory: true, parentCategory: '' })}
                        className="mr-2"
                      />
                      Main Category
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="categoryType"
                        checked={!formData.isMainCategory}
                        onChange={() => setFormData({ ...formData, isMainCategory: false })}
                        className="mr-2"
                      />
                      Subcategory
                    </label>
                  </div>
                </div>

                {!formData.isMainCategory && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Parent Category *
                    </label>
                    <select
                      value={formData.parentCategory}
                      onChange={(e) => setFormData({ ...formData, parentCategory: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    >
                      <option value="">Select Parent Category</option>
                      {mainCategories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={formData.sortOrder.toString()}
                    onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="1">Active</option>
                    <option value="0">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                    setSelectedCategory(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  {showEditModal ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryTreePage; 