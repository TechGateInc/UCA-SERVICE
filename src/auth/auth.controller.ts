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
  @Post('refresh')
  async refresh(
    @Body('refresh_token') refreshToken: string,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ access_token: string }> {
    console.log('Reached here');

    const result = await this.authService.refreshTokens(refreshToken, response);
    return result;
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response): Promise<void> {
    const decodedToken = this.authService.decodeRefreshTokenFromRequest(
      response.req,
    );

    if (decodedToken) {
      const role = decodedToken.role;
      await this.authService.clearRefreshToken(role, decodedToken.userId);
    }

    response.clearCookie('refresh_token');
    response.json({ message: 'Logout successful' });
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('lecturer/signup')
  lecturerSignUp(
    @Body() signUpDto: StudentSignUpDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ access_token: string; user: object }> {
    return this.authService.lecturerSignUp(signUpDto, response);
  }

  @HttpCode(HttpStatus.OK)
  @Post('lecturer/login')
  lecturerLogin(
    @Body() loginDto: StudentLoginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ access_token: string; user: object }> {
    return this.authService.lecturerLogin(loginDto, response);
  }
}
