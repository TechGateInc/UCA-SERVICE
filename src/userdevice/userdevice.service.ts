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
        throw new NotFoundException('Student not found');
      }
      const newUserDevice = new this.userDeviceModel({
        deviceId: dto.deviceId,
        deviceName: dto.deviceName,
        deviceType: dto.deviceType,
        user: userId,
      });

      await newUserDevice.save();

      user.device = newUserDevice;

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
      throw error;
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
      throw error;
    }
  }

  async delete(userId: any, userDeviceId: string) {
    try {
      this.logger.log({
        level: 'info',
        message: 'Deleting user device',
        userId,
        userDeviceId,
      });

      const userDevice = await this.userDeviceModel.findById({
        _id: userDeviceId,
      });

      if (!userDevice) {
        throw new NotFoundException({
          status: 'false',
          message: 'User Device does not exist',
        });
      }
      console.log(userDevice.user, userId);

      if (userDevice.user != userId) {
        throw new ForbiddenException({
          status: 'false',
          message: 'Access to resource denied',
        });
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
      throw error;
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
        throw new NotFoundException('Student not found');
      }

      if (user.device == null) {
        return {
          status: 'null',
          message: 'User does not have a device registered',
        };
      }

      const deviceDetails = await this.userDeviceModel.findOne({
        deviceId: userDeviceId,
      });

      if (!deviceDetails) {
        throw new NotFoundException('Device not found');
      }

      if (user.device.deviceId === deviceDetails.deviceId) {
        this.logger.log({
          level: 'info',
          message: 'Device registered to user',
          userId,
          userDeviceId,
        });

        return { status: 'true', message: 'Device Registered to user' };
      } else {
        throw new ForbiddenException({
          status: 'false',
          message: 'Device not registered to user',
        });
      }
    } catch (error) {
      this.logger.error({
        level: 'error',
        message: 'Error checking user device',
        userId,
        userDeviceId,
        error: error.message,
      });
      throw error;
    }
  }
}
