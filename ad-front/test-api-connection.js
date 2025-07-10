const axios = require('axios');

const BASE_URL = 'http://localhost:8001/admin';

async function testAPIConnection() {
  console.log('🧪 Testing API Connection...\n');

  try {
    // Test 1: Health check
    console.log('1️⃣ Testing health check...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health check successful:', healthResponse.data);

    // Test 2: Get products without auth (should fail)
    console.log('\n2️⃣ Testing products endpoint without auth...');
    try {
      const productsResponse = await axios.get(`${BASE_URL}/products`);
      console.log('❌ Products endpoint should require auth but succeeded:', productsResponse.data);
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Products endpoint correctly requires authentication');
      } else {
        console.log('❌ Unexpected error:', error.response?.status, error.response?.data);
      }
    }

    // Test 3: Get products with invalid token
    console.log('\n3️⃣ Testing products endpoint with invalid token...');
    try {
      const productsResponse = await axios.get(`${BASE_URL}/products`, {
        headers: {
          'Authorization': 'Bearer invalid-token'
        }
      });
      console.log('❌ Should have failed with invalid token:', productsResponse.data);
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Correctly rejected invalid token');
      } else {
        console.log('❌ Unexpected error with invalid token:', error.response?.status, error.response?.data);
      }
    }

    // Test 4: Check if server is running on correct port
    console.log('\n4️⃣ Checking server availability...');
    try {
      const response = await axios.get('http://localhost:8001');
      console.log('✅ Server is running on port 8001');
    } catch (error) {
      console.log('❌ Server not running on port 8001:', error.message);
      
      // Try other common ports
      const ports = [3000, 3001, 5000, 8000, 8080];
      for (const port of ports) {
        try {
          const response = await axios.get(`http://localhost:${port}`);
          console.log(`✅ Server found on port ${port}`);
          break;
        } catch (err) {
          // Continue to next port
        }
      }
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
testAPIConnection(); 