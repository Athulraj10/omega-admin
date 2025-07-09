"use client";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "../../../../components/redux/reducer";
import { addSellerRequest } from "../../../../components/redux/action/seller";
import { SellerFormData } from "../../../../components/redux/action/types/sellerTypes";

export default function AddSellerPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { addLoading, error } = useSelector((state: RootState) => state.sellers);
  
  const [form, setForm] = useState<SellerFormData>({
    companyName: "",
    name: "",
    email: "",
    phone: "",
    address: "",
    status: "1",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(addSellerRequest(form, () => {
      router.push("/sellers/list");
    }));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Add Seller</h2>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          <strong>Error:</strong> {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
        <div>
          <input 
            name="companyName" 
            value={form.companyName} 
            onChange={handleChange} 
            placeholder="Company Name" 
            className="p-2 border rounded w-full" 
            required 
          />
          <p className="text-sm text-gray-500 mt-1">Company name must be unique</p>
        </div>
        <div>
          <input 
            name="name" 
            value={form.name} 
            onChange={handleChange} 
            placeholder="Contact Name" 
            className="p-2 border rounded w-full" 
            required 
          />
        </div>
        <div>
          <input 
            name="email" 
            value={form.email} 
            onChange={handleChange} 
            placeholder="Email" 
            className="p-2 border rounded w-full" 
            required 
            type="email" 
          />
          <p className="text-sm text-gray-500 mt-1">Email must be unique</p>
        </div>
        <input 
          name="phone" 
          value={form.phone} 
          onChange={handleChange} 
          placeholder="Phone" 
          className="p-2 border rounded w-full" 
        />
        <input 
          name="address" 
          value={form.address} 
          onChange={handleChange} 
          placeholder="Address" 
          className="p-2 border rounded w-full" 
        />
        <select 
          name="status" 
          value={form.status} 
          onChange={handleChange} 
          className="p-2 border rounded w-full"
        >
          <option value="1">Active</option>
          <option value="0">Inactive</option>
        </select>
        <button 
          type="submit" 
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={addLoading}
        >
          {addLoading ? "Adding..." : "Add Seller"}
        </button>
      </form>
    </div>
  );
} 