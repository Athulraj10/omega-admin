const moment = require("moment");

const { Banner } = require("../../models");
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
   * @description "This function is to add new banner."
   * @param req
   * @param res
   */
  addBanner: async (req, res) => {
    try {
      const requestParams = req.body;
      console.log('📝 Banner request body:', requestParams);
      console.log('📁 Uploaded file:', req.file);

      if (!req.file) {
        return Response.errorResponseWithoutData(
          res,
          "Image file is required",
          Constants.BAD_REQUEST
        );
      }

      // Handle uploaded file
      const uploadedFile = req.file;
      const extension = uploadedFile.originalname.split('.').pop();
      const randomNumber = await makeRandomNumber(5);
      const imageName = `${moment().unix()}${randomNumber}.${extension}`;
      
      let currentDate = new Date();
      let formattedDate = `${currentDate.getDate()}-${(
        currentDate.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}-${currentDate.getFullYear()}`;

      // Convert file to base64 for S3 upload
      const fs = require('fs');
      const fileBuffer = fs.readFileSync(uploadedFile.path);
      const base64Image = fileBuffer.toString('base64');
      const dataURI = `data:${uploadedFile.mimetype};base64,${base64Image}`;

      // Upload to S3
      const bucketRes = await base64ImageUpload(
        imageName,
        `${Constants.BANNER}/${formattedDate}`,
        dataURI,
        res
      );

      // Clean up uploaded file
      fs.unlinkSync(uploadedFile.path);
      
      const bannerObj = {
        image: imageName,
        titleLine1: requestParams?.titleLine1 || "",
        titleLine2: requestParams?.titleLine2 || "",
        offerText: requestParams?.offerText || "",
        offerHighlight: requestParams?.offerHighlight || "",
        buttonText: requestParams?.buttonText || "Shop now",
        device: requestParams?.device || "desktop",
        status: requestParams?.status || "1",
        isDefault: requestParams?.isDefault || false,
        ...(requestParams?.key !== 'betxfair' && { whiteLabelId: requestParams?.key })
      }
      
      if (bucketRes) {
        const newBanner = await Banner.create(bannerObj);
        
        // Return the created banner data
        const bannerData = {
          _id: newBanner._id,
          image: s3MediaUrl(Constants.BANNER, formattedDate, newBanner.image),
          titleLine1: newBanner.titleLine1,
          titleLine2: newBanner.titleLine2,
          offerText: newBanner.offerText,
          offerHighlight: newBanner.offerHighlight,
          buttonText: newBanner.buttonText,
          device: newBanner.device,
          status: newBanner.status,
          isDefault: newBanner.isDefault,
          createdAt: newBanner.createdAt,
        };

        return Response.successResponseData(
          res,
          bannerData,
          Constants.SUCCESS,
          res.locals.__("bannerAdded")
        );
      } else {
        return Response.errorResponseWithoutData(
          res,
          res.locals.__("failedToUpload"),
          Constants.FAIL
        );
      }
    } catch (error) {
      console.log('❌ Banner creation error:', error);
      return Response.errorResponseWithoutData(
        res,
        res.locals.__("internalError"),
        Constants.INTERNAL_SERVER
      );
    }
  },

  /**
   * @description "This function is to get all banner."
   * @param req
   * @param res
   */
  getBanners: async (req, res) => {
    try {
      const requestParams = req.body || req.query;
      console.log('🔍 Get banners request params:', requestParams);
      
      let bannerFilter = {};

      // Handle device filter
      if (requestParams?.device && requestParams.device !== 'all') {
        bannerFilter.device = requestParams.device;
      }

      // Handle white label filtering (for backward compatibility)
      if (requestParams?.keys === 'betxfair') {
        bannerFilter.whiteLabelId = { $exists: false };
      } else if (requestParams?.keys && Array.isArray(requestParams.keys)) {
        const whiteLabelIds = requestParams.keys.map((id) => new mongoose.Types.ObjectId(id));
        bannerFilter.whiteLabelId = { $in: whiteLabelIds };
      }

      console.log('🔍 Banner filter:', bannerFilter);
      const banners = await Banner.find(bannerFilter).sort({ createdAt: -1 });
      const bannerDatas = banners.map((data) => {
        const date = new Date(data?.createdAt);
        var formattedDate = `${date.getDate()}-${(date.getMonth() + 1)
          .toString()
          .padStart(2, "0")}-${date.getFullYear()}`;
        
        return {
          _id: data?._id,
          image: s3MediaUrl(Constants.BANNER, formattedDate, data?.image),
          titleLine1: data?.titleLine1,
          titleLine2: data?.titleLine2,
          offerText: data?.offerText,
          offerHighlight: data?.offerHighlight,
          buttonText: data?.buttonText,
          device: data?.device,
          status: data?.status,
          isDefault: data?.isDefault,
          createdAt: data?.createdAt,
        };
      });
      
      if (bannerDatas) {
        return Response.successResponseData(
          res,
          bannerDatas,
          Constants.SUCCESS,
          res.locals.__("success")
        );
      }
    } catch (error) {
      console.log(error);
      return Response.errorResponseWithoutData(
        res,
        res.locals.__("internalError"),
        Constants.INTERNAL_SERVER
      );
    }
  },

  /**
   * @description "This function is to update banner."
   * @param req
   * @param res
   */
  updateBanner: async (req, res) => {
    try {
      const requestParams = req.body;
      const bannerId = requestParams?.id;

      if (!bannerId) {
        return Response.errorResponseWithoutData(
          res,
          "Banner ID is required",
          Constants.BAD_REQUEST
        );
      }

      const banner = await Banner.findById(bannerId);
      if (!banner) {
        return Response.errorResponseWithoutData(
          res,
          "Banner not found",
          Constants.NOT_FOUND
        );
      }

      let updateData = {
        titleLine1: requestParams?.titleLine1 || banner.titleLine1,
        titleLine2: requestParams?.titleLine2 || banner.titleLine2,
        offerText: requestParams?.offerText || banner.offerText,
        offerHighlight: requestParams?.offerHighlight || banner.offerHighlight,
        buttonText: requestParams?.buttonText || banner.buttonText,
        device: requestParams?.device || banner.device,
        status: requestParams?.status || banner.status,
        isDefault: requestParams?.isDefault !== undefined ? requestParams.isDefault : banner.isDefault,
      };

      // Handle image update if provided
      if (requestParams?.image && requestParams?.image !== "") {
        const extension = requestParams.image.split(";")[0].split("/")[1];
        const randomNumber = await makeRandomNumber(5);
        const imageName = `${moment().unix()}${randomNumber}.${extension}`;
        const currentDate = new Date();
        const formattedDate = `${currentDate.getDate()}-${(currentDate.getMonth() + 1)
          .toString()
          .padStart(2, "0")}-${currentDate.getFullYear()}`;

        const bucketRes = await base64ImageUpload(
          imageName,
          `${Constants.BANNER}/${formattedDate}`,
          requestParams.image,
          res
        );

        if (bucketRes) {
          // Remove old image
          const oldDate = new Date(banner.createdAt);
          const oldFormattedDate = `${oldDate.getDate()}-${(oldDate.getMonth() + 1)
            .toString()
            .padStart(2, "0")}-${oldDate.getFullYear()}`;
          
          await removeOldImage(
            banner.image,
            `${Constants.BANNER}/${oldFormattedDate}`
          );
          
          updateData.image = imageName;
        } else {
          return Response.errorResponseWithoutData(
            res,
            res.locals.__("failedToUpload"),
            Constants.FAIL
          );
        }
      }

      await Banner.findByIdAndUpdate(bannerId, updateData);

      return Response.successResponseWithoutData(
        res,
        "Banner updated successfully",
        Constants.SUCCESS
      );
    } catch (error) {
      console.log(error);
      return Response.errorResponseWithoutData(
        res,
        res.locals.__("internalError"),
        Constants.INTERNAL_SERVER
      );
    }
  },

  /**
   * @description "This function is to update banner status."
   * @param req
   * @param res
   */
  updateSliderStatus: async (req, res) => {
    try {
      const requestParams = req.body;

      await Banner.updateOne(
        { _id: requestParams?.id },
        {
          $set: { status: requestParams?.status },
        }
      );
      Response.successResponseWithoutData(
        res,
        res.locals.__("bannerStatusUpdated"),
        Constants.SUCCESS
      );
    } catch (error) {
      console.log(error);
      return Response.errorResponseWithoutData(
        res,
        res.locals.__("internalError"),
        Constants.INTERNAL_SERVER
      );
    }
  },

  /**
   * @description "This function is to set banner as default."
   * @param req
   * @param res
   */
  setDefaultBanner: async (req, res) => {
    try {
      const requestParams = req.body;
      const bannerId = requestParams?.id;

      if (!bannerId) {
        return Response.errorResponseWithoutData(
          res,
          "Banner ID is required",
          Constants.BAD_REQUEST
        );
      }

      const banner = await Banner.findById(bannerId);
      if (!banner) {
        return Response.errorResponseWithoutData(
          res,
          "Banner not found",
          Constants.NOT_FOUND
        );
      }

      // Set all other banners of the same device and whiteLabelId to non-default
      await Banner.updateMany(
        { 
          _id: { $ne: bannerId },
          device: banner.device,
          whiteLabelId: banner.whiteLabelId 
        },
        { isDefault: false }
      );

      // Set the selected banner as default
      await Banner.findByIdAndUpdate(bannerId, { isDefault: true });

      return Response.successResponseWithoutData(
        res,
        "Default banner updated successfully",
        Constants.SUCCESS
      );
    } catch (error) {
      console.log(error);
      return Response.errorResponseWithoutData(
        res,
        res.locals.__("internalError"),
        Constants.INTERNAL_SERVER
      );
    }
  },

  /**
   * @description "This function is to delete banner."
   * @param req
   * @param res
   */
  deleteSlider: async (req, res) => {
    try {
      const requestParams = req.params.id;
      const banner = await Banner.findOne({ _id: requestParams });
      
      if (!banner) {
        return Response.errorResponseWithoutData(
          res,
          "Banner not found",
          Constants.NOT_FOUND
        );
      }

      const date = new Date(banner?.createdAt);
      var formattedDate = `${date.getDate()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${date.getFullYear()}`;
      
      const bucketRes = await removeOldImage(
        banner?.image,
        `${Constants.BANNER}/${formattedDate}`
      );

      if (bucketRes) {
        await Banner.deleteOne({ _id: requestParams });
        Response.successResponseWithoutData(
          res,
          res.locals.__("bannerDeleted"),
          Constants.SUCCESS
        );
      } else {
        return Response.errorResponseWithoutData(
          res,
          res.locals.__("failedToDelete"),
          Constants.BAD_REQUEST
        );
      }
    } catch (error) {
      console.log(error, "error");
      return Response.errorResponseWithoutData(
        res,
        res.locals.__("internalError"),
        Constants.INTERNAL_SERVER
      );
    }
  },
};
