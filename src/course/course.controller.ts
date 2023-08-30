import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { GetUser } from '../auth/decorator';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { EditCourseDto } from './dto/edit-course.dto';

@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  createCourse(@GetUser('userId') userId: any, @Body() dto: CreateCourseDto) {
    return this.courseService.create(userId, dto);
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  getCourseById(@GetUser('userId') userId: any, @Param('id') courseId: string) {
    return this.courseService.findById(courseId);
  }

  @Get()
  async getAllCourse(@Query() query: ExpressQuery) {
    return this.courseService.findAll(query);
  }

  @HttpCode(HttpStatus.OK)
  @Patch('edit/:id')
  async updateCourse(
    @GetUser('userId') userId: any,
    @Param('id') courseId: string,
    @Body() dto: EditCourseDto,
  ) {
    return this.courseService.update(userId, courseId, dto);
  }

  @HttpCode(HttpStatus.OK)
  @Delete('delete/:id')
  deleteCourse(@GetUser('userId') userId: any, @Param('id') courseId: string) {
    return this.courseService.delete(userId, courseId);
  }
}
