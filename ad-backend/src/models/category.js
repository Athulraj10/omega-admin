const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true, 
        unique: true, 
        index: true,
        trim: true,
        maxLength: 100
    },
    description: { 
        type: String,
        trim: true,
        maxLength: 500
    },
    icon: { 
        type: String,
        default: 'grid',
        trim: true
    },
    parentCategory: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Category',
        default: null
    },
    isMainCategory: {
        type: Boolean,
        default: false
    },
    sortOrder: {
        type: Number,
        default: 0
    },
    status: { 
        type: String, 
        enum: ['1', '0'], 
        default: '1' 
    },
    image: {
        type: String,
        trim: true
    },
    metaTitle: {
        type: String,
        trim: true,
        maxLength: 60
    },
    metaDescription: {
        type: String,
        trim: true,
        maxLength: 160
    },
    slug: {
        type: String,
        unique: true,
        trim: true,
        lowercase: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin'
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin'
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for subcategories
CategorySchema.virtual('subcategories', {
    ref: 'Category',
    localField: '_id',
    foreignField: 'parentCategory'
});

// Virtual for products count
CategorySchema.virtual('productsCount', {
    ref: 'Product',
    localField: '_id',
    foreignField: 'category',
    count: true
});

// Indexes for better performance
CategorySchema.index({ parentCategory: 1, status: 1, sortOrder: 1 });
CategorySchema.index({ isMainCategory: 1, status: 1 });
CategorySchema.index({ slug: 1 });

// Pre-save middleware to generate slug
CategorySchema.pre('save', function(next) {
    if (this.isModified('name')) {
        this.slug = this.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }
    next();
});

module.exports = mongoose.model('Category', CategorySchema);
