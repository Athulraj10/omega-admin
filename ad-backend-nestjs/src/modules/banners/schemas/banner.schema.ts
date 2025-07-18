import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BannerDocument = Banner & Document;

@Schema({ timestamps: true })
export class Banner {
  @Prop({ required: true })
  titleLine1: string;

  @Prop()
  titleLine2: string;

  @Prop()
  offerText: string;

  @Prop()
  offerHighlight: string;

  @Prop()
  buttonText: string;

  @Prop()
  buttonLink: string;

  @Prop({ required: true })
  device: string; // 'mobile', 'desktop', 'tablet', 'hero-slider'

  @Prop({ default: false })
  isDefault: boolean;

  @Prop({ default: true })
  status: boolean;

  @Prop({ required: true })
  image: string; // Base64 encoded image or S3 URL

  @Prop()
  imageUrl: string; // S3 URL if uploaded to S3

  @Prop()
  sortOrder: number;

  @Prop()
  startDate: Date;

  @Prop()
  endDate: Date;

  @Prop({ default: 'banner' })
  type: string; // 'banner', 'hero-slider', 'promotional'

  @Prop()
  backgroundColor: string;

  @Prop()
  textColor: string;

  @Prop()
  animation: string; // 'fade', 'slide', 'zoom'

  @Prop({ default: 2500 })
  autoplayDelay: number; // in milliseconds
}

export const BannerSchema = SchemaFactory.createForClass(Banner);

// Ensure only one default banner per device
BannerSchema.index({ device: 1, isDefault: 1 }, { unique: true, partialFilterExpression: { isDefault: true } }); 