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

@Injectable()
export class UserdeviceService {
  constructor(
    @InjectModel(UserDevice.name)
    private userDeviceModel: Model<UserDeviceDocument>,
    private studentService: StudentService,
  ) {}

  async create(userId: any, dto: CreateUserDeviceDto) {
    console.log(userId);

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

    return { message: 'User device added to User successfully' };
  }

  async findById(userId: any) {
    const userDevice = await this.userDeviceModel.findOne({
      user: userId,
    });
    return userDevice;
  }

  async delete(userId: any, userDeviceId: string) {
    const userDevice = await this.userDeviceModel.findById({
      _id: userDeviceId,
    });

    if (!userDevice) {
      throw new NotFoundException({
        status: 'false',
        message: 'User Device does not exists',
      });
    }
    if (userDevice.user !== userId) {
      throw new ForbiddenException({
        status: 'false',
        message: 'Access to resource denied',
      });
    }

    await userDevice.deleteOne();
    return { message: 'User Device removed successfully' };
  }

  async checkDevice(userId: any, userDeviceId: string) {
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
      return { status: 'true', message: 'Device Registered to user' };
    } else {
      throw new ForbiddenException({
        status: 'false',
        message: 'Device not to registered to user',
      });
    }
  }
}
