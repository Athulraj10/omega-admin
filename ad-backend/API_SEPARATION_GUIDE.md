# API Separation Guide: Banners vs Hero Sliders

## Overview

This project now has **completely separate collections and APIs** for Banners and Hero Sliders:

- **Banners**: Simple promotional images with basic fields
- **Hero Sliders**: Advanced carousel components with rich features

---

## 🗄️ Database Collections

### Banner Collection (`banners`)
```javascript
{
  _id: ObjectId,
  image: String,           // Image filename
  titleLine1: String,      // Main title
  titleLine2: String,      // Subtitle
  offerText: String,       // Offer description
  offerHighlight: String,  // Highlighted text
  buttonText: String,      // Button text
  device: String,          // 'desktop' | 'mobile'
  status: String,          // '1' | '0'
  isDefault: Boolean,      // Default banner flag
  whiteLabelId: ObjectId,  // Multi-tenant support
  createdAt: Date,
  updatedAt: Date
}
```

### Hero Slider Collection (`herosliders`)
```javascript
{
  _id: ObjectId,
  title: String,           // Slider title
  titleLine1: String,      // Main title
  titleLine2: String,      // Subtitle
  subtitle: String,        // Additional subtitle
  description: String,     // Detailed description
  offerText: String,       // Offer text
  offerHighlight: String,  // Highlighted offer
  buttonText: String,      // Button text
  buttonLink: String,      // Button URL
  image: String,           // Desktop image
  imageUrl: String,        // Full image URL
  mobileImage: String,     // Mobile image
  mobileImageUrl: String,  // Full mobile image URL
  videoUrl: String,        // Video URL
  device: String,          // 'desktop' | 'mobile' | 'tablet' | 'all'
  displayType: String,     // 'image' | 'video' | 'mixed'
  status: String,          // 'active' | 'inactive' | 'draft' | 'scheduled'
  isDefault: Boolean,      // Default slider flag
  priority: Number,        // Priority (1-10)
  sortOrder: Number,       // Sort order
  startDate: Date,         // Scheduling start
  endDate: Date,           // Scheduling end
  isScheduled: Boolean,    // Scheduled flag
  backgroundColor: String, // Background color
  textColor: String,       // Text color
  animation: String,       // Animation type
  animationDuration: Number, // Animation duration
  autoplayDelay: Number,   // Autoplay delay
  isABTest: Boolean,       // A/B testing flag
  abTestGroup: String,     // A/B test group
  abTestWeight: Number,    // A/B test weight
  views: Number,           // View count
  clicks: Number,          // Click count
  ctr: Number,             // Click-through rate
  revenue: Number,         // Revenue generated
  targetAudience: [String], // Target audience
  targetLocation: [String], // Target locations
  targetDevice: [String],  // Target devices
  targetTime: Object,      // Target time window
  metaTitle: String,       // SEO meta title
  metaDescription: String, // SEO meta description
  keywords: [String],      // SEO keywords
  isResponsive: Boolean,   // Responsive flag
  isAccessible: Boolean,   // Accessibility flag
  hasOverlay: Boolean,     // Overlay flag
  overlayOpacity: Number,  // Overlay opacity
  translations: Object,    // Multi-language support
  tags: [String],          // Tags
  category: String,        // Category
  customFields: Object,    // Custom fields
  createdBy: ObjectId,     // Creator ID
  updatedBy: ObjectId,     // Updater ID
  whiteLabelId: ObjectId,  // Multi-tenant support
  isDeleted: Boolean,      // Soft delete flag
  deletedBy: ObjectId,     // Deleted by
  deletedAt: Date,         // Deletion date
  version: Number,         // Version number
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔌 API Endpoints

### Banner API (`/admin/banners`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/admin/banners` | Create new banner | ✅ |
| `GET` | `/admin/banners` | Get all banners | ✅ |
| `GET` | `/admin/banners/public` | Get public banners | ❌ |
| `PUT` | `/admin/banners/:id` | Update banner | ✅ |
| `PATCH` | `/admin/banners/:id/status` | Update banner status | ✅ |
| `PATCH` | `/admin/banners/:id/default` | Set as default banner | ✅ |
| `DELETE` | `/admin/banners/:id` | Delete banner | ✅ |

