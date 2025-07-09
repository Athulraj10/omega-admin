"use client";

import React, { useState, useEffect, useRef } from "react";
import InputGroup from "@/components/FormElements/InputGroup";
import { Checkbox } from "@/components/FormElements/checkbox";
import { useAppDispatch, useAppSelector } from "@/components/redux/hooks";
import { addProduct, editProduct, fetchProducts } from "@/components/redux/action/products/productAction";
import { getSellersRequest } from "@/components/redux/action/seller";
import { useRouter, useSearchParams } from "next/navigation";

export default function AddProduct() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { products, loading } = useAppSelector((state) => state.products);
  const { sellers } = useAppSelector((state) => state.sellers);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    status: "active",
    sku: "",
    discountPrice: "",
    seller: "",
    images: [] as File[],
  });
  const [editId, setEditId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch sellers on component mount
  useEffect(() => {
    dispatch(getSellersRequest());
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
            status: prod.status || "active",
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({ ...formData, images: Array.from(e.target.files) });
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const payload = {
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      discountPrice: formData.discountPrice ? parseFloat(formData.discountPrice) : undefined,
      seller: formData.seller || undefined,
      images: formData.images,
    };
    if (editId) {
      dispatch(editProduct({ id: editId, data: payload, callback: () => {
        setSubmitting(false);
        router.push("/products/list");
      }}));
    } else {
      dispatch(addProduct({ data: payload, callback: () => {
        setSubmitting(false);
        router.push("/products/list");
      }}));
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-dark dark:text-white">{editId ? "Edit Product" : "Add New Product"}</h1>
        <p className="text-gray-600 dark:text-gray-400">{editId ? "Update product details" : "Create a new product for your store"}</p>
      </div>

      <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-dark">
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

          <InputGroup
            type="text"
            label="Category"
            name="category"
            placeholder="Enter category"
            value={formData.category}
            handleChange={handleChange}
            required
          />

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

          <div>
            <label className="mb-2.5 block text-black dark:text-white">Product Images</label>
            <input
              type="file"
              name="images"
              multiple
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-lg file:border-0 file:bg-primary file:px-4 file:py-2 file:text-white hover:file:bg-primary/80"
            />
            {formData.images.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {formData.images.map((file, idx) => (
                  <span key={idx} className="rounded bg-gray-200 px-2 py-1 text-xs text-gray-700 dark:bg-gray-700 dark:text-white">
                    {file.name}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="status"
              name="status"
              checked={formData.status === "active"}
              onChange={(e) => setFormData({ ...formData, status: e.target.checked ? "active" : "inactive" })}
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
                status: "active",
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