# Dynamic Currency System

## Overview

The application now supports dynamic currency management with real-time currency switching and formatting. Users can add, edit, and manage multiple currencies with different exchange rates and symbols.

## Features

### 🔧 Currency Management
- **Add Currencies**: Create new currencies with custom symbols, codes, and exchange rates
- **Edit Currencies**: Modify existing currency details including exchange rates
- **Delete Currencies**: Remove currencies (with protection for default currency)
- **Set Default**: Designate one currency as the system default
- **Status Management**: Activate/deactivate currencies
- **Decimal Places**: Configure currency precision (0, 2, or 3 decimal places)

### 💱 Dynamic Display
- **Real-time Switching**: Change currency display throughout the app instantly
- **Automatic Formatting**: Prices display with correct symbols and decimal places
- **Exchange Rate Conversion**: Automatic conversion between currencies
- **Symbol Positioning**: Support for different currency symbol positions (e.g., $100 vs 100¥)

### 🎯 User Experience
- **Currency Selector**: Easy currency switching in header and pages
- **Consistent Display**: All price displays use the selected currency
- **Fallback Support**: Graceful handling when API is unavailable

## Implementation Details

### Backend Components

#### Currency Model (`ad-backend/src/models/currency.js`)
```javascript
{
  name: String,           // Currency name (e.g., "US Dollar")
  code: String,           // Currency code (e.g., "USD")
  symbol: String,         // Currency symbol (e.g., "$")
  exchangeRate: Number,   // Exchange rate relative to base
  decimalPlaces: Number,  // Decimal precision (0, 2, 3)
  isActive: Boolean,      // Whether currency is active
  isDefault: Boolean      // Whether this is the default currency
}
```

#### Currency Controller (`ad-backend/src/controllers/admin/currencyController.js`)
- `getCurrencies()` - Fetch all currencies
- `createCurrency()` - Add new currency
- `updateCurrency()` - Edit existing currency
- `deleteCurrency()` - Remove currency
- `setDefaultCurrency()` - Set default currency
- `updateCurrencyStatus()` - Toggle currency status

#### API Routes (`ad-backend/src/routes/admin/admin.js`)
- `GET /admin/currencies` - Get all currencies
- `POST /admin/currencies` - Create currency
- `PUT /admin/currencies/:id` - Update currency
- `DELETE /admin/currencies/:id` - Delete currency
- `PATCH /admin/currencies/:id/default` - Set default
- `PATCH /admin/currencies/:id/status` - Update status

### Frontend Components

#### Currency Context (`ad-front/src/contexts/CurrencyContext.tsx`)
- Manages currency state globally
- Provides currency formatting functions
- Handles API communication
- Includes fallback currencies

#### Currency Selector (`ad-front/src/components/CurrencySelector.tsx`)
- Dropdown for currency selection
- Shows current currency with symbol
- Lists all active currencies
- Responsive design

#### Updated Pages
- **Product List**: Dynamic price display with currency selector
- **User List**: Dynamic total spent display
- **Currency Settings**: Full CRUD management interface

## Usage Examples

### Formatting Prices
```typescript
import { useCurrency } from '@/contexts/CurrencyContext';

const { formatPrice } = useCurrency();

// Display price in current currency
const price = formatPrice(99.99); // "$99.99" or "€85.99" etc.
```

### Currency Conversion
```typescript
import { useCurrency } from '@/contexts/CurrencyContext';

const { convertPrice } = useCurrency();

// Convert between currencies
const convertedAmount = convertPrice(100, usdCurrency, eurCurrency);
```

### Currency Selection
```typescript
import CurrencySelector from '@/components/CurrencySelector';

// In your component
<CurrencySelector showLabel={true} />
```

## API Response Format

### Get Currencies
```json
{
  "meta": {
    "code": 200,
    "message": "Currencies fetched successfully"
  },
  "data": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "name": "US Dollar",
      "code": "USD",
      "symbol": "$",
      "exchangeRate": 1.0,
      "decimalPlaces": 2,
      "isActive": true,
      "isDefault": true,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

## Testing

Run the currency API test:
```bash
node test-currency.js
```

This will test all currency endpoints and verify the system works correctly.

## Configuration

### Default Currencies
The system includes fallback currencies if the API is unavailable:
- USD (US Dollar) - $1.00
- EUR (Euro) - €0.85
- GBP (British Pound) - £0.73

### Exchange Rates
Exchange rates are relative to USD as the base currency. Update rates regularly for accurate conversions.

### Decimal Places
- 0: JPY, KRW (no decimals)
- 2: USD, EUR, GBP (standard)
- 3: BHD, KWD (special cases)

## Security Considerations

- Only authenticated admins can manage currencies
- Default currency cannot be deleted
- Default currency cannot be deactivated
- Currency codes must be unique
- Exchange rates must be positive numbers

## Future Enhancements

- Real-time exchange rate updates via external API
- Currency conversion history
- Multi-currency product pricing
- Currency-specific tax rates
- Regional currency detection
- Currency formatting based on locale 