### Hero Slider API (`/admin/hero-sliders`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/admin/hero-sliders` | Create new hero slider | ✅ |
| `GET` | `/admin/hero-sliders` | Get all hero sliders | ✅ |
| `GET` | `/admin/hero-sliders/public` | Get public hero sliders | ❌ |
| `GET` | `/admin/hero-sliders/:id` | Get hero slider by ID | ✅ |
| `PUT` | `/admin/hero-sliders/:id` | Update hero slider | ✅ |
| `PATCH` | `/admin/hero-sliders/:id/status` | Toggle hero slider status | ✅ |
| `DELETE` | `/admin/hero-sliders/:id` | Delete hero slider | ✅ |
| `POST` | `/admin/hero-sliders/reorder` | Reorder hero sliders | ✅ |
| `POST` | `/admin/hero-sliders/:id/duplicate` | Duplicate hero slider | ✅ |
| `GET` | `/admin/hero-sliders/:id/analytics` | Get analytics | ✅ |
| `POST` | `/admin/hero-sliders/bulk` | Bulk operations | ✅ |
| `POST` | `/admin/hero-sliders/:id/views` | Increment views | ❌ |
| `POST` | `/admin/hero-sliders/:id/clicks` | Increment clicks | ❌ |

---

## 🏗️ Backend Architecture

### Controllers
- **Banner Controller**: `src/controllers/admin/bannerController.js`
- **Hero Slider Controller**: `src/controllers/admin/heroSliderController.js`

### Routes
- **Banner Routes**: `src/routes/admin/banner.js`
- **Hero Slider Routes**: `src/routes/admin/heroSlider.js`

### Models
- **Banner Model**: `src/models/banner.js`
- **Hero Slider Model**: `src/models/heroSlider.js`

### Main Router
```javascript
// src/routes/admin/admin.js
router.use('/banners', bannerRoutes);        // Banner endpoints
router.use('/', heroSliderRoutes);           // Hero slider endpoints
```

---

## 🎨 Frontend Architecture

### Redux Actions
- **Banner Actions**: `src/components/redux/action/banner/bannerAction.ts`
- **Hero Slider Actions**: `src/components/redux/action/banner/heroSliderAction.ts`

### Redux Sagas
- **Banner Saga**: `src/components/redux/saga/banner/bannerSaga.ts`
- **Hero Slider Saga**: `src/components/redux/saga/banner/heroSliderSaga.ts`

### Redux Reducers
- **Banner Reducer**: `src/components/redux/reducer/banner/bannerReducer.ts`
- **Hero Slider Reducer**: `src/components/redux/reducer/banner/heroSliderReducer.ts`

### Pages
- **Banner Management**: `/banners/list`
- **Hero Slider Management**: `/banners/hero-sliders`

### Navigation
```javascript
// Sidebar navigation structure
{
  title: "Banners",
  items: [
    { title: "Add Banner", url: "/banners/add" },
    { title: "List Banners", url: "/banners/list" }
  ]
},
{
  title: "Hero Sliders", 
  items: [
    { title: "Add Hero Slider", url: "/banners/hero-sliders/add" },
    { title: "List Hero Sliders", url: "/banners/hero-sliders" }
  ]
}
```

---

## 🧪 Testing the Separation

### 1. Seed Sample Data
```bash
node seed-both-collections.js
```

### 2. Test Banner API
```bash
# Get all banners
curl -X GET http://localhost:8001/admin/banners \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get public banners
curl -X GET http://localhost:8001/admin/banners/public
```

### 3. Test Hero Slider API
```bash
# Get all hero sliders
curl -X GET http://localhost:8001/admin/hero-sliders \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get public hero sliders
curl -X GET http://localhost:8001/admin/hero-sliders/public
```

### 4. Verify Collections
```javascript
// In MongoDB shell
use omega
db.banners.find()      // Should show banner documents
db.herosliders.find()  // Should show hero slider documents
```

---

## 🔄 Migration Notes

### What Changed
1. **Banner logic moved** from `homeController.js` to `bannerController.js`
2. **Hero slider logic** already existed in `heroSliderController.js`
3. **Routes separated** into dedicated route files
4. **Frontend endpoints updated** to use correct APIs
5. **Navigation restructured** to separate banners and hero sliders

### Backward Compatibility
- Legacy banner endpoints in `homeController.js` have been removed
- All banner operations now use `/admin/banners` endpoints
- All hero slider operations use `/admin/hero-sliders` endpoints

### Benefits
- ✅ **Clean separation** of concerns
- ✅ **Independent scaling** of each feature
- ✅ **Easier maintenance** and development
- ✅ **Better organization** of code
- ✅ **RESTful API design**
- ✅ **Separate collections** for different data types

---

## 🚀 Quick Start

1. **Start the backend**:
   ```bash
   cd ad-backend
   npm start
   ```

2. **Seed sample data**:
   ```bash
   node seed-both-collections.js
   ```

3. **Start the frontend**:
   ```bash
   cd ad-front
   npm run dev
   ```

4. **Access the admin panel**:
   - Navigate to `/banners/list` for Banner management
   - Navigate to `/banners/hero-sliders` for Hero Slider management

---

## 📝 Summary

The system now has **complete separation** between Banners and Hero Sliders:

- **Different collections** in MongoDB
- **Separate controllers** and routes
- **Independent frontend components**
- **Clean API endpoints**
- **Organized navigation structure**

This separation allows for better scalability, maintenance, and feature development for each component independently. 