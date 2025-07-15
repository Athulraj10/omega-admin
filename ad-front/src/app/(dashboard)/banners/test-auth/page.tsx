"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/utils/api";

export default function TestAuth() {
  const [authStatus, setAuthStatus] = useState<string>("Checking...");
  const [apiStatus, setApiStatus] = useState<string>("Checking...");
  const [token, setToken] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      // Check local storage
      const storedToken = localStorage.getItem('token');
      const adminData = localStorage.getItem('adminData');
      
      setToken(storedToken || 'No token found');
      
      if (!storedToken || !adminData) {
        setAuthStatus("Not authenticated");
        return;
      }
      
      setAuthStatus("Token found in localStorage");
      
      // Test API connectivity
      try {
        console.log('Testing API connectivity...');
        const response = await api.get('/admin/health');
        console.log('Health check response:', response);
        setApiStatus(`API connected: ${response.data.message}`);
      } catch (error: any) {
        console.error('API test error:', error);
        setApiStatus(`API error: ${error.message}`);
      }
    };
    
    checkAuth();
  }, []);

  const testBannerAPI = async () => {
    try {
      setApiStatus("Testing banner API...");
      const response = await api.get('/admin/banners');
      console.log('Banner API response:', response);
      setApiStatus(`Banner API success: ${response.data.data?.length || 0} banners found`);
    } catch (error: any) {
      console.error('Banner API error:', error);
      setApiStatus(`Banner API error: ${error.response?.status} - ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Authentication & API Test</h1>
      
      <div className="space-y-4">
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="font-semibold mb-2">Authentication Status:</h2>
          <p className="text-sm">{authStatus}</p>
        </div>
        
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="font-semibold mb-2">Token:</h2>
          <p className="text-xs break-all">{token}</p>
        </div>
        
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="font-semibold mb-2">API Status:</h2>
          <p className="text-sm">{apiStatus}</p>
        </div>
        
        <div className="space-x-4">
          <button
            onClick={testBannerAPI}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Test Banner API
          </button>
          
          <button
            onClick={() => router.push('/sign-in')}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Go to Login
          </button>
          
          <button
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Clear Storage & Reload
          </button>
        </div>
      </div>
    </div>
  );
} 