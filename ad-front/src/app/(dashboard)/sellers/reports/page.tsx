"use client";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../components/redux/reducer";
import { getSellersRequest } from "../../../../components/redux/action/seller";

export default function SellerReportsPage() {
  const dispatch = useDispatch();
  const { sellers, loading, error } = useSelector((state: RootState) => state.sellers);

  useEffect(() => {
    dispatch(getSellersRequest());
  }, [dispatch]);

  if (loading) {
    return <div className="text-center py-8">Loading seller reports...</div>;
  }

  if (error) {
    return <div className="text-red-600 text-center py-8">Error: {error}</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Seller Reports</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Total Sellers</h3>
          <p className="text-3xl font-bold text-blue-600">{sellers.length}</p>
        </div>
        <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Active Sellers</h3>
          <p className="text-3xl font-bold text-green-600">
            {sellers.filter(s => s.status === "active").length}
          </p>
        </div>
        <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Total Products</h3>
          <p className="text-3xl font-bold text-purple-600">0</p>
        </div>
        <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Total Orders</h3>
          <p className="text-3xl font-bold text-orange-600">0</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Top Performing Sellers</h3>
          <div className="space-y-3">
            {sellers.slice(0, 5).map((seller) => (
              <div key={seller._id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-neutral-700 rounded">
                <div>
                  <p className="font-medium">{seller.companyName}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{seller.name}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs ${
                  seller.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}>
                  {seller.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
              <p className="font-medium">New seller registered</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Acme Corp joined the platform</p>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded">
              <p className="font-medium">Product added</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Beta Ltd added 5 new products</p>
            </div>
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded">
              <p className="font-medium">Order completed</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Order #12345 delivered successfully</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white dark:bg-neutral-800 p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4">Delivery Failures</h3>
        <div className="text-center py-8 text-gray-500">
          <p>No delivery failures reported</p>
        </div>
      </div>
    </div>
  );
} 