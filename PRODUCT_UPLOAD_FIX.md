# Product Upload Fix Guide

This guide addresses the product upload issues in the backend and provides solutions.

## 🐛 Issues Identified

1. **Missing Upload Directories**: The `src/uploads/products` directory doesn't exist
2. **Path Mismatch**: Multer was saving to `public/uploads/products` but static files served from `src/uploads`
3. **Missing Error Handling**: No proper error handling for file uploads
4. **Validation Issues**: Limited validation for file types and sizes

## ✅ Solutions Implemented

### 1. Create Upload Directories

Run the setup script to create necessary directories:

```bash
cd ad-backend
node setup-uploads.js
```

This creates:
```
ad-backend/
├── src/uploads/
│   ├── products/
│   └── banners/
└── public/uploads/
    ├── products/
    └── banners/
```

### 2. Fixed Multer Configuration

**File**: `ad-backend/src/routes/admin/admin.js`

**Changes**:
- Updated destination path to match static file serving
- Added file type validation (images only)
- Added file size limits (5MB per file)
- Added file count limits (5 files max)
- Added comprehensive error handling

```javascript
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../uploads/products/"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
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
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 5 // Maximum 5 files
  }
});
```

### 3. Added Error Handling Middleware

```javascript
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
    // ... more error cases
  }
  next(error);
};
```

### 4. Enhanced Product Controller

**File**: `ad-backend/src/controllers/admin/productController.js`

**Improvements**:
- Better validation for required fields
- Number validation for price and stock
- Proper data type conversion
- Duplicate SKU handling
- Better error logging

## 🚀 Testing

### 1. Setup Upload Directories

```bash
cd ad-backend
node setup-uploads.js
```

### 2. Test Product Upload

```bash
cd ad-backend
node test-product-upload.js
```

### 3. Manual Testing

1. **Start the backend server**:
   ```bash
   cd ad-backend
   npm start
   ```

2. **Test with Postman or curl**:
   ```bash
   # Test without auth (should fail)
   curl -X POST http://localhost:3000/api/admin/products \
     -F "name=Test Product" \
     -F "category=YOUR_CATEGORY_ID" \
     -F "price=99.99" \
     -F "stock=10" \
     -F "sku=TEST-001" \
     -F "images=@/path/to/image.jpg"
   ```

## 🔧 Configuration

### Environment Variables

Ensure these are set in your `.env` file:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=3000
```

### File Upload Limits

Current limits (can be adjusted in `admin.js`):

- **File Size**: 5MB per file
- **File Count**: 5 files maximum
- **File Types**: Images only (jpg, png, gif, etc.)

## 📁 Directory Structure

After running the setup script:

```
ad-backend/
├── src/
│   └── uploads/
│       ├── products/     # Product images
│       └── banners/      # Banner images
├── public/
│   └── uploads/
│       ├── products/     # Backup location
│       └── banners/      # Backup location
└── server.js
```

## 🔍 Troubleshooting

### Common Issues

1. **"ENOENT: no such file or directory"**
   - Run `node setup-uploads.js` to create directories

2. **"File too large"**
   - Check file size (max 5MB)
   - Adjust limits in multer configuration

3. **"Only image files are allowed"**
   - Ensure you're uploading image files
   - Check file extension and MIME type

4. **"Too many files"**
   - Maximum 5 files allowed
   - Reduce number of files or adjust limit

5. **Images not displaying**
   - Check static file serving path in `server.js`
   - Verify file paths in database
   - Check file permissions

### Debug Steps

1. **Check server logs**:
   ```bash
   cd ad-backend
   npm start
   # Look for upload-related errors
   ```

2. **Verify directories exist**:
   ```bash
   ls -la src/uploads/products/
   ls -la public/uploads/products/
   ```

3. **Test static file serving**:
   ```bash
   curl http://localhost:3000/uploads/products/test-image.jpg
   ```

4. **Check database entries**:
   - Verify image paths are stored correctly
   - Check for any encoding issues

## 📝 API Endpoints

### Product Upload Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/admin/products` | Create product with images | Yes |
| PUT | `/admin/products/:id` | Update product with images | Yes |

### Request Format

**Multipart Form Data**:
```
name: "Product Name"
description: "Product Description"
category: "category_id"
price: "99.99"
stock: "10"
sku: "PRODUCT-SKU"
status: "active"
images: [file1, file2, ...] (optional)
```

### Response Format

```json
{
  "success": true,
  "data": {
    "id": "product_id",
    "name": "Product Name",
    "images": ["/uploads/products/filename.jpg"],
    // ... other fields
  },
  "message": "Product added successfully"
}
```

## 🎯 Next Steps

1. **Test the upload functionality** with the provided scripts
2. **Verify frontend integration** works correctly
3. **Monitor upload performance** and adjust limits if needed
4. **Add image optimization** if required
5. **Implement image deletion** when products are deleted

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section
2. Run the test scripts
3. Verify directory structure
4. Check server logs for errors
5. Test with Postman or curl 