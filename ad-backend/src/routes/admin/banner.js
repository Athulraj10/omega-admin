const express = require('express');
const router = express.Router();
const { adminTokenAuth } = require('../../middlewares/admin');
const multer = require('multer');
const path = require('path');
const bannerController = require('../../controllers/admin/bannerController');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../../uploads/banners/');
    const fs = require('fs');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 1
  }
});

const handleMulterError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    return res.status(400).json({ success: false, message: 'File upload error: ' + error.message });
  }
  next(error);
};

// Banner CRUD routes
router.post('/', adminTokenAuth, upload.single('image'), handleMulterError, bannerController.addBanner);
router.get('/', adminTokenAuth, bannerController.getBanners);
router.get('/public', bannerController.getBanners);
router.put('/:id', adminTokenAuth, bannerController.updateBanner);
router.patch('/:id/status', adminTokenAuth, bannerController.updateSliderStatus);
router.patch('/:id/default', adminTokenAuth, bannerController.setDefaultBanner);
router.delete('/:id', adminTokenAuth, bannerController.deleteSlider);

module.exports = router; 