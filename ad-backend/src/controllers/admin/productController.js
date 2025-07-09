const Product = require("../../models/product");
const path = require("path");
const fs = require("fs");
const Response = require("../../services/Response");
const SUCCESS = 200;
const FAIL = 400;
const INTERNAL_SERVER = 500;

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    return Response.successResponseData(res, products, SUCCESS, "Product list fetched successfully");
  } catch (err) {
    return Response.errorResponseData(res, err.message, INTERNAL_SERVER);
  }
};

exports.addProduct = async (req, res) => {
  try {
    const { name, description, category, price, discountPrice, stock, sku, status } = req.body;
    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map((file) => `/uploads/products/${file.filename}`);
    }
    const product = new Product({
      name,
      description,
      category,
      price,
      discountPrice,
      stock,
      sku,
      status,
      images,
    });
    await product.save();
    return Response.successResponseData(res, product, SUCCESS, "Product added successfully");
  } catch (err) {
    return Response.errorResponseData(res, err.message, INTERNAL_SERVER);
  }
};

exports.editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, category, price, discountPrice, stock, sku, status } = req.body;
    let update = { name, description, category, price, discountPrice, stock, sku, status };
    if (req.files && req.files.length > 0) {
      update.images = req.files.map((file) => `/uploads/products/${file.filename}`);
    }
    const product = await Product.findByIdAndUpdate(id, update, { new: true });
    if (!product) return Response.errorResponseWithoutData(res, "Product not found", FAIL);
    return Response.successResponseData(res, product, SUCCESS, "Product updated successfully");
  } catch (err) {
    return Response.errorResponseData(res, err.message, INTERNAL_SERVER);
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) return Response.errorResponseWithoutData(res, "Product not found", FAIL);
    if (product.images && product.images.length > 0) {
      product.images.forEach((imgPath) => {
        const filePath = path.join(__dirname, "../../../public", imgPath);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      });
    }
    return Response.successResponseWithoutData(res, "Product deleted successfully", SUCCESS);
  } catch (err) {
    return Response.errorResponseData(res, err.message, INTERNAL_SERVER);
  }
};

exports.updateProductStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const product = await Product.findByIdAndUpdate(id, { status }, { new: true });
    if (!product) return Response.errorResponseWithoutData(res, "Product not found", FAIL);
    return Response.successResponseData(res, product, SUCCESS, "Product status updated successfully");
  } catch (err) {
    return Response.errorResponseData(res, err.message, INTERNAL_SERVER);
  }
}; 