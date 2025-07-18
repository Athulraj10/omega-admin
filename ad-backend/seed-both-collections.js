const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const { Banner, HeroSlider } = require('./src/models');

// Sample Banner Data
const sampleBanners = [
  {
    image: 'banner-1.jpg',
    titleLine1: 'Summer Sale',
    titleLine2: 'Up to 50% Off',
    offerText: 'Limited time offer',
    offerHighlight: '50%',
    buttonText: 'Shop Now',
    device: 'desktop',
    status: '1',
    isDefault: true,
  },
  {
    image: 'banner-2.jpg',
    titleLine1: 'New Collection',
    titleLine2: 'Fresh Arrivals',
    offerText: 'Discover the latest trends',
    offerHighlight: 'NEW',
    buttonText: 'Explore',
    device: 'mobile',
    status: '1',
    isDefault: false,
  },
  {
    image: 'banner-3.jpg',
    titleLine1: 'Free Shipping',
    titleLine2: 'On Orders Over $50',
    offerText: 'No minimum purchase required',
    offerHighlight: 'FREE',
    buttonText: 'Shop Now',
    device: 'desktop',
    status: '0',
    isDefault: false,
  }
];

// Sample Hero Slider Data
const sampleHeroSliders = [
  {
    title: 'Premium Collection',
    titleLine1: 'Premium Collection',
    titleLine2: 'Exclusive Designs',
    subtitle: 'Discover our handpicked selection',
    description: 'Explore our premium collection featuring exclusive designs and high-quality materials.',
    offerText: 'Limited Edition',
    offerHighlight: 'PREMIUM',
    buttonText: 'Shop Collection',
    buttonLink: '/premium',
    image: 'hero-slider-1.jpg',
    imageUrl: 'https://example.com/hero-slider-1.jpg',
    mobileImage: 'hero-slider-1-mobile.jpg',
    mobileImageUrl: 'https://example.com/hero-slider-1-mobile.jpg',
    device: 'desktop',
    displayType: 'image',
    status: 'active',
    isDefault: true,
    priority: 1,
    sortOrder: 1,
    backgroundColor: '#ffffff',
    textColor: '#000000',
    animation: 'fade',
    autoplayDelay: 3000,
    category: 'premium',
    tags: ['premium', 'exclusive', 'design'],
  },
  {
    title: 'Seasonal Sale',
    titleLine1: 'Seasonal Sale',
    titleLine2: 'Up to 70% Off',
    subtitle: 'Don\'t miss out on amazing deals',
    description: 'Huge discounts on seasonal items. Limited time only!',
    offerText: 'Massive Discounts',
    offerHighlight: '70% OFF',
    buttonText: 'Shop Sale',
    buttonLink: '/sale',
    image: 'hero-slider-2.jpg',
    imageUrl: 'https://example.com/hero-slider-2.jpg',
    mobileImage: 'hero-slider-2-mobile.jpg',
    mobileImageUrl: 'https://example.com/hero-slider-2-mobile.jpg',
    device: 'mobile',
    displayType: 'image',
    status: 'active',
    isDefault: false,
    priority: 2,
    sortOrder: 2,
    backgroundColor: '#ff6b6b',
    textColor: '#ffffff',
    animation: 'slide',
    autoplayDelay: 4000,
    category: 'sale',
    tags: ['sale', 'discount', 'seasonal'],
  },
  {
    title: 'New Arrivals',
    titleLine1: 'New Arrivals',
    titleLine2: 'Fresh & Trendy',
    subtitle: 'Be the first to discover',
    description: 'Check out our latest arrivals featuring the newest trends and styles.',
    offerText: 'Just Launched',
    offerHighlight: 'NEW',
    buttonText: 'View New',
    buttonLink: '/new-arrivals',
    image: 'hero-slider-3.jpg',
    imageUrl: 'https://example.com/hero-slider-3.jpg',
    mobileImage: 'hero-slider-3-mobile.jpg',
    mobileImageUrl: 'https://example.com/hero-slider-3-mobile.jpg',
    device: 'all',
    displayType: 'image',
    status: 'active',
    isDefault: false,
    priority: 3,
    sortOrder: 3,
    backgroundColor: '#4ecdc4',
    textColor: '#ffffff',
    animation: 'zoom',
    autoplayDelay: 3500,
    category: 'new',
    tags: ['new', 'trendy', 'fresh'],
  }
];

async function seedBothCollections() {
  try {
    console.log('🌱 Starting to seed both Banner and HeroSlider collections...\n');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_CONNECTION_STRING || 'mongodb://localhost:27017/omega');
    console.log('✅ Connected to database\n');

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await Banner.deleteMany({});
    await HeroSlider.deleteMany({});
    console.log('✅ Cleared existing data\n');

    // Seed Banners
    console.log('📢 Seeding Banner collection...');
    const createdBanners = await Banner.insertMany(sampleBanners);
    console.log(`✅ Created ${createdBanners.length} banners\n`);

    // Seed Hero Sliders
    console.log('🎠 Seeding HeroSlider collection...');
    const createdHeroSliders = await HeroSlider.insertMany(sampleHeroSliders);
    console.log(`✅ Created ${createdHeroSliders.length} hero sliders\n`);

    // Display summary
    console.log('📊 Seeding Summary:');
    console.log(`   - Banners: ${createdBanners.length}`);
    console.log(`   - Hero Sliders: ${createdHeroSliders.length}`);
    console.log('\n🎉 Both collections seeded successfully!');

    // Display sample data
    console.log('\n📋 Sample Banner Data:');
    createdBanners.forEach((banner, index) => {
      console.log(`   ${index + 1}. ${banner.titleLine1} (${banner.device}) - Status: ${banner.status}`);
    });

    console.log('\n📋 Sample Hero Slider Data:');
    createdHeroSliders.forEach((slider, index) => {
      console.log(`   ${index + 1}. ${slider.title} (${slider.device}) - Status: ${slider.status}`);
    });

    console.log('\n🔗 API Endpoints:');
    console.log('   - Banners: GET /admin/banners');
    console.log('   - Hero Sliders: GET /admin/hero-sliders');
    console.log('   - Public Banners: GET /admin/banners/public');
    console.log('   - Public Hero Sliders: GET /admin/hero-sliders/public');

  } catch (error) {
    console.error('❌ Seeding error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from database');
  }
}

// Run the seeder
seedBothCollections(); 