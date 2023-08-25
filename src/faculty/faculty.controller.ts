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
import { FacultyService } from './faculty.service';
import { CreateFacultyDto, EditFacultyDto } from './dto';

@Controller('faculty')
export class FacultyController {
  constructor(private readonly facultyService: FacultyService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  createFaculty(@GetUser('userId') userId: any, @Body() dto: CreateFacultyDto) {
    return this.facultyService.create(userId, dto);
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  getFacultyById(
    @GetUser('userId') userId: any,
    @Param('id') facultyId: string,
  ) {
    return this.facultyService.findById(facultyId);
  }

  @Get()
  async getAllFaculty(@Query() query: ExpressQuery) {
    return this.facultyService.findAll(query);
  }

  @HttpCode(HttpStatus.OK)
  @Patch('edit/:id')
  async updateFaculty(
    @GetUser('userId') userId: any,
    @Param('id') facultyId: string,
    @Body() dto: EditFacultyDto,
  ) {
    return this.facultyService.update(userId, facultyId, dto);
  }

  @HttpCode(HttpStatus.OK)
  @Delete('delete/:id')
  deleteFaculty(
    @GetUser('userId') userId: any,
    @Param('id') facultyId: string,
  ) {
    return this.facultyService.delete(userId, facultyId);
  }
}
