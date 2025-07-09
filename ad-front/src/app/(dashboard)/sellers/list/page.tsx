"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../components/redux/reducer";
import { getSellersRequest, deleteSellerRequest } from "../../../../components/redux/action/seller";
import { Seller } from "../../../../components/redux/action/types/sellerTypes";

export default function SellerListPage() {
  const dispatch = useDispatch();
  const { sellers, loading, error, deleteLoading } = useSelector((state: RootState) => state.sellers);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSellers, setFilteredSellers] = useState<Seller[]>([]);

  useEffect(() => {
    dispatch(getSellersRequest());
  }, [dispatch]);

  useEffect(() => {
    const filtered = sellers.filter((seller) =>
      seller.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seller.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seller.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSellers(filtered);
  }, [sellers, searchTerm]);

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this seller?")) {
      dispatch(deleteSellerRequest(id));
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading sellers...</div>;
  }

  if (error) {
    return <div className="text-red-600 text-center py-8">Error: {error}</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Seller List</h2>
      <input 
        className="mb-4 p-2 border rounded w-full max-w-xs" 
        placeholder="Search sellers..." 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <table className="min-w-full bg-white dark:bg-neutral-800 rounded shadow">
        <thead>
          <tr>
            <th className="p-2">Company</th>
            <th className="p-2">Name</th>
            <th className="p-2">Email</th>
            <th className="p-2">Phone</th>
            <th className="p-2">Status</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredSellers.map((seller) => (
            <tr key={seller._id} className="border-t">
              <td className="p-2">{seller.companyName}</td>
              <td className="p-2">{seller.userName}</td>
              <td className="p-2">{seller.email}</td>
              <td className="p-2">{seller.mobile_no || "-"}</td>
              <td className="p-2">
                <span className={seller.status === "1" ? "text-green-600" : "text-red-600"}>
                  {seller.status}
                </span>
              </td>
              <td className="p-2">
                <button className="text-blue-600 hover:underline mr-2">Edit</button>
                <button 
                  className="text-red-600 hover:underline"
                  onClick={() => handleDelete(seller._id)}
                  disabled={deleteLoading}
                >
                  {deleteLoading ? "Deleting..." : "Delete"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {filteredSellers.length === 0 && (
        <div className="text-center py-8 text-gray-500">No sellers found</div>
      )}
    </div>
  );
} 