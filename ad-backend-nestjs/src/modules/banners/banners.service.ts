import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Banner, BannerDocument } from './schemas/banner.schema';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { S3Service } from '../../common/services/s3.service';
import { HelperService } from '../../common/services/helper.service';

@Injectable()
export class BannersService {
  constructor(
    @InjectModel(Banner.name) private bannerModel: Model<BannerDocument>,
    private s3Service: S3Service,
    private helperService: HelperService,
  ) {}

  async create(createBannerDto: CreateBannerDto): Promise<Banner> {
    const { image, isDefault, device, ...bannerData } = createBannerDto;

    // Handle image upload to S3
    let imageUrl = '';
    if (image) {
      try {
        const randomNumber = await this.helperService.makeRandomNumber(5);
        const fileName = `banner-${Date.now()}-${randomNumber}.jpg`;
        imageUrl = await this.s3Service.uploadBase64Image(image, `banners/${fileName}`);
      } catch (error) {
        throw new BadRequestException('Failed to upload image');
      }
    }

    // If this is a default banner, unset other default banners for the same device
    if (isDefault) {
      await this.bannerModel.updateMany(
        { device, isDefault: true },
        { isDefault: false }
      );
    }

    const banner = new this.bannerModel({
      ...bannerData,
      imageUrl,
      image: image, // Keep original base64 for reference
    });

    return banner.save();
  }

  async findAll(): Promise<Banner[]> {
    return this.bannerModel.find().sort({ sortOrder: 1, createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<Banner> {
    const banner = await this.bannerModel.findById(id).exec();
    if (!banner) {
      throw new NotFoundException('Banner not found');
    }
    return banner;
  }

  async update(id: string, updateBannerDto: UpdateBannerDto): Promise<Banner> {
    const { image, isDefault, device, ...updateData } = updateBannerDto;

    // Handle image upload if provided
    if (image) {
      try {
        const randomNumber = await this.helperService.makeRandomNumber(5);
        const fileName = `banner-${Date.now()}-${randomNumber}.jpg`;
        const imageUrl = await this.s3Service.uploadBase64Image(image, `banners/${fileName}`);
        updateData['imageUrl'] = imageUrl;
        updateData['image'] = image;
      } catch (error) {
        throw new BadRequestException('Failed to upload image');
      }
    }

    // If this is a default banner, unset other default banners for the same device
    if (isDefault) {
      await this.bannerModel.updateMany(
        { device, isDefault: true, _id: { $ne: id } },
        { isDefault: false }
      );
    }

    const banner = await this.bannerModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();

    if (!banner) {
      throw new NotFoundException('Banner not found');
    }

    return banner;
  }

  async remove(id: string): Promise<Banner> {
    const banner = await this.bannerModel.findByIdAndDelete(id).exec();
    if (!banner) {
      throw new NotFoundException('Banner not found');
    }
    return banner;
  }

  async toggleStatus(id: string): Promise<Banner> {
    const banner = await this.bannerModel.findById(id).exec();
    if (!banner) {
      throw new NotFoundException('Banner not found');
    }

    banner.status = !banner.status;
    return banner.save();
  }

  async setDefault(id: string): Promise<Banner> {
    const banner = await this.bannerModel.findById(id).exec();
    if (!banner) {
      throw new NotFoundException('Banner not found');
    }

    // Unset other default banners for the same device
    await this.bannerModel.updateMany(
      { device: banner.device, isDefault: true, _id: { $ne: id } },
      { isDefault: false }
    );

    banner.isDefault = true;
    return banner.save();
  }

  async findByDevice(device: string): Promise<Banner[]> {
    return this.bannerModel.find({ device, status: true }).sort({ sortOrder: 1, isDefault: -1, createdAt: -1 }).exec();
  }

  async getDefaultBanner(device: string): Promise<Banner | null> {
    return this.bannerModel.findOne({ device, isDefault: true, status: true }).exec();
  }

  // Hero Slider specific methods
  async getHeroSliders(): Promise<Banner[]> {
    return this.bannerModel.find({ 
      device: 'hero-slider', 
      status: true 
    }).sort({ sortOrder: 1, createdAt: -1 }).exec();
  }

  async createHeroSlider(createBannerDto: CreateBannerDto): Promise<Banner> {
    // Ensure it's a hero slider
    createBannerDto.device = 'hero-slider';
    createBannerDto.type = 'hero-slider';
    
    return this.create(createBannerDto);
  }

  async updateHeroSlider(id: string, updateBannerDto: UpdateBannerDto): Promise<Banner> {
    // Ensure it's a hero slider
    updateBannerDto.device = 'hero-slider';
    updateBannerDto.type = 'hero-slider';
    
    return this.update(id, updateBannerDto);
  }

  async reorderHeroSliders(ids: string[]): Promise<void> {
    for (let i = 0; i < ids.length; i++) {
      await this.bannerModel.findByIdAndUpdate(ids[i], { sortOrder: i + 1 }).exec();
    }
  }

  async getActiveHeroSliders(): Promise<Banner[]> {
    const now = new Date();
    return this.bannerModel.find({
      device: 'hero-slider',
      status: true,
      $or: [
        { startDate: { $exists: false } },
        { startDate: { $lte: now } }
      ],
      $or: [
        { endDate: { $exists: false } },
        { endDate: { $gte: now } }
      ]
    }).sort({ sortOrder: 1, createdAt: -1 }).exec();
  }
} 