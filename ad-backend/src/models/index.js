const {
  User,
  UserLoginHistory,
} = require("./user");
const Address = require("./address");
const Cart = require("./cart");
const Category = require("./category");
const Currency = require("./currency");
const Notification = require("./notification");
const Order = require("./order");
const Otp = require("./otp");
const Product = require("./product");
const Review = require("./review");
const UserTransaction = require("./userTransaction");
const UserWallet = require("./userWallet");
const Wishlist = require("./wishlist");
const Banner = require("./banner");
const HeroSlider = require("./heroSlider");

module.exports = {
  User,
  Banner,
  HeroSlider,
  UserLoginHistory, Address, Cart, Category, Currency, Notification, Order, Otp, Product, Review, UserTransaction, UserWallet, Wishlist
};
