const axios = require('axios');

const BASE_URL = 'http://localhost:3000/admin';

// Test data
const testProduct = {
  name: 'Test Product',
  description: 'Test Description',
  category: '686ea4de6a8bad22443404a7', // Use a valid category ID
  price: '100',
  stock: '50',
  sku: 'TEST-SKU-001'
};

async function testSKUValidation() {
  console.log('🧪 Testing SKU Validation...\n');

  try {
    // Test 1: Add first product with SKU
    console.log('1️⃣ Adding first product with SKU:', testProduct.sku);
    const response1 = await axios.post(`${BASE_URL}/products`, testProduct, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_ADMIN_TOKEN' // Replace with actual token
      }
    });
    
    if (response1.data.success) {
      console.log('✅ First product added successfully');
      console.log('📄 Response:', response1.data.message);
    } else {
      console.log('❌ Failed to add first product:', response1.data.message);
    }

    // Test 2: Try to add second product with same SKU
    console.log('\n2️⃣ Trying to add second product with same SKU:', testProduct.sku);
    const testProduct2 = { ...testProduct, name: 'Test Product 2' };
    
    try {
      const response2 = await axios.post(`${BASE_URL}/products`, testProduct2, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer YOUR_ADMIN_TOKEN' // Replace with actual token
        }
      });
      
      if (response2.data.success) {
        console.log('❌ Second product was added (should have failed)');
      } else {
        console.log('✅ Second product correctly rejected');
        console.log('📄 Error message:', response2.data.message);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        console.log('✅ Second product correctly rejected');
        console.log('📄 Error message:', error.response.data.message);
      } else {
        console.log('❌ Unexpected error:', error.message);
      }
    }

    // Test 3: Check SKU availability
    console.log('\n3️⃣ Checking SKU availability for:', testProduct.sku);
    try {
      const response3 = await axios.get(`${BASE_URL}/products/check-sku?sku=${testProduct.sku}`, {
        headers: {
          'Authorization': 'Bearer YOUR_ADMIN_TOKEN' // Replace with actual token
        }
      });
      
      if (response3.data.success) {
        console.log('✅ SKU availability check successful');
        console.log('📄 Available:', response3.data.data.available);
        console.log('📄 Message:', response3.data.message);
      } else {
        console.log('❌ SKU availability check failed:', response3.data.message);
      }
    } catch (error) {
      console.log('❌ SKU availability check error:', error.message);
    }

    // Test 4: Generate unique SKU
    console.log('\n4️⃣ Generating unique SKU from base:', testProduct.sku);
    try {
      const response4 = await axios.get(`${BASE_URL}/products/generate-sku?baseSKU=${testProduct.sku}`, {
        headers: {
          'Authorization': 'Bearer YOUR_ADMIN_TOKEN' // Replace with actual token
        }
      });
      
      if (response4.data.success) {
        console.log('✅ Unique SKU generated successfully');
        console.log('📄 Generated SKU:', response4.data.data.sku);
        console.log('📄 Message:', response4.data.message);
      } else {
        console.log('❌ SKU generation failed:', response4.data.message);
      }
    } catch (error) {
      console.log('❌ SKU generation error:', error.message);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('📄 Response data:', error.response.data);
    }
  }
}

// Run the test
testSKUValidation(); 