const express = require("express");
const router = express.Router();
const heroSliderController = require("../../controllers/admin/heroSliderController");
const { adminTokenAuth } = require("../../middlewares/admin");
const multer = require("multer");
const path = require("path");

// Multer configuration for hero sliders
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, "../../uploads/hero-sliders/");
    
    // Ensure directory exists
    const fs = require('fs');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const filename = uniqueSuffix + "-" + file.originalname;
    cb(null, filename);
  },
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 2 // Maximum 2 files (image + mobileImage)
  }
});

// Multer error handling middleware
const handleMulterError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      message: 'File upload error: ' + error.message
    });
  }
  next(error);
};

// Hero Slider Routes
router.post("/hero-sliders", adminTokenAuth, upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'mobileImage', maxCount: 1 }
]), handleMulterError, heroSliderController.createHeroSlider);

router.get("/hero-sliders", adminTokenAuth, heroSliderController.getHeroSliders);

router.get("/hero-sliders/:id", adminTokenAuth, heroSliderController.getHeroSliderById);

router.put("/hero-sliders/:id", adminTokenAuth, upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'mobileImage', maxCount: 1 }
]), handleMulterError, heroSliderController.updateHeroSlider);

router.delete("/hero-sliders/:id", adminTokenAuth, heroSliderController.deleteHeroSlider);

router.patch("/hero-sliders/:id/status", adminTokenAuth, heroSliderController.toggleHeroSliderStatus);

router.post("/hero-sliders/reorder", adminTokenAuth, heroSliderController.reorderHeroSliders);

router.post("/hero-sliders/:id/duplicate", adminTokenAuth, heroSliderController.duplicateHeroSlider);

router.get("/hero-sliders/:id/analytics", adminTokenAuth, heroSliderController.getHeroSliderAnalytics);

router.post("/hero-sliders/bulk", adminTokenAuth, heroSliderController.bulkOperations);

// Public routes (no authentication required)
router.get("/hero-sliders/public", heroSliderController.getPublicHeroSliders);

router.post("/hero-sliders/:id/views", heroSliderController.incrementViews);

router.post("/hero-sliders/:id/clicks", heroSliderController.incrementClicks);

module.exports = router; 