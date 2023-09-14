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

import { StudentService } from './student.service';
import { EditStudentDto } from './dto';
import { JwtStudentAuthGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import { Permission } from 'src/auth/decorator/permission.decorator';
import { StudentDocument } from './schema/student.schema';

@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}
  @UseGuards(JwtStudentAuthGuard)
  @Get('me')
  getMe(@GetUser('studentId') studentId: string) {
    return this.studentService.findById(studentId);
  }

  @Post('tag')
  @UseGuards(JwtStudentAuthGuard)
  async addTagToStudent(
    @GetUser('studentId') studentId: string,
    @Body() tag: string,
  ): Promise<StudentDocument> {
    return this.studentService.addTagToStudent(studentId, tag);
  }

  @Get()
  @Permission('University Admin')
  async getAllUsers(@Query() query: ExpressQuery) {
    return this.studentService.findAll(query);
  }

  @Get('check-email')
  async verifyEmail(@Body('email') email: string) {
    return this.studentService.findByEmail(email);
  }

  @Patch('changepassword')
  @UseGuards(JwtStudentAuthGuard)
  async changePassword(
    @GetUser('studentId') studentId: any,
    @Body('password') password: string,
  ) {
    return this.studentService.changePassword(studentId, password);
  }

  @Patch('edit')
  @UseGuards(JwtStudentAuthGuard)
  async updateUser(
    @GetUser('studentId') studentId: any,
    @Body() dto: EditStudentDto,
  ) {
    return this.studentService.update(studentId, dto);
  }

  @Delete('delete')
  @UseGuards(JwtStudentAuthGuard)
  async deleteUser(@GetUser('studentId') studentId: any) {
    return this.studentService.delete(studentId);
  }

  @Post('reset-password')
  async sendOTP(@Body('email') email: string): Promise<{ message: string }> {
    return this.studentService.sendOTP(email);
  }

  @Post('reset-password/verify')
  async verfiyOTP(
    @Body('email') email: string,
    @Body('otp') otp: string,
  ): Promise<{ message: string }> {
    return this.studentService.verifyOTP(email, otp);
  }

  @Post('reset-password/reset')
  async resetPassword(
    @Body('email') email: string,
    @Body('newPassword') newPassword: string,
  ): Promise<{ message: string }> {
    return this.studentService.resetPassword(email, newPassword);
  }
}
