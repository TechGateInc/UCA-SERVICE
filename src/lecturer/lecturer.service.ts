import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import mongoose, { Model } from 'mongoose';
import { Lecturer, LecturerDocument } from './schema/lecturer.schema';
import { MailerService } from '../mail/mail.service';
import * as argon from 'argon2';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { EditLecturerDto } from './dto';
import { InjectModel } from '@nestjs/mongoose';
import { ActivityLogService } from 'src/activity-log/activity-log.service';

@Injectable()
export class LecturerService {
  constructor(
    @InjectModel(Lecturer.name)
    private lecturerModel: Model<LecturerDocument>,
    private readonly mailerService: MailerService,
    private readonly activityLogService: ActivityLogService,
  ) {}

  async findById(userId: any): Promise<LecturerDocument> {
    const isValidId = mongoose.isValidObjectId(userId);

    if (!isValidId) {
      throw new BadRequestException('Please enter valid Id');
    }

    const user = await this.lecturerModel
      .findById({ _id: userId })
      .select('-password')
      .exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }
    delete user.password;
    return user;
  }

  async findAll(query: ExpressQuery): Promise<LecturerDocument[]> {
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

    const users = await this.lecturerModel
      .find({ ...keyword })
      .limit(resPerPage)
      .skip(skip);
    return users;
  }

  async update(userId: any, dto: EditLecturerDto): Promise<LecturerDocument> {
    const user = await this.lecturerModel.findById({ _id: userId }).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const updatedUser = await user
      .updateOne({ $set: dto }, { new: true })
      .exec();

    // Log the action
    await this.activityLogService.createActivityLog(
      user._id,
      'Lecturer Profile Updated',
    );

    return updatedUser;
  }

  async delete(userId: number): Promise<object> {
    const isValidId = mongoose.isValidObjectId(userId);

    if (!isValidId) {
      throw new BadRequestException('Please enter valid Id');
    }

    const user = await this.lecturerModel
      .findByIdAndDelete({ _id: userId })
      .exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    // Log the action
    await this.activityLogService.createActivityLog(
      user._id,
      'Lecturer Deleted',
    );

    return { message: 'user deleted successfully' };
  }

  async findByEmail(email: string): Promise<object> {
    const user = await this.lecturerModel.findOne({ email }).exec();
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
    const user = await this.lecturerModel.findOne({ email }).exec();
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
    // Log the action
    await this.activityLogService.createActivityLog(
      user._id,
      'Lecturer Password OTP sent',
    );

    return {
      message: 'Password reset initiated. Check your email for the OTP.',
    };
  }

  async verifyOTP(email: string, otp: string): Promise<{ message: string }> {
    const user = await this.lecturerModel.findOne({ email }).exec();
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
    const user = await this.lecturerModel.findOne({ email }).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const newHash = await argon.hash(password);
    user.password = newHash;
    user.resetOTP = null;
    await user.save();
    // Log the action
    await this.activityLogService.createActivityLog(
      user._id,
      'Lecturer Changed Password',
    );

    return { message: 'Password reset successful.' };
  }

  async changePassword(userId: any, password: string): Promise<object> {
    const user = await this.lecturerModel.findById({ _id: userId }).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const newHash = await argon.hash(password);
    user.password = newHash;
    await user.save();
    return { message: 'Password changed successfully' };
  }
}
