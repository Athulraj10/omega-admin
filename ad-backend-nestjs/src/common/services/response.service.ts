import { Injectable } from '@nestjs/common';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  meta?: any;
  code?: number;
}

@Injectable()
export class ResponseService {
  successResponse<T>(data: T, message: string = 'Success', meta?: any): ApiResponse<T> {
    return {
      success: true,
      data,
      message,
      meta,
      code: 200,
    };
  }

  errorResponse(message: string, code: number = 400): ApiResponse {
    return {
      success: false,
      message,
      code,
    };
  }

  successResponseWithoutData(message: string, code: number = 200): ApiResponse {
    return {
      success: true,
      message,
      code,
    };
  }

  errorResponseData(message: string, code: number = 400): ApiResponse {
    return {
      success: false,
      message,
      code,
    };
  }
} 