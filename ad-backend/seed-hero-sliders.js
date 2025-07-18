#!/usr/bin/env node

/**
 * Hero Slider Seeder Script
 * 
 * This script populates the database with sample hero slider data
 * Run with: node seed-hero-sliders.js
 */

require('dotenv').config();
const { createHeroSliders } = require('./src/seeders/heroSliderSeeder');

console.log('🚀 Starting Hero Slider Seeder...');
console.log('📅', new Date().toISOString());

createHeroSliders()
  .then(() => {
    console.log('✅ Hero slider seeding completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Hero slider seeding failed:', error);
    process.exit(1);
  }); 