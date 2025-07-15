const axios = require('axios');

async function testBannerAPI() {
  try {
    console.log('🔍 Testing banner API...');
    
    // Test health endpoint first
    const healthResponse = await axios.get('http://localhost:3000/admin/health');
    console.log('✅ Health check:', healthResponse.data);
    
    // Test banner endpoint (this will require authentication)
    try {
      const bannerResponse = await axios.get('http://localhost:3000/admin/banners');
      console.log('✅ Banner API response:', bannerResponse.data);
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Banner API is working (requires authentication)');
      } else {
        console.log('❌ Banner API error:', error.response?.data || error.message);
      }
    }
    
  } catch (error) {
    console.error('❌ API test failed:', error.message);
  }
}

testBannerAPI(); 