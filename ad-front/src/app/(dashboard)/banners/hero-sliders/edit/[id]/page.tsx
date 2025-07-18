"use client";

import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter, useParams } from 'next/navigation';
import { updateHeroSliderRequest, UpdateHeroSliderData } from '@/components/redux/action/banner/heroSliderAction';
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import { toast } from 'react-toastify';

const EditHeroSliderPage = () => {
  const router = useRouter();
  const params = useParams();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [formData, setFormData] = useState<UpdateHeroSliderData>({
    id: '',
    titleLine1: '',
    titleLine2: '',
    offerText: '',
    offerHighlight: '',
    buttonText: '',
    buttonLink: '',
    image: '',
    backgroundColor: '#ffffff',
    textColor: '#000000',
    animation: 'fade',
    autoplayDelay: 2500,
    sortOrder: 1,
    status: true,
  });

  useEffect(() => {
    if (params.id) {
      setFormData(prev => ({ ...prev, id: params.id as string }));
      // Here you would fetch the existing slider data
      // For now, we'll use placeholder data
    }
  }, [params.id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) : type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        setFormData(prev => ({ ...prev, image: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.titleLine1.trim()) {
      setError('Title Line 1 is required');
      return;
    }

    try {
      setLoading(true);
      dispatch(updateHeroSliderRequest(formData));
      toast.success('Hero slider updated successfully!');
      router.push('/banners/hero-sliders');
    } catch (error) {
      setError('Failed to update hero slider');
      toast.error('Failed to update hero slider');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div suppressHydrationWarning>
      <Breadcrumb pageName="Edit Hero Slider" />

      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-stroke-dark dark:bg-box-dark sm:px-7.5 xl:pb-1">
        <div className="max-w-2xl mx-auto">
          <h4 className="text-xl font-semibold text-black dark:text-white mb-6">
            Edit Hero Slider
          </h4>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Slider Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-3 py-2 border border-stroke rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {imagePreview && (
                <div className="mt-2">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded border"
                  />
                </div>
              )}
            </div>

            {/* Title Line 1 */}
            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Title Line 1 *
              </label>
              <input
                type="text"
                name="titleLine1"
                value={formData.titleLine1}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-stroke rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g., Organic & healthy vegetables"
                required
              />
            </div>

            {/* Title Line 2 */}
            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Title Line 2
              </label>
              <input
                type="text"
                name="titleLine2"
                value={formData.titleLine2}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-stroke rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g., Fresh from the farm"
              />
            </div>

            {/* Offer Text */}
            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Offer Text
              </label>
              <input
                type="text"
                name="offerText"
                value={formData.offerText}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-stroke rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g., Starting at $"
              />
            </div>

            {/* Offer Highlight */}
            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Offer Highlight
              </label>
              <input
                type="text"
                name="offerHighlight"
                value={formData.offerHighlight}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-stroke rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g., 20.00"
              />
            </div>

            {/* Button Text */}
            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Button Text
              </label>
              <input
                type="text"
                name="buttonText"
                value={formData.buttonText}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-stroke rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g., Shop Now"
              />
            </div>

            {/* Button Link */}
            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Button Link
              </label>
              <input
                type="url"
                name="buttonLink"
                value={formData.buttonLink}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-stroke rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g., https://example.com/shop"
              />
            </div>

            {/* Background Color */}
            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Background Color
              </label>
              <input
                type="color"
                name="backgroundColor"
                value={formData.backgroundColor}
                onChange={handleInputChange}
                className="w-full h-12 border border-stroke rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Text Color */}
            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Text Color
              </label>
              <input
                type="color"
                name="textColor"
                value={formData.textColor}
                onChange={handleInputChange}
                className="w-full h-12 border border-stroke rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Animation */}
            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Animation Type
              </label>
              <select
                name="animation"
                value={formData.animation}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-stroke rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="fade">Fade</option>
                <option value="slide">Slide</option>
                <option value="zoom">Zoom</option>
              </select>
            </div>

            {/* Autoplay Delay */}
            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Autoplay Delay (ms)
              </label>
              <input
                type="number"
                name="autoplayDelay"
                value={formData.autoplayDelay}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-stroke rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                min="1000"
                max="10000"
                step="500"
              />
            </div>

            {/* Sort Order */}
            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Sort Order
              </label>
              <input
                type="number"
                name="sortOrder"
                value={formData.sortOrder}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-stroke rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                min="1"
              />
            </div>

            {/* Status */}
            <div className="flex items-center">
              <input
                type="checkbox"
                name="status"
                checked={formData.status}
                onChange={handleInputChange}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-black dark:text-white">
                Active
              </label>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center rounded-md bg-primary py-2 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10 disabled:opacity-50"
              >
                {loading ? 'Updating...' : 'Update Hero Slider'}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="inline-flex items-center justify-center rounded-md border border-stroke py-2 px-10 text-center font-medium text-black hover:bg-gray-50 lg:px-8 xl:px-10"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditHeroSliderPage; 