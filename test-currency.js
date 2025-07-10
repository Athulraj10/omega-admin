const axios = require('axios');

const BASE_URL = 'http://localhost:8001/admin';

// Test data
const testCurrency = {
  name: 'US Dollar',
  code: 'USD',
  symbol: '$',
  exchangeRate: 1.0,
  decimalPlaces: 2,
  isActive: true
};

const testCurrency2 = {
  name: 'Euro',
  code: 'EUR',
  symbol: '€',
  exchangeRate: 0.85,
  decimalPlaces: 2,
  isActive: true
};

async function testCurrencyAPI() {
  console.log('🧪 Testing Currency API...\n');

  try {
    // Test 1: Get currencies (should be empty initially)
    console.log('1️⃣ Testing GET /currencies...');
    const getResponse = await axios.get(`${BASE_URL}/currencies`);
    console.log('✅ GET /currencies:', getResponse.data);
    console.log('');

    // Test 2: Create first currency
    console.log('2️⃣ Testing POST /currencies (USD)...');
    const createResponse1 = await axios.post(`${BASE_URL}/currencies`, testCurrency);
    console.log('✅ Created USD:', createResponse1.data);
    console.log('');

    // Test 3: Create second currency
    console.log('3️⃣ Testing POST /currencies (EUR)...');
    const createResponse2 = await axios.post(`${BASE_URL}/currencies`, testCurrency2);
    console.log('✅ Created EUR:', createResponse2.data);
    console.log('');

    // Test 4: Get currencies again (should have 2)
    console.log('4️⃣ Testing GET /currencies (after creation)...');
    const getResponse2 = await axios.get(`${BASE_URL}/currencies`);
    console.log('✅ GET /currencies:', getResponse2.data);
    console.log('');

    // Test 5: Update EUR exchange rate
    console.log('5️⃣ Testing PUT /currencies (update EUR)...');
    const updateData = { ...testCurrency2, exchangeRate: 0.88 };
    const updateResponse = await axios.put(`${BASE_URL}/currencies/${createResponse2.data.data._id}`, updateData);
    console.log('✅ Updated EUR:', updateResponse.data);
    console.log('');

    // Test 6: Set EUR as default
    console.log('6️⃣ Testing PATCH /currencies/:id/default (set EUR as default)...');
    const defaultResponse = await axios.patch(`${BASE_URL}/currencies/${createResponse2.data.data._id}/default`);
    console.log('✅ Set EUR as default:', defaultResponse.data);
    console.log('');

    // Test 7: Get currencies one more time
    console.log('7️⃣ Testing GET /currencies (final check)...');
    const getResponse3 = await axios.get(`${BASE_URL}/currencies`);
    console.log('✅ Final GET /currencies:', getResponse3.data);
    console.log('');

    console.log('🎉 All currency API tests passed!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run the test
testCurrencyAPI(); 