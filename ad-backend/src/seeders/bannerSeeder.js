const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config({ path: "../../.env" });
const { Banner } = require("./../models");
const logger = require("../logger/logger");

const createBanners = async () => {
  try {
    const url = process.env.MONGO_CONNECTION_STRING || "mongodb://localhost:27017/omega";
    logger.info("Connecting to database for banner seeding...");

    const mongooseOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    mongoose.connect(url, mongooseOptions);

    mongoose.connection.once("open", async () => {
      logger.info("Connected to database for banner seeding");
      
      // Clear existing banners
      await Banner.deleteMany({});
      logger.info("Cleared existing banners");

      // Create sample banners
      const sampleBanners = [
        {
          image: "sample-banner-1.jpg",
          titleLine1: "Organic & Healthy Vegetables",
          titleLine2: "Fresh from the Farm",
          offerText: "Starting at $",
          offerHighlight: "20.00",
          buttonText: "Shop Now",
          device: "desktop",
          status: "1",
          isDefault: true,
        },
        {
          image: "sample-banner-2.jpg",
          titleLine1: "Explore Fresh & Juicy Fruits",
          titleLine2: "Nature's Sweetest Gifts",
          offerText: "Special Offer $",
          offerHighlight: "29.99",
          buttonText: "Discover More",
          device: "desktop",
          status: "1",
          isDefault: false,
        },
        {
          image: "sample-banner-3.jpg",
          titleLine1: "Premium Quality Products",
          titleLine2: "Delivered to Your Door",
          offerText: "Free Delivery on Orders Over $",
          offerHighlight: "50.00",
          buttonText: "Order Now",
          device: "mobile",
          status: "1",
          isDefault: false,
        }
      ];

      const createdBanners = await Banner.insertMany(sampleBanners);
      logger.info(`Created ${createdBanners.length} sample banners`);
      
      console.log("✅ Sample banners created successfully!");
      console.log("📊 Banner IDs:", createdBanners.map(b => b._id));
      
      mongoose.connection.close();
    });
  } catch (error) {
    logger.error("Error seeding banners:", error);
    console.error("❌ Error seeding banners:", error);
  }
};

createBanners(); 