import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Query,
  Put,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { BannersService } from './banners.service';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ResponseService } from '../../common/services/response.service';

@ApiTags('Banners')
@Controller('banners')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class BannersController {
  constructor(
    private readonly bannersService: BannersService,
    private readonly responseService: ResponseService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new banner' })
  @ApiResponse({ status: 201, description: 'Banner created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(@Body() createBannerDto: CreateBannerDto) {
    const banner = await this.bannersService.create(createBannerDto);
    return this.responseService.successResponse(
      banner,
      'Banner created successfully'
    );
  }

  @Post('hero-slider')
  @ApiOperation({ summary: 'Create a new hero slider' })
  @ApiResponse({ status: 201, description: 'Hero slider created successfully' })
  async createHeroSlider(@Body() createBannerDto: CreateBannerDto) {
    const banner = await this.bannersService.createHeroSlider(createBannerDto);
    return this.responseService.successResponse(
      banner,
      'Hero slider created successfully'
    );
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({ summary: 'Upload banner image' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    // Handle file upload logic here
    return this.responseService.successResponse(
      { filename: file.filename },
      'Image uploaded successfully'
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all banners' })
  @ApiResponse({ status: 200, description: 'Banners retrieved successfully' })
  async findAll(@Query('device') device?: string) {
    let banners;
    if (device) {
      banners = await this.bannersService.findByDevice(device);
    } else {
      banners = await this.bannersService.findAll();
    }
    return this.responseService.successResponse(
      banners,
      'Banners retrieved successfully'
    );
  }

  @Get('hero-slider')
  @ApiOperation({ summary: 'Get all hero sliders' })
  @ApiResponse({ status: 200, description: 'Hero sliders retrieved successfully' })
  async getHeroSliders() {
    const banners = await this.bannersService.getHeroSliders();
    return this.responseService.successResponse(
      banners,
      'Hero sliders retrieved successfully'
    );
  }

  @Get('hero-slider/active')
  @ApiOperation({ summary: 'Get active hero sliders for frontend' })
  @ApiResponse({ status: 200, description: 'Active hero sliders retrieved successfully' })
  async getActiveHeroSliders() {
    const banners = await this.bannersService.getActiveHeroSliders();
    return this.responseService.successResponse(
      banners,
      'Active hero sliders retrieved successfully'
    );
  }

  @Get('default/:device')
  @ApiOperation({ summary: 'Get default banner for device' })
  @ApiResponse({ status: 200, description: 'Default banner retrieved successfully' })
  async getDefaultBanner(@Param('device') device: string) {
    const banner = await this.bannersService.getDefaultBanner(device);
    return this.responseService.successResponse(
      banner,
      'Default banner retrieved successfully'
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get banner by ID' })
  @ApiResponse({ status: 200, description: 'Banner retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Banner not found' })
  async findOne(@Param('id') id: string) {
    const banner = await this.bannersService.findOne(id);
    return this.responseService.successResponse(
      banner,
      'Banner retrieved successfully'
    );
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update banner' })
  @ApiResponse({ status: 200, description: 'Banner updated successfully' })
  @ApiResponse({ status: 404, description: 'Banner not found' })
  async update(
    @Param('id') id: string,
    @Body() updateBannerDto: UpdateBannerDto,
  ) {
    const banner = await this.bannersService.update(id, updateBannerDto);
    return this.responseService.successResponse(
      banner,
      'Banner updated successfully'
    );
  }

  @Patch('hero-slider/:id')
  @ApiOperation({ summary: 'Update hero slider' })
  @ApiResponse({ status: 200, description: 'Hero slider updated successfully' })
  async updateHeroSlider(
    @Param('id') id: string,
    @Body() updateBannerDto: UpdateBannerDto,
  ) {
    const banner = await this.bannersService.updateHeroSlider(id, updateBannerDto);
    return this.responseService.successResponse(
      banner,
      'Hero slider updated successfully'
    );
  }

  @Put('hero-slider/reorder')
  @ApiOperation({ summary: 'Reorder hero sliders' })
  @ApiResponse({ status: 200, description: 'Hero sliders reordered successfully' })
  async reorderHeroSliders(@Body() body: { ids: string[] }) {
    await this.bannersService.reorderHeroSliders(body.ids);
    return this.responseService.successResponse(
      null,
      'Hero sliders reordered successfully'
    );
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Toggle banner status' })
  @ApiResponse({ status: 200, description: 'Banner status updated successfully' })
  async toggleStatus(@Param('id') id: string) {
    const banner = await this.bannersService.toggleStatus(id);
    return this.responseService.successResponse(
      banner,
      'Banner status updated successfully'
    );
  }

  @Patch(':id/default')
  @ApiOperation({ summary: 'Set banner as default' })
  @ApiResponse({ status: 200, description: 'Default banner set successfully' })
  async setDefault(@Param('id') id: string) {
    const banner = await this.bannersService.setDefault(id);
    return this.responseService.successResponse(
      banner,
      'Default banner set successfully'
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete banner' })
  @ApiResponse({ status: 200, description: 'Banner deleted successfully' })
  @ApiResponse({ status: 404, description: 'Banner not found' })
  async remove(@Param('id') id: string) {
    const banner = await this.bannersService.remove(id);
    return this.responseService.successResponse(
      banner,
      'Banner deleted successfully'
    );
  }
} 