import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Query as ExpressQuery } from 'express-serve-static-core';

import { Course, CourseDocument } from './schema/course.schema';
import { EditCourseDto } from './dto/edit-course.dto';
import { CreateCourseDto } from './dto/create-course.dto';

@Injectable()
export class CourseService {
  constructor(
    @InjectModel(Course.name) private courseModel: Model<CourseDocument>,
  ) {}

  async create(userId: string, dto: CreateCourseDto) {
    const newCourse = new this.courseModel({
      title: dto.title,
      courseabrev: dto.courseabrev,
      unit: dto.unit,
    });

    await newCourse.save();
    return { message: 'Course created successfully' };
  }

  async findById(courseId: any): Promise<CourseDocument> {
    const course = await this.courseModel.findById({ _id: courseId }).exec();
    if (!course) {
      throw new NotFoundException('Course not found');
    }
    return course;
  }

  async findAll(query: ExpressQuery): Promise<CourseDocument[]> {
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

    const courses = await this.courseModel
      .find({ ...keyword })
      .limit(resPerPage)
      .skip(skip);
    return courses;
  }

  async update(
    userId: any,
    courseId: string,
    dto: EditCourseDto,
  ): Promise<CourseDocument> {
    const course = await this.courseModel.findById({ _id: courseId });

    if (!course) {
      throw new NotFoundException({
        status: 'false',
        message: 'Course does not exists',
      });
    }
    const updateCourse = await this.courseModel
      .findByIdAndUpdate(courseId, { $set: dto }, { new: true })
      .exec();

    return updateCourse;
  }

  async delete(userId: any, courseId: string) {
    const course = await this.courseModel.findById({ _id: courseId });

    if (!course) {
      throw new NotFoundException({
        status: 'false',
        message: 'Course does not exists',
      });
    }
    await course.deleteOne();
    return { message: 'Course deleted successfully' };
  }
}
