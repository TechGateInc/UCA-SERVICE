import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Query as ExpressQuery } from 'express-serve-static-core';
import * as argon from 'argon2';
import { transports, createLogger, format } from 'winston';

import { Admin, AdminDocument } from './schema/admin.schema';
import { MailerService } from 'src/mail/mail.service';
import { ActivityLogService } from 'src/activity-log/activity-log.service';
import { EditAdminDto } from './dto';

@Injectable()
export class AdminService {
  private readonly logger = createLogger({
    format: format.combine(format.timestamp(), format.json()),
    transports: [
      new transports.Console(), // Console transport for logging to console
      new transports.File({ filename: 'logs/admin-service.log' }), // File transport for saving logs to a file
    ],
  });

  constructor(
    @InjectModel(Admin.name)
    private adminModel: Model<AdminDocument>,
    private readonly mailerService: MailerService,
    private readonly activityLogService: ActivityLogService,
  ) {}

  async findById(userId: any): Promise<AdminDocument> {
    try {
      this.logger.log({
        level: 'info',
        message: 'Finding admin by ID',
        userId,
      });

      const isValidId = mongoose.isValidObjectId(userId);

      if (!isValidId) {
        throw new BadRequestException('Please enter valid ID');
      }

      const user = await this.adminModel
        .findById({ _id: userId })
        .select('-password')
        .exec();

      if (!user) {
        throw new NotFoundException('User not found');
      }

      delete user.password;

      this.logger.log({
        level: 'info',
        message: 'Admin found by ID',
        userId,
      });

      return user;
    } catch (error) {
      this.logger.error({
        level: 'error',
        message: 'Error finding admin by ID',
        userId,
        error: error.message,
      });
      throw error;
    }
  }

  async findAll(query: ExpressQuery): Promise<AdminDocument[]> {
    try {
      this.logger.log({
        level: 'info',
        message: 'Finding all admins',
      });

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

      const users = await this.adminModel
        .find({ ...keyword })
        .limit(resPerPage)
        .skip(skip);

      this.logger.log({
        level: 'info',
        message: 'All admins found',
      });

      return users;
    } catch (error) {
      this.logger.error({
        level: 'error',
        message: 'Error finding all admins',
        error: error.message,
      });
      throw error;
    }
  }

  async update(userId: any, dto: EditAdminDto): Promise<AdminDocument> {
    try {
      this.logger.log({
        level: 'info',
        message: 'Updating admin profile',
        userId,
      });

      const user = await this.adminModel.findById({ _id: userId }).exec();

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const updatedUser = await user
        .updateOne({ $set: dto }, { new: true })
        .exec();

      // Log the action
      await this.activityLogService.createActivityLog(
        user._id,
        'Admin Profile Updated',
      );

      this.logger.log({
        level: 'info',
        message: 'Admin profile updated successfully',
        userId,
      });

      return updatedUser;
    } catch (error) {
      this.logger.error({
        level: 'error',
        message: 'Error updating admin profile',
        userId,
        error: error.message,
      });
      throw error;
    }
  }

  async delete(userId: number): Promise<object> {
    try {
      this.logger.log({
        level: 'info',
        message: 'Deleting admin',
        userId,
      });

      const isValidId = mongoose.isValidObjectId(userId);

      if (!isValidId) {
        throw new BadRequestException('Please enter a valid ID');
      }

      const user = await this.adminModel
        .findByIdAndDelete({ _id: userId })
        .exec();

      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Log the action
      await this.activityLogService.createActivityLog(
        user._id,
        'Admin Deleted',
      );

      this.logger.log({
        level: 'info',
        message: 'Admin deleted successfully',
        userId,
      });

      return { message: 'User deleted successfully' };
    } catch (error) {
      this.logger.error({
        level: 'error',
        message: 'Error deleting admin',
        userId,
        error: error.message,
      });
      throw error;
    }
  }

  async findByEmail(email: string): Promise<object> {
    try {
      this.logger.log({
        level: 'info',
        message: 'Finding admin by email',
        email,
      });

      const user = await this.adminModel.findOne({ email }).exec();

      if (!user) {
        throw new NotFoundException('User not found');
      }

      this.logger.log({
        level: 'info',
        message: 'Admin found by email',
        email,
      });

      return { user, message: 'User found successfully' };
    } catch (error) {
      this.logger.error({
        level: 'error',
        message: 'Error finding admin by email',
        email,
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
      this.logger.log({
        level: 'info',
        message: 'Sending OTP for admin password reset',
        email,
      });

      const user = await this.adminModel.findOne({ email }).exec();

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const otp = this.generateOTP();

      user.resetOTP = otp;
      await user.save();
      await this.mailerService.sendForgotPasswordEmail(email, otp);

      // Log the action
      await this.activityLogService.createActivityLog(
        user._id,
        'Admin Password OTP sent',
      );

      this.logger.log({
        level: 'info',
        message: 'OTP sent for admin password reset',
        email,
      });

      return {
        message: 'Password reset initiated. Check your email for the OTP.',
      };
    } catch (error) {
      this.logger.error({
        level: 'error',
        message: 'Error sending OTP for admin password reset',
        email,
        error: error.message,
      });
      throw error;
    }
  }

  async verifyOTP(email: string, otp: string): Promise<{ message: string }> {
    try {
      this.logger.log({
        level: 'info',
        message: 'Verifying OTP for admin password reset',
        email,
      });

      const user = await this.adminModel.findOne({ email }).exec();

      if (!user) {
        throw new NotFoundException('User not found');
      }

      if (!(await this.validateOTP(otp, user.resetOTP))) {
        throw new BadRequestException('Invalid OTP');
      }

      this.logger.log({
        level: 'info',
        message: 'OTP verified successfully for admin password reset',
        email,
      });

      return {
        message: 'OTP verified successfully.',
      };
    } catch (error) {
      this.logger.error({
        level: 'error',
        message: 'Error verifying OTP for admin password reset',
        email,
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
      this.logger.log({
        level: 'info',
        message: 'Resetting admin password',
        email,
      });

      const user = await this.adminModel.findOne({ email }).exec();

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
        'Admin Changed Password',
      );

      this.logger.log({
        level: 'info',
        message: 'Admin password reset successfully',
        email,
      });

      return { message: 'Password reset successful.' };
    } catch (error) {
      this.logger.error({
        level: 'error',
        message: 'Error resetting admin password',
        email,
        error: error.message,
      });
      throw error;
    }
  }

  async changePassword(userId: any, password: string): Promise<object> {
    try {
      this.logger.log({
        level: 'info',
        message: 'Changing admin password',
        userId,
      });

      const user = await this.adminModel.findById({ _id: userId }).exec();

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const newHash = await argon.hash(password);
      user.password = newHash;
      await user.save();

      this.logger.log({
        level: 'info',
        message: 'Admin password changed successfully',
        userId,
      });

      return { message: 'Password changed successfully' };
    } catch (error) {
      this.logger.error({
        level: 'error',
        message: 'Error changing admin password',
        userId,
        error: error.message,
      });
      throw error;
    }
  }
}
