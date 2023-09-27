import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Faculty, FacultyDocument } from './schema/faculty.schema';
import { CreateFacultyDto, EditFacultyDto } from './dto';
import { Model } from 'mongoose';
import { Query as ExpressQuery } from 'express-serve-static-core';

@Injectable()
export class FacultyService {
  constructor(
    @InjectModel(Faculty.name) private facultyModel: Model<FacultyDocument>,
  ) {}

  async create(userId: string, dto: CreateFacultyDto) {
    const newFaculty = new this.facultyModel({
      name: dto.name,
      school: dto.school,
      creator: userId,
    });

    await newFaculty.save();
    return { message: 'Faculty created successfully' };
  }

  async findById(facultyId: any): Promise<FacultyDocument> {
    const faculty = await this.facultyModel.findById({ _id: facultyId }).exec();
    if (!faculty) {
      return Promise.reject(new NotFoundException('Faculty not found'));
    }
    return faculty;
  }

  async findAll(query: ExpressQuery): Promise<FacultyDocument[]> {
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

    const faculties = await this.facultyModel
      .find({ ...keyword })
      .limit(resPerPage)
      .skip(skip);
    return faculties;
  }

  async update(
    userId: any,
    facultyId: string,
    dto: EditFacultyDto,
  ): Promise<FacultyDocument> {
    const faculty = await this.facultyModel.findById({ _id: facultyId });

    if (!faculty) {
      return Promise.reject(
        new NotFoundException({
          status: 'false',
          message: 'Faculty does not exists',
        }),
      );
    }
    const updateFaculty = await this.facultyModel
      .findByIdAndUpdate(facultyId, { $set: dto }, { new: true })
      .exec();

    return updateFaculty;
  }

  async delete(userId: any, facultyId: string) {
    const faculty = await this.facultyModel.findById({ _id: facultyId });

    if (!faculty) {
      return Promise.reject(
        new NotFoundException({
          status: 'false',
          message: 'Faculty does not exists',
        }),
      );
    }

    await faculty.deleteOne();
    return { message: 'Faculty deleted successfully' };
  }
}
