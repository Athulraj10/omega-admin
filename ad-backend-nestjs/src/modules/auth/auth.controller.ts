import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from '../../common/guards/local-auth.guard';
import { ResponseService } from '../../common/services/response.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

export class LoginDto {
  email: string;
  password: string;
}

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private responseService: ResponseService,
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'Admin login' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );
    
    if (!user) {
      return this.responseService.errorResponse('Invalid credentials', 401);
    }

    const result = await this.authService.login(user);
    return this.responseService.successResponse(
      result.user,
      'Login successful',
      { token: result.access_token }
    );
  }
} 