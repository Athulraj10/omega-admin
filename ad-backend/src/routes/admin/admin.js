const router = require("express").Router();
const connect = require("connect");
const { adminTokenAuth } = require("../../middlewares/admin");
const multer = require("multer");
const path = require("path");
const productController = require("../../controllers/admin/productController");
const sellerController = require("../../controllers/admin/sellerController");

const {
  login,
  resetPassword,
  logout,
  updateProfile,
} = require("../../controllers/admin/authController");
const {
  addBanner,
  getBanners,
  updateSliderStatus,
  deleteSlider,
} = require("../../controllers/admin/homeController");


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../../public/uploads/products/"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});
const upload = multer({ storage });


router.post("/login", login);
router.post("/reset-password", adminTokenAuth, resetPassword);
router.post("/logout", adminTokenAuth, logout);
router.post("/update-profile", adminTokenAuth, updateProfile);

router.post("/add-home-slider", adminTokenAuth, addBanner);
router.post("/home-sliders", adminTokenAuth, getBanners);
router.put("/home-slider", adminTokenAuth, updateSliderStatus);
router.delete("/home-slider/:id", adminTokenAuth, deleteSlider);

// Product routes
router.get("/products", productController.getProducts);
router.post("/products", adminTokenAuth, upload.array("images"), productController.addProduct);
router.put("/products/:id", adminTokenAuth, upload.array("images"), productController.editProduct);
router.delete("/products/:id", adminTokenAuth, productController.deleteProduct);
router.patch("/products/:id/status", adminTokenAuth, productController.updateProductStatus);

// Seller routes
router.get("/sellers", adminTokenAuth, sellerController.getSellers);
router.post("/seller", adminTokenAuth, sellerController.addSeller);
router.put("/seller/:id", adminTokenAuth, sellerController.editSeller);
router.delete("/seller/:id", adminTokenAuth, sellerController.deleteSeller);
router.get("/seller/:id/products", adminTokenAuth, sellerController.getSellerProducts);
router.get("/seller/:id/reports", adminTokenAuth, sellerController.getSellerReports);


module.exports = router;
