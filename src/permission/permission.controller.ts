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
import { GetUser } from 'src/auth/decorator';
import { PermissionService } from './permission.service';
import { CreatePermissionDto, EditPermissionDto } from './dto';

@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post(':staffId/add/:permission')
  grantPermission(
    @Param('staffId') staffId: string,
    @Param('permission') permission: string,
  ) {
    return this.permissionService.grantPermission(staffId, permission);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post()
  createDept(@GetUser('userId') userId: any, @Body() dto: CreatePermissionDto) {
    return this.permissionService.create(userId, dto);
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  getDeptById(
    @GetUser('userId') userId: any,
    @Param('id') permisionId: string,
  ) {
    return this.permissionService.findById(permisionId);
  }

  @Get()
  async getAllDept(@Query() query: ExpressQuery) {
    return this.permissionService.findAll(query);
  }

  @HttpCode(HttpStatus.OK)
  @Patch('edit/:id')
  async updateDept(
    @GetUser('userId') userId: any,
    @Param('id') permisionId: string,
    @Body() dto: EditPermissionDto,
  ) {
    return this.permissionService.update(userId, permisionId, dto);
  }

  @HttpCode(HttpStatus.OK)
  @Delete('delete/:id')
  deleteDept(@GetUser('userId') userId: any, @Param('id') permisionId: string) {
    return this.permissionService.delete(userId, permisionId);
  }
}
