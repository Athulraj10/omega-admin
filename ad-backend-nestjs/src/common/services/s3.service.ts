import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class S3Service {
  private isDevelopment: boolean;
  private uploadDir: string;

  constructor(private configService: ConfigService) {
    this.isDevelopment = this.configService.get<string>('NODE_ENV') === 'development';
    this.uploadDir = path.join(process.cwd(), 'uploads');
    
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async uploadBase64Image(base64Data: string, key: string): Promise<string> {
    try {
      // Remove data:image/jpeg;base64, prefix if present
      const base64Image = base64Data.replace(/^data:image\/[a-z]+;base64,/, '');
      const buffer = Buffer.from(base64Image, 'base64');

      if (this.isDevelopment) {
        // In development, save to local file system
        const fileName = path.basename(key);
        const filePath = path.join(this.uploadDir, fileName);
        
        fs.writeFileSync(filePath, buffer);
        
        // Return local file URL
        return `http://localhost:${this.configService.get('PORT', 8001)}/uploads/${fileName}`;
      } else {
        // In production, use AWS S3
        const AWS = require('aws-sdk');
        const s3 = new AWS.S3({
          accessKeyId: this.configService.get<string>('AMZ_ACCESS_KEY'),
          secretAccessKey: this.configService.get<string>('AMZ_SECRET_ACCESS_KEY'),
          region: this.configService.get<string>('AMZ_REGION'),
        });

        const params = {
          Bucket: this.configService.get<string>('AMZ_BUCKET'),
          Key: key,
          Body: buffer,
          ContentType: 'image/jpeg',
          ACL: 'public-read',
        };

        const result = await s3.upload(params).promise();
        return result.Location;
      }
    } catch (error) {
      throw new Error(`Failed to upload image: ${error.message}`);
    }
  }

  async uploadFile(file: Buffer, key: string, contentType: string): Promise<string> {
    try {
      if (this.isDevelopment) {
        // In development, save to local file system
        const fileName = path.basename(key);
        const filePath = path.join(this.uploadDir, fileName);
        
        fs.writeFileSync(filePath, file);
        
        // Return local file URL
        return `http://localhost:${this.configService.get('PORT', 8001)}/uploads/${fileName}`;
      } else {
        // In production, use AWS S3
        const AWS = require('aws-sdk');
        const s3 = new AWS.S3({
          accessKeyId: this.configService.get<string>('AMZ_ACCESS_KEY'),
          secretAccessKey: this.configService.get<string>('AMZ_SECRET_ACCESS_KEY'),
          region: this.configService.get<string>('AMZ_REGION'),
        });

        const params = {
          Bucket: this.configService.get<string>('AMZ_BUCKET'),
          Key: key,
          Body: file,
          ContentType: contentType,
          ACL: 'public-read',
        };

        const result = await s3.upload(params).promise();
        return result.Location;
      }
    } catch (error) {
      throw new Error(`Failed to upload file: ${error.message}`);
    }
  }

  async deleteFile(key: string): Promise<void> {
    try {
      if (this.isDevelopment) {
        // In development, delete from local file system
        const fileName = path.basename(key);
        const filePath = path.join(this.uploadDir, fileName);
        
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } else {
        // In production, delete from AWS S3
        const AWS = require('aws-sdk');
        const s3 = new AWS.S3({
          accessKeyId: this.configService.get<string>('AMZ_ACCESS_KEY'),
          secretAccessKey: this.configService.get<string>('AMZ_SECRET_ACCESS_KEY'),
          region: this.configService.get<string>('AMZ_REGION'),
        });

        const params = {
          Bucket: this.configService.get<string>('AMZ_BUCKET'),
          Key: key,
        };

        await s3.deleteObject(params).promise();
      }
    } catch (error) {
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  }
} 