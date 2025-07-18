const moment = require("moment");
const { HeroSlider } = require("../../models");
const Constants = require("../../services/Constants");
const { makeRandomNumber } = require("../../services/Helper");
const Response = require("../../services/Response");
const {
  removeOldImage,
  s3MediaUrl,
  base64ImageUpload,
} = require("../../services/S3Bucket");
const { default: mongoose } = require("mongoose");

module.exports = {
  /**
   * @description "Create a new hero slider"
   * @param req
   * @param res
   */
  createHeroSlider: async (req, res) => {
    try {
      const requestParams = req.body;
      console.log('📝 Hero Slider creation request:', requestParams);
      console.log('📁 Files received:', req.files);
      console.log('📋 Headers:', req.headers);

      // Validate required fields - accept either title or titleLine1
      if (!requestParams.title && !requestParams.titleLine1) {
        return Response.errorResponseWithoutData(
          res,
          "Title is required (either 'title' or 'titleLine1' field)",
          Constants.BAD_REQUEST
        );
      }

      // Use titleLine1 if title is not provided
      const title = requestParams.title || requestParams.titleLine1;

      // Check if image is provided either as file upload or URL
      if (!requestParams.image && (!req.files || !req.files.image)) {
        return Response.errorResponseWithoutData(
          res,
          "Image is required (either as file upload or URL)",
          Constants.BAD_REQUEST
        );
      }

      // Handle image upload
      let imageUrl = '';
      let mobileImageUrl = '';
      
      if (req.files && req.files.image && req.files.image.length > 0) {
        const uploadedFile = req.files.image[0]; // Get the first file from the array
        
        console.log('📄 Uploaded file details:', {
          originalname: uploadedFile.originalname,
          size: uploadedFile.size,
          mimetype: uploadedFile.mimetype,
          tempFilePath: uploadedFile.tempFilePath
        });
        
        // Validate uploaded file
        if (!uploadedFile.originalname) {
          return Response.errorResponseWithoutData(
            res,
            "Invalid image file uploaded - missing filename",
            Constants.BAD_REQUEST
          );
        }
        
        const extension = uploadedFile.originalname.split('.').pop();
        const randomNumber = await makeRandomNumber(5);
        const imageName = `hero-slider-${moment().unix()}${randomNumber}.${extension}`;
        
        let currentDate = new Date();
        let formattedDate = `${currentDate.getDate()}-${(
          currentDate.getMonth() + 1
        ).toString().padStart(2, "0")}-${currentDate.getFullYear()}`;

        // Convert file to base64 for S3 upload
        const fs = require('fs');
        const fileBuffer = fs.readFileSync(uploadedFile.tempFilePath);
        const base64Image = fileBuffer.toString('base64');
        const dataURI = `data:${uploadedFile.mimetype};base64,${base64Image}`;

        // Upload to S3
        const bucketRes = await base64ImageUpload(
          imageName,
          `hero-sliders/${formattedDate}`,
          dataURI,
          res
        );

        if (bucketRes) {
          imageUrl = s3MediaUrl(`hero-sliders`, formattedDate, imageName);
        }

        // Clean up uploaded file
        fs.unlinkSync(uploadedFile.tempFilePath);
      }

      // Handle mobile image upload
      if (req.files && req.files.mobileImage && req.files.mobileImage.length > 0) {
        const uploadedFile = req.files.mobileImage[0]; // Get the first file from the array
        
        // Validate uploaded file
        if (!uploadedFile.originalname) {
          return Response.errorResponseWithoutData(
            res,
            "Invalid mobile image file uploaded - missing filename",
            Constants.BAD_REQUEST
          );
        }
        
        const extension = uploadedFile.originalname.split('.').pop();
        const randomNumber = await makeRandomNumber(5);
        const imageName = `hero-slider-mobile-${moment().unix()}${randomNumber}.${extension}`;
        
        let currentDate = new Date();
        let formattedDate = `${currentDate.getDate()}-${(
          currentDate.getMonth() + 1
        ).toString().padStart(2, "0")}-${currentDate.getFullYear()}`;

        const fs = require('fs');
        const fileBuffer = fs.readFileSync(uploadedFile.tempFilePath);
        const base64Image = fileBuffer.toString('base64');
        const dataURI = `data:${uploadedFile.mimetype};base64,${base64Image}`;

        const bucketRes = await base64ImageUpload(
          imageName,
          `hero-sliders/${formattedDate}`,
          dataURI,
          res
        );

        if (bucketRes) {
          mobileImageUrl = s3MediaUrl(`hero-sliders`, formattedDate, imageName);
        }

        fs.unlinkSync(uploadedFile.tempFilePath);
      }

      // Prepare slider data
      const sliderData = {
        title: title,
        titleLine1: requestParams.titleLine1 || "",
        titleLine2: requestParams.titleLine2 || "",
        subtitle: requestParams.subtitle || "",
        description: requestParams.description || "",
        offerText: requestParams.offerText || "",
        offerHighlight: requestParams.offerHighlight || "",
        buttonText: requestParams.buttonText || "Shop now",
        buttonLink: requestParams.buttonLink || "/",
        image: imageUrl || requestParams.image, // Use uploaded image URL if available, otherwise use provided image
        imageUrl: imageUrl,
        mobileImage: mobileImageUrl || requestParams.mobileImage,
        mobileImageUrl: mobileImageUrl,
        videoUrl: requestParams.videoUrl || "",
        device: requestParams.device || "desktop",
        displayType: requestParams.displayType || "image",
        status: requestParams.status || "active",
        isDefault: requestParams.isDefault || false,
        priority: requestParams.priority || 1,
        sortOrder: requestParams.sortOrder || 0,
        startDate: requestParams.startDate ? new Date(requestParams.startDate) : null,
        endDate: requestParams.endDate ? new Date(requestParams.endDate) : null,
        isScheduled: requestParams.isScheduled || false,
        backgroundColor: requestParams.backgroundColor || "#ffffff",
        textColor: requestParams.textColor || "#000000",
        animation: requestParams.animation || "fade",
        animationDuration: requestParams.animationDuration || 500,
        autoplayDelay: requestParams.autoplayDelay || 3000,
        isABTest: requestParams.isABTest || false,
        abTestGroup: requestParams.abTestGroup || "A",
        abTestWeight: requestParams.abTestWeight || 50,
        targetAudience: requestParams.targetAudience ? requestParams.targetAudience.split(',') : [],
        targetLocation: requestParams.targetLocation ? requestParams.targetLocation.split(',') : [],
        targetDevice: requestParams.targetDevice ? requestParams.targetDevice.split(',') : [],
        targetTime: requestParams.targetTime || { start: "00:00", end: "23:59" },
        metaTitle: requestParams.metaTitle || "",
        metaDescription: requestParams.metaDescription || "",
        keywords: requestParams.keywords ? requestParams.keywords.split(',') : [],
        isResponsive: requestParams.isResponsive !== false,
        isAccessible: requestParams.isAccessible !== false,
        hasOverlay: requestParams.hasOverlay || false,
        overlayOpacity: requestParams.overlayOpacity || 0.3,
        translations: requestParams.translations || {},
        tags: requestParams.tags ? requestParams.tags.split(',') : [],
        category: requestParams.category || "general",
        customFields: requestParams.customFields || {},
        createdBy: req.user.id,
        whiteLabelId: requestParams.whiteLabelId || null,
      };

      const newSlider = await HeroSlider.create(sliderData);

      return Response.successResponseData(
        res,
        newSlider,
        Constants.SUCCESS,
        "Hero slider created successfully"
      );

    } catch (error) {
      console.log('❌ Hero slider creation error:', error);
      return Response.errorResponseWithoutData(
        res,
        "Failed to create hero slider",
        Constants.INTERNAL_SERVER
      );
    }
  },

  /**
   * @description "Get all hero sliders with advanced filtering"
   * @param req
   * @param res
   */
  getHeroSliders: async (req, res) => {
    try {
      const requestParams = req.body || req.query;
      console.log('🔍 Get hero sliders request:', requestParams);

      // Build filter query
      let filterQuery = { isDeleted: { $ne: true } };

      // Status filter
      if (requestParams.status && requestParams.status !== 'all') {
        filterQuery.status = requestParams.status;
      }

      // Device filter
      if (requestParams.device && requestParams.device !== 'all') {
        filterQuery.device = requestParams.device;
      }

      // Category filter
      if (requestParams.category) {
        filterQuery.category = requestParams.category;
      }

      // Tag filter
      if (requestParams.tags) {
        filterQuery.tags = { $in: requestParams.tags.split(',') };
      }

      // Search filter
      if (requestParams.search) {
        filterQuery.$or = [
          { title: { $regex: requestParams.search, $options: 'i' } },
          { titleLine1: { $regex: requestParams.search, $options: 'i' } },
          { titleLine2: { $regex: requestParams.search, $options: 'i' } },
          { description: { $regex: requestParams.search, $options: 'i' } },
        ];
      }

      // Date range filter
      if (requestParams.startDate && requestParams.endDate) {
        filterQuery.createdAt = {
          $gte: new Date(requestParams.startDate),
          $lte: new Date(requestParams.endDate),
        };
      }

      // White label filter
      if (requestParams.whiteLabelId) {
        filterQuery.whiteLabelId = requestParams.whiteLabelId;
      }

      // Pagination
      const page = parseInt(requestParams.page) || 1;
      const limit = parseInt(requestParams.limit) || 10;
      const skip = (page - 1) * limit;

      // Sorting
      let sortQuery = {};
      if (requestParams.sortBy) {
        const sortOrder = requestParams.sortOrder === 'desc' ? -1 : 1;
        sortQuery[requestParams.sortBy] = sortOrder;
      } else {
        sortQuery = { sortOrder: 1, priority: -1, createdAt: -1 };
      }

      // Execute query
      const sliders = await HeroSlider.find(filterQuery)
        .sort(sortQuery)
        .skip(skip)
        .limit(limit)
        .populate('createdBy', 'name email')
        .populate('updatedBy', 'name email')
        .populate('approvedBy', 'name email');

      // Get total count
      const totalCount = await HeroSlider.countDocuments(filterQuery);

      // Calculate analytics
      const analytics = await HeroSlider.aggregate([
        { $match: filterQuery },
        {
          $group: {
            _id: null,
            totalViews: { $sum: '$views' },
            totalClicks: { $sum: '$clicks' },
            avgCTR: { $avg: '$ctr' },
            totalRevenue: { $sum: '$revenue' },
            activeCount: {
              $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
            },
            scheduledCount: {
              $sum: { $cond: [{ $eq: ['$status', 'scheduled'] }, 1, 0] }
            },
            draftCount: {
              $sum: { $cond: [{ $eq: ['$status', 'draft'] }, 1, 0] }
            },
          }
        }
      ]);

      const responseData = {
        sliders,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalCount / limit),
          totalItems: totalCount,
          itemsPerPage: limit,
        },
        analytics: analytics[0] || {
          totalViews: 0,
          totalClicks: 0,
          avgCTR: 0,
          totalRevenue: 0,
          activeCount: 0,
          scheduledCount: 0,
          draftCount: 0,
        }
      };

      return Response.successResponseData(
        res,
        responseData,
        Constants.SUCCESS,
        "Hero sliders retrieved successfully"
      );

    } catch (error) {
      console.log('❌ Get hero sliders error:', error);
      return Response.errorResponseWithoutData(
        res,
        "Failed to retrieve hero sliders",
        Constants.INTERNAL_SERVER
      );
    }
  },

  /**
   * @description "Get public hero sliders for frontend"
   * @param req
   * @param res
   */
  getPublicHeroSliders: async (req, res) => {
    try {
      const { device = 'all', whiteLabelId = null } = req.query;
      console.log('🌐 Public hero sliders request:', { device, whiteLabelId });

      const sliders = await HeroSlider.getActiveSliders(device, whiteLabelId);

      return Response.successResponseData(
        res,
        sliders,
        Constants.SUCCESS,
        "Public hero sliders retrieved successfully"
      );

    } catch (error) {
      console.log('❌ Public hero sliders error:', error);
      return Response.errorResponseWithoutData(
        res,
        "Failed to retrieve public hero sliders",
        Constants.INTERNAL_SERVER
      );
    }
  },

  /**
   * @description "Get hero slider by ID"
   * @param req
   * @param res
   */
  getHeroSliderById: async (req, res) => {
    try {
      const { id } = req.params;
      console.log('🔍 Get hero slider by ID:', id);

      const slider = await HeroSlider.findById(id)
        .populate('createdBy', 'name email')
        .populate('updatedBy', 'name email')
        .populate('approvedBy', 'name email');

      if (!slider) {
        return Response.errorResponseWithoutData(
          res,
          "Hero slider not found",
          Constants.NOT_FOUND
        );
      }

      return Response.successResponseData(
        res,
        slider,
        Constants.SUCCESS,
        "Hero slider retrieved successfully"
      );

    } catch (error) {
      console.log('❌ Get hero slider by ID error:', error);
      return Response.errorResponseWithoutData(
        res,
        "Failed to retrieve hero slider",
        Constants.INTERNAL_SERVER
      );
    }
  },

  /**
   * @description "Update hero slider"
   * @param req
   * @param res
   */
  updateHeroSlider: async (req, res) => {
    try {
      const { id } = req.params;
      const requestParams = req.body;
      console.log('📝 Update hero slider request:', { id, requestParams });

      const slider = await HeroSlider.findById(id);
      if (!slider) {
        return Response.errorResponseWithoutData(
          res,
          "Hero slider not found",
          Constants.NOT_FOUND
        );
      }

      // Handle image updates
      let updateData = { ...requestParams };

      if (req.files && req.files.image) {
        const uploadedFile = req.files.image[0]; // Get the first file from the array
        const extension = uploadedFile.originalname.split('.').pop();
        const randomNumber = await makeRandomNumber(5);
        const imageName = `hero-slider-${moment().unix()}${randomNumber}.${extension}`;
        
        let currentDate = new Date();
        let formattedDate = `${currentDate.getDate()}-${(
          currentDate.getMonth() + 1
        ).toString().padStart(2, "0")}-${currentDate.getFullYear()}`;

        const fs = require('fs');
        const fileBuffer = fs.readFileSync(uploadedFile.tempFilePath);
        const base64Image = fileBuffer.toString('base64');
        const dataURI = `data:${uploadedFile.mimetype};base64,${base64Image}`;

        const bucketRes = await base64ImageUpload(
          imageName,
          `hero-sliders/${formattedDate}`,
          dataURI,
          res
        );

        if (bucketRes) {
          updateData.imageUrl = s3MediaUrl(`hero-sliders`, formattedDate, imageName);
        }

        fs.unlinkSync(uploadedFile.tempFilePath);
      }

      // Handle mobile image updates
      if (req.files && req.files.mobileImage) {
        const uploadedFile = req.files.mobileImage[0]; // Get the first file from the array
        const extension = uploadedFile.originalname.split('.').pop();
        const randomNumber = await makeRandomNumber(5);
        const imageName = `hero-slider-mobile-${moment().unix()}${randomNumber}.${extension}`;
        
        let currentDate = new Date();
        let formattedDate = `${currentDate.getDate()}-${(
          currentDate.getMonth() + 1
        ).toString().padStart(2, "0")}-${currentDate.getFullYear()}`;

        const fs = require('fs');
        const fileBuffer = fs.readFileSync(uploadedFile.tempFilePath);
        const base64Image = fileBuffer.toString('base64');
        const dataURI = `data:${uploadedFile.mimetype};base64,${base64Image}`;

        const bucketRes = await base64ImageUpload(
          imageName,
          `hero-sliders/${formattedDate}`,
          dataURI,
          res
        );

        if (bucketRes) {
          updateData.mobileImageUrl = s3MediaUrl(`hero-sliders`, formattedDate, imageName);
        }

        fs.unlinkSync(uploadedFile.tempFilePath);
      }

      // Add update metadata
      updateData.updatedBy = req.user.id;
      updateData.updatedAt = new Date();

      const updatedSlider = await HeroSlider.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      ).populate('createdBy', 'name email')
       .populate('updatedBy', 'name email');

      return Response.successResponseData(
        res,
        updatedSlider,
        Constants.SUCCESS,
        "Hero slider updated successfully"
      );

    } catch (error) {
      console.log('❌ Update hero slider error:', error);
      return Response.errorResponseWithoutData(
        res,
        "Failed to update hero slider",
        Constants.INTERNAL_SERVER
      );
    }
  },

  /**
   * @description "Delete hero slider"
   * @param req
   * @param res
   */
  deleteHeroSlider: async (req, res) => {
    try {
      const { id } = req.params;
      console.log('🗑️ Delete hero slider request:', id);

      const slider = await HeroSlider.findById(id);
      if (!slider) {
        return Response.errorResponseWithoutData(
          res,
          "Hero slider not found",
          Constants.NOT_FOUND
        );
      }

      // Soft delete
      await slider.softDelete(req.user.id);

      return Response.successResponseWithoutData(
        res,
        "Hero slider deleted successfully",
        Constants.SUCCESS
      );

    } catch (error) {
      console.log('❌ Delete hero slider error:', error);
      return Response.errorResponseWithoutData(
        res,
        "Failed to delete hero slider",
        Constants.INTERNAL_SERVER
      );
    }
  },

  /**
   * @description "Toggle hero slider status"
   * @param req
   * @param res
   */
  toggleHeroSliderStatus: async (req, res) => {
    try {
      const { id } = req.params;
      console.log('🔄 Toggle hero slider status request:', id);

      const slider = await HeroSlider.findById(id);
      if (!slider) {
        return Response.errorResponseWithoutData(
          res,
          "Hero slider not found",
          Constants.NOT_FOUND
        );
      }

      slider.status = slider.status === 'active' ? 'inactive' : 'active';
      slider.updatedBy = req.user.id;
      await slider.save();

      return Response.successResponseData(
        res,
        slider,
        Constants.SUCCESS,
        `Hero slider ${slider.status === 'active' ? 'activated' : 'deactivated'} successfully`
      );

    } catch (error) {
      console.log('❌ Toggle hero slider status error:', error);
      return Response.errorResponseWithoutData(
        res,
        "Failed to toggle hero slider status",
        Constants.INTERNAL_SERVER
      );
    }
  },

  /**
   * @description "Reorder hero sliders"
   * @param req
   * @param res
   */
  reorderHeroSliders: async (req, res) => {
    try {
      const { sliders } = req.body;
      console.log('📋 Reorder hero sliders request:', sliders);

      if (!Array.isArray(sliders)) {
        return Response.errorResponseWithoutData(
          res,
          "Invalid sliders array",
          Constants.BAD_REQUEST
        );
      }

      // Update sort order for each slider
      const updatePromises = sliders.map((slider, index) => {
        return HeroSlider.findByIdAndUpdate(slider.id, {
          sortOrder: index,
          updatedBy: req.user.id,
        });
      });

      await Promise.all(updatePromises);

      return Response.successResponseWithoutData(
        res,
        "Hero sliders reordered successfully",
        Constants.SUCCESS
      );

    } catch (error) {
      console.log('❌ Reorder hero sliders error:', error);
      return Response.errorResponseWithoutData(
        res,
        "Failed to reorder hero sliders",
        Constants.INTERNAL_SERVER
      );
    }
  },

  /**
   * @description "Duplicate hero slider"
   * @param req
   * @param res
   */
  duplicateHeroSlider: async (req, res) => {
    try {
      const { id } = req.params;
      console.log('📋 Duplicate hero slider request:', id);

      const slider = await HeroSlider.findById(id);
      if (!slider) {
        return Response.errorResponseWithoutData(
          res,
          "Hero slider not found",
          Constants.NOT_FOUND
        );
      }

      const duplicatedSlider = await slider.duplicate(req.user.id);

      return Response.successResponseData(
        res,
        duplicatedSlider,
        Constants.SUCCESS,
        "Hero slider duplicated successfully"
      );

    } catch (error) {
      console.log('❌ Duplicate hero slider error:', error);
      return Response.errorResponseWithoutData(
        res,
        "Failed to duplicate hero slider",
        Constants.INTERNAL_SERVER
      );
    }
  },

  /**
   * @description "Get hero slider analytics"
   * @param req
   * @param res
   */
  getHeroSliderAnalytics: async (req, res) => {
    try {
      const { startDate, endDate, device } = req.query;
      console.log('📊 Hero slider analytics request:', { startDate, endDate, device });

      let matchQuery = { isDeleted: { $ne: true } };

      if (startDate && endDate) {
        matchQuery.createdAt = {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        };
      }

      if (device && device !== 'all') {
        matchQuery.device = device;
      }

      const analytics = await HeroSlider.aggregate([
        { $match: matchQuery },
        {
          $group: {
            _id: {
              status: '$status',
              device: '$device',
              category: '$category',
            },
            count: { $sum: 1 },
            totalViews: { $sum: '$views' },
            totalClicks: { $sum: '$clicks' },
            avgCTR: { $avg: '$ctr' },
            totalRevenue: { $sum: '$revenue' },
          }
        },
        {
          $group: {
            _id: null,
            totalSliders: { $sum: '$count' },
            totalViews: { $sum: '$totalViews' },
            totalClicks: { $sum: '$totalClicks' },
            avgCTR: { $avg: '$avgCTR' },
            totalRevenue: { $sum: '$totalRevenue' },
            byStatus: {
              $push: {
                status: '$_id.status',
                count: '$count',
                views: '$totalViews',
                clicks: '$totalClicks',
                ctr: '$avgCTR',
                revenue: '$totalRevenue',
              }
            },
            byDevice: {
              $push: {
                device: '$_id.device',
                count: '$count',
                views: '$totalViews',
                clicks: '$totalClicks',
                ctr: '$avgCTR',
                revenue: '$totalRevenue',
              }
            },
            byCategory: {
              $push: {
                category: '$_id.category',
                count: '$count',
                views: '$totalViews',
                clicks: '$totalClicks',
                ctr: '$avgCTR',
                revenue: '$totalRevenue',
              }
            },
          }
        }
      ]);

      return Response.successResponseData(
        res,
        analytics[0] || {
          totalSliders: 0,
          totalViews: 0,
          totalClicks: 0,
          avgCTR: 0,
          totalRevenue: 0,
          byStatus: [],
          byDevice: [],
          byCategory: [],
        },
        Constants.SUCCESS,
        "Analytics retrieved successfully"
      );

    } catch (error) {
      console.log('❌ Hero slider analytics error:', error);
      return Response.errorResponseWithoutData(
        res,
        "Failed to retrieve analytics",
        Constants.INTERNAL_SERVER
      );
    }
  },

  /**
   * @description "Increment slider views"
   * @param req
   * @param res
   */
  incrementViews: async (req, res) => {
    try {
      const { id } = req.params;
      console.log('👁️ Increment views request:', id);

      const slider = await HeroSlider.findById(id);
      if (!slider) {
        return Response.errorResponseWithoutData(
          res,
          "Hero slider not found",
          Constants.NOT_FOUND
        );
      }

      await slider.incrementViews();

      return Response.successResponseWithoutData(
        res,
        "Views incremented successfully",
        Constants.SUCCESS
      );

    } catch (error) {
      console.log('❌ Increment views error:', error);
      return Response.errorResponseWithoutData(
        res,
        "Failed to increment views",
        Constants.INTERNAL_SERVER
      );
    }
  },

  /**
   * @description "Increment slider clicks"
   * @param req
   * @param res
   */
  incrementClicks: async (req, res) => {
    try {
      const { id } = req.params;
      console.log('🖱️ Increment clicks request:', id);

      const slider = await HeroSlider.findById(id);
      if (!slider) {
        return Response.errorResponseWithoutData(
          res,
          "Hero slider not found",
          Constants.NOT_FOUND
        );
      }

      await slider.incrementClicks();

      return Response.successResponseWithoutData(
        res,
        "Clicks incremented successfully",
        Constants.SUCCESS
      );

    } catch (error) {
      console.log('❌ Increment clicks error:', error);
      return Response.errorResponseWithoutData(
        res,
        "Failed to increment clicks",
        Constants.INTERNAL_SERVER
      );
    }
  },

  /**
   * @description "Bulk operations on hero sliders"
   * @param req
   * @param res
   */
  bulkOperations: async (req, res) => {
    try {
      const { ids, operation, data } = req.body;
      console.log('📦 Bulk operation request:', { ids, operation, data });

      if (!Array.isArray(ids) || ids.length === 0) {
        return Response.errorResponseWithoutData(
          res,
          "Invalid slider IDs",
          Constants.BAD_REQUEST
        );
      }

      let updateData = {};
      let message = "";

      switch (operation) {
        case 'activate':
          updateData = { status: 'active', updatedBy: req.user.id };
          message = "Sliders activated successfully";
          break;
        case 'deactivate':
          updateData = { status: 'inactive', updatedBy: req.user.id };
          message = "Sliders deactivated successfully";
          break;
        case 'delete':
          // Soft delete
          const sliders = await HeroSlider.find({ _id: { $in: ids } });
          await Promise.all(sliders.map(slider => slider.softDelete(req.user.id)));
          message = "Sliders deleted successfully";
          break;
        case 'update':
          updateData = { ...data, updatedBy: req.user.id };
          message = "Sliders updated successfully";
          break;
        default:
          return Response.errorResponseWithoutData(
            res,
            "Invalid operation",
            Constants.BAD_REQUEST
          );
      }

      if (operation !== 'delete') {
        await HeroSlider.updateMany(
          { _id: { $in: ids } },
          updateData
        );
      }

      return Response.successResponseWithoutData(
        res,
        message,
        Constants.SUCCESS
      );

    } catch (error) {
      console.log('❌ Bulk operations error:', error);
      return Response.errorResponseWithoutData(
        res,
        "Failed to perform bulk operations",
        Constants.INTERNAL_SERVER
      );
    }
  },
}; 