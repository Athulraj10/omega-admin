const fs = require('fs');
const path = require('path');

console.log('🔧 Testing Upload Directories...\n');

// Test paths
const testPaths = [
  'src/uploads',
  'src/uploads/products',
  'src/uploads/banners',
  'public/uploads',
  'public/uploads/products',
  'public/uploads/banners'
];

testPaths.forEach(testPath => {
  const fullPath = path.join(__dirname, testPath);
  
  if (fs.existsSync(fullPath)) {
    console.log(`✅ ${testPath} exists`);
    
    // Test if directory is writable
    try {
      const testFile = path.join(fullPath, 'test-write.txt');
      fs.writeFileSync(testFile, 'test');
      fs.unlinkSync(testFile);
      console.log(`✅ ${testPath} is writable`);
    } catch (error) {
      console.log(`❌ ${testPath} is not writable:`, error.message);
    }
  } else {
    console.log(`❌ ${testPath} does not exist`);
  }
});

// Test multer path resolution
console.log('\n📁 Testing Multer Path Resolution...');
const multerPath = path.join(__dirname, 'src', 'routes', 'admin');
const uploadPath = path.join(multerPath, '../../uploads/products/');
console.log('Multer upload path:', uploadPath);

if (fs.existsSync(uploadPath)) {
  console.log('✅ Multer upload path exists');
} else {
  console.log('❌ Multer upload path does not exist');
}

// Test static file serving path
console.log('\n🌐 Testing Static File Serving...');
const staticPath = path.join(__dirname, 'src', 'uploads');
console.log('Static file path:', staticPath);

if (fs.existsSync(staticPath)) {
  console.log('✅ Static file path exists');
} else {
  console.log('❌ Static file path does not exist');
}

console.log('\n📋 Summary:');
console.log('- All upload directories should exist and be writable');
console.log('- Multer and static file paths should match');
console.log('- Ready for file uploads!'); 