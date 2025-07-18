# Hero Slider API Documentation

## Overview

The Hero Slider API provides comprehensive management of hero sliders with advanced features including scheduling, A/B testing, analytics, and dynamic content management.

## Base URL

```
http://localhost:8001/admin
```

## Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### 1. Create Hero Slider

**POST** `/hero-sliders`

Creates a new hero slider with advanced features.

**Headers:**
```
Content-Type: multipart/form-data
Authorization: Bearer <token>
```

**Form Data:**
```javascript
{
  title: "Summer Collection Launch",           // Required
  titleLine1: "Summer Collection",             // Optional
  titleLine2: "New Arrivals 2024",             // Optional
  subtitle: "Discover the latest trends",      // Optional
  description: "Explore our collection...",    // Optional
  offerText: "Up to",                          // Optional
  offerHighlight: "50% OFF",                   // Optional
  buttonText: "Shop Now",                      // Optional
  buttonLink: "/summer-collection",            // Optional
  image: <file>,                               // Required
  mobileImage: <file>,                         // Optional
  videoUrl: "https://...",                     // Optional
  device: "desktop",                           // Optional: desktop|mobile|tablet|all
  displayType: "image",                        // Optional: image|video|mixed
  status: "active",                            // Optional: active|inactive|draft|scheduled
  isDefault: false,                            // Optional
  priority: 1,                                 // Optional: 1-10
  sortOrder: 0,                                // Optional
  startDate: "2024-12-01",                     // Optional
  endDate: "2024-12-31",                       // Optional
  isScheduled: false,                          // Optional
  backgroundColor: "#ffffff",                  // Optional
  textColor: "#000000",                        // Optional
  animation: "fade",                           // Optional: fade|slide|zoom|flip|bounce|none
  animationDuration: 500,                      // Optional: 100-3000ms
  autoplayDelay: 3000,                         // Optional: 1000-10000ms
  isABTest: false,                             // Optional
  abTestGroup: "A",                            // Optional: A|B|control
  abTestWeight: 50,                            // Optional: 0-100
  targetAudience: "fashion,women,men",         // Optional: comma-separated
  targetLocation: "US,CA,UK",                  // Optional: comma-separated
  targetDevice: "desktop,mobile",              // Optional: comma-separated
  targetTime: '{"start":"00:00","end":"23:59"}', // Optional: JSON string
  metaTitle: "SEO Title",                      // Optional
  metaDescription: "SEO Description",          // Optional
  keywords: "summer,fashion,trends",           // Optional: comma-separated
  isResponsive: true,                          // Optional
  isAccessible: true,                          // Optional
  hasOverlay: false,                           // Optional
  overlayOpacity: 0.3,                         // Optional: 0-1
  tags: "summer,fashion,new-arrivals",         // Optional: comma-separated
  category: "fashion",                         // Optional
  customFields: '{"season":"summer","year":"2024"}' // Optional: JSON string
}
```

