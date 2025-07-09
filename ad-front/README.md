# Omega Admin Dashboard

A modern, responsive admin dashboard built with Next.js, TypeScript, Tailwind CSS, and Redux Toolkit.

## Features

### Authentication System
- **Login/Logout**: Complete authentication flow with JWT tokens
- **Protected Routes**: PrivateRoute component for dashboard protection
- **Public Routes**: Redirect authenticated users away from sign-in page
- **Redux Integration**: Centralized state management for auth
- **Form Validation**: Comprehensive input validation and error handling

### Products Management
- **Add Products**: Form with image upload, category selection, and pricing
- **List Products**: Searchable and filterable product table
- **Categories**: Category management with CRUD operations
- **Product Details**: Modal view for product information

### User Management
- **User List**: Comprehensive user management with search and filtering
- **User Status**: Block/unblock functionality
- **Order Integration**: View orders related to each user
- **User Details**: Modal view for user information

### Order Management
- **Order List**: Complete order tracking with status management
- **Order Statistics**: Overview cards with key metrics
- **Payment Tracking**: Payment status and method tracking
- **Order Details**: Detailed order view with items and history

### Currency Management
- **Add Currency**: Add new currencies with exchange rates and symbols
- **Edit Currency**: Modify existing currency details
- **Delete Currency**: Remove currencies (with protection for default)
- **Set Default**: Designate primary currency for the system
- **Status Management**: Activate/deactivate currencies
- **Search & Filter**: Find currencies by name, code, or status
- **Decimal Places**: Configure currency precision (0, 2, or 3 decimal places)

## Project Structure

```
ad-front/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   └── sign-in/
│   │   ├── (dashboard)/
│   │   │   ├── dashboard/
│   │   │   ├── products/
│   │   │   ├── users/
│   │   │   └── settings/
│   │   │       └── currencies/
│   │   └── layout.tsx
│   ├── components/
│   │   ├── (Auth)/
│   │   ├── Layouts/
│   │   ├── redux/
│   │   └── ui/
│   ├── services/
│   └── utils/
└── package.json
```

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Build for Production**
   ```bash
   npm run build
   ```

## Authentication Flow

1. **Login**: User enters credentials → Redux action dispatched → API call → Token stored → Redirect to dashboard
2. **Logout**: User clicks logout → Token cleared → Redirect to sign-in
3. **Route Protection**: PrivateRoute checks token → Redirect to sign-in if not authenticated
4. **Public Routes**: Authenticated users redirected away from sign-in page

## Currency Management Features

### Add Currency
- Currency name (e.g., "US Dollar")
- Currency code (e.g., "USD")
- Currency symbol (e.g., "$")
- Exchange rate (relative to base currency)
- Decimal places (0, 2, or 3)
- Active status toggle

### Edit Currency
- Modify all currency properties
- Update exchange rates
- Change decimal precision
- Toggle active status

### Default Currency
- Only one currency can be default
- Default currency cannot be deleted
- Exchange rates calculated relative to default

### Status Management
- Active currencies available for transactions
- Inactive currencies hidden from users
- Quick status toggle in table

### Search & Filter
- Search by currency name or code
- Filter by active/inactive status
- Real-time filtering and search

## API Integration Ready

The application is structured to easily integrate with backend APIs:

- **Redux Actions**: Centralized API calls
- **TypeScript Interfaces**: Type-safe data handling
- **Error Handling**: Comprehensive error states
- **Loading States**: User feedback during operations

## Technologies Used

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **State Management**: Redux Toolkit, Redux Saga
- **UI Components**: Custom components with Tailwind
- **Icons**: Custom SVG icons
- **Forms**: Controlled components with validation
- **Routing**: Next.js App Router with middleware

## Contributing

1. Follow TypeScript best practices
2. Use Tailwind CSS for styling
3. Implement proper error handling
4. Add loading states for better UX
5. Test all CRUD operations
6. Ensure responsive design
