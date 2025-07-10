const express = require("express");
const router = express.Router();
const currencyController = require("../../controllers/admin/currencyController");
const adminMiddleware = require("../../middlewares/admin");

// Apply admin middleware to all routes
router.use(adminMiddleware);

// Get all currencies
router.get("/", currencyController.getCurrencies);

// Create new currency
router.post("/", currencyController.createCurrency);

// Update currency
router.put("/:id", currencyController.updateCurrency);

// Delete currency
router.delete("/:id", currencyController.deleteCurrency);

// Set default currency
router.patch("/:id/default", currencyController.setDefaultCurrency);

// Update currency status
router.patch("/:id/status", currencyController.updateCurrencyStatus);

module.exports = router; 