import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Permission, PermissionDocument } from './schema/permission.schema';
import { CreatePermissionDto } from './dto';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { Model } from 'mongoose';
import { EditPermissionDto } from './dto/edit-permission.dto';
import { StaffService } from 'src/staff/staff.service';

@Injectable()
export class PermissionService {
  constructor(
    @InjectModel(Permission.name)
    private permissionModel: Model<PermissionDocument>,
    private readonly staffService: StaffService,
  ) {}

  async grantPermission(
    staffId: string,
    permissionName: string,
  ): Promise<void> {
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
  }

  async create(userId: string, dto: CreatePermissionDto) {
    const newPermission = new this.permissionModel({
      name: dto.name,
    });

    await newPermission.save();
    return { message: 'Permission created successfully' };
  }

  async findById(permissionId: any): Promise<PermissionDocument> {
    const permission = await this.permissionModel
      .findById({ _id: permissionId })
      .exec();
    if (!permission) {
      throw new NotFoundException('Permission not found');
    }
    return permission;
  }

  async findAll(query: ExpressQuery): Promise<PermissionDocument[]> {
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
  }

  async update(
    userId: any,
    permissionId: string,
    dto: EditPermissionDto,
  ): Promise<PermissionDocument> {
    const permission = await this.permissionModel.findById({
      _id: permissionId,
    });

    if (!permission) {
      throw new NotFoundException({
        status: 'false',
        message: 'Permission does not exists',
      });
    }
    const updatePermission = await this.permissionModel
      .findByIdAndUpdate(permissionId, { $set: dto }, { new: true })
      .exec();

    return updatePermission;
  }

  async delete(userId: any, permissionId: string) {
    const permission = await this.permissionModel.findById({
      _id: permissionId,
    });

    if (!permission) {
      throw new NotFoundException({
        status: 'false',
        message: 'Permission does not exists',
      });
    }

    await permission.deleteOne();
    return { message: 'Permission deleted successfully' };
  }
}
