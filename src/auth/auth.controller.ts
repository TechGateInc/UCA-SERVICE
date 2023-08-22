import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { StudentLoginDto, StudentSignUpDto } from './dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('student/signup')
  signUp(
    @Body() signUpDto: StudentSignUpDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ access_token: string; user: object }> {
    return this.authService.signUp(signUpDto, response);
  }

  @HttpCode(HttpStatus.OK)
  @Post('student/login')
  login(
    @Body() loginDto: StudentLoginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ access_token: string; user: object }> {
    return this.authService.login(loginDto, response);
  }

  @HttpCode(HttpStatus.OK)
  @Post('student/refresh')
  async refresh(
    @Body('refresh_token') refreshToken: string,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ access_token: string }> {
    const result = await this.authService.refreshTokens(refreshToken, response);
    return result;
  }

  @HttpCode(HttpStatus.OK)
  @Post('student/logout')
  async logout(@Res({ passthrough: true }) response: Response): Promise<void> {
    // Clear the refresh token from the database
    const decodedToken = this.authService.decodeRefreshTokenFromRequest(
      response.req,
    );
    if (decodedToken) {
      await this.authService.clearRefreshToken(decodedToken.studentId);
    }

    // Clear the refresh token cookie
    response.clearCookie('refresh_token');

    // Optionally, you can return a response indicating successful logout
    response.json({ message: 'Logout successful' });
  }
}
