import {
  BadRequestException,
  ConflictException,
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
import { ActivityLogService } from '../activity-log/activity-log.service';
import { createLogger, format, transports } from 'winston';

@Injectable()
export class StudentService {
  private readonly logger = createLogger({
    format: format.combine(format.timestamp(), format.json()),
    transports: [
      new transports.Console(), // Console transport for logging to console
      new transports.File({ filename: 'logs/student-service.log' }), // File transport for saving logs to a file
    ],
  });

  constructor(
    @InjectModel(Student.name)
    private studentModel: Model<StudentDocument>,
    private readonly mailerService: MailerService,
    private readonly activityLogService: ActivityLogService,
  ) {}

  async deleteExpiredOTPs(): Promise<void> {
    try {
      const expirationThreshold = new Date();
      expirationThreshold.setMinutes(expirationThreshold.getMinutes() - 3); // 3 minutes ago

      // Find and delete expired OTPs
      const expiredUsers = await this.studentModel
        .find({
          resetOTPExpiration: { $lte: expirationThreshold }, // Find OTPs expired 3 minutes ago or earlier
        })
        .exec();

      for (const user of expiredUsers) {
        user.resetOTP = null;
        user.resetOTPExpiration = null;
        await user.save();
      }
    } catch (error) {
      this.logger.error({
        level: 'error',
        message: 'Error deleting expired OTPs',
        error: error.message,
      });
      throw error;
    }
  }

  async findById(userId: any): Promise<StudentDocument> {
    try {
      const isValidId = mongoose.isValidObjectId(userId);

      if (!isValidId) {
        throw new BadRequestException('Please enter valid Id');
      }

      const user = await this.studentModel
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
        message: 'Error finding student by ID',
        error: error.message,
      });
      throw error;
    }
  }

  async findAll(query: ExpressQuery): Promise<StudentDocument[]> {
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

      const users = await this.studentModel
        .find({ ...keyword })
        .limit(resPerPage)
        .skip(skip);
      return users;
    } catch (error) {
      this.logger.error({
        level: 'error',
        message: 'Error finding all students',
        error: error.message,
      });
      throw error;
    }
  }

  async update(userId: any, dto: EditStudentDto): Promise<StudentDocument> {
    try {
      const user = await this.studentModel.findById({ _id: userId }).exec();
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const updatedUser = await user
        .updateOne({ $set: dto }, { new: true })
        .exec();

      // Log the action
      await this.activityLogService.createActivityLog(
        user._id,
        'Student Profile Updated',
      );

      return updatedUser;
    } catch (error) {
      this.logger.error({
        level: 'error',
        message: 'Error updating student',
        error: error.message,
      });
      throw error;
    }
  }

  async delete(userId: number): Promise<object> {
    try {
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
      // Log the action
      await this.activityLogService.createActivityLog(
        user._id,
        'Student Deleted',
      );
      return { message: 'User deleted successfully' };
    } catch (error) {
      this.logger.error({
        level: 'error',
        message: 'Error deleting student',
        error: error.message,
      });
      throw error;
    }
  }

  async findByEmail(email: string): Promise<object> {
    try {
      const user = await this.studentModel.findOne({ email }).exec();
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return { user, message: 'User found successfully' };
    } catch (error) {
      this.logger.error({
        level: 'error',
        message: 'Error finding student by email',
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
      const user = await this.studentModel.findOne({ email }).exec();
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const otp = this.generateOTP();
      const expirationTimestamp = new Date();
      expirationTimestamp.setMinutes(expirationTimestamp.getMinutes() + 3); // Set OTP expiration to 3 minutes from now

      user.resetOTP = otp;
      user.resetOTPExpiration = expirationTimestamp;
      // Store OTP in user's record (you'll need to implement this)
      await user.save();
      await this.mailerService.sendForgotPasswordEmail(
        email,
        otp,
        user.firstName,
      );

      // Log the action
      await this.activityLogService.createActivityLog(
        user._id,
        'Student Password OTP sent',
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
      const user = await this.studentModel.findOne({ email }).exec();
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
        'Student Changed Password',
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
      const user = await this.studentModel.findById({ _id: userId }).exec();
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

  async addTagToStudent(studentId: any, tag: string): Promise<StudentDocument> {
    try {
      const student = await this.studentModel.findById(studentId).exec();
      if (!student) {
        throw new NotFoundException('Student not found');
      }

      // Check if the tag is already used by another student
      const tagExists = await this.studentModel.findOne({ tag }).exec();

      if (tagExists) {
        throw new ConflictException(`This Tag ${tag} already in use`);
      }

      student.userTag = tag;
      await student.save();

      delete student.password;

      // Log the action
      await this.activityLogService.createActivityLog(
        student.email,
        `Student Tag Added ${tag}`,
      );
      return student;
    } catch (error) {
      this.logger.error({
        level: 'error',
        message: 'Error adding tag to student',
        error: error.message,
      });
      throw error;
    }
  }
}
