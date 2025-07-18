// Simple test script to run category seeder
require('dotenv').config();

// Set basic environment variables if not present
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
process.env.PORT = process.env.PORT || '3000';

// Import and run the seeder
const { seedCategories } = require('./src/seeders/categorySeeder');

console.log('🚀 Starting category seeder test...');

seedCategories()
  .then(() => {
    console.log('✅ Category seeder completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Category seeder failed:', error);
    process.exit(1);
  }); 