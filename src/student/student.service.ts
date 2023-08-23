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
import { MailerService } from '../mail/mail.service';

@Injectable()
export class StudentService {
  constructor(
    @InjectModel(Student.name)
    private studentModel: Model<StudentDocument>,
    private readonly mailerService: MailerService,
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
    delete user.password;
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

  async update(userId: any, dto: EditStudentDto): Promise<StudentDocument> {
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

  private generateOTP(): string {
    return Math.floor(1000 + Math.random() * 8999).toString();
  }

  private async validateOTP(
    enteredOTP: string,
    storedOTP: string,
  ): Promise<boolean> {
    return enteredOTP === storedOTP;
  }

  async sendOTP(email: string): Promise<{ message: string }> {
    // Check if user exists based on email (you'll need to implement this)
    const user = await this.studentModel.findOne({ email }).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const otp = this.generateOTP();
    // console.log(otp);

    user.resetOTP = otp; // Store OTP in user's record (you'll need to implement this)
    await user.save();
    await this.mailerService.sendEmail(
      email,
      'Password Reset OTP',
      `Your OTP for password reset is: ${otp}`,
    );

    return {
      message: 'Password reset initiated. Check your email for the OTP.',
    };
  }

  async verifyOTP(email: string, otp: string): Promise<{ message: string }> {
    const user = await this.studentModel.findOne({ email }).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!(await this.validateOTP(otp, user.resetOTP))) {
      throw new BadRequestException('Invalid OTP');
    }

    return {
      message: 'OTP verified successfully.',
    };
  }

  async resetPassword(
    email: string,
    password: string,
  ): Promise<{ message: string }> {
    const user = await this.studentModel.findOne({ email }).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const newHash = await argon.hash(password);
    user.password = newHash;
    user.resetOTP = null;
    await user.save();
    return { message: 'Password reset successful.' };
  }

  async changePassword(userId: any, password: string): Promise<object> {
    const user = await this.studentModel.findById({ _id: userId }).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const newHash = await argon.hash(password);
    user.password = newHash;
    await user.save();
    return { message: 'Password changed successfully' };
  }
}
