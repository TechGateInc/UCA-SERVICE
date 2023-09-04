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

  async create(dto: CreateUserDeviceDto, userId: any) {
    const user = await this.studentService.findById({ _id: userId });

    if (!user) {
      throw new NotFoundException('Student not found');
    }
    const newUserDevice = new this.userDeviceModel({
      deviceName: dto.deviceName,
      deviceId: dto.deviceId,
      lastLogin: dto.lastLogin,
      user: dto.user,
    });

    await newUserDevice.save();

    user.device = newUserDevice;

    return { message: 'User device added to User successfully' };
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
}
