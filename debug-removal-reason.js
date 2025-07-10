// Debug script to help identify removalReason error
console.log('🔍 Debugging removalReason error...');

// Check if there are any global objects that might have removalReason
console.log('Global objects that might contain removalReason:');
console.log('window:', typeof window !== 'undefined' ? Object.keys(window).filter(key => key.includes('removal')) : 'window not available');
console.log('document:', typeof document !== 'undefined' ? Object.keys(document).filter(key => key.includes('removal')) : 'document not available');

// Check for any third-party libraries that might be setting removalReason
if (typeof window !== 'undefined') {
  // Check common third-party libraries
  const libraries = [
    'React', 'Redux', 'ReactRedux', 'ReduxSaga',
    'axios', 'lodash', 'moment', 'date-fns'
  ];
  
  libraries.forEach(lib => {
    if (window[lib]) {
      console.log(`${lib} available:`, !!window[lib]);
    }
  });
}

// Monitor for any property assignments
if (typeof window !== 'undefined') {
  const originalDefineProperty = Object.defineProperty;
  Object.defineProperty = function(obj, prop, descriptor) {
    if (prop === 'removalReason') {
      console.error('🚨 removalReason being set on:', obj);
      console.error('Stack trace:', new Error().stack);
    }
    return originalDefineProperty.call(this, obj, prop, descriptor);
  };
  
  console.log('✅ Monitoring for removalReason property assignments...');
}

// Check for any user objects that might be causing issues
function checkUserObject(user) {
  if (!user) {
    console.warn('⚠️ User object is null/undefined');
    return false;
  }
  
  if (typeof user !== 'object') {
    console.warn('⚠️ User is not an object:', typeof user);
    return false;
  }
  
  if (!user.id) {
    console.warn('⚠️ User object missing id:', user);
    return false;
  }
  
  return true;
}

// Export the check function for use in components
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { checkUserObject };
} else if (typeof window !== 'undefined') {
  window.checkUserObject = checkUserObject;
}

console.log('🔍 Debug script loaded. Check console for removalReason errors.'); 