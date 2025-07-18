const mongoose = require("mongoose");

const heroSliderSchema = new mongoose.Schema(
  {
    // Basic Information
    title: {
      type: String,
      required: true,
      maxLength: 100,
      trim: true,
    },
    titleLine1: {
      type: String,
      maxLength: 100,
      default: "",
      trim: true,
    },
    titleLine2: {
      type: String,
      maxLength: 100,
      default: "",
      trim: true,
    },
    subtitle: {
      type: String,
      maxLength: 200,
      default: "",
      trim: true,
    },
    
    // Content
    description: {
      type: String,
      maxLength: 500,
      default: "",
      trim: true,
    },
    offerText: {
      type: String,
      maxLength: 200,
      default: "",
      trim: true,
    },
    offerHighlight: {
      type: String,
      maxLength: 50,
      default: "",
      trim: true,
    },
    buttonText: {
      type: String,
      maxLength: 50,
      default: "Shop now",
      trim: true,
    },
    buttonLink: {
      type: String,
      maxLength: 255,
      default: "/",
      trim: true,
    },
    
    // Media
    image: {
      type: String,
      required: true,
      maxLength: 255,
    },
    imageUrl: {
      type: String,
      maxLength: 255,
    },
    mobileImage: {
      type: String,
      maxLength: 255,
    },
    mobileImageUrl: {
      type: String,
      maxLength: 255,
    },
    videoUrl: {
      type: String,
      maxLength: 255,
    },
    
    // Device & Display
    device: {
      type: String,
      enum: ["desktop", "mobile", "tablet", "all"],
      default: "desktop",
    },
    displayType: {
      type: String,
      enum: ["image", "video", "mixed"],
      default: "image",
    },
    
    // Status & Priority
    status: {
      type: String,
      enum: ["active", "inactive", "draft", "scheduled"],
      default: "active",
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: Number,
      default: 1,
      min: 1,
      max: 10,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
    
    // Scheduling
    startDate: {
      type: Date,
      default: null,
    },
    endDate: {
      type: Date,
      default: null,
    },
    isScheduled: {
      type: Boolean,
      default: false,
    },
    
    // Styling & Animation
    backgroundColor: {
      type: String,
      maxLength: 7,
      default: "#ffffff",
      validate: {
        validator: function(v) {
          return /^#[0-9A-F]{6}$/i.test(v);
        },
        message: 'Background color must be a valid hex color'
      }
    },
    textColor: {
      type: String,
      maxLength: 7,
      default: "#000000",
      validate: {
        validator: function(v) {
          return /^#[0-9A-F]{6}$/i.test(v);
        },
        message: 'Text color must be a valid hex color'
      }
    },
    animation: {
      type: String,
      enum: ["fade", "slide", "zoom", "flip", "bounce", "none"],
      default: "fade",
    },
    animationDuration: {
      type: Number,
      default: 500,
      min: 100,
      max: 3000,
    },
    autoplayDelay: {
      type: Number,
      default: 3000,
      min: 1000,
      max: 10000,
    },
    
    // A/B Testing
    isABTest: {
      type: Boolean,
      default: false,
    },
    abTestGroup: {
      type: String,
      enum: ["A", "B", "control"],
      default: "A",
    },
    abTestWeight: {
      type: Number,
      default: 50,
      min: 0,
      max: 100,
    },
    
    // Analytics & Performance
    views: {
      type: Number,
      default: 0,
    },
    clicks: {
      type: Number,
      default: 0,
    },
    ctr: {
      type: Number,
      default: 0,
    },
    conversionRate: {
      type: Number,
      default: 0,
    },
    revenue: {
      type: Number,
      default: 0,
    },
    
    // Targeting & Personalization
    targetAudience: {
      type: [String],
      default: [],
    },
    targetLocation: {
      type: [String],
      default: [],
    },
    targetDevice: {
      type: [String],
      default: [],
    },
    targetTime: {
      start: {
        type: String,
        default: "00:00",
      },
      end: {
        type: String,
        default: "23:59",
      },
    },
    
    // SEO & Meta
    metaTitle: {
      type: String,
      maxLength: 60,
      default: "",
    },
    metaDescription: {
      type: String,
      maxLength: 160,
      default: "",
    },
    keywords: {
      type: [String],
      default: [],
    },
    
    // Advanced Features
    isResponsive: {
      type: Boolean,
      default: true,
    },
    isAccessible: {
      type: Boolean,
      default: true,
    },
    hasOverlay: {
      type: Boolean,
      default: false,
    },
    overlayOpacity: {
      type: Number,
      default: 0.3,
      min: 0,
      max: 1,
    },
    
    // Multi-language Support
    translations: {
      type: Map,
      of: {
        titleLine1: String,
        titleLine2: String,
        subtitle: String,
        description: String,
        offerText: String,
        offerHighlight: String,
        buttonText: String,
        metaTitle: String,
        metaDescription: String,
      },
      default: {},
    },
    
    // Version Control
    version: {
      type: Number,
      default: 1,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    publishedAt: {
      type: Date,
      default: null,
    },
    
    // Audit Fields
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
    approvedAt: {
      type: Date,
      default: null,
    },
    
    // White Label Support
    whiteLabelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WhiteLabel",
    },
    
    // Tags & Categories
    tags: {
      type: [String],
      default: [],
    },
    category: {
      type: String,
      maxLength: 50,
      default: "general",
    },
    
    // Custom Fields
    customFields: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      default: {},
    },
    
    // Soft Delete
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
  },
  { 
    timestamps: { 
      createdAt: "createdAt", 
      updatedAt: "updatedAt" 
    },
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes for better performance
heroSliderSchema.index({ status: 1, device: 1, isDefault: 1 });
heroSliderSchema.index({ startDate: 1, endDate: 1 });
heroSliderSchema.index({ isScheduled: 1, status: 1 });
heroSliderSchema.index({ sortOrder: 1, priority: 1 });
heroSliderSchema.index({ tags: 1 });
heroSliderSchema.index({ category: 1 });
heroSliderSchema.index({ isDeleted: 1 });
heroSliderSchema.index({ whiteLabelId: 1 });

// Virtual for calculating CTR
heroSliderSchema.virtual('calculatedCTR').get(function() {
  if (this.views === 0) return 0;
  return ((this.clicks / this.views) * 100).toFixed(2);
});

// Virtual for checking if slider is currently active
heroSliderSchema.virtual('isCurrentlyActive').get(function() {
  if (this.status !== 'active' && this.status !== 'scheduled') return false;
  if (this.isDeleted) return false;
  
  const now = new Date();
  
  if (this.isScheduled && this.startDate && this.endDate) {
    return now >= this.startDate && now <= this.endDate;
  }
  
  return true;
});

// Pre-save middleware
heroSliderSchema.pre('save', async function(next) {
  // Ensure only one default slider per device
  if (this.isDefault) {
    await this.constructor.updateMany(
      { 
        _id: { $ne: this._id },
        device: this.device,
        whiteLabelId: this.whiteLabelId,
        isDeleted: false
      },
      { isDefault: false }
    );
  }
  
  // Update publishedAt when status changes to active
  if (this.isModified('status') && this.status === 'active' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  
  // Increment version on updates
  if (this.isModified() && !this.isNew) {
    this.version += 1;
  }
  
  next();
});

// Pre-find middleware to exclude deleted items
heroSliderSchema.pre(/^find/, function(next) {
  if (!this.getQuery().includeDeleted) {
    this.where({ isDeleted: { $ne: true } });
  }
  next();
});

// Static method to get active sliders
heroSliderSchema.statics.getActiveSliders = function(device = 'all', whiteLabelId = null) {
  const query = {
    status: { $in: ['active', 'scheduled'] },
    isDeleted: false,
  };
  
  if (device !== 'all') {
    query.device = { $in: [device, 'all'] };
  }
  
  if (whiteLabelId) {
    query.whiteLabelId = whiteLabelId;
  }
  
  return this.find(query)
    .sort({ sortOrder: 1, priority: -1, createdAt: -1 })
    .exec();
};

// Static method to get scheduled sliders
heroSliderSchema.statics.getScheduledSliders = function() {
  const now = new Date();
  return this.find({
    status: 'scheduled',
    isScheduled: true,
    startDate: { $lte: now },
    endDate: { $gte: now },
    isDeleted: false,
  }).exec();
};

// Instance method to increment views
heroSliderSchema.methods.incrementViews = function() {
  this.views += 1;
  this.ctr = this.views > 0 ? ((this.clicks / this.views) * 100) : 0;
  return this.save();
};

// Instance method to increment clicks
heroSliderSchema.methods.incrementClicks = function() {
  this.clicks += 1;
  this.ctr = this.views > 0 ? ((this.clicks / this.views) * 100) : 0;
  return this.save();
};

// Instance method to soft delete
heroSliderSchema.methods.softDelete = function(deletedBy) {
  this.isDeleted = true;
  this.deletedAt = new Date();
  this.deletedBy = deletedBy;
  return this.save();
};

// Instance method to restore
heroSliderSchema.methods.restore = function() {
  this.isDeleted = false;
  this.deletedAt = null;
  this.deletedBy = null;
  return this.save();
};

// Instance method to duplicate
heroSliderSchema.methods.duplicate = function(createdBy) {
  const duplicate = new this.constructor({
    ...this.toObject(),
    _id: undefined,
    title: `${this.title} (Copy)`,
    status: 'draft',
    isDefault: false,
    views: 0,
    clicks: 0,
    ctr: 0,
    conversionRate: 0,
    revenue: 0,
    createdBy,
    createdAt: undefined,
    updatedAt: undefined,
    publishedAt: null,
    approvedAt: null,
    approvedBy: null,
  });
  
  return duplicate.save();
};

module.exports = mongoose.model("HeroSlider", heroSliderSchema); 