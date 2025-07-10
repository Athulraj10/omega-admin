const mongoose = require("mongoose");

const currencySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxLength: 100,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      maxLength: 10,
      trim: true,
      uppercase: true,
      unique: true,
    },
    symbol: {
      type: String,
      required: true,
      maxLength: 10,
      trim: true,
    },
    exchangeRate: {
      type: Number,
      required: true,
      min: 0,
      default: 1.0,
    },
    decimalPlaces: {
      type: Number,
      required: true,
      min: 0,
      max: 4,
      default: 2,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Ensure only one default currency
currencySchema.pre('save', async function(next) {
  if (this.isDefault) {
    await this.constructor.updateMany(
      { _id: { $ne: this._id } },
      { isDefault: false }
    );
  }
  next();
});

module.exports = mongoose.model("Currency", currencySchema);
