const path = require("path");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const { User, UserLoginHistory, Order, Product } = require("./../models");
const logger = require("../logger/logger");
const { ACTIVE, ROLES } = require("../services/Constants");

const createUsers = async () => {
  try {
    const url = process.env.MONGO_CONNECTION_STRING;
    console.log("MONGO_CONNECTION_STRING:", process.env.MONGO_CONNECTION_STRING);
    console.log("All env vars:", Object.keys(process.env).filter(key => key.includes('MONGO')));
    logger.info("Connecting to database for user seeding...");

    const mongooseOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    await mongoose.connect(url, mongooseOptions);

    mongoose.connection.once("open", async () => {
      logger.info("Connected to database for user seeding");

      // Create admin user
      const adminPassword = await bcrypt.hash("admin@123", 10);
      const adminUser = await User.findOneAndUpdate(
        { email: "admin@gmail.com" },
        {
          first_name: "Admin",
          last_name: "User",
          email: "admin@gmail.com",
          userName: "admin123",
          status: ACTIVE,
          role: ROLES.ADMIN.name,
          roleLevel: ROLES.ADMIN.level,
          password: adminPassword,
          passwordText: "admin@123",
          email_verify: new Date(),
          device_code: "device_admin",
          mobile_no: "8877445511",
        },
        { upsert: true, new: true }
      );

      // Create seller users
      const sellers = [
        {
          first_name: "John",
          last_name: "Seller",
          email: "john.seller@gmail.com",
          userName: "johnseller",
          mobile_no: "9876543210",
          password: "seller@123",
        },
        {
          first_name: "Sarah",
          last_name: "Merchant",
          email: "sarah.merchant@gmail.com",
          userName: "sarahmerchant",
          mobile_no: "9876543211",
          password: "seller@123",
        },
        {
          first_name: "Mike",
          last_name: "Vendor",
          email: "mike.vendor@gmail.com",
          userName: "mikevendor",
          mobile_no: "9876543212",
          password: "seller@123",
        },
      ];

      for (const sellerData of sellers) {
        const sellerPassword = await bcrypt.hash(sellerData.password, 10);
        await User.findOneAndUpdate(
          { email: sellerData.email },
          {
            first_name: sellerData.first_name,
            last_name: sellerData.last_name,
            email: sellerData.email,
            userName: sellerData.userName,
            status: ACTIVE,
            role: ROLES.SELLER.name,
            roleLevel: ROLES.SELLER.level,
            password: sellerPassword,
            passwordText: sellerData.password,
            email_verify: new Date(),
            device_code: `device_${sellerData.userName}`,
            mobile_no: sellerData.mobile_no,
          },
          { upsert: true, new: true }
        );
      }

      // Create regular users
      const users = [
        {
          first_name: "Alice",
          last_name: "Customer",
          email: "alice.customer@gmail.com",
          userName: "alicecustomer",
          mobile_no: "9876543220",
          password: "user@123",
        },
        {
          first_name: "Bob",
          last_name: "Buyer",
          email: "bob.buyer@gmail.com",
          userName: "bobbuyer",
          mobile_no: "9876543221",
          password: "user@123",
        },
        {
          first_name: "Carol",
          last_name: "Client",
          email: "carol.client@gmail.com",
          userName: "carolclient",
          mobile_no: "9876543222",
          password: "user@123",
        },
        {
          first_name: "David",
          last_name: "User",
          email: "david.user@gmail.com",
          userName: "daviduser",
          mobile_no: "9876543223",
          password: "user@123",
        },
        {
          first_name: "Emma",
          last_name: "Customer",
          email: "emma.customer@gmail.com",
          userName: "emmacustomer",
          mobile_no: "9876543224",
          password: "user@123",
        },
        {
          first_name: "Frank",
          last_name: "Buyer",
          email: "frank.buyer@gmail.com",
          userName: "frankbuyer",
          mobile_no: "9876543225",
          password: "user@123",
        },
        {
          first_name: "Grace",
          last_name: "Client",
          email: "grace.client@gmail.com",
          userName: "graceclient",
          mobile_no: "9876543226",
          password: "user@123",
        },
        {
          first_name: "Henry",
          last_name: "User",
          email: "henry.user@gmail.com",
          userName: "henryuser",
          mobile_no: "9876543227",
          password: "user@123",
        },
      ];

      for (const userData of users) {
        const userPassword = await bcrypt.hash(userData.password, 10);
        await User.findOneAndUpdate(
          { email: userData.email },
          {
            first_name: userData.first_name,
            last_name: userData.last_name,
            email: userData.email,
            userName: userData.userName,
            status: ACTIVE,
            role: ROLES.USER.name,
            roleLevel: ROLES.USER.level,
            password: userPassword,
            passwordText: userData.password,
            email_verify: new Date(),
            device_code: `device_${userData.userName}`,
            mobile_no: userData.mobile_no,
          },
          { upsert: true, new: true }
        );
      }

      logger.info("Users created successfully!");
      
      // Create login history for all users
      const allUsers = await User.find({});
      for (const user of allUsers) {
        const loginHistory = await UserLoginHistory.findOneAndUpdate(
          { userId: user._id },
          { userId: user._id },
          { upsert: true, new: true }
        );

        await User.updateOne(
          { _id: user._id },
          {
            $set: {
              loginHistory: loginHistory._id,
            },
          }
        );
      }

      logger.info("Login history created for all users!");
      
      // Close the connection
      mongoose.connection.close();
    });
  } catch (error) {
    logger.error("Error creating users:", error);
  }
};

createUsers(); 