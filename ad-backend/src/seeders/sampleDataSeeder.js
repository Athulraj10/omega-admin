const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const { User, Order, Product, Category } = require("./../models");
const logger = require("../logger/logger");
const { ACTIVE } = require("../services/Constants");

const createSampleData = async () => {
  try {
    const url = process.env.MONGO_CONNECTION_STRING;
    logger.info("Connecting to database for sample data seeding...");

    const mongooseOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    await mongoose.connect(url, mongooseOptions);

    mongoose.connection.once("open", async () => {
      logger.info("Connected to database for sample data seeding");

      // Get users for creating orders
      const users = await User.find({ role: "user" }).limit(5);
      const sellers = await User.find({ role: "seller" }).limit(3);

      if (users.length === 0 || sellers.length === 0) {
        logger.error("No users or sellers found. Please run userSeeder first.");
        return;
      }

      // Create sample categories
      const categories = [
        { name: "Electronics", slug: "electronics" },
        { name: "Clothing", slug: "clothing" },
        { name: "Books", slug: "books" },
        { name: "Home & Garden", slug: "home-garden" },
      ];

      for (const catData of categories) {
        await Category.findOneAndUpdate(
          { slug: catData.slug },
          {
            name: catData.name,
            slug: catData.slug,
            status: ACTIVE,
          },
          { upsert: true, new: true }
        );
      }

      // Create sample products
      const products = [
        {
          name: "iPhone 15 Pro",
          description: "Latest iPhone with advanced features",
          price: 999.99,
          category: "electronics",
          seller: sellers[0]._id,
          stock: 50,
        },
        {
          name: "Samsung Galaxy S24",
          description: "Premium Android smartphone",
          price: 899.99,
          category: "electronics",
          seller: sellers[0]._id,
          stock: 30,
        },
        {
          name: "Nike Air Max",
          description: "Comfortable running shoes",
          price: 129.99,
          category: "clothing",
          seller: sellers[1]._id,
          stock: 100,
        },
        {
          name: "Adidas T-Shirt",
          description: "Comfortable cotton t-shirt",
          price: 29.99,
          category: "clothing",
          seller: sellers[1]._id,
          stock: 200,
        },
        {
          name: "The Great Gatsby",
          description: "Classic American novel",
          price: 12.99,
          category: "books",
          seller: sellers[2]._id,
          stock: 75,
        },
        {
          name: "Garden Tool Set",
          description: "Complete gardening toolkit",
          price: 89.99,
          category: "home-garden",
          seller: sellers[2]._id,
          stock: 25,
        },
      ];

      const createdProducts = [];
      for (const productData of products) {
        const category = await Category.findOne({ slug: productData.category });
        const product = await Product.findOneAndUpdate(
          { name: productData.name },
          {
            name: productData.name,
            description: productData.description,
            price: productData.price,
            category: category._id,
            seller: productData.seller,
            stock: productData.stock,
            status: ACTIVE,
          },
          { upsert: true, new: true }
        );
        createdProducts.push(product);
      }

      // Create sample orders for the last 30 days
      const orderStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];
      const paymentMethods = ["credit_card", "paypal", "bank_transfer"];
      const paymentStatuses = ["pending", "completed", "failed"];

      const orders = [];
      const now = new Date();
      
      // Generate orders for the last 30 days
      for (let i = 0; i < 30; i++) {
        const orderDate = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000));
        const numOrders = Math.floor(Math.random() * 5) + 1; // 1-5 orders per day
        
        for (let j = 0; j < numOrders; j++) {
          const user = users[Math.floor(Math.random() * users.length)];
          const product = createdProducts[Math.floor(Math.random() * createdProducts.length)];
          const quantity = Math.floor(Math.random() * 3) + 1;
          const totalAmount = product.price * quantity;
          
          const order = {
            user: user._id,
            products: [{
              product: product._id,
              quantity: quantity,
              price: product.price,
            }],
            totalAmount: totalAmount,
            status: orderStatuses[Math.floor(Math.random() * orderStatuses.length)],
            paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
            paymentStatus: paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)],
            orderDate: orderDate,
            shippingAddress: {
              street: "123 Main St",
              city: "New York",
              state: "NY",
              zipCode: "10001",
              country: "USA",
            },
          };
          
          orders.push(order);
        }
      }

      // Insert orders
      await Order.insertMany(orders);
      logger.info(`Created ${orders.length} sample orders`);

      // Create some recent orders for this week
      const thisWeekOrders = [];
      for (let i = 0; i < 7; i++) {
        const orderDate = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000));
        const numOrders = Math.floor(Math.random() * 3) + 1;
        
        for (let j = 0; j < numOrders; j++) {
          const user = users[Math.floor(Math.random() * users.length)];
          const product = createdProducts[Math.floor(Math.random() * createdProducts.length)];
          const quantity = Math.floor(Math.random() * 2) + 1;
          const totalAmount = product.price * quantity;
          
          const order = {
            user: user._id,
            products: [{
              product: product._id,
              quantity: quantity,
              price: product.price,
            }],
            totalAmount: totalAmount,
            status: "delivered",
            paymentMethod: "credit_card",
            paymentStatus: "completed",
            orderDate: orderDate,
            shippingAddress: {
              street: "456 Oak Ave",
              city: "Los Angeles",
              state: "CA",
              zipCode: "90210",
              country: "USA",
            },
          };
          
          thisWeekOrders.push(order);
        }
      }

      await Order.insertMany(thisWeekOrders);
      logger.info(`Created ${thisWeekOrders.length} additional orders for this week`);

      logger.info("Sample data created successfully!");
      
      // Close the connection
      mongoose.connection.close();
    });
  } catch (error) {
    logger.error("Error creating sample data:", error);
  }
};

createSampleData(); 