**Response:**
```json
{
  "meta": {
    "code": 200,
    "message": "Hero slider created successfully"
  },
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "title": "Summer Collection Launch",
    "titleLine1": "Summer Collection",
    "titleLine2": "New Arrivals 2024",
    "status": "active",
    "device": "desktop",
    "isDefault": false,
    "priority": 1,
    "sortOrder": 0,
    "views": 0,
    "clicks": 0,
    "ctr": 0,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### 2. Get All Hero Sliders

**GET** `/hero-sliders`

Retrieves hero sliders with advanced filtering and pagination.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
```javascript
{
  page: 1,                    // Optional: Page number
  limit: 10,                  // Optional: Items per page
  status: "active",           // Optional: active|inactive|draft|scheduled|all
  device: "desktop",          // Optional: desktop|mobile|tablet|all
  category: "fashion",        // Optional: Category filter
  tags: "summer,fashion",     // Optional: Tag filter (comma-separated)
  search: "summer",           // Optional: Search in title, description
  startDate: "2024-01-01",    // Optional: Start date filter
  endDate: "2024-12-31",      // Optional: End date filter
  sortBy: "createdAt",        // Optional: createdAt|title|status|device|priority|views|clicks
  sortOrder: "desc",          // Optional: asc|desc
  whiteLabelId: "64f8a1b2c3d4e5f6a7b8c9d0" // Optional: White label filter
}
```

**Response:**
```json
{
  "meta": {
    "code": 200,
    "message": "Hero sliders retrieved successfully"
  },
  "data": {
    "sliders": [
      {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
        "title": "Summer Collection Launch",
        "titleLine1": "Summer Collection",
        "titleLine2": "New Arrivals 2024",
        "status": "active",
        "device": "desktop",
        "isDefault": true,
        "priority": 1,
        "sortOrder": 1,
        "views": 1250,
        "clicks": 89,
        "ctr": 7.12,
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 48,
      "itemsPerPage": 10
    },
    "analytics": {
      "totalViews": 15420,
      "totalClicks": 1234,
      "avgCTR": 8.01,
      "totalRevenue": 45678.90,
      "activeCount": 15,
      "scheduledCount": 3,
      "draftCount": 8
    }
  }
}
```

### 3. Get Hero Slider by ID

**GET** `/hero-sliders/:id`

Retrieves a specific hero slider by ID.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "meta": {
    "code": 200,
    "message": "Hero slider retrieved successfully"
  },
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "title": "Summer Collection Launch",
    "titleLine1": "Summer Collection",
    "titleLine2": "New Arrivals 2024",
    "subtitle": "Discover the latest trends",
    "description": "Explore our exclusive collection...",
    "offerText": "Up to",
    "offerHighlight": "50% OFF",
    "buttonText": "Shop Now",
    "buttonLink": "/summer-collection",
    "image": "https://s3.amazonaws.com/bucket/hero-sliders/image.jpg",
    "imageUrl": "https://s3.amazonaws.com/bucket/hero-sliders/image.jpg",
    "mobileImage": "https://s3.amazonaws.com/bucket/hero-sliders/mobile-image.jpg",
    "mobileImageUrl": "https://s3.amazonaws.com/bucket/hero-sliders/mobile-image.jpg",
    "videoUrl": "",
    "device": "desktop",
    "displayType": "image",
    "status": "active",
    "isDefault": true,
    "priority": 1,
    "sortOrder": 1,
    "startDate": null,
    "endDate": null,
    "isScheduled": false,
    "backgroundColor": "#ffffff",
    "textColor": "#000000",
    "animation": "fade",
    "animationDuration": 500,
    "autoplayDelay": 3000,
    "isABTest": false,
    "abTestGroup": "A",
    "abTestWeight": 50,
    "views": 1250,
    "clicks": 89,
    "ctr": 7.12,
    "conversionRate": 2.5,
    "revenue": 1250.00,
    "targetAudience": ["fashion", "women", "men"],
    "targetLocation": ["US", "CA", "UK"],
    "targetDevice": ["desktop", "mobile"],
    "targetTime": {
      "start": "00:00",
      "end": "23:59"
    },
    "metaTitle": "Summer Collection 2024",
    "metaDescription": "Discover the latest trends...",
    "keywords": ["summer", "fashion", "trends"],
    "isResponsive": true,
    "isAccessible": true,
    "hasOverlay": false,
    "overlayOpacity": 0.3,
    "translations": {},
    "tags": ["summer", "fashion", "new-arrivals"],
    "category": "fashion",
    "customFields": {
      "season": "summer",
      "year": "2024"
    },
    "version": 1,
    "isPublished": true,
    "publishedAt": "2024-01-15T10:30:00.000Z",
    "createdBy": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "name": "Admin User",
      "email": "admin@example.com"
    },
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### 4. Update Hero Slider

**PUT** `/hero-sliders/:id`

Updates an existing hero slider.

**Headers:**
```
Content-Type: multipart/form-data
Authorization: Bearer <token>
```

**Form Data:** (Same as create, but all fields are optional)

**Response:**
```json
{
  "meta": {
    "code": 200,
    "message": "Hero slider updated successfully"
  },
  "data": {
    // Updated slider data
  }
}
```

### 5. Delete Hero Slider

**DELETE** `/hero-sliders/:id`

Soft deletes a hero slider.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "meta": {
    "code": 200,
    "message": "Hero slider deleted successfully"
  }
}
```

### 6. Toggle Hero Slider Status

**PATCH** `/hero-sliders/:id/status`

Toggles the status between active and inactive.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "meta": {
    "code": 200,
    "message": "Hero slider activated successfully"
  },
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "status": "active"
  }
}
```

### 7. Reorder Hero Sliders

**POST** `/hero-sliders/reorder`

Reorders hero sliders by updating their sort order.

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <token>
```

**Body:**
```json
{
  "sliders": [
    {
      "id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "sortOrder": 1
    },
    {
      "id": "64f8a1b2c3d4e5f6a7b8c9d1",
      "sortOrder": 2
    }
  ]
}
```

**Response:**
```json
{
  "meta": {
    "code": 200,
    "message": "Hero sliders reordered successfully"
  }
}
```

### 8. Duplicate Hero Slider

**POST** `/hero-sliders/:id/duplicate`

Creates a copy of an existing hero slider.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "meta": {
    "code": 200,
    "message": "Hero slider duplicated successfully"
  },
  "data": {
    // Duplicated slider data
  }
}
```

### 9. Get Hero Slider Analytics

**GET** `/hero-sliders/analytics`

Retrieves analytics data for hero sliders.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
```javascript
{
  startDate: "2024-01-01",    // Optional: Start date
  endDate: "2024-12-31",      // Optional: End date
  device: "desktop",          // Optional: Device filter
  category: "fashion",        // Optional: Category filter
  whiteLabelId: "64f8a1b2c3d4e5f6a7b8c9d0" // Optional: White label filter
}
```

**Response:**
```json
{
  "meta": {
    "code": 200,
    "message": "Analytics retrieved successfully"
  },
  "data": {
    "totalSliders": 48,
    "totalViews": 15420,
    "totalClicks": 1234,
    "avgCTR": 8.01,
    "totalRevenue": 45678.90,
    "byStatus": [
      {
        "status": "active",
        "count": 15,
        "views": 12500,
        "clicks": 1000,
        "ctr": 8.0,
        "revenue": 40000.00
      }
    ],
    "byDevice": [
      {
        "device": "desktop",
        "count": 25,
        "views": 10000,
        "clicks": 800,
        "ctr": 8.0,
        "revenue": 30000.00
      }
    ],
    "byCategory": [
      {
        "category": "fashion",
        "count": 20,
        "views": 8000,
        "clicks": 640,
        "ctr": 8.0,
        "revenue": 25000.00
      }
    ]
  }
}
```

### 10. Bulk Operations

**POST** `/hero-sliders/bulk`

Performs bulk operations on multiple hero sliders.

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <token>
```

