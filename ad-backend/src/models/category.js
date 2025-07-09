const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true, index: true },
    description: { type: String },
    status: { type: String, enum: ['1', '0'], default: '1' },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Category', CategorySchema);
