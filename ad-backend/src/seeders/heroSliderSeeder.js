const mongoose = require("mongoose");
const { HeroSlider } = require("./../models");
const logger = require("../logger/logger");

const createHeroSliders = async () => {
  try {
    const url = process.env.MONGO_CONNECTION_STRING || "mongodb://localhost:27017/omega";
    logger.info("Connecting to database for hero slider seeding...");

    const mongooseOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    mongoose.connect(url, mongooseOptions);

    mongoose.connection.once("open", async () => {
      logger.info("Connected to database for hero slider seeding");
      
      // Clear existing hero sliders
      await HeroSlider.deleteMany({});
      logger.info("Cleared existing hero sliders");

      // Create sample hero sliders
      const sampleHeroSliders = [
        {
          title: "Summer Collection Launch",
          titleLine1: "Summer Collection",
          titleLine2: "New Arrivals 2024",
          subtitle: "Discover the latest trends in summer fashion",
          description: "Explore our exclusive summer collection featuring the latest trends in fashion, accessories, and lifestyle products.",
          offerText: "Up to",
          offerHighlight: "50% OFF",
          buttonText: "Shop Now",
          buttonLink: "/summer-collection",
          image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=600&fit=crop",
          imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=600&fit=crop",
          mobileImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=800&fit=crop",
          mobileImageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=800&fit=crop",
          device: "desktop",
          displayType: "image",
          status: "active",
          isDefault: true,
          priority: 1,
          sortOrder: 1,
          backgroundColor: "#ffffff",
          textColor: "#000000",
          animation: "fade",
          animationDuration: 500,
          autoplayDelay: 3000,
          isABTest: false,
          abTestGroup: "A",
          abTestWeight: 50,
          targetAudience: ["fashion", "women", "men"],
          targetLocation: ["US", "CA", "UK"],
          targetDevice: ["desktop", "mobile"],
          targetTime: { start: "00:00", end: "23:59" },
          metaTitle: "Summer Collection 2024 - Latest Fashion Trends",
          metaDescription: "Discover the latest summer fashion trends with our exclusive collection. Up to 50% off on new arrivals.",
          keywords: ["summer", "fashion", "collection", "trends", "sale"],
          isResponsive: true,
          isAccessible: true,
          hasOverlay: false,
          overlayOpacity: 0.3,
          tags: ["summer", "fashion", "new-arrivals"],
          category: "fashion",
          customFields: {
            season: "summer",
            year: "2024",
            collection: "main"
          },
          createdBy: new mongoose.Types.ObjectId(), // You'll need to replace with actual admin ID
        },
        {
          title: "Electronics Mega Sale",
          titleLine1: "Electronics",
          titleLine2: "Mega Sale",
          subtitle: "Get the best deals on premium electronics",
          description: "Unlock amazing deals on premium electronics including smartphones, laptops, and smart home devices.",
          offerText: "Save up to",
          offerHighlight: "70%",
          buttonText: "Explore Deals",
          buttonLink: "/electronics-sale",
          image: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=1200&h=600&fit=crop",
          imageUrl: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=1200&h=600&fit=crop",
          mobileImage: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=600&h=800&fit=crop",
          mobileImageUrl: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=600&h=800&fit=crop",
          device: "desktop",
          displayType: "image",
          status: "active",
          isDefault: false,
          priority: 2,
          sortOrder: 2,
          backgroundColor: "#000000",
          textColor: "#ffffff",
          animation: "slide",
          animationDuration: 600,
          autoplayDelay: 4000,
          isABTest: true,
          abTestGroup: "A",
          abTestWeight: 60,
          targetAudience: ["tech", "electronics", "gadgets"],
          targetLocation: ["US", "CA"],
          targetDevice: ["desktop", "mobile", "tablet"],
          targetTime: { start: "09:00", end: "21:00" },
          metaTitle: "Electronics Mega Sale - Best Deals on Premium Gadgets",
          metaDescription: "Get the best deals on premium electronics. Save up to 70% on smartphones, laptops, and smart home devices.",
          keywords: ["electronics", "sale", "gadgets", "smartphones", "laptops"],
          isResponsive: true,
          isAccessible: true,
          hasOverlay: true,
          overlayOpacity: 0.4,
          tags: ["electronics", "sale", "gadgets"],
          category: "electronics",
          customFields: {
            saleType: "mega-sale",
            discount: "70%",
            category: "electronics"
          },
          createdBy: new mongoose.Types.ObjectId(),
        },
        {
          title: "Mobile App Launch",
          titleLine1: "Download Our App",
          titleLine2: "Get Exclusive Offers",
          subtitle: "Shop faster and get exclusive mobile-only deals",
          description: "Download our mobile app for a seamless shopping experience and access to exclusive mobile-only offers and discounts.",
          offerText: "Get",
          offerHighlight: "20% OFF",
          buttonText: "Download Now",
          buttonLink: "/download-app",
          image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1200&h=600&fit=crop",
          imageUrl: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1200&h=600&fit=crop",
          mobileImage: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=800&fit=crop",
          mobileImageUrl: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=800&fit=crop",
          device: "mobile",
          displayType: "image",
          status: "active",
          isDefault: true,
          priority: 1,
          sortOrder: 1,
          backgroundColor: "#4f46e5",
          textColor: "#ffffff",
          animation: "zoom",
          animationDuration: 700,
          autoplayDelay: 3500,
          isABTest: false,
          abTestGroup: "A",
          abTestWeight: 50,
          targetAudience: ["mobile-users", "app-users"],
          targetLocation: ["US", "CA", "UK", "AU"],
          targetDevice: ["mobile"],
          targetTime: { start: "00:00", end: "23:59" },
          metaTitle: "Download Our Mobile App - Get Exclusive Offers",
          metaDescription: "Download our mobile app for exclusive offers and a seamless shopping experience. Get 20% off on your first purchase.",
          keywords: ["mobile", "app", "download", "exclusive", "offers"],
          isResponsive: true,
          isAccessible: true,
          hasOverlay: false,
          overlayOpacity: 0.3,
          tags: ["mobile", "app", "download"],
          category: "mobile",
          customFields: {
            appType: "shopping",
            platform: "ios-android",
            offer: "20%"
          },
          createdBy: new mongoose.Types.ObjectId(),
        },
        {
          title: "Holiday Season Sale",
          titleLine1: "Holiday Season",
          titleLine2: "Special Offers",
          subtitle: "Celebrate the holidays with amazing deals",
          description: "Make this holiday season special with our curated collection of gifts and special offers for your loved ones.",
          offerText: "Holiday Special",
          offerHighlight: "40% OFF",
          buttonText: "Shop Gifts",
          buttonLink: "/holiday-gifts",
          image: "https://images.unsplash.com/photo-1543589923-d58f523daa0c?w=1200&h=600&fit=crop",
          imageUrl: "https://images.unsplash.com/photo-1543589923-d58f523daa0c?w=1200&h=600&fit=crop",
          mobileImage: "https://images.unsplash.com/photo-1543589923-d58f523daa0c?w=600&h=800&fit=crop",
          mobileImageUrl: "https://images.unsplash.com/photo-1543589923-d58f523daa0c?w=600&h=800&fit=crop",
          device: "all",
          displayType: "image",
          status: "scheduled",
          isDefault: false,
          priority: 3,
          sortOrder: 3,
          startDate: new Date("2024-12-01"),
          endDate: new Date("2024-12-31"),
          isScheduled: true,
          backgroundColor: "#dc2626",
          textColor: "#ffffff",
          animation: "bounce",
          animationDuration: 800,
          autoplayDelay: 5000,
          isABTest: true,
          abTestGroup: "B",
          abTestWeight: 40,
          targetAudience: ["holiday-shoppers", "gift-buyers"],
          targetLocation: ["US", "CA", "UK", "AU", "EU"],
          targetDevice: ["desktop", "mobile", "tablet"],
          targetTime: { start: "08:00", end: "22:00" },
          metaTitle: "Holiday Season Sale - Special Offers on Gifts",
          metaDescription: "Celebrate the holidays with amazing deals and special offers. Find the perfect gifts for your loved ones.",
          keywords: ["holiday", "sale", "gifts", "special", "offers"],
          isResponsive: true,
          isAccessible: true,
          hasOverlay: true,
          overlayOpacity: 0.5,
          tags: ["holiday", "sale", "gifts"],
          category: "seasonal",
          customFields: {
            season: "holiday",
            year: "2024",
            event: "christmas"
          },
          createdBy: new mongoose.Types.ObjectId(),
        },
        {
          title: "Premium Membership",
          titleLine1: "Premium Membership",
          titleLine2: "Exclusive Benefits",
          subtitle: "Join our premium membership for exclusive perks",
          description: "Unlock exclusive benefits, early access to sales, and premium customer support with our membership program.",
          offerText: "Join for",
          offerHighlight: "$9.99/month",
          buttonText: "Join Now",
          buttonLink: "/premium-membership",
          image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=600&fit=crop",
          imageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=600&fit=crop",
          mobileImage: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=800&fit=crop",
          mobileImageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=800&fit=crop",
          device: "desktop",
          displayType: "image",
          status: "active",
          isDefault: false,
          priority: 4,
          sortOrder: 4,
          backgroundColor: "#1f2937",
          textColor: "#ffffff",
          animation: "flip",
          animationDuration: 900,
          autoplayDelay: 6000,
          isABTest: false,
          abTestGroup: "A",
          abTestWeight: 50,
          targetAudience: ["premium", "membership", "vip"],
          targetLocation: ["US", "CA", "UK"],
          targetDevice: ["desktop", "mobile"],
          targetTime: { start: "10:00", end: "20:00" },
          metaTitle: "Premium Membership - Exclusive Benefits and Perks",
          metaDescription: "Join our premium membership for exclusive benefits, early access to sales, and premium customer support.",
          keywords: ["premium", "membership", "exclusive", "benefits", "vip"],
          isResponsive: true,
          isAccessible: true,
          hasOverlay: false,
          overlayOpacity: 0.3,
          tags: ["premium", "membership", "exclusive"],
          category: "membership",
          customFields: {
            membershipType: "premium",
            price: "9.99",
            currency: "USD"
          },
          createdBy: new mongoose.Types.ObjectId(),
        },
        {
          title: "Flash Sale Alert",
          titleLine1: "Flash Sale",
          titleLine2: "Limited Time",
          subtitle: "Don't miss out on these incredible deals",
          description: "Hurry! These amazing deals are available for a limited time only. Shop now before they're gone forever.",
          offerText: "Flash Sale",
          offerHighlight: "80% OFF",
          buttonText: "Shop Fast",
          buttonLink: "/flash-sale",
          image: "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=1200&h=600&fit=crop",
          imageUrl: "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=1200&h=600&fit=crop",
          mobileImage: "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=600&h=800&fit=crop",
          mobileImageUrl: "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=600&h=800&fit=crop",
          device: "all",
          displayType: "image",
          status: "active",
          isDefault: false,
          priority: 5,
          sortOrder: 5,
          backgroundColor: "#fbbf24",
          textColor: "#000000",
          animation: "bounce",
          animationDuration: 500,
          autoplayDelay: 2000,
          isABTest: true,
          abTestGroup: "B",
          abTestWeight: 30,
          targetAudience: ["flash-sale", "deals", "bargain"],
          targetLocation: ["US", "CA"],
          targetDevice: ["desktop", "mobile"],
          targetTime: { start: "12:00", end: "18:00" },
          metaTitle: "Flash Sale - Limited Time Deals Up to 80% Off",
          metaDescription: "Don't miss out on these incredible flash sale deals. Limited time offers with up to 80% off on selected items.",
          keywords: ["flash", "sale", "limited", "time", "deals"],
          isResponsive: true,
          isAccessible: true,
          hasOverlay: true,
          overlayOpacity: 0.6,
          tags: ["flash-sale", "limited-time", "deals"],
          category: "flash-sale",
          customFields: {
            saleType: "flash",
            duration: "6-hours",
            discount: "80%"
          },
          createdBy: new mongoose.Types.ObjectId(),
        }
      ];

      const createdSliders = await HeroSlider.insertMany(sampleHeroSliders);
      logger.info(`✅ Created ${createdSliders.length} sample hero sliders`);

      // Log created sliders
      createdSliders.forEach((slider, index) => {
        logger.info(`📱 Hero Slider ${index + 1}: ${slider.title} (${slider.device}) - Status: ${slider.status}`);
      });

      logger.info("🎉 Hero slider seeding completed successfully");
      mongoose.connection.close();
    });

  } catch (error) {
    logger.error("❌ Hero slider seeding error:", error);
    process.exit(1);
  }
};

// Run seeder if called directly
if (require.main === module) {
  createHeroSliders();
}

module.exports = { createHeroSliders }; 