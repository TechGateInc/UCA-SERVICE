import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { StudentLoginDto, StudentSignUpDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('student/signup')
  signUp(
    @Body() signUpDto: StudentSignUpDto,
  ): Promise<{ access_token: string }> {
    return this.authService.signUp(signUpDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('student/login')
  login(@Body() loginDto: StudentLoginDto): Promise<{ access_token: string }> {
    return this.authService.login(loginDto);
  }
}
