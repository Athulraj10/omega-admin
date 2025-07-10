const fs = require("fs").promises;
const path = require("path");
const Product = require("../../models/product");
const Response = require("../../services/Response");

// Utility function to generate unique SKU
const generateUniqueSKU = async (baseSKU) => {
  let sku = baseSKU;
  let counter = 1;
  
  while (await Product.findOne({ sku })) {
    sku = `${baseSKU}-${counter}`;
    counter++;
  }
  
  return sku;
};

const SUCCESS = 200;
const FAIL = 400;
const INTERNAL_SERVER = 500;

const getProducts = async (req, res) => {
  try {
    console.log('🔄 Fetching products...');
    
    const products = await Product.find()
      .populate('category', 'name')
      .populate('seller', 'companyName userName email')
      .sort({ createdAt: -1 });
    
    console.log('📦 Fetched products:', products.length);
    console.log('📦 Sample product:', products[0] ? {
      _id: products[0]._id,
      name: products[0].name,
      category: products[0].category,
      seller: products[0].seller
    } : 'No products');
    
    return Response.successResponseData(res, products, SUCCESS, "Product list fetched successfully");
  } catch (err) {
    console.error('❌ Error fetching products:', err);
    console.error('❌ Error stack:', err.stack);
    return Response.errorResponseData(res, err.message, INTERNAL_SERVER);
  }
};

const addProduct = async (req, res) => {
  try {
    const { name, description, category, price, discountPrice, stock, sku, status, seller } = req.body;

    console.log('📝 Adding product:', {name, description, category, price, discountPrice, stock, sku, status, seller });
    console.log('📁 Files received:', req.files ? req.files.length : 0);
    console.log('📝 Status value:', status);
    console.log('📝 Status type:', typeof status);
    // Basic validation
    console.log({name, description, category, price, discountPrice, stock, sku, status, seller})
    if (!name || !category || !price || !sku) {
      return Response.errorResponseWithoutData(res, "Missing required fields", FAIL);
    }

    // Validate price and stock are numbers
    if (isNaN(price) || isNaN(stock)) {
      return Response.errorResponseWithoutData(res, "Price and stock must be valid numbers", FAIL);
    }

    // Check if SKU already exists
    const existingProduct = await Product.findOne({ sku: sku.trim() });
    if (existingProduct) {
      return Response.errorResponseWithoutData(res, `Product with SKU "${sku.trim()}" already exists. Please use a different SKU.`, FAIL);
    }

    let images = [];
    if (req.files && req.files.length > 0) {
      console.log('📸 Processing uploaded files:', req.files.length);
      images = req.files.map((file) => {
        const imagePath = `/uploads/products/${file.filename}`;
        console.log('📄 Image path:', imagePath);
        console.log('📄 File details:', {
          originalname: file.originalname,
          filename: file.filename,
          mimetype: file.mimetype,
          size: file.size
        });
        return imagePath;
      });
    } else {
      console.log('📸 No files uploaded');
    }

    const product = new Product({
      name: name.trim(),
      description: description?.trim() || '',
      category,
      price: parseFloat(price),
      discountPrice: discountPrice ? parseFloat(discountPrice) : undefined,
      stock: parseInt(stock),
      sku: sku.trim(),
      status: status || '1',
      seller: seller || undefined,
      images,
    });

    await product.save();
    return Response.successResponseData(res, product, SUCCESS, "Product added successfully");
  } catch (err) {
    console.error('Error adding product:', err);
    
    // Handle duplicate key errors (MongoDB error code 11000)
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      const value = err.keyValue[field];
      
      if (field === 'sku') {
        return Response.errorResponseWithoutData(res, `Product with SKU "${value}" already exists. Please use a different SKU.`, FAIL);
      } else {
        return Response.errorResponseWithoutData(res, `A product with this ${field} already exists.`, FAIL);
      }
    }
    
    // Handle validation errors
    if (err.name === 'ValidationError') {
      const validationErrors = Object.values(err.errors).map(error => error.message);
      return Response.errorResponseWithoutData(res, `Validation error: ${validationErrors.join(', ')}`, FAIL);
    }
    
    // Handle other errors
    return Response.errorResponseData(res, err.message, INTERNAL_SERVER);
  }
};

const editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, category, price, discountPrice, stock, sku, status, seller } = req.body;

    // Validate required fields
    if (!name || !category || !price || !sku) {
      return Response.errorResponseWithoutData(res, "Missing required fields", FAIL);
    }

    // Validate price and stock are numbers
    if (isNaN(price) || isNaN(stock)) {
      return Response.errorResponseWithoutData(res, "Price and stock must be valid numbers", FAIL);
    }

    // Check if SKU already exists for another product
    const existingProduct = await Product.findOne({ sku: sku.trim(), _id: { $ne: id } });
    if (existingProduct) {
      return Response.errorResponseWithoutData(res, `Product with SKU "${sku.trim()}" already exists. Please use a different SKU.`, FAIL);
    }

    const update = {
      name: name.trim(),
      description: description?.trim() || '',
      category,
      price: parseFloat(price),
      discountPrice: discountPrice ? parseFloat(discountPrice) : undefined,
      stock: parseInt(stock),
      sku: sku.trim(),
      status: status || '1',
    };

    // Handle new images if uploaded
    if (req.files && req.files.length > 0) {
      console.log('📸 Processing uploaded files for edit:', req.files.length);
      update.images = req.files.map((file) => {
        const imagePath = `/uploads/products/${file.filename}`;
        console.log('📄 Image path for edit:', imagePath);
        return imagePath;
      });
    } else {
      console.log('📸 No files uploaded for edit');
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
    console.error('Error updating product:', err);
    
    // Handle duplicate key errors (MongoDB error code 11000)
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      const value = err.keyValue[field];
      
      if (field === 'sku') {
        return Response.errorResponseWithoutData(res, `Product with SKU "${value}" already exists. Please use a different SKU.`, FAIL);
      } else {
        return Response.errorResponseWithoutData(res, `A product with this ${field} already exists.`, FAIL);
      }
    }
    
    // Handle validation errors
    if (err.name === 'ValidationError') {
      const validationErrors = Object.values(err.errors).map(error => error.message);
      return Response.errorResponseWithoutData(res, `Validation error: ${validationErrors.join(', ')}`, FAIL);
    }
    
    // Handle other errors
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

const checkSKUAvailability = async (req, res) => {
  try {
    const { sku, productId } = req.query;
    
    if (!sku) {
      return Response.errorResponseWithoutData(res, "SKU is required", FAIL);
    }

    let query = { sku: sku.trim() };
    
    // If editing a product, exclude it from the check
    if (productId) {
      query._id = { $ne: productId };
    }

    const existingProduct = await Product.findOne(query);
    
    return Response.successResponseData(res, {
      available: !existingProduct,
      sku: sku.trim()
    }, SUCCESS, existingProduct ? "SKU already exists" : "SKU is available");
  } catch (err) {
    return Response.errorResponseData(res, err.message, INTERNAL_SERVER);
  }
};

const generateSKU = async (req, res) => {
  try {
    const { baseSKU } = req.query;
    
    if (!baseSKU) {
      return Response.errorResponseWithoutData(res, "Base SKU is required", FAIL);
    }

    const uniqueSKU = await generateUniqueSKU(baseSKU);
    
    return Response.successResponseData(res, {
      sku: uniqueSKU
    }, SUCCESS, "Unique SKU generated successfully");
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
  checkSKUAvailability,
  generateSKU,
};
