const axios = require('axios');

const BASE_URL = 'http://localhost:8001/admin';

// Test cases for login errors
const testCases = [
  {
    name: 'Wrong Password Test',
    data: {
      email: 'admin@example.com',
      password: 'wrongpassword',
      device_code: 'web-admin'
    },
    expectedError: 'emailPasswordNotMatch'
  },
  {
    name: 'Non-existent User Test',
    data: {
      email: 'nonexistent@example.com',
      password: 'anypassword',
      device_code: 'web-admin'
    },
    expectedError: 'userNotExist'
  },
  {
    name: 'Empty Email Test',
    data: {
      email: '',
      password: 'anypassword',
      device_code: 'web-admin'
    },
    expectedError: 'validation error'
  },
  {
    name: 'Empty Password Test',
    data: {
      email: 'admin@example.com',
      password: '',
      device_code: 'web-admin'
    },
    expectedError: 'validation error'
  }
];

async function testLoginErrors() {
  console.log('🧪 Testing Login Error Messages...\n');

  for (const testCase of testCases) {
    try {
      console.log(`📝 Testing: ${testCase.name}`);
      console.log(`📤 Sending data:`, testCase.data);
      
      const response = await axios.post(`${BASE_URL}/login`, testCase.data);
      
      console.log('❌ UNEXPECTED: Request succeeded when it should have failed');
      console.log('Response:', response.data);
      
    } catch (error) {
      if (error.response) {
        console.log('✅ Expected error received');
        console.log('Status:', error.response.status);
        console.log('Error Message:', error.response.data?.meta?.message);
        console.log('Error Code:', error.response.data?.meta?.code);
        
        // Check if the error message matches expected
        const actualMessage = error.response.data?.meta?.message;
        if (actualMessage && actualMessage.includes(testCase.expectedError)) {
          console.log('✅ Error message matches expected pattern');
        } else {
          console.log('⚠️ Error message does not match expected pattern');
          console.log(`Expected: ${testCase.expectedError}`);
          console.log(`Actual: ${actualMessage}`);
        }
      } else {
        console.log('❌ Network error:', error.message);
      }
    }
    
    console.log('---\n');
  }

  console.log('🎉 Login error tests completed!');
}

// Test the security fix
async function testSecurityFix() {
  console.log('🔒 Testing Security Fix...\n');
  
  try {
    // Test with no password (should fail after security fix)
    console.log('📝 Testing: Login without password (should fail)');
    
    const response = await axios.post(`${BASE_URL}/login`, {
      email: 'admin@example.com',
      password: '', // Empty password
      device_code: 'web-admin'
    });
    
    console.log('❌ SECURITY VULNERABILITY: Login succeeded without password!');
    console.log('Response:', response.data);
    
  } catch (error) {
    if (error.response) {
      console.log('✅ Security fix working: Login properly rejected');
      console.log('Error:', error.response.data?.meta?.message);
    } else {
      console.log('❌ Network error:', error.message);
    }
  }
  
  console.log('---\n');
}

// Run all tests
async function runAllTests() {
  await testSecurityFix();
  await testLoginErrors();
}

runAllTests(); 