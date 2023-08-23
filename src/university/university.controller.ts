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
  UseGuards,
} from '@nestjs/common';
import { Query as ExpressQuery } from 'express-serve-static-core';

import { UniversityService } from './university.service';
import { JwtGuard } from '../auth/guard';
import { CreateUniDto, EditUniDto } from './dto';
import { GetUser } from '../auth/decorator';

@Controller('university')
export class UniversityController {
  constructor(private readonly uniService: UniversityService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  createProduct(@GetUser('userId') userId: any, @Body() dto: CreateUniDto) {
    return this.uniService.create(userId, dto);
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  getUniById(@GetUser('userId') userId: any, @Param('id') uniId: string) {
    return this.uniService.findById(uniId);
  }

  @Get()
  async getAllUni(@Query() query: ExpressQuery) {
    return this.uniService.findAll(query);
  }

  @HttpCode(HttpStatus.OK)
  @Patch('edit/:id')
  @UseGuards(JwtGuard)
  async updateUser(
    @GetUser('userId') userId: any,
    @Param('id') uniId: string,
    @Body() dto: EditUniDto,
  ) {
    return this.uniService.update(userId, uniId, dto);
  }

  @HttpCode(HttpStatus.OK)
  @Delete('delete/:id')
  deleteProduct(@GetUser('userId') userId: any, @Param('id') uniId: string) {
    return this.uniService.delete(userId, uniId);
  }
}
