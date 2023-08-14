import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { StudentService } from './student.service';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { EditStudentDto } from './dto';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';

@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}
  @UseGuards(JwtGuard)
  @Get('me')
  getMe(
    @GetUser('studentId') studentId: string,
    @GetUser('email') email: string,
  ) {
    console.log({
      studentId,
      email,
    });

    return 'user info';
  }

  @Get(':id')
  async GetUser(@GetUser('studentId') studentId: any) {
    return this.studentService.findById(studentId);
  }

  @Get()
  async getAllUsers(@Query() query: ExpressQuery) {
    return this.studentService.findAll(query);
  }

  @Get('check-email')
  async verifyEmail(@Body('email') email: string) {
    return this.studentService.findByEmail(email);
  }

  @Patch('changepassword')
  @UseGuards(JwtGuard)
  async changePassword(
    @GetUser('studentId') studentId: any,
    @Body('password') password: string,
  ) {
    return this.studentService.changePassword(studentId, password);
  }

  @Patch('edit')
  @UseGuards(JwtGuard)
  async updateUser(
    @GetUser('studentId') studentId: any,
    @Body() dto: EditStudentDto,
  ) {
    return this.studentService.update(studentId, dto);
  }

  @Delete('delete')
  @UseGuards(JwtGuard)
  async deleteUser(@GetUser('studentId') studentId: any) {
    return this.studentService.delete(studentId);
  }
}
