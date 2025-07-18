# Omega Admin Backend - NestJS

This is a complete NestJS conversion of the Omega Admin backend, providing a modern, scalable, and maintainable API structure.

## 🚀 Features

- **NestJS Framework**: Modern Node.js framework with TypeScript support
- **MongoDB Integration**: Using Mongoose for database operations
- **JWT Authentication**: Secure authentication with JWT tokens
- **File Upload**: Local file storage in development, S3 in production
- **API Documentation**: Swagger/OpenAPI documentation
- **Validation**: Class-validator for request validation
- **Rate Limiting**: Built-in rate limiting protection
- **Logging**: Winston logger integration
- **CORS**: Cross-origin resource sharing support
- **Security**: Helmet for security headers

## 📁 Project Structure

```
src/
├── common/                    # Shared services and utilities
│   ├── guards/               # Authentication guards
│   ├── services/             # Common services (S3, Logger, etc.)
│   └── strategies/           # Passport strategies
├── modules/                  # Feature modules
│   ├── auth/                 # Authentication module
│   ├── banners/              # Banner management
│   ├── categories/           # Category management
│   ├── currencies/           # Currency management
│   ├── notifications/        # Notification system
│   ├── orders/               # Order management
│   ├── products/             # Product management
│   ├── uploads/              # File upload handling
│   └── users/                # User management
├── app.module.ts             # Root application module
└── main.ts                   # Application entry point
```

## 🛠️ Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Environment Setup**:
   Create a `.env` file in the root directory:
   ```env
   NODE_ENV=development
   PORT=8001
   MONGO_CONNECTION_STRING=mongodb://localhost:27017/omega-admin
   JWT_SECRET=your-jwt-secret-key-change-in-production
   JWT_EXPIRES_IN=6h
   ```

   **Optional AWS S3 (for production)**:
   ```env
   AMZ_ACCESS_KEY=your-aws-access-key
   AMZ_SECRET_ACCESS_KEY=your-aws-secret-key
   AMZ_REGION=us-east-1
   AMZ_BUCKET=your-s3-bucket-name
   AMZ_BUCKET_URL=https://your-bucket.s3.amazonaws.com
   ```

3. **Database Setup**:
   Ensure MongoDB is running locally or update the connection string.

## 🚀 Running the Application

### Development
```bash
npm run start:dev
```

### Production
```bash
npm run build
npm run start:prod
```

### Database Seeding
```bash
npm run seed
```

## 📚 API Documentation

Once the application is running, visit:
- **Swagger UI**: `http://localhost:8001/api`
- **API Base URL**: `http://localhost:8001/admin`
- **Uploads Directory**: `http://localhost:8001/uploads/`

## 🔐 Authentication

The API uses JWT-based authentication. To access protected endpoints:

1. **Login** to get a token:
   ```bash
   POST /admin/auth/login
   {
     "email": "admin@gmail.com",
     "password": "admin@123"
   }
   ```

2. **Use the token** in subsequent requests:
   ```bash
   Authorization: Bearer <your-jwt-token>
   ```

## 🎯 Banner Management API

### Endpoints

- `GET /admin/banners` - Get all banners
- `POST /admin/banners` - Create a new banner
- `GET /admin/banners/:id` - Get banner by ID
- `PATCH /admin/banners/:id` - Update banner
- `DELETE /admin/banners/:id` - Delete banner
- `PATCH /admin/banners/:id/status` - Toggle banner status
- `PATCH /admin/banners/:id/default` - Set as default banner
- `GET /admin/banners/default/:device` - Get default banner for device

### Banner Schema

```typescript
{
  titleLine1: string;        // Required
  titleLine2?: string;       // Optional
  offerText?: string;        // Optional
  offerHighlight?: string;   // Optional
  buttonText?: string;       // Optional
  device: 'mobile' | 'desktop' | 'tablet';  // Required
  isDefault: boolean;        // Default: false
  status: boolean;           // Default: true
  image: string;             // Required (base64 or file)
  imageUrl?: string;         // Local URL in dev, S3 URL in prod
  sortOrder?: number;        // Optional
  startDate?: Date;          // Optional
  endDate?: Date;            // Optional
}
```

## 🔧 Key Features

### 1. **Banner Management**
- Full CRUD operations for banners
- Device-specific banners (mobile, desktop, tablet)
- Default banner per device
- Status toggle functionality
- Image upload (local in dev, S3 in prod)

### 2. **Authentication & Authorization**
- JWT-based authentication
- Role-based access control
- Secure password hashing with bcrypt

### 3. **File Upload**
- **Development**: Local file storage in `uploads/` directory
- **Production**: S3 integration for image storage
- Base64 image support
- Automatic file naming and organization

### 4. **Validation**
- Request validation using class-validator
- Custom validation pipes
- Error handling and response formatting

### 5. **Security**
- CORS configuration
- Rate limiting
- Security headers with Helmet
- Input sanitization

## 🧪 Testing

```bash
# Unit tests
npm run test

# e2e tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📝 Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NODE_ENV` | Environment mode | `development` | ✅ |
| `PORT` | Server port | `8001` | ✅ |
| `MONGO_CONNECTION_STRING` | MongoDB connection string | - | ✅ |
| `JWT_SECRET` | JWT signing secret | `dev-jwt-secret-key` | ❌ |
| `JWT_EXPIRES_IN` | JWT token expiration | `6h` | ❌ |
| `AMZ_ACCESS_KEY` | AWS access key | - | ❌ |
| `AMZ_SECRET_ACCESS_KEY` | AWS secret key | - | ❌ |
| `AMZ_REGION` | AWS region | - | ❌ |
| `AMZ_BUCKET` | S3 bucket name | - | ❌ |
| `THROTTLE_TTL` | Rate limit time window | `60` | ❌ |
| `THROTTLE_LIMIT` | Rate limit requests per window | `100` | ❌ |

## 🔄 Migration from Express.js

This NestJS version provides several improvements over the original Express.js backend:

1. **Better Structure**: Modular architecture with clear separation of concerns
2. **Type Safety**: Full TypeScript support with compile-time error checking
3. **Dependency Injection**: Built-in DI container for better testability
4. **Validation**: Automatic request validation with class-validator
5. **Documentation**: Auto-generated API documentation with Swagger
6. **Testing**: Better testing utilities and structure
7. **Performance**: Optimized for better performance and scalability
8. **File Storage**: Flexible storage (local in dev, S3 in prod)

## 🚀 Quick Start (No AWS Required)

1. **Clone and install**:
   ```bash
   cd ad-backend-nestjs
   npm install
   ```

2. **Create minimal .env**:
   ```env
   NODE_ENV=development
   PORT=8001
   MONGO_CONNECTION_STRING=mongodb://localhost:27017/omega-admin
   ```

3. **Start the application**:
   ```bash
   npm run start:dev
   ```

4. **Seed the database**:
   ```bash
   npm run seed
   ```

5. **Access the API**:
   - API: `http://localhost:8001/admin`
   - Docs: `http://localhost:8001/api`
   - Uploads: `http://localhost:8001/uploads/`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License. 