const router = require("express").Router();
const { adminTokenAuth } = require("../../middlewares/admin");
const multer = require("multer");
const path = require("path");
const productController = require("../../controllers/admin/productController");
const sellerController = require("../../controllers/admin/sellerController");
const userController = require("../../controllers/admin/userController");
const categoryController = require("../../controllers/admin/categoryController");
const currencyController = require("../../controllers/admin/currencyController");
const dashboardController = require("../../controllers/admin/dashboardController");
const heroSliderRoutes = require("./heroSlider");
const bannerRoutes = require('./banner');

const {
  login,
  resetPassword,
  logout,
  updateProfile,
} = require("../../controllers/admin/authController");
const {
  addBanner,
  getBanners,
  updateBanner,
  updateSliderStatus,
  setDefaultBanner,
  deleteSlider,
} = require("../../controllers/admin/homeController");


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Determine upload path based on route
    let uploadPath;
    if (req.path.includes('/banners')) {
      uploadPath = path.join(__dirname, "../../uploads/banners/");
    } else {
      uploadPath = path.join(__dirname, "../../uploads/products/");
    }
    
    console.log('📁 Upload destination:', uploadPath);
    
    // Ensure directory exists
    const fs = require('fs');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
      console.log('✅ Created upload directory:', uploadPath);
    }
    
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const filename = uniqueSuffix + "-" + file.originalname;
    console.log('📄 Generated filename:', filename);
    cb(null, filename);
  },
});
const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    // Check file type
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 5 // Maximum 5 files
  }
});

// Multer error handling middleware
const handleMulterError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 5MB.'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files. Maximum 5 files allowed.'
      });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Unexpected file field.'
      });
    }
  }
  if (error.message === 'Only image files are allowed!') {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
  next(error);
};

router.post("/login", login);
router.post("/reset-password", adminTokenAuth, resetPassword);
router.post("/logout", adminTokenAuth, logout);
router.post("/update-profile", adminTokenAuth, updateProfile);

// Product routes
router.get("/products", productController.getProducts);
router.post("/products", adminTokenAuth, upload.array("images"), handleMulterError, productController.addProduct);
router.put("/products/:id", adminTokenAuth, upload.array("images"), handleMulterError, productController.editProduct);
router.delete("/products/:id", adminTokenAuth, productController.deleteProduct);
router.patch("/products/:id/status", adminTokenAuth, productController.updateProductStatus);
router.get("/products/check-sku", adminTokenAuth, productController.checkSKUAvailability);
router.get("/products/generate-sku", adminTokenAuth, productController.generateSKU);

// Seller routes
router.get("/sellers", adminTokenAuth, sellerController.getSellers);
router.post("/seller", adminTokenAuth, sellerController.addSeller);
router.put("/seller/:id", adminTokenAuth, sellerController.editSeller);
router.delete("/seller/:id", adminTokenAuth, sellerController.deleteSeller);
router.get("/seller/:id/products", adminTokenAuth, sellerController.getSellerProducts);
router.get("/seller/:id/reports", adminTokenAuth, sellerController.getSellerReports);

// Health check endpoint (no auth required)
router.get("/health", (req, res) => {
  res.json({ 
    status: "OK", 
    message: "Admin API is running",
    timestamp: new Date().toISOString()
  });
});

// Test users endpoint (no auth required for testing)
router.get("/test-users", userController.getUsers);

// User routes
router.get("/users", adminTokenAuth, userController.getUsers);
router.get("/users/:id", adminTokenAuth, userController.getUserById);
router.get("/users/:id/orders", adminTokenAuth, userController.getUserOrders);
router.get("/users/:id/reports", adminTokenAuth, userController.getUserReports);
router.patch("/users/:id/status", adminTokenAuth, userController.updateUserStatus);
router.delete("/users/:id", adminTokenAuth, userController.deleteUser);

// Category routes
router.get("/categories", adminTokenAuth, categoryController.getCategories);
router.get("/categories/hierarchical", categoryController.getHierarchicalCategories);
router.get("/categories/active", categoryController.getActiveCategories);
router.get("/categories/for-product", categoryController.getCategoriesForProduct);
router.get("/categories/:id", adminTokenAuth, categoryController.getCategoryById);
router.post("/categories", adminTokenAuth, categoryController.createCategory);
router.put("/categories/:id", adminTokenAuth, categoryController.updateCategory);
router.delete("/categories/:id", adminTokenAuth, categoryController.deleteCategory);
router.patch("/categories/:id/status", adminTokenAuth, categoryController.updateCategoryStatus);
router.post("/categories/reorder", adminTokenAuth, categoryController.reorderCategories);

// Dashboard routes - temporarily without auth for testing
router.get("/dashboard/overview", dashboardController.getDashboardOverview);
router.get("/dashboard/users", dashboardController.getRecentUsers);
router.get("/dashboard/payments", dashboardController.getPaymentsOverview);
router.get("/dashboard/weekly-profit", dashboardController.getWeeklyProfit);
router.get("/dashboard/device-usage", dashboardController.getDeviceUsage);
router.get("/dashboard/campaign-visitors", dashboardController.getCampaignVisitors);

// Currency routes
router.get("/currencies", currencyController.getCurrencies);
router.post("/currencies", adminTokenAuth, currencyController.createCurrency);
router.put("/currencies/:id", adminTokenAuth, currencyController.updateCurrency);
router.delete("/currencies/:id", adminTokenAuth, currencyController.deleteCurrency);
router.patch("/currencies/:id/default", adminTokenAuth, currencyController.setDefaultCurrency);
router.patch("/currencies/:id/status", adminTokenAuth, currencyController.updateCurrencyStatus);

// Hero Slider routes
router.use("/", heroSliderRoutes);
router.use('/banners', bannerRoutes);

module.exports = router;
