"use client";

import React, { useEffect } from "react";
import { PencilSquareIcon, TrashIcon } from "@/assets/icons";
import { useAppDispatch, useAppSelector } from "@/components/redux/hooks";
import { fetchProducts, deleteProduct, updateProductStatus } from "@/components/redux/action/products/productAction";
import { getSellersRequest } from "@/components/redux/action/seller";
import { useRouter } from "next/navigation";

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

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(getSellersRequest());
  }, [dispatch]);

  const getSellerName = (sellerId: string) => {
    const seller = sellers.find((s: any) => s._id === sellerId);
    return seller ? `${seller.companyName} - ${seller.userName}` : "Unknown Seller";
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
    dispatch(updateProductStatus({ id: product._id, data: { status: product.status === "active" ? "inactive" : "active" } }));
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
          <h1 className="text-2xl font-bold text-dark dark:text-white">Products</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your product inventory</p>
        </div>
        <button
          onClick={() => router.push("/products/add")}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-medium text-white transition-all hover:bg-opacity-90"
        >
          <PlusIcon />
          Add Product
        </button>
      </div>

      <div className="rounded-lg bg-white shadow-sm dark:bg-gray-dark">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-stroke dark:border-strokedark">
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
                    {product.category}
                  </td>
                  <td className="px-6 py-4 text-black dark:text-white">
                    {product.seller ? getSellerName(product.seller) : "No Seller"}
                  </td>
                  <td className="px-6 py-4 text-black dark:text-white">
                    ${product.price?.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-black dark:text-white">
                    {product.stock}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleStatusToggle(product)}
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium border-0 transition ${
                        product.status === "active"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      }`}
                    >
                      {product.status === "active" ? "Active" : "Inactive"}
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
            <button
              onClick={() => router.push("/products/add")}
              className="mt-4 rounded-lg bg-primary px-4 py-2 font-medium text-white transition-all hover:bg-opacity-90"
            >
              Add Product
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 