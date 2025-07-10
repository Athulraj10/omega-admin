const Currency = require("../../models/currency");
const Response = require("../../services/Response");

const SUCCESS = 200;
const FAIL = 400;
const INTERNAL_SERVER = 500;

const getCurrencies = async (req, res) => {
  try {
    console.log('🔄 Fetching currencies...');
    
    const currencies = await Currency.find().sort({ isDefault: -1, createdAt: -1 });
    
    console.log('💰 Fetched currencies:', currencies.length);
    
    return Response.successResponseData(res, currencies, SUCCESS, "Currencies fetched successfully");
  } catch (err) {
    console.error('❌ Error fetching currencies:', err);
    return Response.errorResponseData(res, err.message, INTERNAL_SERVER);
  }
};

const createCurrency = async (req, res) => {
  try {
    const { name, code, symbol, exchangeRate, decimalPlaces, isActive } = req.body;

    console.log('📝 Creating currency:', { name, code, symbol, exchangeRate, decimalPlaces, isActive });

    // Validate required fields
    if (!name || !code || !symbol || !exchangeRate) {
      return Response.errorResponseWithoutData(res, "Missing required fields", FAIL);
    }

    // Check if currency code already exists
    const existingCurrency = await Currency.findOne({ code: code.toUpperCase() });
    if (existingCurrency) {
      return Response.errorResponseWithoutData(res, `Currency with code "${code.toUpperCase()}" already exists`, FAIL);
    }

    // If this is the first currency, make it default
    const currencyCount = await Currency.countDocuments();
    const isDefault = currencyCount === 0;

    const currency = new Currency({
      name: name.trim(),
      code: code.toUpperCase().trim(),
      symbol: symbol.trim(),
      exchangeRate: parseFloat(exchangeRate),
      decimalPlaces: parseInt(decimalPlaces) || 2,
      isActive: isActive !== undefined ? isActive : true,
      isDefault,
    });

    await currency.save();
    
    console.log('✅ Currency created:', currency._id);
    
    return Response.successResponseData(res, currency, SUCCESS, "Currency created successfully");
  } catch (err) {
    console.error('❌ Error creating currency:', err);
    
    // Handle duplicate key errors
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      const value = err.keyValue[field];
      return Response.errorResponseWithoutData(res, `Currency with ${field} "${value}" already exists`, FAIL);
    }
    
    // Handle validation errors
    if (err.name === 'ValidationError') {
      const validationErrors = Object.values(err.errors).map(error => error.message);
      return Response.errorResponseWithoutData(res, `Validation error: ${validationErrors.join(', ')}`, FAIL);
    }
    
    return Response.errorResponseData(res, err.message, INTERNAL_SERVER);
  }
};

const updateCurrency = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, code, symbol, exchangeRate, decimalPlaces, isActive } = req.body;

    console.log('📝 Updating currency:', id, { name, code, symbol, exchangeRate, decimalPlaces, isActive });

    // Validate required fields
    if (!name || !code || !symbol || !exchangeRate) {
      return Response.errorResponseWithoutData(res, "Missing required fields", FAIL);
    }

    // Check if currency exists
    const existingCurrency = await Currency.findById(id);
    if (!existingCurrency) {
      return Response.errorResponseWithoutData(res, "Currency not found", FAIL);
    }

    // Check if code already exists for another currency
    const duplicateCode = await Currency.findOne({ 
      code: code.toUpperCase(), 
      _id: { $ne: id } 
    });
    if (duplicateCode) {
      return Response.errorResponseWithoutData(res, `Currency with code "${code.toUpperCase()}" already exists`, FAIL);
    }

    const updateData = {
      name: name.trim(),
      code: code.toUpperCase().trim(),
      symbol: symbol.trim(),
      exchangeRate: parseFloat(exchangeRate),
      decimalPlaces: parseInt(decimalPlaces) || 2,
      isActive: isActive !== undefined ? isActive : existingCurrency.isActive,
    };

    const currency = await Currency.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    console.log('✅ Currency updated:', currency._id);
    
    return Response.successResponseData(res, currency, SUCCESS, "Currency updated successfully");
  } catch (err) {
    console.error('❌ Error updating currency:', err);
    
    // Handle duplicate key errors
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      const value = err.keyValue[field];
      return Response.errorResponseWithoutData(res, `Currency with ${field} "${value}" already exists`, FAIL);
    }
    
    // Handle validation errors
    if (err.name === 'ValidationError') {
      const validationErrors = Object.values(err.errors).map(error => error.message);
      return Response.errorResponseWithoutData(res, `Validation error: ${validationErrors.join(', ')}`, FAIL);
    }
    
    return Response.errorResponseData(res, err.message, INTERNAL_SERVER);
  }
};

const deleteCurrency = async (req, res) => {
  try {
    const { id } = req.params;

    console.log('🗑️ Deleting currency:', id);

    const currency = await Currency.findById(id);
    if (!currency) {
      return Response.errorResponseWithoutData(res, "Currency not found", FAIL);
    }

    // Prevent deletion of default currency
    if (currency.isDefault) {
      return Response.errorResponseWithoutData(res, "Cannot delete default currency", FAIL);
    }

    await Currency.findByIdAndDelete(id);
    
    console.log('✅ Currency deleted:', id);
    
    return Response.successResponseWithoutData(res, "Currency deleted successfully", SUCCESS);
  } catch (err) {
    console.error('❌ Error deleting currency:', err);
    return Response.errorResponseData(res, err.message, INTERNAL_SERVER);
  }
};

const setDefaultCurrency = async (req, res) => {
  try {
    const { id } = req.params;

    console.log('⭐ Setting default currency:', id);

    // Check if currency exists
    const currency = await Currency.findById(id);
    if (!currency) {
      return Response.errorResponseWithoutData(res, "Currency not found", FAIL);
    }

    // Check if currency is active
    if (!currency.isActive) {
      return Response.errorResponseWithoutData(res, "Cannot set inactive currency as default", FAIL);
    }

    // Remove default from all currencies
    await Currency.updateMany({}, { isDefault: false });

    // Set the selected currency as default
    currency.isDefault = true;
    await currency.save();
    
    console.log('✅ Default currency set:', id);
    
    return Response.successResponseData(res, currency, SUCCESS, "Default currency updated successfully");
  } catch (err) {
    console.error('❌ Error setting default currency:', err);
    return Response.errorResponseData(res, err.message, INTERNAL_SERVER);
  }
};

const updateCurrencyStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    console.log('🔄 Updating currency status:', id, { isActive });

    const currency = await Currency.findById(id);
    if (!currency) {
      return Response.errorResponseWithoutData(res, "Currency not found", FAIL);
    }

    // Prevent deactivating default currency
    if (currency.isDefault && !isActive) {
      return Response.errorResponseWithoutData(res, "Cannot deactivate default currency", FAIL);
    }

    currency.isActive = isActive;
    await currency.save();
    
    console.log('✅ Currency status updated:', id, isActive);
    
    return Response.successResponseData(res, currency, SUCCESS, "Currency status updated successfully");
  } catch (err) {
    console.error('❌ Error updating currency status:', err);
    return Response.errorResponseData(res, err.message, INTERNAL_SERVER);
  }
};

module.exports = {
  getCurrencies,
  createCurrency,
  updateCurrency,
  deleteCurrency,
  setDefaultCurrency,
  updateCurrencyStatus,
}; 