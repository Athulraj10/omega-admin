"use client";

import React, { useState, useEffect } from "react";
import { PencilSquareIcon, TrashIcon } from "@/assets/icons";
import InputGroup from "@/components/FormElements/InputGroup";

interface Category {
  id: string;
  name: string;
  description: string;
  productCount: number;
  isActive: boolean;
  createdAt: string;
}

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  // Mock data for demonstration
  useEffect(() => {
    const mockCategories: Category[] = [
      {
        id: "1",
        name: "Electronics",
        description: "Electronic devices and gadgets",
        productCount: 15,
        isActive: true,
        createdAt: "2024-01-15",
      },
      {
        id: "2",
        name: "Clothing",
        description: "Fashion and apparel items",
        productCount: 23,
        isActive: true,
        createdAt: "2024-01-16",
      },
      {
        id: "3",
        name: "Books",
        description: "Books and publications",
        productCount: 8,
        isActive: false,
        createdAt: "2024-01-17",
      },
    ];

    setTimeout(() => {
      setCategories(mockCategories);
      setLoading(false);
    }, 1000);
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // TODO: Implement API call to add category
    console.log("Adding category:", formData);
    
    // Add to local state for demo
    const newCategory: Category = {
      id: Date.now().toString(),
      name: formData.name,
      description: formData.description,
      productCount: 0,
      isActive: true,
      createdAt: new Date().toISOString().split('T')[0],
    };
    
    setCategories([...categories, newCategory]);
    setFormData({ name: "", description: "" });
    setShowAddForm(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEdit = (categoryId: string) => {
    console.log("Edit category:", categoryId);
    // TODO: Navigate to edit page or open edit modal
  };

  const handleDelete = (categoryId: string) => {
    if (confirm("Are you sure you want to delete this category?")) {
      console.log("Delete category:", categoryId);
      // TODO: Implement delete API call
      setCategories(categories.filter(cat => cat.id !== categoryId));
    }
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
          <h1 className="text-2xl font-bold text-dark dark:text-white">Categories</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your product categories</p>
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
          Add Category
        </button>
      </div>

      {showAddForm && (
        <div className="mb-6 rounded-lg bg-white p-6 shadow-sm dark:bg-gray-dark">
          <h2 className="mb-4 text-lg font-semibold text-dark dark:text-white">Add New Category</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <InputGroup
              type="text"
              label="Category Name"
              name="name"
              placeholder="Enter category name"
              value={formData.name}
              handleChange={handleChange}
              required
            />
            <div>
              <label className="mb-2.5 block text-black dark:text-white">
                Description
              </label>
              <textarea
                name="description"
                rows={3}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                placeholder="Enter category description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setFormData({ name: "", description: "" });
                }}
                className="rounded-lg border border-stroke px-4 py-2 font-medium text-black transition-all hover:shadow-1 dark:border-strokedark dark:text-white dark:hover:shadow-1"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-primary px-4 py-2 font-medium text-white transition-all hover:bg-opacity-90"
              >
                Add Category
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="rounded-lg bg-white shadow-sm dark:bg-gray-dark">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-stroke dark:border-strokedark">
                <th className="px-6 py-4 text-left font-medium text-black dark:text-white">
                  Category Name
                </th>
                <th className="px-6 py-4 text-left font-medium text-black dark:text-white">
                  Description
                </th>
                <th className="px-6 py-4 text-left font-medium text-black dark:text-white">
                  Products
                </th>
                <th className="px-6 py-4 text-left font-medium text-black dark:text-white">
                  Status
                </th>
                <th className="px-6 py-4 text-left font-medium text-black dark:text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr
                  key={category.id}
                  className="border-b border-stroke dark:border-strokedark hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <td className="px-6 py-4">
                    <div className="font-medium text-black dark:text-white">
                      {category.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-black dark:text-white">
                    {category.description}
                  </td>
                  <td className="px-6 py-4 text-black dark:text-white">
                    {category.productCount}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                        category.isActive
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      }`}
                    >
                      {category.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(category.id)}
                        className="rounded p-1 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
                        title="Edit"
                      >
                        <PencilSquareIcon />
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        className="rounded p-1 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                        title="Delete"
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

        {categories.length === 0 && (
          <div className="py-12 text-center">
            <div className="text-gray-500 dark:text-gray-400">
              No categories found. Create your first category!
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="mt-4 rounded-lg bg-primary px-4 py-2 font-medium text-white transition-all hover:bg-opacity-90"
            >
              Add Category
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 