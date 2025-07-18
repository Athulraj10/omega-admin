const axios = require('axios');
const FormData = require('form-data');

const BASE_URL = 'http://localhost:5000/api';

async function testProductAdd() {
  try {
    console.log('🚀 Testing Product Add API...');
    
    // First, let's test if the server is running
    console.log('1. Testing server health...');
    try {
      const healthResponse = await axios.get(`${BASE_URL}/admin/health`);
      console.log('✅ Server is running:', healthResponse.data);
    } catch (error) {
      console.log('❌ Server health check failed:', error.message);
      return;
    }
    
    // Test getting sellers (needed for product form)
    console.log('\n2. Testing sellers endpoint...');
    try {
      const sellersResponse = await axios.get(`${BASE_URL}/admin/sellers`);
      console.log('✅ Sellers fetched successfully');
      console.log('📊 Sellers count:', sellersResponse.data.data?.length || 0);
      if (sellersResponse.data.data?.length > 0) {
        console.log('📋 First seller:', {
          _id: sellersResponse.data.data[0]._id,
          companyName: sellersResponse.data.data[0].companyName,
          userName: sellersResponse.data.data[0].userName
        });
      }
    } catch (error) {
      console.log('❌ Sellers fetch failed:', error.response?.data?.message || error.message);
    }
    
    // Test getting categories (needed for product form)
    console.log('\n3. Testing categories endpoint...');
    try {
      const categoriesResponse = await axios.get(`${BASE_URL}/admin/categories/for-product`);
      console.log('✅ Categories fetched successfully');
      console.log('📊 Categories count:', categoriesResponse.data.data?.length || 0);
      if (categoriesResponse.data.data?.length > 0) {
        console.log('📋 First category:', {
          id: categoriesResponse.data.data[0].id,
          name: categoriesResponse.data.data[0].name,
          subcategories: categoriesResponse.data.data[0].subcategories?.length || 0
        });
      }
    } catch (error) {
      console.log('❌ Categories fetch failed:', error.response?.data?.message || error.message);
    }
    
    // Test product add endpoint (without authentication for now)
    console.log('\n4. Testing product add endpoint structure...');
    try {
      const formData = new FormData();
      formData.append('name', 'Test Product');
      formData.append('description', 'Test product description');
      formData.append('price', '99.99');
      formData.append('stock', '10');
      formData.append('status', '1');
      formData.append('sku', 'TEST-SKU-001');
      
      const productResponse = await axios.post(`${BASE_URL}/admin/products`, formData, {
        headers: {
          ...formData.getHeaders(),
          'Authorization': 'Bearer test-token' // This will fail auth, but we can see the endpoint structure
        }
      });
      console.log('✅ Product add endpoint is accessible');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Product add endpoint exists (auth required)');
        console.log('📄 Response structure:', {
          success: error.response.data?.success,
          message: error.response.data?.message
        });
      } else {
        console.log('❌ Product add endpoint failed:', error.response?.data?.message || error.message);
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testProductAdd(); 