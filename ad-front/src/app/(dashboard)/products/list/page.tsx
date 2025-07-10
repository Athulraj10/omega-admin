"use client";

import React, { useEffect, useState } from "react";
import { PencilSquareIcon, TrashIcon } from "@/assets/icons";
import { useAppDispatch, useAppSelector } from "@/components/redux/hooks";
import { fetchProducts, deleteProduct, updateProductStatus } from "@/components/redux/action/products/productAction";
import { getSellersRequest } from "@/components/redux/action/seller";
import { useRouter } from "next/navigation";
import ProductImageGallery from "@/components/ProductImageGallery";
import { useCurrency } from "@/contexts/CurrencyContext";
import CurrencySelector from "@/components/CurrencySelector";

const PlusIcon = (props: any) => (
  <svg width={24} height={24} viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2.25a.75.75 0 01.75.75v8.25H21a.75.75 0 010 1.5h-8.25V21a.75.75 0 01-1.5 0v-8.25H3a.75.75 0 010-1.5h8.25V3a.75.75 0 01.75-.75z"
    />
  </svg>
);

export default function ListProducts() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { products, loading } = useAppSelector((state) => state.products);
  const { sellers } = useAppSelector((state) => state.sellers);
  const { userData } = useAppSelector((state) => state.auth);
  const { formatPrice } = useCurrency();
  
  // Image gallery state
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  
  // Debug: Check entire Redux state
  const entireState = useAppSelector((state) => state);
  console.log('🏪 Entire Redux state:', entireState);

  // Debug logging
  console.log('📦 Products from Redux:', products);
  console.log('📦 Products length:', products?.length || 0);
  console.log('📦 Products type:', typeof products);
  console.log('📦 Products is array:', Array.isArray(products));
  console.log('👥 Sellers from Redux:', sellers);
  console.log('🔑 Auth token:', typeof window !== 'undefined' ? localStorage.getItem('token') : 'SSR');
  console.log('👤 User data:', userData);

  useEffect(() => {
    console.log('🔄 Dispatching fetchProducts...');
    console.log('🔑 Token available:', typeof window !== 'undefined' ? !!localStorage.getItem('token') : 'SSR');
    dispatch(fetchProducts());
    dispatch(getSellersRequest());
  }, [dispatch]);

  const getSellerName = (seller: any) => {
    if (!seller) return "No Seller";
    
    // If seller is populated (has companyName and userName)
    if (seller.companyName && seller.userName) {
      return `${seller.companyName} - ${seller.userName}`;
    }
    
    // If seller is just an ID, try to find in sellers list
    if (typeof seller === 'string') {
      const sellerData = sellers.find((s: any) => s._id === seller);
      return sellerData ? `${sellerData.companyName} - ${sellerData.userName}` : "Unknown Seller";
    }
    
    return "Unknown Seller";
  };

  const handleEdit = (productId: string) => {
    router.push(`/products/add?id=${productId}`);
  };

  const handleDelete = (productId: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      dispatch(deleteProduct({ id: productId }));
    }
  };

  const handleStatusToggle = (product: any) => {
    const currentStatus = product.status === "1" ? "active" : "inactive";
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    dispatch(updateProductStatus({ id: product._id, data: { status: newStatus } }));
  };

  const handleImageClick = (product: any) => {
    if (product.images && product.images.length > 0) {
      setSelectedProduct(product);
      setIsGalleryOpen(true);
    }
  };

  // Check if user is authenticated
  const isAuthenticated = typeof window !== 'undefined' && localStorage.getItem('token');
  
  if (!isAuthenticated) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 dark:text-red-400 mb-4">Not authenticated. Please log in.</div>
          <button 
            onClick={() => router.push('/sign-in')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

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
          <h1 className="text-2xl font-bold text-dark dark:text-white">Products</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your product inventory</p>
        </div>
        <div className="flex items-center gap-2">
          <CurrencySelector />
          <button
            onClick={() => {
              console.log('🔄 Manual refresh triggered');
              dispatch(fetchProducts());
            }}
            className="flex items-center gap-2 rounded-lg bg-gray-600 px-4 py-2 font-medium text-white transition-all hover:bg-opacity-90"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
            </svg>
            Refresh
          </button>
          <button
            onClick={() => router.push("/products/add")}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-medium text-white transition-all hover:bg-opacity-90"
          >
            <PlusIcon />
            Add Product
          </button>
        </div>
      </div>

      <div className="rounded-lg bg-white shadow-sm dark:bg-gray-dark">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-stroke dark:border-strokedark">
                <th className="px-6 py-4 text-left font-medium text-black dark:text-white">
                  Image
                </th>
                <th className="px-6 py-4 text-left font-medium text-black dark:text-white">
                  Product Name
                </th>
                <th className="px-6 py-4 text-left font-medium text-black dark:text-white">
                  Category
                </th>
                <th className="px-6 py-4 text-left font-medium text-black dark:text-white">
                  Seller
                </th>
                <th className="px-6 py-4 text-left font-medium text-black dark:text-white">
                  Price
                </th>
                <th className="px-6 py-4 text-left font-medium text-black dark:text-white">
                  Stock
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
              {products.map((product: any) => (
                <tr
                  key={product._id}
                  className="border-b border-stroke dark:border-strokedark hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {product.images && product.images.length > 0 ? (
                        <button
                          onClick={() => handleImageClick(product)}
                          className="group relative"
                        >
                          <img
                            src={`http://localhost:8001${product.images[0]}`}
                            alt={product.name}
                            className="h-16 w-16 rounded-lg object-cover border border-gray-200 dark:border-gray-700 transition-transform group-hover:scale-105"
                            onError={(e) => {
                              e.currentTarget.src = "/images/product/product-01.png";
                            }}
                          />
                          {product.images.length > 1 && (
                            <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                              +{product.images.length - 1}
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-all flex items-center justify-center">
                            <svg className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 11-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </button>
                      ) : (
                        <div className="h-16 w-16 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                          <svg className="h-8 w-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-black dark:text-white">
                        {product.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {product.description?.substring(0, 50)}...
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-black dark:text-white">
                    {product.category?.name || product.category || 'No Category'}
                  </td>
                  <td className="px-6 py-4 text-black dark:text-white">
                    {getSellerName(product.seller)}
                  </td>
                  <td className="px-6 py-4 text-black dark:text-white">
                    {formatPrice(product.price || 0)}
                  </td>
                  <td className="px-6 py-4 text-black dark:text-white">
                    {product.stock}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleStatusToggle(product)}
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium border-0 transition ${
                        product.status === "1"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      }`}
                    >
                      {product.status === "1" ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(product._id)}
                        className="rounded p-1 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
                        title="Edit"
                      >
                        <PencilSquareIcon />
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
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

        {products.length === 0 && (
          <div className="py-12 text-center">
            <div className="text-gray-500 dark:text-gray-400">
              No products found. Create your first product!
            </div>
            <div className="text-sm text-gray-400 mt-2">
              Debug: Products array length: {products?.length || 0}
            </div>
            <div className="text-sm text-gray-400">
              Debug: Products type: {typeof products}
            </div>
            <button
              onClick={() => router.push("/products/add")}
              className="mt-4 rounded-lg bg-primary px-4 py-2 font-medium text-white transition-all hover:bg-opacity-90"
            >
              Add Product
            </button>
          </div>
        )}
      </div>

      {/* Product Image Gallery Modal */}
      {selectedProduct && (
        <ProductImageGallery
          images={selectedProduct.images}
          productName={selectedProduct.name}
          isOpen={isGalleryOpen}
          onClose={() => {
            setIsGalleryOpen(false);
            setSelectedProduct(null);
          }}
        />
      )}
    </div>
  );
} 