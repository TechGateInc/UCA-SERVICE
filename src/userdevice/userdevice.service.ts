import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserDevice, UserDeviceDocument } from './schema/userdevice.schema';
import { Model } from 'mongoose';
import { CreateUserDeviceDto } from './dto';
import { StudentService } from 'src/student/student.service';
import { transports, createLogger, format } from 'winston';

@Injectable()
export class UserdeviceService {
  private readonly logger = createLogger({
    format: format.combine(format.timestamp(), format.json()),
    transports: [
      new transports.Console(), // Console transport for logging to console
      new transports.File({ filename: 'logs/userdevice-service.log' }), // File transport for saving logs to a file
    ],
  });

  constructor(
    @InjectModel(UserDevice.name)
    private userDeviceModel: Model<UserDeviceDocument>,
    private studentService: StudentService,
  ) {}

  async create(userId: any, dto: CreateUserDeviceDto) {
    try {
      this.logger.log({
        level: 'info',
        message: 'Creating user device',
        userId,
        device: dto,
      });

      const user = await this.studentService.findById(userId);
      if (!user) {
        return Promise.reject(new NotFoundException('Student not found'));
      }
      const newUserDevice = new this.userDeviceModel({
        deviceId: dto.deviceId,
        deviceName: dto.deviceName,
        deviceType: dto.deviceType,
        user: userId,
      });

      user.device = newUserDevice;
      await newUserDevice.save();

      await user.save();

      this.logger.log({
        level: 'info',
        message: 'User device created successfully',
        userId,
        device: newUserDevice,
      });

      return { message: 'User device added to User successfully' };
    } catch (error) {
      this.logger.error({
        level: 'error',
        message: 'Error creating user device',
        error: error.message,
      });
      return Promise.reject(new Error('An unexpected error occurred')); // Re-return Promise.reject( the error to let the global error handler handle i)t
    }
  }

  async findById(userId: any) {
    try {
      this.logger.log({
        level: 'info',
        message: 'Finding user device by user ID',
        userId,
      });

      const userDevice = await this.userDeviceModel.findOne({
        user: userId,
      });

      this.logger.log({
        level: 'info',
        message: 'User device found by user ID',
        userId,
        device: userDevice,
      });

      return userDevice;
    } catch (error) {
      this.logger.error({
        level: 'error',
        message: 'Error finding user device by user ID',
        userId,
        error: error.message,
      });
      return Promise.reject(new Error('An unexpected error occurred')); // Re-return Promise.reject( the error to let the global error handler handle i)t
    }
  }

  async delete(userId: any, userDeviceId: any) {
    try {
      this.logger.log({
        level: 'info',
        message: 'Deleting user device',
        userId,
        userDeviceId,
      });

      const userDevice = await this.userDeviceModel.findById(userDeviceId); // Ensure userDeviceId is a string or valid ObjectId

      if (!userDevice) {
        return Promise.reject(
          new NotFoundException({
            status: 'false',
            message: 'User Device does not exist',
          }),
        );
      }
      if (userDevice.user != userId) {
        return Promise.reject(
          new ForbiddenException({
            status: 'false',
            message: 'Access to resource denied',
          }),
        );
      }

      await userDevice.deleteOne();

      this.logger.log({
        level: 'info',
        message: 'User device removed successfully',
        userId,
        userDeviceId,
      });

      return { message: 'User Device removed successfully' };
    } catch (error) {
      this.logger.error({
        level: 'error',
        message: 'Error deleting user device',
        userId,
        userDeviceId,
        error: error.message,
      });
      return Promise.reject(new Error('An unexpected error occurred')); // Re-return Promise.reject( the error to let the global error handler handle i)t
    }
  }

  async checkDevice(userId: any, userDeviceId: string) {
    try {
      this.logger.log({
        level: 'info',
        message: 'Checking user device',
        userId,
        userDeviceId,
      });

      const user = await this.studentService.findById(userId);

      if (!user) {
        return Promise.reject(new ForbiddenException('Student not found'));
      }

      if (!user.device) {
        // Log the action
        this.logger.log({
          level: 'info',
          message: `Student has no registered device: ${user.email}`,
        });
        return null;
      }

      // Fetch the device details using the user.device reference
      const deviceDetails = await this.userDeviceModel.findById(user.device);

      if (!deviceDetails) {
        // Log the action
        this.logger.log({
          level: 'info',
          message: `Student has no registered device: ${user.email}`,
        });
        return null; // Return null when the device is not found
      }

      if (deviceDetails.deviceId === userDeviceId) {
        this.logger.log({
          level: 'info',
          message: 'Device registered to user',
          userId,
          userDeviceId,
        });

        return deviceDetails;
      } else {
        this.logger.log({
          level: 'info',
          message: `Student has another device registered: ${user.email}`,
        });
        return null; // Return null when the device is not registered to the user
      }
    } catch (error) {
      this.logger.error({
        level: 'error',
        message: 'Error checking user device',
        userId,
        userDeviceId,
        error: error.message,
      });

      return Promise.reject(new Error('An unexpected error occurred')); // Re-return Promise.reject( the error to let the global error handler handle i)t
    }
  }
}
