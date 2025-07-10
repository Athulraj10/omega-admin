const fs = require('fs');
const path = require('path');

// Directories to create
const uploadDirs = [
  'src/uploads',
  'src/uploads/products',
  'src/uploads/banners',
  'public/uploads',
  'public/uploads/products',
  'public/uploads/banners'
];

console.log('🔧 Setting up upload directories...\n');

uploadDirs.forEach(dir => {
  const fullPath = path.join(__dirname, dir);
  
  if (!fs.existsSync(fullPath)) {
    try {
      fs.mkdirSync(fullPath, { recursive: true });
      console.log(`✅ Created directory: ${dir}`);
    } catch (error) {
      console.error(`❌ Failed to create directory: ${dir}`, error.message);
    }
  } else {
    console.log(`ℹ️  Directory already exists: ${dir}`);
  }
});

console.log('\n📁 Upload directories setup complete!');
console.log('\n📋 Directory structure:');
console.log('├── src/uploads/');
console.log('│   ├── products/');
console.log('│   └── banners/');
console.log('└── public/uploads/');
console.log('    ├── products/');
console.log('    └── banners/'); 