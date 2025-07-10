const axios = require('axios');

// Test login error handling
async function testLoginErrorHandling() {
  console.log('🧪 Testing Login Error Handling...\n');

  const baseURL = 'http://localhost:5000/api';
  
  // Test cases
  const testCases = [
    {
      name: 'Invalid Email (400 Error)',
      data: {
        email: 'invalid@email.com',
        password: 'password123',
        device_code: 'web-admin'
      }
    },
    {
      name: 'Wrong Password (400 Error)',
      data: {
        email: 'admin@example.com',
        password: 'wrongpassword',
        device_code: 'web-admin'
      }
    },
    {
      name: 'User Not Exist (400 Error)',
      data: {
        email: 'nonexistent@example.com',
        password: 'password123',
        device_code: 'web-admin'
      }
    },
    {
      name: 'Empty Email (400 Error)',
      data: {
        email: '',
        password: 'password123',
        device_code: 'web-admin'
      }
    },
    {
      name: 'Empty Password (400 Error)',
      data: {
        email: 'admin@example.com',
        password: '',
        device_code: 'web-admin'
      }
    }
  ];

  for (const testCase of testCases) {
    console.log(`📋 Testing: ${testCase.name}`);
    
    try {
      const response = await axios.post(`${baseURL}/admin/login`, testCase.data);
      console.log('✅ Unexpected success:', response.data);
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        console.log(`❌ Expected ${status} error:`);
        console.log(`   Status: ${status}`);
        console.log(`   Message: ${data?.meta?.message || 'No message'}`);
        console.log(`   Code: ${data?.meta?.code || 'No code'}`);
        console.log(`   Full Response:`, JSON.stringify(data, null, 2));
        
        // Verify error structure
        if (data?.meta?.code === 400) {
          console.log('✅ Correct 400 error structure');
        } else {
          console.log('⚠️  Unexpected error code');
        }
      } else {
        console.log('❌ Network error:', error.message);
      }
    }
    
    console.log('---\n');
  }

  // Test successful login for comparison
  console.log('📋 Testing: Valid Login (Should Succeed)');
  try {
    const response = await axios.post(`${baseURL}/admin/login`, {
      email: 'admin@example.com',
      password: 'admin123',
      device_code: 'web-admin'
    });
    
    if (response.data?.meta?.code === 200) {
      console.log('✅ Login successful');
      console.log(`   Message: ${response.data?.meta?.message}`);
      console.log(`   Token: ${response.data?.meta?.token ? 'Present' : 'Missing'}`);
    } else {
      console.log('❌ Unexpected response structure');
    }
  } catch (error) {
    console.log('❌ Login failed:', error.response?.data || error.message);
  }
}

// Run the test
testLoginErrorHandling().catch(console.error); 