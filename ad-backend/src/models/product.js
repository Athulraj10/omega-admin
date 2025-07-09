const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true, index: true },
    description: { type: String },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
    price: { type: Number, required: true },
    discountPrice: { type: Number },
    images: [{ type: String }],
    stock: { type: Number, default: 0 },
    sku: { type: String, unique: true },
    status: { type: String, enum: ['1', '0'], default: '1' },
    ratingsAverage: { type: Number, default: 0 },
    ratingsCount: { type: Number, default: 0 },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
}, {
    timestamps: true,
});

ProductSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Product', ProductSchema);
