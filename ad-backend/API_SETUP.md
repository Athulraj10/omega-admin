# Backend API Setup Guide

## Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn

## Environment Variables
Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
NODE_ENV=development
PORT=8001

# MongoDB Configuration
MONGO_CONNECTION_STRING=mongodb://localhost:27017/omega-admin

# AWS S3 Configuration (for file uploads)
AMZ_ACCESS_KEY=your_aws_access_key
AMZ_SECRET_ACCESS_KEY=your_aws_secret_key
AMZ_REGION=us-east-1
AMZ_BUCKET=your_s3_bucket_name
AMZ_BUCKET_URL=https://your_s3_bucket_name.s3.amazonaws.com

# JWT Secret (for token generation)
JWT_SECRET=your_jwt_secret_key
```

## Installation
```bash
# Install dependencies
npm install

# Start the server
npm run dev
```

## API Endpoints

### Health Check
- **GET** `/admin/health` - Check if API is running

### User Management
- **GET** `/admin/users` - Get all users (requires auth)
- **GET** `/admin/users/:id` - Get user details (requires auth)
- **GET** `/admin/users/:id/orders` - Get user orders (requires auth)
- **GET** `/admin/users/:id/reports` - Get user reports (requires auth)
- **PATCH** `/admin/users/:id/status` - Update user status (requires auth)
- **DELETE** `/admin/users/:id` - Delete user (requires auth)

### Test Endpoints (No Auth Required)
- **GET** `/admin/test-users` - Get all users (for testing)

## Testing the API
```bash
# Run the test script
node test-api.js
```

## Authentication
Most endpoints require admin authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Database Setup
Make sure MongoDB is running and accessible. The API will automatically create collections when needed.

## Troubleshooting
1. Check if MongoDB is running
2. Verify environment variables are set correctly
3. Check server logs for any errors
4. Ensure all dependencies are installed 