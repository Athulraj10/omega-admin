const Category = require('../models/category');
const mongoose = require('mongoose');

const sampleCategories = [
  // Main Categories
  {
    name: 'Dairy & Bakery',
    description: 'Fresh dairy products and bakery items',
    icon: 'cupcake',
    isMainCategory: true,
    parentCategory: null,
    sortOrder: 1,
    status: '1',
    metaTitle: 'Dairy & Bakery Products',
    metaDescription: 'Fresh dairy products and bakery items for your daily needs'
  },
  {
    name: 'Fruits & Vegetable',
    description: 'Fresh fruits and vegetables',
    icon: 'apple',
    isMainCategory: true,
    parentCategory: null,
    sortOrder: 2,
    status: '1',
    metaTitle: 'Fruits & Vegetables',
    metaDescription: 'Fresh fruits and vegetables for a healthy lifestyle'
  },
  {
    name: 'Snack & Spice',
    description: 'Snacks and spices for every occasion',
    icon: 'cupcake',
    isMainCategory: true,
    parentCategory: null,
    sortOrder: 3,
    status: '1',
    metaTitle: 'Snacks & Spices',
    metaDescription: 'Delicious snacks and aromatic spices'
  },
  {
    name: 'Juice & Drinks',
    description: 'Refreshing juices and beverages',
    icon: 'beverage',
    isMainCategory: true,
    parentCategory: null,
    sortOrder: 4,
    status: '1',
    metaTitle: 'Juices & Drinks',
    metaDescription: 'Refreshing juices and beverages for hydration'
  }
];

const sampleSubcategories = [
  // Dairy & Bakery subcategories
  {
    name: 'Dairy',
    description: 'Fresh dairy products',
    icon: 'cupcake',
    isMainCategory: false,
    sortOrder: 1,
    status: '1',
    metaTitle: 'Dairy Products',
    metaDescription: 'Fresh dairy products including milk, cheese, and yogurt'
  },
  {
    name: 'Bakery',
    description: 'Fresh bakery items',
    icon: 'cupcake',
    isMainCategory: false,
    sortOrder: 2,
    status: '1',
    metaTitle: 'Bakery Items',
    metaDescription: 'Fresh bakery items including bread, cakes, and pastries'
  },
  // Fruits & Vegetable subcategories
  {
    name: 'Fruits',
    description: 'Fresh fruits',
    icon: 'apple',
    isMainCategory: false,
    sortOrder: 1,
    status: '1',
    metaTitle: 'Fresh Fruits',
    metaDescription: 'Fresh and seasonal fruits'
  },
  {
    name: 'Vegetables',
    description: 'Fresh vegetables',
    icon: 'apple',
    isMainCategory: false,
    sortOrder: 2,
    status: '1',
    metaTitle: 'Fresh Vegetables',
    metaDescription: 'Fresh and organic vegetables'
  },
  // Snack & Spice subcategories
  {
    name: 'Snacks',
    description: 'Delicious snacks',
    icon: 'cupcake',
    isMainCategory: false,
    sortOrder: 1,
    status: '1',
    metaTitle: 'Snacks',
    metaDescription: 'Delicious snacks for every occasion'
  },
  {
    name: 'Spices',
    description: 'Aromatic spices',
    icon: 'cupcake',
    isMainCategory: false,
    sortOrder: 2,
    status: '1',
    metaTitle: 'Spices',
    metaDescription: 'Aromatic spices for cooking'
  },
  // Juice & Drinks subcategories
  {
    name: 'Juices',
    description: 'Fresh juices',
    icon: 'beverage',
    isMainCategory: false,
    sortOrder: 1,
    status: '1',
    metaTitle: 'Fresh Juices',
    metaDescription: 'Fresh and natural juices'
  },
  {
    name: 'Beverages',
    description: 'Refreshing beverages',
    icon: 'beverage',
    isMainCategory: false,
    sortOrder: 2,
    status: '1',
    metaTitle: 'Beverages',
    metaDescription: 'Refreshing beverages and drinks'
  }
];

