import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Department, DepartmentDocument } from './schema/department.schema';
import { Model } from 'mongoose';
import { CreateDeptDto, EditDeptDto } from './dto';
import { Query as ExpressQuery } from 'express-serve-static-core';

@Injectable()
export class DepartmentService {
  constructor(
    @InjectModel(Department.name) private deptModel: Model<DepartmentDocument>,
  ) {}

  async create(userId: string, dto: CreateDeptDto) {
    const newDepartment = new this.deptModel({
      name: dto.name,
      school: dto.school,
      creator: userId,
    });

    await newDepartment.save();
    return { message: 'Department created successfully' };
  }

  async findById(deptId: any): Promise<DepartmentDocument> {
    const department = await this.deptModel.findById({ _id: deptId }).exec();
    if (!department) {
      return Promise.reject(new NotFoundException('Department not found'));
    }
    return department;
  }

  async findAll(query: ExpressQuery): Promise<DepartmentDocument[]> {
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

    const departments = await this.deptModel
      .find({ ...keyword })
      .limit(resPerPage)
      .skip(skip);
    return departments;
  }

  async update(
    userId: any,
    deptId: string,
    dto: EditDeptDto,
  ): Promise<DepartmentDocument> {
    const department = await this.deptModel.findById({ _id: deptId });

    if (!department) {
      return Promise.reject(
        new NotFoundException({
          status: 'false',
          message: 'Department does not exists',
        }),
      );
    }
    const updateDepartment = await this.deptModel
      .findByIdAndUpdate(deptId, { $set: dto }, { new: true })
      .exec();

    return updateDepartment;
  }

  async delete(userId: any, deptId: string) {
    const department = await this.deptModel.findById({ _id: deptId });

    if (!department) {
      return Promise.reject(
        new NotFoundException({
          status: 'false',
          message: 'Department does not exists',
        }),
      );
    }
    await department.deleteOne();
    return { message: 'Department deleted successfully' };
  }
}
