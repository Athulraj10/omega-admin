const fs = require("fs").promises;
const path = require("path");
const Product = require("../../models/product");
const Response = require("../../services/Response");

const SUCCESS = 200;
const FAIL = 400;
const INTERNAL_SERVER = 500;

const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    return Response.successResponseData(res, products, SUCCESS, "Product list fetched successfully");
  } catch (err) {
    return Response.errorResponseData(res, err.message, INTERNAL_SERVER);
  }
};

const addProduct = async (req, res) => {
  try {
    const { name, description, category, price, discountPrice, stock, sku, status } = req.body;

    // Basic validation
    if (!name || !category || !price || !sku) {
      return Response.errorResponseWithoutData(res, "Missing required fields", FAIL);
    }

    let images = [];
    if (req.files?.length) {
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

const editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const update = { ...req.body };

    // Handle new images if uploaded
    if (req.files?.length) {
      update.images = req.files.map((file) => `/uploads/products/${file.filename}`);
    }

    const product = await Product.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return Response.errorResponseWithoutData(res, "Product not found", FAIL);
    }

    return Response.successResponseData(res, product, SUCCESS, "Product updated successfully");
  } catch (err) {
    return Response.errorResponseData(res, err.message, INTERNAL_SERVER);
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return Response.errorResponseWithoutData(res, "Product not found", FAIL);
    }

    // Delete associated image files
    if (product.images?.length) {
      for (const imgPath of product.images) {
        const filePath = path.join(__dirname, "../../../public", imgPath);
        try {
          await fs.unlink(filePath);
        } catch (err) {
          console.warn(`Failed to delete image: ${filePath}`, err.message);
        }
      }
    }

    return Response.successResponseWithoutData(res, "Product deleted successfully", SUCCESS);
  } catch (err) {
    return Response.errorResponseData(res, err.message, INTERNAL_SERVER);
  }
};

const updateProductStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const product = await Product.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!product) {
      return Response.errorResponseWithoutData(res, "Product not found", FAIL);
    }

    return Response.successResponseData(res, product, SUCCESS, "Product status updated successfully");
  } catch (err) {
    return Response.errorResponseData(res, err.message, INTERNAL_SERVER);
  }
};

module.exports = {
  getProducts,
  addProduct,
  editProduct,
  deleteProduct,
  updateProductStatus,
};
