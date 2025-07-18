import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { ResponseService } from './services/response.service';
import { HelperService } from './services/helper.service';
import { S3Service } from './services/s3.service';
import { LoggerService } from './services/logger.service';

@Global()
@Module({
  imports: [
    ConfigModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { 
          expiresIn: configService.get<string>('JWT_EXPIRES_IN', '6h') 
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    JwtStrategy,
    LocalStrategy,
    JwtAuthGuard,
    RolesGuard,
    ResponseService,
    HelperService,
    S3Service,
    LoggerService,
  ],
  exports: [
    JwtModule,
    PassportModule,
    JwtAuthGuard,
    RolesGuard,
    ResponseService,
    HelperService,
    S3Service,
    LoggerService,
  ],
})
export class CommonModule {} 