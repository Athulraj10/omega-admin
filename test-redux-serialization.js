// Test script to verify Redux serialization
console.log('🧪 Testing Redux Action Serialization...\n');

// Mock the login action structure
const loginAction = {
  type: 'LOGIN',
  payload: {
    data: {
      email: 'test@example.com',
      password: 'password123',
      device_code: 'web-admin'
    }
  }
};

// Test if the action is serializable
function testSerialization(action) {
  try {
    // Test JSON serialization
    const serialized = JSON.stringify(action);
    const deserialized = JSON.parse(serialized);
    
    console.log('✅ Action is serializable');
    console.log('Original:', action);
    console.log('Serialized:', serialized);
    console.log('Deserialized:', deserialized);
    
    // Test if they're equivalent
    const isEquivalent = JSON.stringify(action) === JSON.stringify(deserialized);
    console.log('✅ Equivalent after serialization:', isEquivalent);
    
    return true;
  } catch (error) {
    console.error('❌ Action is not serializable:', error.message);
    console.log('Problematic action:', action);
    return false;
  }
}

// Test the login action
console.log('📋 Testing Login Action:');
testSerialization(loginAction);

// Test with functions (should fail)
console.log('\n📋 Testing Action with Function (should fail):');
const actionWithFunction = {
  type: 'LOGIN',
  payload: {
    data: {
      email: 'test@example.com',
      password: 'password123',
      device_code: 'web-admin'
    },
    callback: () => console.log('This should cause serialization error')
  }
};
testSerialization(actionWithFunction);

console.log('\n🎯 Redux Serialization Test Complete!'); 