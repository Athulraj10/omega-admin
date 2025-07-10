"use client";

import React, { useState, useEffect, useRef } from "react";
import InputGroup from "@/components/FormElements/InputGroup";
import { Checkbox } from "@/components/FormElements/checkbox";
import { useAppDispatch, useAppSelector } from "@/components/redux/hooks";
import { addProduct, editProduct, fetchProducts } from "@/components/redux/action/products/productAction";
import { getSellersRequest } from "@/components/redux/action/seller";
import { fetchActiveCategories } from "@/components/redux/action/categories/categoryAction";
import { useRouter, useSearchParams } from "next/navigation";
import ImageUpload from "@/components/ImageUpload";

export default function AddProduct() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { products, loading } = useAppSelector((state) => state.products);
  const { sellers } = useAppSelector((state) => state.sellers);
  const { activeCategories } = useAppSelector((state) => state.categories);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    status: "1",
    sku: "",
    discountPrice: "",
    seller: "",
    images: [] as File[],
  });
  const [editId, setEditId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch sellers and categories on component mount
  useEffect(() => {
    dispatch(getSellersRequest());
    dispatch(fetchActiveCategories());
  }, [dispatch]);

  useEffect(() => {
    const id = searchParams.get("id");
    if (id) {
      setEditId(id);
      if (products.length === 0) {
        dispatch(fetchProducts());
      } else {
        const prod = products.find((p: any) => p._id === id);
        if (prod) {
          setFormData({
            name: prod.name || "",
            description: prod.description || "",
            price: prod.price?.toString() || "",
            category: prod.category || "",
            stock: prod.stock?.toString() || "",
            status: prod.status || "1",
            sku: prod.sku || "",
            discountPrice: prod.discountPrice?.toString() || "",
            seller: prod.seller || "",
            images: [], // images are not prefilled for edit
          });
        }
      }
    }
  }, [searchParams, products, dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };



  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null); // Clear any previous errors
    
    // Set a timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      setSubmitting(false);
    }, 30000); // 30 seconds timeout
    
    const clearTimeoutAndStopLoading = () => {
      clearTimeout(timeoutId);
      setSubmitting(false);
    };
    
    const handleError = (errorMessage: string) => {
      clearTimeoutAndStopLoading();
      setError(errorMessage);
    };
    
    try {
      // Debug form data
      console.log('📝 Form data before submission:', formData);
      console.log('👥 Sellers available:', sellers);
      console.log('📝 Status value:', formData.status);
      console.log('📝 Status type:', typeof formData.status);
      
      // Create FormData for file upload
      const formDataToSend = new FormData();
      
      // Add product data (excluding images)
      const { images, ...formDataWithoutImages } = formData;
      console.log('📝 Form data without images:', formDataWithoutImages);
      
      Object.entries(formDataWithoutImages).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          formDataToSend.append(key, String(value));
          console.log(`📤 Adding to FormData: ${key} = ${value} (type: ${typeof value})`);
        } else {
          console.log(`❌ Skipping empty field: ${key} = ${value}`);
        }
      });
      
      // Debug FormData contents
      console.log('📤 FormData entries:');
      for (let [key, value] of formDataToSend.entries()) {
        console.log(`  ${key}: ${value}`);
      }
      
      // Add files separately
      if (formData.images && formData.images.length > 0) {
        formData.images.forEach((file: File) => {
          formDataToSend.append('images', file);
        });
      }
      
      // Convert price and stock to numbers
      formDataToSend.set('price', parseFloat(formData.price).toString());
      formDataToSend.set('stock', parseInt(formData.stock).toString());
      
      if (formData.discountPrice) {
        formDataToSend.set('discountPrice', parseFloat(formData.discountPrice).toString());
      }
      
      // Make direct API call
      const API = (await import('@/utils/api')).default;
      const url = editId ? `/admin/products/${editId}` : '/admin/products';
      const method = editId ? 'put' : 'post';
      
      const response = await API[method](url, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('📡 API Response:', response.data);
      console.log('📡 Response structure:', {
        hasMeta: !!response.data?.meta,
        metaCode: response.data?.meta?.code,
        hasSuccess: !!response.data?.success,
        hasMessage: !!response.data?.message,
        hasMetaMessage: !!response.data?.meta?.message
      });
      
      if (response.data?.meta?.code === 200 || response.data?.success) {
        clearTimeoutAndStopLoading();
        router.push("/products/list");
      } else {
        const errorMessage = response.data?.meta?.message || response.data?.message || "Failed to save product";
        handleError(errorMessage);
      }
    } catch (error: any) {
      console.error('Error saving product:', error);
      console.error('Error type:', error.constructor.name);
      console.error('Error message:', error.message);
      console.error('Error response status:', error.response?.status);
      console.error('Error response data:', error.response?.data);
      console.error('Error response headers:', error.response?.headers);
      
      let errorMessage = "Failed to save product. Please try again.";
      
      // Handle different types of errors
      if (error.response?.data) {
        // Handle different error response structures
        if (error.response.data.meta?.message) {
          errorMessage = error.response.data.meta.message;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        }
      } else if (error.message) {
        // Handle network or other errors
        if (error.message.includes('Network Error')) {
          errorMessage = "Network error. Please check your connection and try again.";
        } else if (error.message.includes('timeout')) {
          errorMessage = "Request timed out. Please try again.";
        } else if (error.message.includes('400')) {
          errorMessage = "Bad request. Please check your input and try again.";
        } else if (error.message.includes('401')) {
          errorMessage = "Authentication failed. Please log in again.";
        } else if (error.message.includes('403')) {
          errorMessage = "Access denied. You don't have permission to perform this action.";
        } else if (error.message.includes('404')) {
          errorMessage = "Resource not found. Please check the URL and try again.";
        } else if (error.message.includes('500')) {
          errorMessage = "Server error. Please try again later.";
        } else {
          errorMessage = error.message;
        }
      }
      
      handleError(errorMessage);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-dark dark:text-white">{editId ? "Edit Product" : "Add New Product"}</h1>
        <p className="text-gray-600 dark:text-gray-400">{editId ? "Update product details" : "Create a new product for your store"}</p>
      </div>

      <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-dark">
        {error && (
          <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4 dark:bg-red-900/20 dark:border-red-800">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                  Error
                </h3>
                <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                  {error}
                </div>
              </div>
            </div>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <InputGroup
            type="text"
            label="Product Name"
            name="name"
            placeholder="Enter product name"
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
              rows={4}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              placeholder="Enter product description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <InputGroup
              type="number"
              label="Price"
              name="price"
              placeholder="0.00"
              value={formData.price}
              handleChange={handleChange}
              required
            />

            <InputGroup
              type="number"
              label="Stock Quantity"
              name="stock"
              placeholder="0"
              value={formData.stock}
              handleChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="mb-2.5 block text-black dark:text-white">
              Category <span className="text-meta-1">*</span>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              required
            >
              <option value="">Select a category</option>
              {activeCategories.map((category: any) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2.5 block text-black dark:text-white">
              Seller <span className="text-meta-1">*</span>
            </label>
            <select
              name="seller"
              value={formData.seller}
              onChange={handleChange}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              required
            >
              <option value="">Select a seller</option>
              {sellers.map((seller: any) => (
                <option key={seller._id} value={seller._id}>
                  {seller.companyName} - {seller.userName}
                </option>
              ))}
            </select>
          </div>

          <InputGroup
            type="text"
            label="SKU"
            name="sku"
            placeholder="Enter SKU"
            value={formData.sku}
            handleChange={handleChange}
          />

          <InputGroup
            type="number"
            label="Discount Price"
            name="discountPrice"
            placeholder="0.00"
            value={formData.discountPrice}
            handleChange={handleChange}
          />

          <ImageUpload
            images={formData.images}
            onChange={(images) => setFormData({ ...formData, images })}
            multiple={true}
            maxFiles={5}
            maxSize={5}
            accept="image/*"
            label="Product Images"
          />

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="status"
              name="status"
              checked={formData.status === "1"}
              onChange={(e) => setFormData({ ...formData, status: e.target.checked ? "1" : "0" })}
              className="mr-2 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary dark:border-stroke-dark dark:bg-dark-2"
            />
            <label htmlFor="status" className="text-sm font-medium text-black dark:text-white">
              Active Product
            </label>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              className="rounded-lg border border-stroke px-6 py-2 font-medium text-black transition-all hover:shadow-1 dark:border-strokedark dark:text-white dark:hover:shadow-1"
              onClick={() => setFormData({
                name: "",
                description: "",
                price: "",
                category: "",
                stock: "",
                status: "1",
                sku: "",
                discountPrice: "",
                seller: "",
                images: [],
              })}
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={submitting || loading}
              className="flex items-center justify-center rounded-lg bg-primary px-6 py-2 font-medium text-white transition-all hover:bg-opacity-90 disabled:opacity-50"
            >
              {submitting || loading ? (
                <>
                  <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent"></span>
                  {editId ? "Updating..." : "Adding..."}
                </>
              ) : (
                editId ? "Update Product" : "Add Product"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 