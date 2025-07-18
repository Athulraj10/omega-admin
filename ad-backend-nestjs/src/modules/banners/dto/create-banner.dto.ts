import { IsString, IsOptional, IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsUrl } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum DeviceType {
  MOBILE = 'mobile',
  DESKTOP = 'desktop',
  TABLET = 'tablet',
  HERO_SLIDER = 'hero-slider',
}

export enum BannerType {
  BANNER = 'banner',
  HERO_SLIDER = 'hero-slider',
  PROMOTIONAL = 'promotional',
}

export enum AnimationType {
  FADE = 'fade',
  SLIDE = 'slide',
  ZOOM = 'zoom',
}

export class CreateBannerDto {
  @ApiProperty({ description: 'First line of the banner title' })
  @IsString()
  @IsNotEmpty()
  titleLine1: string;

  @ApiPropertyOptional({ description: 'Second line of the banner title' })
  @IsString()
  @IsOptional()
  titleLine2?: string;

  @ApiPropertyOptional({ description: 'Offer text to display' })
  @IsString()
  @IsOptional()
  offerText?: string;

  @ApiPropertyOptional({ description: 'Highlighted offer text' })
  @IsString()
  @IsOptional()
  offerHighlight?: string;

  @ApiPropertyOptional({ description: 'Button text' })
  @IsString()
  @IsOptional()
  buttonText?: string;

  @ApiPropertyOptional({ description: 'Button link URL' })
  @IsUrl()
  @IsOptional()
  buttonLink?: string;

  @ApiProperty({ 
    description: 'Device type for the banner',
    enum: DeviceType 
  })
  @IsEnum(DeviceType)
  device: DeviceType;

  @ApiPropertyOptional({ description: 'Whether this is the default banner for the device' })
  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;

  @ApiPropertyOptional({ description: 'Banner status' })
  @IsBoolean()
  @IsOptional()
  status?: boolean;

  @ApiProperty({ description: 'Base64 encoded image or file' })
  @IsString()
  @IsNotEmpty()
  image: string;

  @ApiPropertyOptional({ description: 'Banner type' })
  @IsEnum(BannerType)
  @IsOptional()
  type?: BannerType;

  @ApiPropertyOptional({ description: 'Background color' })
  @IsString()
  @IsOptional()
  backgroundColor?: string;

  @ApiPropertyOptional({ description: 'Text color' })
  @IsString()
  @IsOptional()
  textColor?: string;

  @ApiPropertyOptional({ description: 'Animation type' })
  @IsEnum(AnimationType)
  @IsOptional()
  animation?: AnimationType;

  @ApiPropertyOptional({ description: 'Autoplay delay in milliseconds' })
  @IsNumber()
  @IsOptional()
  autoplayDelay?: number;

  @ApiPropertyOptional({ description: 'Sort order' })
  @IsNumber()
  @IsOptional()
  sortOrder?: number;
} 