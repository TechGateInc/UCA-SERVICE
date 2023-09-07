import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Permission, PermissionDocument } from './schema/permission.schema';
import { CreatePermissionDto } from './dto';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { Model } from 'mongoose';
import { EditPermissionDto } from './dto/edit-permission.dto';
import { StaffService } from 'src/staff/staff.service';
import { createLogger, format, transports } from 'winston';

@Injectable()
export class PermissionService {
  private readonly logger = createLogger({
    format: format.combine(format.timestamp(), format.json()),
    transports: [
      new transports.Console(), // Console transport for logging to console
      new transports.File({ filename: 'logs/permission-service.log' }), // File transport for saving logs to a file
    ],
  });

  constructor(
    @InjectModel(Permission.name)
    private permissionModel: Model<PermissionDocument>,
    private readonly staffService: StaffService,
  ) {}

  async grantPermission(staffId: string, permissionName: string) {
    try {
      const staff = await this.staffService.findById(staffId);

      if (!staff) {
        throw new NotFoundException('Staff not found');
      }

      const permission = await this.permissionModel
        .findOne({ name: permissionName })
        .exec();
      if (!permission) {
        throw new NotFoundException('Permission not found');
      }
      if (!staff.permissions.includes(permission.id)) {
        staff.permissions.push(permission.id);
        await staff.save();
      }
      return { message: `Permission added for ${staff.firstName} ` };
    } catch (error) {
      this.logger.error({
        level: 'error',
        message: 'Error granting permission',
        error: error.message,
      });
      throw error;
    }
  }

  async create(userId: string, dto: CreatePermissionDto) {
    try {
      const newPermission = new this.permissionModel({
        name: dto.name,
      });

      await newPermission.save();
      return { message: 'Permission created successfully' };
    } catch (error) {
      this.logger.error({
        level: 'error',
        message: 'Error creating permission',
        error: error.message,
      });
      throw error;
    }
  }

  async findById(permissionId: any): Promise<PermissionDocument> {
    try {
      const permission = await this.permissionModel
        .findById({ _id: permissionId })
        .exec();
      if (!permission) {
        throw new NotFoundException('Permission not found');
      }
      return permission;
    } catch (error) {
      this.logger.error({
        level: 'error',
        message: 'Error finding permission by ID',
        error: error.message,
      });
      throw error;
    }
  }

  async findAll(query: ExpressQuery): Promise<PermissionDocument[]> {
    try {
      const resPerPage = 2;
      const currentPage = Number(query.page);
      const skip = resPerPage * (currentPage - 1);

      const keyword = query.keyword
        ? {
            name: {
              $regex: query.keyword,
              $options: 'i',
            },
          }
        : {};

      const permissions = await this.permissionModel
        .find({ ...keyword })
        .limit(resPerPage)
        .skip(skip);
      return permissions;
    } catch (error) {
      this.logger.error({
        level: 'error',
        message: 'Error finding all permissions',
        error: error.message,
      });
      throw error;
    }
  }

  async update(
    userId: any,
    permissionId: string,
    dto: EditPermissionDto,
  ): Promise<PermissionDocument> {
    try {
      const permission = await this.permissionModel.findById({
        _id: permissionId,
      });

      if (!permission) {
        throw new NotFoundException({
          status: 'false',
          message: 'Permission does not exist',
        });
      }
      const updatePermission = await this.permissionModel
        .findByIdAndUpdate(permissionId, { $set: dto }, { new: true })
        .exec();

      return updatePermission;
    } catch (error) {
      this.logger.error({
        level: 'error',
        message: 'Error updating permission',
        error: error.message,
      });
      throw error;
    }
  }

  async delete(userId: any, permissionId: string) {
    try {
      const permission = await this.permissionModel.findById({
        _id: permissionId,
      });

      if (!permission) {
        throw new NotFoundException({
          status: 'false',
          message: 'Permission does not exist',
        });
      }

      await permission.deleteOne();
      return { message: 'Permission deleted successfully' };
    } catch (error) {
      this.logger.error({
        level: 'error',
        message: 'Error deleting permission',
        error: error.message,
      });
      throw error;
    }
  }
}
