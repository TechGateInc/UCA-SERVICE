import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { LecturerService } from './lecturer.service';
import { GetUser } from '../auth/decorator';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { EditLecturerDto } from './dto';
// import { JwtLecturerAuthGuard } from '../auth/guard';

@Controller('lecturer')
export class LecturerController {
  constructor(private readonly lecturerService: LecturerService) {}
  // @UseGuards(JwtLecturerAuthGuard)
  @Get('me')
  getMe(@GetUser('lecturerId') lecturerId: string) {
    return this.lecturerService.findById(lecturerId);
  }

  @Get()
  async getAllUsers(@Query() query: ExpressQuery) {
    return this.lecturerService.findAll(query);
  }

  @Get('check-email')
  async verifyEmail(@Body('email') email: string) {
    return this.lecturerService.findByEmail(email);
  }

  @Patch('changepassword')
  // @UseGuards(JwtLecturerAuthGuard)
  async changePassword(
    @GetUser('lecturerId') lecturerId: any,
    @Body('password') password: string,
  ) {
    return this.lecturerService.changePassword(lecturerId, password);
  }

  @Patch('edit')
  // @UseGuards(JwtLecturerAuthGuard)
  async updateUser(
    @GetUser('lecturerId') lecturerId: any,
    @Body() dto: EditLecturerDto,
  ) {
    return this.lecturerService.update(lecturerId, dto);
  }

  @Delete('delete')
  // @UseGuards(JwtLecturerAuthGuard)
  async deleteUser(@GetUser('lecturerId') lecturerId: any) {
    return this.lecturerService.delete(lecturerId);
  }

  @Post('reset-password')
  async sendOTP(@Body('email') email: string): Promise<{ message: string }> {
    return this.lecturerService.sendOTP(email);
  }

  @Post('reset-password/verify')
  async verfiyOTP(
    @Body('email') email: string,
    @Body('otp') otp: string,
  ): Promise<{ message: string }> {
    return this.lecturerService.verifyOTP(email, otp);
  }

  @Post('reset-password/reset')
  async resetPassword(
    @Body('email') email: string,
    @Body('newPassword') newPassword: string,
  ): Promise<{ message: string }> {
    return this.lecturerService.resetPassword(email, newPassword);
  }
}
