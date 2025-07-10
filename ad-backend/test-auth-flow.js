const axios = require('axios');

const BASE_URL = 'http://localhost:8001/admin';

async function testAuthFlow() {
  console.log('🧪 Testing Authentication Flow...\n');

  try {
    // Test 1: Admin login
    console.log('1️⃣ Testing admin login...');
    const loginData = {
      email: 'admin@gmail.com',
      password: 'admin@123'
    };
    
    const loginResponse = await axios.post(`${BASE_URL}/login`, loginData);
    console.log('📡 Login response status:', loginResponse.status);
    
    if (loginResponse.data?.success) {
      console.log('✅ Login successful');
      console.log('📄 Token:', loginResponse.data.data?.token ? 'Present' : 'Missing');
      console.log('📄 User data:', {
        id: loginResponse.data.data?.user?._id,
        email: loginResponse.data.data?.user?.email,
        role: loginResponse.data.data?.user?.role,
        roleLevel: loginResponse.data.data?.user?.roleLevel
      });
      
      const token = loginResponse.data.data?.token;
      
      if (token) {
        // Test 2: Get products with valid token
        console.log('\n2️⃣ Testing products endpoint with valid token...');
        try {
          const productsResponse = await axios.get(`${BASE_URL}/products`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          console.log('📡 Products response status:', productsResponse.status);
          console.log('📄 Products response:', {
            success: productsResponse.data?.success,
            message: productsResponse.data?.message,
            dataLength: productsResponse.data?.data?.length || 0
          });
          
          if (productsResponse.data?.success) {
            console.log('✅ Products fetched successfully');
            if (productsResponse.data?.data?.length > 0) {
              console.log('📦 Sample product:', {
                _id: productsResponse.data.data[0]._id,
                name: productsResponse.data.data[0].name,
                category: productsResponse.data.data[0].category,
                seller: productsResponse.data.data[0].seller
              });
            } else {
              console.log('📦 No products found in database');
            }
          } else {
            console.log('❌ Products fetch failed:', productsResponse.data?.message);
          }
        } catch (error) {
          console.log('❌ Products request failed:', error.response?.status, error.response?.data);
        }
        
        // Test 3: Get categories with valid token
        console.log('\n3️⃣ Testing categories endpoint with valid token...');
        try {
          const categoriesResponse = await axios.get(`${BASE_URL}/categories`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          console.log('📡 Categories response status:', categoriesResponse.status);
          console.log('📄 Categories response:', {
            success: categoriesResponse.data?.success,
            message: categoriesResponse.data?.message,
            dataLength: categoriesResponse.data?.data?.length || 0
          });
          
          if (categoriesResponse.data?.success) {
            console.log('✅ Categories fetched successfully');
            if (categoriesResponse.data?.data?.length > 0) {
              console.log('📂 Sample category:', {
                _id: categoriesResponse.data.data[0]._id,
                name: categoriesResponse.data.data[0].name,
                status: categoriesResponse.data.data[0].status
              });
            } else {
              console.log('📂 No categories found in database');
            }
          } else {
            console.log('❌ Categories fetch failed:', categoriesResponse.data?.message);
          }
        } catch (error) {
          console.log('❌ Categories request failed:', error.response?.status, error.response?.data);
        }
        
        // Test 4: Get sellers with valid token
        console.log('\n4️⃣ Testing sellers endpoint with valid token...');
        try {
          const sellersResponse = await axios.get(`${BASE_URL}/sellers`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          console.log('📡 Sellers response status:', sellersResponse.status);
          console.log('📄 Sellers response:', {
            success: sellersResponse.data?.success,
            message: sellersResponse.data?.message,
            dataLength: sellersResponse.data?.data?.length || 0
          });
          
          if (sellersResponse.data?.success) {
            console.log('✅ Sellers fetched successfully');
            if (sellersResponse.data?.data?.length > 0) {
              console.log('👥 Sample seller:', {
                _id: sellersResponse.data.data[0]._id,
                companyName: sellersResponse.data.data[0].companyName,
                userName: sellersResponse.data.data[0].userName
              });
            } else {
              console.log('👥 No sellers found in database');
            }
          } else {
            console.log('❌ Sellers fetch failed:', sellersResponse.data?.message);
          }
        } catch (error) {
          console.log('❌ Sellers request failed:', error.response?.status, error.response?.data);
        }
        
      } else {
        console.log('❌ No token received from login');
      }
    } else {
      console.log('❌ Login failed:', loginResponse.data?.message);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('📄 Response status:', error.response.status);
      console.error('📄 Response data:', error.response.data);
    }
  }
}

// Run the test
testAuthFlow(); 