**Body:**
```json
{
  "ids": ["64f8a1b2c3d4e5f6a7b8c9d0", "64f8a1b2c3d4e5f6a7b8c9d1"],
  "operation": "activate", // activate|deactivate|delete|update
  "data": {                // Required for update operation
    "status": "active",
    "priority": 2
  }
}
```

**Response:**
```json
{
  "meta": {
    "code": 200,
    "message": "Sliders activated successfully"
  }
}
```

## Public Endpoints (No Authentication Required)

### 11. Get Public Hero Sliders

**GET** `/hero-sliders/public`

Retrieves active hero sliders for public display.

**Query Parameters:**
```javascript
{
  device: "desktop",          // Optional: desktop|mobile|tablet|all
  whiteLabelId: "64f8a1b2c3d4e5f6a7b8c9d0" // Optional: White label filter
}
```

**Response:**
```json
{
  "meta": {
    "code": 200,
    "message": "Public hero sliders retrieved successfully"
  },
  "data": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "title": "Summer Collection Launch",
      "titleLine1": "Summer Collection",
      "titleLine2": "New Arrivals 2024",
      "offerText": "Up to",
      "offerHighlight": "50% OFF",
      "buttonText": "Shop Now",
      "buttonLink": "/summer-collection",
      "image": "https://s3.amazonaws.com/bucket/hero-sliders/image.jpg",
      "imageUrl": "https://s3.amazonaws.com/bucket/hero-sliders/image.jpg",
      "mobileImage": "https://s3.amazonaws.com/bucket/hero-sliders/mobile-image.jpg",
      "mobileImageUrl": "https://s3.amazonaws.com/bucket/hero-sliders/mobile-image.jpg",
      "device": "desktop",
      "backgroundColor": "#ffffff",
      "textColor": "#000000",
      "animation": "fade",
      "autoplayDelay": 3000,
      "isDefault": true,
      "sortOrder": 1
    }
  ]
}
```

### 12. Increment Views

**POST** `/hero-sliders/:id/views`

Increments the view count for a hero slider.

**Response:**
```json
{
  "meta": {
    "code": 200,
    "message": "Views incremented successfully"
  }
}
```

### 13. Increment Clicks

**POST** `/hero-sliders/:id/clicks`

Increments the click count for a hero slider.

**Response:**
```json
{
  "meta": {
    "code": 200,
    "message": "Clicks incremented successfully"
  }
}
```

## Error Responses

### 400 Bad Request
```json
{
  "meta": {
    "code": 400,
    "message": "Validation error message"
  }
}
```

### 401 Unauthorized
```json
{
  "meta": {
    "code": 401,
    "message": "Authentication required"
  }
}
```

### 404 Not Found
```json
{
  "meta": {
    "code": 404,
    "message": "Hero slider not found"
  }
}
```

### 500 Internal Server Error
```json
{
  "meta": {
    "code": 500,
    "message": "Internal server error"
  }
}
```

## Advanced Features

### Scheduling
Hero sliders can be scheduled to automatically activate/deactivate based on start and end dates.

### A/B Testing
Support for A/B testing with different groups and weights for performance optimization.

### Analytics
Comprehensive analytics including views, clicks, CTR, conversion rates, and revenue tracking.

### Targeting
Advanced targeting options including audience, location, device, and time-based targeting.

### Multi-language Support
Built-in support for translations and multi-language content.

### SEO Optimization
Meta titles, descriptions, and keywords for better search engine optimization.

### Custom Fields
Flexible custom fields for storing additional data specific to your business needs.

## Usage Examples

### Creating a Scheduled Slider
```javascript
const formData = new FormData();
formData.append('title', 'Holiday Sale');
formData.append('titleLine1', 'Holiday Season');
formData.append('titleLine2', 'Special Offers');
formData.append('startDate', '2024-12-01');
formData.append('endDate', '2024-12-31');
formData.append('isScheduled', 'true');
formData.append('status', 'scheduled');
formData.append('image', imageFile);

fetch('/admin/hero-sliders', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + token
  },
  body: formData
});
```

### Getting Analytics
```javascript
fetch('/admin/hero-sliders/analytics?startDate=2024-01-01&endDate=2024-12-31', {
  headers: {
    'Authorization': 'Bearer ' + token
  }
});
```

### Bulk Activation
```javascript
fetch('/admin/hero-sliders/bulk', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    ids: ['id1', 'id2', 'id3'],
    operation: 'activate'
  })
});
``` 