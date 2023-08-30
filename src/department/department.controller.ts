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

import { CreateDeptDto, EditDeptDto } from './dto';
import { GetUser } from '../auth/decorator';
import { DepartmentService } from './department.service';

@Controller('department')
export class DepartmentController {
  constructor(private readonly deptService: DepartmentService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  createDept(@GetUser('userId') userId: any, @Body() dto: CreateDeptDto) {
    return this.deptService.create(userId, dto);
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  getDeptById(@GetUser('userId') userId: any, @Param('id') deptId: string) {
    return this.deptService.findById(deptId);
  }

  @Get()
  async getAllDept(@Query() query: ExpressQuery) {
    return this.deptService.findAll(query);
  }

  @HttpCode(HttpStatus.OK)
  @Patch('edit/:id')
  async updateDept(
    @GetUser('userId') userId: any,
    @Param('id') deptId: string,
    @Body() dto: EditDeptDto,
  ) {
    return this.deptService.update(userId, deptId, dto);
  }

  @HttpCode(HttpStatus.OK)
  @Delete('delete/:id')
  deleteDept(@GetUser('userId') userId: any, @Param('id') deptId: string) {
    return this.deptService.delete(userId, deptId);
  }
}
