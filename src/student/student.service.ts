import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import * as argon from 'argon2';
import { Query as ExpressQuery } from 'express-serve-static-core';

import { Student, StudentDocument } from './schema/student.schema';
import { EditStudentDto } from './dto';

@Injectable()
export class StudentService {
  constructor(
    @InjectModel(Student.name)
    private studentModel: Model<StudentDocument>,
  ) {}

  async findById(userId: any): Promise<StudentDocument> {
    const isValidId = mongoose.isValidObjectId(userId);

    if (!isValidId) {
      throw new BadRequestException('Please enter valid Id');
    }

    const user = await this.studentModel.findById({ _id: userId }).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findAll(query: ExpressQuery): Promise<StudentDocument[]> {
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

    const users = await this.studentModel
      .find({ ...keyword })
      .limit(resPerPage)
      .skip(skip);
    return users;
  }

  async changePassword(userId: any, password: string): Promise<object> {
    console.log(userId);

    const isValidId = mongoose.isValidObjectId(userId);

    if (!isValidId) {
      throw new BadRequestException('Please enter valid Id');
    }

    const user = await this.studentModel.findById({ _id: userId }).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const newHash = await argon.hash(password);
    user.password = newHash;
    await user.save();
    return { message: 'Password changed successfully' };
  }

  async update(userId: any, dto: EditStudentDto): Promise<StudentDocument> {
    const isValidId = mongoose.isValidObjectId(userId);

    if (!isValidId) {
      throw new BadRequestException('Please enter valid Id');
    }

    const user = await this.studentModel.findById({ _id: userId }).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const updatedUser = await user
      .updateOne({ $set: dto }, { new: true })
      .exec();
    return updatedUser;
  }

  async delete(userId: number): Promise<object> {
    const isValidId = mongoose.isValidObjectId(userId);

    if (!isValidId) {
      throw new BadRequestException('Please enter valid Id');
    }

    const user = await this.studentModel
      .findByIdAndDelete({ _id: userId })
      .exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return { message: 'user deleted successfully' };
  }

  async findByEmail(email: string): Promise<object> {
    const user = await this.studentModel.findOne({ email }).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return { user, message: 'user deleted successfully' };
  }
}
