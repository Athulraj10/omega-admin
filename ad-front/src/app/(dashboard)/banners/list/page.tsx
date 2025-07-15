"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/components/redux/hooks";
import { fetchBannersRequest, deleteBannerRequest, updateBannerStatusRequest, setDefaultBannerRequest } from "@/components/redux/action/banner/bannerAction";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { toast } from "react-toastify";

export default function ListBanners() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { banners, loading, error } = useAppSelector((state) => state.banner);
  const [selectedDevice, setSelectedDevice] = useState<'all' | 'desktop' | 'mobile'>('all');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      console.log('🔍 Fetching banners...');
      dispatch(fetchBannersRequest());
    }
  }, [dispatch, mounted]);

  const handleAddBanner = () => {
    router.push('/banners/add');
  };

  const handleEditBanner = (bannerId: string) => {
    router.push(`/banners/edit/${bannerId}`);
  };

  const handleDeleteBanner = (bannerId: string) => {
    if (window.confirm('Are you sure you want to delete this banner?')) {
      dispatch(deleteBannerRequest(bannerId));
    }
  };

  const handleToggleStatus = (bannerId: string, currentStatus: '1' | '0') => {
    const newStatus = currentStatus === '1' ? '0' : '1';
    dispatch(updateBannerStatusRequest({ id: bannerId, status: newStatus }));
  };

  const handleSetDefault = (bannerId: string) => {
    dispatch(setDefaultBannerRequest(bannerId));
  };

  const filteredBanners = banners.filter(banner => {
    if (selectedDevice === 'all') return true;
    return banner.device === selectedDevice;
  });

  const formatDate = (dateString: string) => {
    // Use consistent date formatting for both server and client
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    return `${month} ${day}, ${year} ${hours}:${minutes}`;
  };

  // Prevent hydration errors by not rendering until mounted
  if (!mounted) {
    return (
      <>
        <Breadcrumb pageName="Banner Management" />
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-stroke-dark dark:bg-box-dark sm:px-7.5 xl:pb-1">
          <div className="flex items-center justify-center py-8">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          </div>
        </div>
      </>
    );
  }

  return (
    <div suppressHydrationWarning>
      <Breadcrumb pageName="Banner Management" />

      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-stroke-dark dark:bg-box-dark sm:px-7.5 xl:pb-1">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <h4 className="text-xl font-semibold text-black dark:text-white">
            Banners
          </h4>
          
          <div className="flex items-center gap-3">
            <select
              value={selectedDevice}
              onChange={(e) => setSelectedDevice(e.target.value as 'all' | 'desktop' | 'mobile')}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            >
              <option value="all">All Devices</option>
              <option value="desktop">Desktop</option>
              <option value="mobile">Mobile</option>
            </select>
            
            <button
              onClick={handleAddBanner}
              className="inline-flex items-center justify-center rounded-md bg-primary py-2 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
            >
              Add Banner
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md mx-auto">
              <div className="flex items-center justify-center mb-2">
                <svg className="w-6 h-6 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-red-800 font-medium mb-2">Error Loading Banners</p>
              <p className="text-red-600 text-sm">{error}</p>
              {error.includes('Authentication') && (
                <button
                  onClick={() => router.push('/sign-in')}
                  className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                >
                  Go to Login
                </button>
              )}
            </div>
          </div>
        ) : filteredBanners.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">No banners found</p>
          </div>
        ) : (
          <div className="max-w-full overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                  <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                    Banner
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
                {filteredBanners.map((banner) => (
                  <tr key={banner._id} className="border-b border-[#eee] dark:border-stroke-dark">
                    <td className="py-5 px-4 pl-9 dark:border-stroke-dark xl:pl-11">
                      <div className="flex items-center gap-3">
                        <div className="relative h-16 w-24 rounded-md overflow-hidden">
                          <img
                            src={banner.image}
                            alt="Banner"
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = '/images/placeholder.png';
                            }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-4">
                      <div className="flex flex-col">
                        <h5 className="font-medium text-black dark:text-white">
                          {banner.titleLine1 || 'No title'}
                        </h5>
                        {banner.titleLine2 && (
                          <p className="text-sm text-bodydark2">{banner.titleLine2}</p>
                        )}
                        {banner.offerText && (
                          <p className="text-sm text-primary">
                            {banner.offerText} {banner.offerHighlight && <span className="font-bold">{banner.offerHighlight}</span>}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="py-5 px-4">
                      <span className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${
                        banner.device === 'desktop' 
                          ? 'bg-success text-success' 
                          : 'bg-warning text-warning'
                      }`}>
                        {banner.device}
                      </span>
                    </td>
                    <td className="py-5 px-4">
                      <label className="relative inline-flex cursor-pointer items-center">
                        <input
                          type="checkbox"
                          checked={banner.status === '1'}
                          onChange={() => handleToggleStatus(banner._id, banner.status)}
                          className="sr-only peer"
                        />
                        <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:bg-gray-700 dark:peer-focus:ring-primary/80"></div>
                      </label>
                    </td>
                    <td className="py-5 px-4">
                      {banner.isDefault ? (
                        <span className="inline-flex rounded-full bg-success bg-opacity-10 py-1 px-3 text-sm font-medium text-success">
                          Default
                        </span>
                      ) : (
                        <button
                          onClick={() => handleSetDefault(banner._id)}
                          className="inline-flex rounded-full bg-primary bg-opacity-10 py-1 px-3 text-sm font-medium text-primary hover:bg-opacity-20"
                        >
                          Set Default
                        </button>
                      )}
                    </td>
                    <td className="py-5 px-4">
                      <p className="text-black dark:text-white">
                        {formatDate(banner.createdAt)}
                      </p>
                    </td>
                    <td className="py-5 px-4">
                      <div className="flex items-center space-x-3.5">
                        <button
                          onClick={() => handleEditBanner(banner._id)}
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
                        </button>
                        <button
                          onClick={() => handleDeleteBanner(banner._id)}
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
      </div>
    </div>
  );
} 