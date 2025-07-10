const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

// Test the product upload API directly
async function testProductUpload() {
  try {
    console.log('🧪 Testing product upload API...');
    
    // Create test data
    const testData = {
      name: 'Test Product',
      description: 'Test description',
      category: '64f8b8b8b8b8b8b8b8b8b8b8', // You'll need to replace with a real category ID
      price: '99.99',
      stock: '10',
      sku: 'TEST-SKU-' + Date.now(),
      status: '1',
      seller: '64f8b8b8b8b8b8b8b8b8b8b9' // You'll need to replace with a real seller ID
    };
    
    console.log('📝 Test data:', testData);
    
    // Create FormData
    const formData = new FormData();
    
    // Add all fields
    Object.entries(testData).forEach(([key, value]) => {
      formData.append(key, value);
      console.log(`📤 Adding: ${key} = ${value}`);
    });
    
    // Add a test image if available
    const testImagePath = './test-image.jpg';
    if (fs.existsSync(testImagePath)) {
      formData.append('images', fs.createReadStream(testImagePath));
      console.log('📸 Added test image');
    } else {
      console.log('📸 No test image found, skipping');
    }
    
    // Make the request
    const response = await axios.post('http://localhost:8001/admin/products', formData, {
      headers: {
        ...formData.getHeaders(),
        'Authorization': 'Bearer YOUR_TOKEN_HERE' // Replace with actual token
      },
      timeout: 10000
    });
    
    console.log('✅ Success!');
    console.log('📡 Response status:', response.status);
    console.log('📡 Response data:', response.data);
    
  } catch (error) {
    console.error('❌ Error testing product upload:');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    console.error('Error status:', error.response?.status);
    console.error('Error data:', error.response?.data);
    console.error('Error headers:', error.response?.headers);
    
    if (error.response?.data) {
      console.error('📝 Backend error details:');
      console.error('  Meta:', error.response.data.meta);
      console.error('  Message:', error.response.data.message);
      console.error('  Success:', error.response.data.success);
    }
  }
}

// Test with different scenarios
async function runTests() {
  console.log('🚀 Starting API tests...\n');
  
  // Test 1: Basic request without auth
  console.log('=== Test 1: Basic request without auth ===');
  await testProductUpload();
  
  console.log('\n=== Test 2: Check if server is running ===');
  try {
    const healthCheck = await axios.get('http://localhost:8001/health', { timeout: 5000 });
    console.log('✅ Server is running');
    console.log('📡 Health check response:', healthCheck.data);
  } catch (error) {
    console.error('❌ Server health check failed:', error.message);
  }
  
  console.log('\n=== Test 3: Check admin routes ===');
  try {
    const adminCheck = await axios.get('http://localhost:8001/admin/products', { timeout: 5000 });
    console.log('✅ Admin routes accessible');
  } catch (error) {
    console.error('❌ Admin routes check failed:', error.message);
    console.error('Status:', error.response?.status);
  }
}

// Run the tests
runTests().catch(console.error); 