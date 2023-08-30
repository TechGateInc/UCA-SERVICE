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

import { Query as ExpressQuery } from 'express-serve-static-core';
import { JwtAdminAuthGuard } from 'src/auth/guard';
import { AdminService } from './admin.service';
import { EditAdminDto } from './dto';
import { GetUser } from 'src/auth/decorator';
import { Permission } from 'src/auth/decorator/permission.decorator';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}
  @UseGuards(JwtAdminAuthGuard)
  @Get('me')
  getMe(@GetUser('adminId') adminId: string) {
    return this.adminService.findById(adminId);
  }

  @Get()
  @Permission('University Admin')
  async getAllUsers(@Query() query: ExpressQuery) {
    return this.adminService.findAll(query);
  }

  @Get('check-email')
  async verifyEmail(@Body('email') email: string) {
    return this.adminService.findByEmail(email);
  }

  @Patch('changepassword')
  @UseGuards(JwtAdminAuthGuard)
  async changePassword(
    @GetUser('adminId') adminId: any,
    @Body('password') password: string,
  ) {
    return this.adminService.changePassword(adminId, password);
  }

  @Patch('edit')
  @UseGuards(JwtAdminAuthGuard)
  async updateUser(
    @GetUser('adminId') adminId: any,
    @Body() dto: EditAdminDto,
  ) {
    return this.adminService.update(adminId, dto);
  }

  @Delete('delete')
  @UseGuards(JwtAdminAuthGuard)
  async deleteUser(@GetUser('adminId') adminId: any) {
    return this.adminService.delete(adminId);
  }

  @Post('reset-password')
  async sendOTP(@Body('email') email: string): Promise<{ message: string }> {
    return this.adminService.sendOTP(email);
  }

  @Post('reset-password/verify')
  async verfiyOTP(
    @Body('email') email: string,
    @Body('otp') otp: string,
  ): Promise<{ message: string }> {
    return this.adminService.verifyOTP(email, otp);
  }

  @Post('reset-password/reset')
  async resetPassword(
    @Body('email') email: string,
    @Body('newPassword') newPassword: string,
  ): Promise<{ message: string }> {
    return this.adminService.resetPassword(email, newPassword);
  }
}