const seedCategories = async () => {
  try {
    console.log('🌱 Starting category seeding...');

    // Clear existing categories
    await Category.deleteMany({});
    console.log('✅ Cleared existing categories');

    // Create main categories
    const createdMainCategories = [];
    for (const categoryData of sampleCategories) {
      const category = new Category(categoryData);
      const savedCategory = await category.save();
      createdMainCategories.push(savedCategory);
      console.log(`✅ Created main category: ${savedCategory.name}`);
    }

    // Create subcategories and link them to main categories
    const mainCategoryMap = {
      'Dairy & Bakery': createdMainCategories[0],
      'Fruits & Vegetable': createdMainCategories[1],
      'Snack & Spice': createdMainCategories[2],
      'Juice & Drinks': createdMainCategories[3]
    };

    const subcategoryMapping = [
      { subcategory: 'Dairy', parent: 'Dairy & Bakery' },
      { subcategory: 'Bakery', parent: 'Dairy & Bakery' },
      { subcategory: 'Fruits', parent: 'Fruits & Vegetable' },
      { subcategory: 'Vegetables', parent: 'Fruits & Vegetable' },
      { subcategory: 'Snacks', parent: 'Snack & Spice' },
      { subcategory: 'Spices', parent: 'Snack & Spice' },
      { subcategory: 'Juices', parent: 'Juice & Drinks' },
      { subcategory: 'Beverages', parent: 'Juice & Drinks' }
    ];

    for (const mapping of subcategoryMapping) {
      const subcategoryData = sampleSubcategories.find(sub => sub.name === mapping.subcategory);
      const parentCategory = mainCategoryMap[mapping.parent];
      
      if (subcategoryData && parentCategory) {
        const subcategory = new Category({
          ...subcategoryData,
          parentCategory: parentCategory._id
        });
        const savedSubcategory = await subcategory.save();
        console.log(`✅ Created subcategory: ${savedSubcategory.name} under ${parentCategory.name}`);
      }
    }

    // Add some sample products to subcategories for testing
    const subcategories = await Category.find({ isMainCategory: false });
    
    // Create sample products for each subcategory
    const sampleProducts = [
      // Dairy products
      { name: 'Fresh Milk', category: subcategories.find(sub => sub.name === 'Dairy')?._id },
      { name: 'Cheese', category: subcategories.find(sub => sub.name === 'Dairy')?._id },
      { name: 'Yogurt', category: subcategories.find(sub => sub.name === 'Dairy')?._id },
      
      // Bakery products
      { name: 'Bread & Buns', category: subcategories.find(sub => sub.name === 'Bakery')?._id },
      { name: 'Cake And Pastry', category: subcategories.find(sub => sub.name === 'Bakery')?._id },
      { name: 'Rusk Toast', category: subcategories.find(sub => sub.name === 'Bakery')?._id },
      { name: 'Chocolate Brownie', category: subcategories.find(sub => sub.name === 'Bakery')?._id },
      { name: 'Cream Roll', category: subcategories.find(sub => sub.name === 'Bakery')?._id },
      
      // Fruits
      { name: 'Apple', category: subcategories.find(sub => sub.name === 'Fruits')?._id },
      { name: 'Banana', category: subcategories.find(sub => sub.name === 'Fruits')?._id },
      { name: 'Orange', category: subcategories.find(sub => sub.name === 'Fruits')?._id },
      
      // Vegetables
      { name: 'Cauliflower', category: subcategories.find(sub => sub.name === 'Vegetables')?._id },
      { name: 'Bell Peppers', category: subcategories.find(sub => sub.name === 'Vegetables')?._id },
      { name: 'Broccoli', category: subcategories.find(sub => sub.name === 'Vegetables')?._id },
      { name: 'Cabbage', category: subcategories.find(sub => sub.name === 'Vegetables')?._id },
      { name: 'Tomato', category: subcategories.find(sub => sub.name === 'Vegetables')?._id },
      
      // Snacks
      { name: 'Chips', category: subcategories.find(sub => sub.name === 'Snacks')?._id },
      { name: 'Nuts', category: subcategories.find(sub => sub.name === 'Snacks')?._id },
      { name: 'Cookies', category: subcategories.find(sub => sub.name === 'Snacks')?._id },
      
      // Spices
      { name: 'Black Pepper', category: subcategories.find(sub => sub.name === 'Spices')?._id },
      { name: 'Cinnamon', category: subcategories.find(sub => sub.name === 'Spices')?._id },
      { name: 'Turmeric', category: subcategories.find(sub => sub.name === 'Spices')?._id },
      
      // Juices
      { name: 'Orange Juice', category: subcategories.find(sub => sub.name === 'Juices')?._id },
      { name: 'Apple Juice', category: subcategories.find(sub => sub.name === 'Juices')?._id },
      { name: 'Grape Juice', category: subcategories.find(sub => sub.name === 'Juices')?._id },
      
      // Beverages
      { name: 'Coffee', category: subcategories.find(sub => sub.name === 'Beverages')?._id },
      { name: 'Tea', category: subcategories.find(sub => sub.name === 'Beverages')?._id },
      { name: 'Soda', category: subcategories.find(sub => sub.name === 'Beverages')?._id }
    ];

    // Import Product model and create sample products
    const Product = require('../models/product');
    
    for (const productData of sampleProducts) {
      if (productData.category) {
        const product = new Product({
          name: productData.name,
          description: `Fresh ${productData.name.toLowerCase()}`,
          category: productData.category,
          price: Math.floor(Math.random() * 100) + 10,
          stock: Math.floor(Math.random() * 50) + 5,
          sku: `SKU-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          status: '1'
        });
        await product.save();
        console.log(`✅ Created product: ${product.name}`);
      }
    }

    console.log('🎉 Category seeding completed successfully!');
    console.log(`📊 Created ${createdMainCategories.length} main categories`);
    console.log(`📊 Created ${subcategories.length} subcategories`);
    console.log(`📊 Created ${sampleProducts.length} sample products`);

    // Display the hierarchical structure
    const hierarchicalCategories = await Category.find({ isMainCategory: true })
      .populate({
        path: 'subcategories',
        select: 'name description productCount'
      });

    console.log('\n📋 Hierarchical Category Structure:');
    hierarchicalCategories.forEach(mainCat => {
      console.log(`\n🏷️  ${mainCat.name}:`);
      mainCat.subcategories.forEach(subCat => {
        console.log(`   └── ${subCat.name} (${subCat.productCount || 0} products)`);
      });
    });

  } catch (error) {
    console.error('❌ Error seeding categories:', error);
    throw error;
  }
};

// Run seeder if called directly
if (require.main === module) {
  // Connect to MongoDB
  const configAll = require('../config/configAll');
  mongoose.connect(configAll.mongoUrl)
    .then(() => {
      console.log('🔗 Connected to MongoDB');
      return seedCategories();
    })
    .then(() => {
      console.log('✅ Seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeding failed:', error);
      process.exit(1);
    });
}

module.exports = { seedCategories }; 