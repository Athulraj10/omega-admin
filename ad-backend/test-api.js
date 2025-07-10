const axios = require('axios');

const BASE_URL = 'http://localhost:8001';

async function testAPI() {
  try {
    console.log('🧪 Testing API endpoints...\n');

    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get(`${BASE_URL}/admin/health`);
    console.log('✅ Health endpoint:', healthResponse.data);
    console.log('');

    // Test users endpoint (without auth for testing)
    console.log('2. Testing users endpoint...');
    const usersResponse = await axios.get(`${BASE_URL}/admin/test-users`);
    console.log('✅ Users endpoint:', usersResponse.data);
    console.log('');

    console.log('🎉 All API tests passed!');

  } catch (error) {
    console.error('❌ API test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

// Run the test
testAPI(); 