import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { ActivityLogService } from 'src/activity-log/activity-log.service';
import { MailerService } from 'src/mail/mail.service';
import { Staff, StaffDocument } from './schema/staff.schema';
import { Query as ExpressQuery } from 'express-serve-static-core';
import * as argon from 'argon2';
import { EditStaffDto } from './dto/edit-staff.dto';
import { createLogger, format, transports } from 'winston';

@Injectable()
export class StaffService {
  private readonly logger = createLogger({
    format: format.combine(format.timestamp(), format.json()),
    transports: [
      new transports.Console(), // Console transport for logging to console
      new transports.File({ filename: 'logs/staff-service.log' }), // File transport for saving logs to a file
    ],
  });

  constructor(
    @InjectModel(Staff.name)
    private staffModel: Model<StaffDocument>,
    private readonly mailerService: MailerService,
    private readonly activityLogService: ActivityLogService,
  ) {}

  async findById(userId: any): Promise<StaffDocument> {
    try {
      const isValidId = mongoose.isValidObjectId(userId);

      if (!isValidId) {
        throw new BadRequestException('Please enter a valid ID');
      }

      const user = await this.staffModel
        .findById({ _id: userId })
        .select('-password')
        .exec();

      if (!user) {
        throw new NotFoundException('User not found');
      }
      delete user.password;
      return user;
    } catch (error) {
      this.logger.error({
        level: 'error',
        message: 'Error finding staff by ID',
        error: error.message,
      });
      throw error;
    }
  }

  async findAll(query: ExpressQuery): Promise<StaffDocument[]> {
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

      const users = await this.staffModel
        .find({ ...keyword })
        .limit(resPerPage)
        .skip(skip);
      return users;
    } catch (error) {
      this.logger.error({
        level: 'error',
        message: 'Error finding all staff members',
        error: error.message,
      });
      throw error;
    }
  }

  async update(userId: any, dto: EditStaffDto): Promise<StaffDocument> {
    try {
      const user = await this.staffModel.findById({ _id: userId }).exec();
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const updatedUser = await user
        .updateOne({ $set: dto }, { new: true })
        .exec();

      // Log the action
      await this.activityLogService.createActivityLog(
        user._id,
        'Staff Profile Updated',
      );

      return updatedUser;
    } catch (error) {
      this.logger.error({
        level: 'error',
        message: 'Error updating staff member',
        error: error.message,
      });
      throw error;
    }
  }

  async delete(userId: number): Promise<object> {
    try {
      const isValidId = mongoose.isValidObjectId(userId);

      if (!isValidId) {
        throw new BadRequestException('Please enter a valid ID');
      }

      const user = await this.staffModel
        .findByIdAndDelete({ _id: userId })
        .exec();
      if (!user) {
        throw new NotFoundException('User not found');
      }
      // Log the action
      await this.activityLogService.createActivityLog(
        user._id,
        'Staff Deleted',
      );

      return { message: 'User deleted successfully' };
    } catch (error) {
      this.logger.error({
        level: 'error',
        message: 'Error deleting staff member',
        error: error.message,
      });
      throw error;
    }
  }

  async findByEmail(email: string): Promise<object> {
    try {
      const user = await this.staffModel.findOne({ email }).exec();
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return { user, message: 'User found successfully' };
    } catch (error) {
      this.logger.error({
        level: 'error',
        message: 'Error finding staff member by email',
        error: error.message,
      });
      throw error;
    }
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
    try {
      // Check if user exists based on email (you'll need to implement this)
      const user = await this.staffModel.findOne({ email }).exec();
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const otp = this.generateOTP();
      // console.log(otp);

      user.resetOTP = otp; // Store OTP in the user's record (you'll need to implement this)
      await user.save();
      await this.mailerService.sendEmail(
        email,
        'Password Reset OTP',
        `Your OTP for password reset is: ${otp}`,
      );
      // Log the action
      await this.activityLogService.createActivityLog(
        user._id,
        'Staff Password OTP sent',
      );

      return {
        message: 'Password reset initiated. Check your email for the OTP.',
      };
    } catch (error) {
      this.logger.error({
        level: 'error',
        message: 'Error sending OTP for password reset',
        error: error.message,
      });
      throw error;
    }
  }

  async verifyOTP(email: string, otp: string): Promise<{ message: string }> {
    try {
      const user = await this.staffModel.findOne({ email }).exec();
      if (!user) {
        throw new NotFoundException('User not found');
      }

      if (!(await this.validateOTP(otp, user.resetOTP))) {
        throw new BadRequestException('Invalid OTP');
      }

      return {
        message: 'OTP verified successfully.',
      };
    } catch (error) {
      this.logger.error({
        level: 'error',
        message: 'Error verifying OTP',
        error: error.message,
      });
      throw error;
    }
  }

  async resetPassword(
    email: string,
    password: string,
  ): Promise<{ message: string }> {
    try {
      const user = await this.staffModel.findOne({ email }).exec();
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
        'Staff Changed Password',
      );

      return { message: 'Password reset successful.' };
    } catch (error) {
      this.logger.error({
        level: 'error',
        message: 'Error resetting password',
        error: error.message,
      });
      throw error;
    }
  }

  async changePassword(userId: any, password: string): Promise<object> {
    try {
      const user = await this.staffModel.findById({ _id: userId }).exec();
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const newHash = await argon.hash(password);
      user.password = newHash;
      await user.save();
      return { message: 'Password changed successfully' };
    } catch (error) {
      this.logger.error({
        level: 'error',
        message: 'Error changing password',
        error: error.message,
      });
      throw error;
    }
  }
}
