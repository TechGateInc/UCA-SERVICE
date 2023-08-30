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

import { GetUser } from 'src/auth/decorator';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { JwtStaffAuthGuard } from '../auth/guard';
import { EditStaffDto } from './dto/edit-staff.dto';
import { StaffService } from './staff.service';

@Controller('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}
  @UseGuards(JwtStaffAuthGuard)
  @Get('me')
  getMe(@GetUser('staffId') staffId: string) {
    return this.staffService.findById(staffId);
  }

  @Get()
  async getAllUsers(@Query() query: ExpressQuery) {
    return this.staffService.findAll(query);
  }

  @Get('check-email')
  async verifyEmail(@Body('email') email: string) {
    return this.staffService.findByEmail(email);
  }

  @Patch('changepassword')
  @UseGuards(JwtStaffAuthGuard)
  async changePassword(
    @GetUser('staffId') staffId: any,
    @Body('password') password: string,
  ) {
    return this.staffService.changePassword(staffId, password);
  }

  @Patch('edit')
  @UseGuards(JwtStaffAuthGuard)
  async updateUser(
    @GetUser('staffId') staffId: any,
    @Body() dto: EditStaffDto,
  ) {
    return this.staffService.update(staffId, dto);
  }

  @Delete('delete')
  @UseGuards(JwtStaffAuthGuard)
  async deleteUser(@GetUser('staffId') staffId: any) {
    return this.staffService.delete(staffId);
  }

  @Post('reset-password')
  async sendOTP(@Body('email') email: string): Promise<{ message: string }> {
    return this.staffService.sendOTP(email);
  }

  @Post('reset-password/verify')
  async verfiyOTP(
    @Body('email') email: string,
    @Body('otp') otp: string,
  ): Promise<{ message: string }> {
    return this.staffService.verifyOTP(email, otp);
  }

  @Post('reset-password/reset')
  async resetPassword(
    @Body('email') email: string,
    @Body('newPassword') newPassword: string,
  ): Promise<{ message: string }> {
    return this.staffService.resetPassword(email, newPassword);
  }
}
