"use client";

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/components/redux/store';
import {
  fetchHeroSlidersRequest,
  deleteHeroSliderRequest,
  toggleHeroSliderStatusRequest,
  reorderHeroSlidersRequest,
  HeroSlider,
} from '@/components/redux/action/banner/heroSliderAction';
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import { toast } from 'react-toastify';
import Link from 'next/link';
import HeroSliderPreview from '@/components/HeroSliderPreview';

const HeroSlidersPage = () => {
  const dispatch = useDispatch();
  const heroSliderState = useSelector((state: RootState) => state.heroSlider);
  
  // Debug logging to understand the state structure
  console.log('HeroSlider State:', heroSliderState);
  
  // Safely extract values with proper fallbacks
  const heroSliders = Array.isArray(heroSliderState?.heroSliders) ? heroSliderState.heroSliders : [];
  const loading = heroSliderState?.loading || false;
  const error = heroSliderState?.error || null;
  
  console.log('heroSliders type:', typeof heroSliders, 'value:', heroSliders);
  const [mounted, setMounted] = useState(false);
  
  // Dynamic state management
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deviceFilter, setDeviceFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedSliders, setSelectedSliders] = useState<string[]>([]);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedSliderForReview, setSelectedSliderForReview] = useState<HeroSlider | null>(null);

  useEffect(() => {
    setMounted(true);
    dispatch(fetchHeroSlidersRequest());
  }, []);

  // Auto-refresh data every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (!loading) {
        dispatch(fetchHeroSlidersRequest());
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [dispatch, loading]);

  // Filtered and sorted data
  const filteredAndSortedSliders = useMemo(() => {
    let filtered = [...heroSliders];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(slider =>
        slider.titleLine1.toLowerCase().includes(searchTerm.toLowerCase()) ||
        slider.titleLine2?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        slider.offerText?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(slider => 
        statusFilter === 'active' ? slider.status : !slider.status
      );
    }

    // Device filter
    if (deviceFilter !== 'all') {
      filtered = filtered.filter(slider => slider.device === deviceFilter);
    }

    // Sorting
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortBy) {
        case 'title':
          aValue = a.titleLine1.toLowerCase();
          bValue = b.titleLine1.toLowerCase();
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'device':
          aValue = a.device;
          bValue = b.device;
          break;
        case 'isDefault':
          aValue = a.isDefault;
          bValue = b.isDefault;
          break;
        case 'createdAt':
        default:
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [heroSliders, searchTerm, statusFilter, deviceFilter, sortBy, sortOrder]);

  const handleDelete = useCallback((id: string) => {
    if (window.confirm('Are you sure you want to delete this hero slider?')) {
      dispatch(deleteHeroSliderRequest(id));
      setSelectedSliders(prev => prev.filter(sliderId => sliderId !== id));
    }
  }, [dispatch]);

  const handleToggleStatus = useCallback((id: string) => {
    dispatch(toggleHeroSliderStatusRequest(id));
  }, [dispatch]);

  const handleSetDefault = useCallback((id: string) => {
    // TODO: Implement set default functionality
    toast.info('Set default functionality will be implemented soon');
  }, []);

  const handleBulkAction = useCallback((action: 'delete' | 'activate' | 'deactivate') => {
    if (selectedSliders.length === 0) {
      toast.warning('Please select at least one slider');
      return;
    }

    const actionText = action === 'delete' ? 'delete' : action === 'activate' ? 'activate' : 'deactivate';
    
    if (window.confirm(`Are you sure you want to ${actionText} ${selectedSliders.length} slider(s)?`)) {
      selectedSliders.forEach(id => {
        if (action === 'delete') {
          dispatch(deleteHeroSliderRequest(id));
        } else {
          dispatch(toggleHeroSliderStatusRequest(id));
        }
      });
      setSelectedSliders([]);
    }
  }, [selectedSliders, dispatch]);

  const handleSelectAll = useCallback(() => {
    if (selectedSliders.length === filteredAndSortedSliders.length) {
      setSelectedSliders([]);
    } else {
      setSelectedSliders(filteredAndSortedSliders.map(slider => slider._id));
    }
  }, [selectedSliders.length, filteredAndSortedSliders]);

  const handleSelectSlider = useCallback((id: string) => {
    setSelectedSliders(prev => 
      prev.includes(id) 
        ? prev.filter(sliderId => sliderId !== id)
        : [...prev, id]
    );
  }, []);

  const formatDate = useCallback((dateString: string) => {
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    return `${month} ${day}, ${year} ${hours}:${minutes}`;
  }, []);

  const getStatusColor = useCallback((status: boolean) => {
    return status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  }, []);

  const handleReview = useCallback((slider: HeroSlider) => {
    setSelectedSliderForReview(slider);
    setShowReviewModal(true);
  }, []);

  const closeReviewModal = useCallback(() => {
    setShowReviewModal(false);
    setSelectedSliderForReview(null);
  }, []);

  if (!mounted) return null;

  return (
    <div suppressHydrationWarning>
      <Breadcrumb pageName="Hero Sliders Management" />

      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-stroke-dark dark:bg-box-dark sm:px-7.5 xl:pb-1">
        {/* Header with Actions */}
        <div className="flex flex-wrap gap-3 justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <h4 className="text-xl font-semibold text-black dark:text-white">
              Hero Sliders ({filteredAndSortedSliders.length})
            </h4>
          </div>
          <Link
            href="/banners/hero-sliders/add"
            className="inline-flex items-center justify-center rounded-md bg-primary py-2 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10 transition-all duration-200 hover:scale-105"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Hero Slider
          </Link>
        </div>



        {/* Statistics */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 dark:text-blue-400">Total Sliders</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{heroSliders.length}</p>
              </div>
              <div className="text-blue-500">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 dark:text-green-400">Active</p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                  {heroSliders.filter(s => s.status).length}
                </p>
              </div>
              <div className="text-green-500">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-600 dark:text-yellow-400">Desktop</p>
                <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">
                  {heroSliders.filter(s => s.device === 'desktop').length}
                </p>
              </div>
              <div className="text-yellow-500">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 dark:text-purple-400">Mobile</p>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                  {heroSliders.filter(s => s.device === 'mobile').length}
                </p>
              </div>
              <div className="text-purple-500">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-wrap gap-4">
            {/* Search */}
            <div className="flex-1 min-w-64">
              <input
                type="text"
                placeholder="Search sliders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            {/* Device Filter */}
            <select
              value={deviceFilter}
              onChange={(e) => setDeviceFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="all">All Devices</option>
              <option value="desktop">Desktop</option>
              <option value="mobile">Mobile</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="createdAt">Date Created</option>
              <option value="title">Title</option>
              <option value="status">Status</option>
              <option value="device">Device</option>
              <option value="isDefault">Default</option>
            </select>

            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600"
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>

          {/* Bulk Actions */}
          {selectedSliders.length > 0 && (
            <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <span className="text-sm text-blue-700 dark:text-blue-300">
                {selectedSliders.length} slider(s) selected
              </span>
              <button
                onClick={() => handleBulkAction('activate')}
                className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
              >
                Activate All
              </button>
              <button
                onClick={() => handleBulkAction('deactivate')}
                className="px-3 py-1 text-xs bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200"
              >
                Deactivate All
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
              >
                Delete All
              </button>
              <button
                onClick={() => setSelectedSliders([])}
                className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
              >
                Clear Selection
              </button>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        ) : filteredAndSortedSliders.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-gray-500 mb-4">
              {searchTerm || statusFilter !== 'all' || deviceFilter !== 'all' 
                ? 'No sliders match your filters.' 
                : 'No hero sliders found. Create your first one!'}
            </p>
            <Link
              href="/banners/hero-sliders/add"
              className="inline-flex items-center justify-center rounded-md bg-primary py-2 px-6 text-center font-medium text-white hover:bg-opacity-90 transition-all duration-200 hover:scale-105"
            >
              Add Your First Hero Slider
            </Link>
          </div>
        ) : (
          <div className="max-w-full overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                  <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                    Hero Slider
                  </th>
                  <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                    Title
                  </th>
                  <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                    Device
                  </th>
                  <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                    Status
                  </th>
                  <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                    Default
                  </th>
                  <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                    Created
                  </th>
                  <th className="py-4 px-4 font-medium text-black dark:text-white">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedSliders.map((slider: HeroSlider) => (
                  <tr key={slider._id} className="border-b border-[#eee] dark:border-stroke-dark">
                    <td className="py-5 px-4 pl-9 dark:border-stroke-dark xl:pl-11">
                      <div className="flex items-center gap-3">
                        <div className="relative h-16 w-24 rounded-md overflow-hidden">
                          <img
                            src={slider.imageUrl || slider.image}
                            alt="Hero Slider"
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = '/images/product/product-01.png';
                            }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-4">
                      <div className="flex flex-col">
                        <h5 className="font-medium text-black dark:text-white">
                          {slider.titleLine1 || 'No title'}
                        </h5>
                        {slider.titleLine2 && (
                          <p className="text-sm text-bodydark2">{slider.titleLine2}</p>
                        )}
                        {slider.offerText && (
                          <p className="text-sm text-primary">
                            {slider.offerText} {slider.offerHighlight && <span className="font-bold">{slider.offerHighlight}</span>}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="py-5 px-4">
                      <span className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${
                        slider.device === 'desktop' 
                          ? 'bg-success text-success' 
                          : 'bg-warning text-warning'
                      }`}>
                        {slider.device}
                      </span>
                    </td>
                    <td className="py-5 px-4">
                      <label className="relative inline-flex cursor-pointer items-center">
                        <input
                          type="checkbox"
                          checked={slider.status}
                          onChange={() => handleToggleStatus(slider._id)}
                          className="sr-only peer"
                        />
                        <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:bg-gray-700 dark:peer-focus:ring-primary/80"></div>
                      </label>
                    </td>
                    <td className="py-5 px-4">
                      {slider.isDefault ? (
                        <span className="inline-flex rounded-full bg-success bg-opacity-10 py-1 px-3 text-sm font-medium text-success">
                          Default
                        </span>
                      ) : (
                        <button
                          onClick={() => handleSetDefault(slider._id)}
                          className="inline-flex rounded-full bg-primary bg-opacity-10 py-1 px-3 text-sm font-medium text-primary hover:bg-opacity-20"
                        >
                          Set Default
                        </button>
                      )}
                    </td>
                    <td className="py-5 px-4">
                      <p className="text-black dark:text-white">
                        {formatDate(slider.createdAt)}
                      </p>
                    </td>
                    <td className="py-5 px-4">
                      <div className="flex items-center space-x-3.5">
                        <button
                          onClick={() => handleReview(slider)}
                          className="hover:text-purple-600"
                          title="Review Slider"
                        >
                          <svg className="fill-current" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 12.75C11.0711 12.75 12.75 11.0711 12.75 9C12.75 6.92893 11.0711 5.25 9 5.25C6.92893 5.25 5.25 6.92893 5.25 9C5.25 11.0711 6.92893 12.75 9 12.75Z" fill=""/>
                            <path d="M9 1.5C4.85786 1.5 1.5 4.85786 1.5 9C1.5 13.1421 4.85786 16.5 9 16.5C13.1421 16.5 16.5 13.1421 16.5 9C16.5 4.85786 13.1421 1.5 9 1.5ZM9 15C5.68629 15 3 12.3137 3 9C3 5.68629 5.68629 3 9 3C12.3137 3 15 5.68629 15 9C15 12.3137 12.3137 15 9 15Z" fill=""/>
                          </svg>
                        </button>
                        <Link
                          href={`/banners/hero-sliders/edit/${slider._id}`}
                          className="hover:text-primary"
                        >
                          <svg className="fill-current" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clipPath="url(#clip0_130_9806)">
                              <path d="M1.42188 12.3466C1.36541 12.1906 1.42188 12.0347 1.52578 11.9307L7.38156 6.07422C7.43906 6.01672 7.52578 5.99844 7.58328 6.05594C7.64078 6.11344 7.65906 6.20016 7.60156 6.25766L1.74766 12.1141C1.64375 12.2181 1.47812 12.2746 1.42188 12.3466ZM12.2344 13.0781H2.8125C2.51875 13.0781 2.28125 13.3156 2.28125 13.6094C2.28125 13.9031 2.51875 14.1406 2.8125 14.1406H12.2344C12.5281 14.1406 12.7656 13.9031 12.7656 13.6094C12.7656 13.3156 12.5281 13.0781 12.2344 13.0781ZM14.7422 5.4375L12.4688 3.16406C12.3164 3.01172 12.0695 3.01172 11.9172 3.16406L10.4062 4.675L13.6758 7.94453L15.1867 6.43359C15.3391 6.28125 15.3391 6.03438 15.1867 5.88203L14.7422 5.4375Z" fill=""/>
                            </g>
                            <defs>
                              <clipPath id="clip0_130_9806">
                                <rect width="18" height="18" fill="white"/>
                              </clipPath>
                            </defs>
                          </svg>
                        </Link>
                        <button
                          onClick={() => handleDelete(slider._id)}
                          className="hover:text-danger"
                        >
                          <svg className="fill-current" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clipPath="url(#clip0_130_9808)">
                              <path d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.3844L4.95039 6.2719H13.0785L12.6566 15.3844C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z" fill=""/>
                              <path d="M9.00039 9.11255C8.66289 9.11255 8.35352 9.3938 8.35352 9.75942V13.3313C8.35352 13.6688 8.63477 13.9782 9.00039 13.9782C9.33789 13.9782 9.64727 13.6969 9.64727 13.3313V9.75942C9.64727 9.3938 9.33789 9.11255 9.00039 9.11255Z" fill=""/>
                              <path d="M11.2502 9.67504C10.8846 9.64692 10.6033 9.90004 10.6033 10.2657V13.3313C10.6033 13.6688 10.8846 13.9782 11.2502 13.9782C11.5877 13.9782 11.8971 13.6969 11.8971 13.3313V10.2657C11.8971 9.90004 11.5877 9.64692 11.2502 9.67504Z" fill=""/>
                              <path d="M6.72245 9.67504C6.38495 9.70317 6.1037 10.0125 6.1037 10.3782V13.3313C6.1037 13.6688 6.38495 13.9782 6.72245 13.9782C7.08808 13.9782 7.39745 13.6969 7.39745 13.3313V10.3782C7.39745 10.0125 7.08808 9.70317 6.72245 9.67504Z" fill=""/>
                            </g>
                            <defs>
                              <clipPath id="clip0_130_9808">
                                <rect width="18" height="18" fill="white"/>
                              </clipPath>
                            </defs>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}



        {/* Review Modal */}
        {showReviewModal && selectedSliderForReview && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-semibold text-black dark:text-white">
                  Review Hero Slider
                </h3>
                <button
                  onClick={closeReviewModal}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

                            {/* Modal Content */}
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Details Section - Left Side */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-black dark:text-white">Slider Details</h4>
                    
                    <div className="space-y-4">
                      {/* Content Details */}
                      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                        <h5 className="text-md font-semibold text-gray-900 dark:text-white mb-3">Content</h5>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Title Line 1
                            </label>
                            <p className="text-black dark:text-white font-medium">{selectedSliderForReview.titleLine1}</p>
                          </div>

                          {selectedSliderForReview.titleLine2 && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Title Line 2
                              </label>
                              <p className="text-black dark:text-white">{selectedSliderForReview.titleLine2}</p>
                            </div>
                          )}

                          {selectedSliderForReview.offerText && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Offer Text
                              </label>
                              <p className="text-black dark:text-white">
                                {selectedSliderForReview.offerText}
                                {selectedSliderForReview.offerHighlight && (
                                  <span className="font-bold ml-1 text-blue-600">
                                    {selectedSliderForReview.offerHighlight}
                                  </span>
                                )}
                              </p>
                            </div>
                          )}

                          {selectedSliderForReview.buttonText && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Button Text
                              </label>
                              <p className="text-black dark:text-white">{selectedSliderForReview.buttonText}</p>
                            </div>
                          )}

                          {selectedSliderForReview.buttonLink && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Button Link
                              </label>
                              <p className="text-blue-600 break-all text-sm">{selectedSliderForReview.buttonLink}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Settings Details */}
                      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                        <h5 className="text-md font-semibold text-gray-900 dark:text-white mb-3">Settings</h5>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Status
                            </label>
                            <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(selectedSliderForReview.status)}`}>
                              {selectedSliderForReview.status ? 'Active' : 'Inactive'}
                            </span>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Device
                            </label>
                            <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                              {selectedSliderForReview.device || 'desktop'}
                            </span>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Default
                            </label>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {selectedSliderForReview.isDefault ? 'Yes' : 'No'}
                            </span>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Sort Order
                            </label>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {selectedSliderForReview.sortOrder || 'Auto'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Technical Details */}
                      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                        <h5 className="text-md font-semibold text-gray-900 dark:text-white mb-3">Technical Info</h5>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Animation:</span>
                            <span className="text-sm font-medium capitalize">{selectedSliderForReview.animation || 'fade'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Background:</span>
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-4 h-4 rounded border"
                                style={{ backgroundColor: selectedSliderForReview.backgroundColor || '#ffffff' }}
                              ></div>
                              <span className="text-xs font-mono">{selectedSliderForReview.backgroundColor || '#ffffff'}</span>
                            </div>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Text Color:</span>
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-4 h-4 rounded border"
                                style={{ backgroundColor: selectedSliderForReview.textColor || '#000000' }}
                              ></div>
                              <span className="text-xs font-mono">{selectedSliderForReview.textColor || '#000000'}</span>
                            </div>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Autoplay Delay:</span>
                            <span className="text-sm font-medium">{(selectedSliderForReview.autoplayDelay || 3000) / 1000}s</span>
                          </div>
                        </div>
                      </div>

                      {/* Timestamps */}
                      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                        <h5 className="text-md font-semibold text-gray-900 dark:text-white mb-3">Timestamps</h5>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Created:</span>
                            <span className="text-sm font-medium">{formatDate(selectedSliderForReview.createdAt)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Updated:</span>
                            <span className="text-sm font-medium">{formatDate(selectedSliderForReview.updatedAt)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Preview Section - Right Side */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-black dark:text-white">User-Side Preview</h4>
                    
                    {/* Device Toggle */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setPreviewDevice('desktop')}
                        className={`px-3 py-1 text-sm rounded ${
                          previewDevice === 'desktop'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                        }`}
                      >
                        Desktop
                      </button>
                      <button
                        onClick={() => setPreviewDevice('mobile')}
                        className={`px-3 py-1 text-sm rounded ${
                          previewDevice === 'mobile'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                        }`}
                      >
                        Mobile
                      </button>
                    </div>

                    {/* Hero Slider Preview Component */}
                    <HeroSliderPreview
                      image={selectedSliderForReview.imageUrl || selectedSliderForReview.image}
                      titleLine1={selectedSliderForReview.titleLine1}
                      titleLine2={selectedSliderForReview.titleLine2}
                      offerText={selectedSliderForReview.offerText}
                      offerHighlight={selectedSliderForReview.offerHighlight}
                      buttonText={selectedSliderForReview.buttonText}
                      backgroundColor={selectedSliderForReview.backgroundColor}
                      textColor={selectedSliderForReview.textColor}
                      animation={selectedSliderForReview.animation}
                      device={previewDevice}
                    />

                    {/* Preview Info */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                      <h5 className="text-md font-semibold text-blue-900 dark:text-blue-100 mb-2">Preview Information</h5>
                      <div className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                        <p>• This preview shows exactly how the hero slider will appear to users</p>
                        <p>• Toggle between desktop and mobile to see responsive behavior</p>
                        <p>• All content, colors, and styling are applied as they will appear live</p>
                        <p>• The button is non-functional in preview mode</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={closeReviewModal}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                >
                  Close
                </button>
                <Link
                  href={`/banners/hero-sliders/edit/${selectedSliderForReview._id}`}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Edit Slider
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeroSlidersPage; 