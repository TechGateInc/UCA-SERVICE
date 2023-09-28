import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserdeviceService } from './userdevice.service';
import { GetUser } from 'src/auth/decorator';
import { CreateUserDeviceDto } from './dto';
import { JwtStudentAuthGuard } from 'src/auth/guard';

@Controller('userdevice')
export class UserdeviceController {
  constructor(private readonly userDeviceService: UserdeviceService) {}

  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtStudentAuthGuard)
  @Post()
  async createUserDevice(
    @GetUser('studentId') studentId: any,
    @Body() dto: CreateUserDeviceDto,
  ) {
    return this.userDeviceService.create(studentId, dto);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtStudentAuthGuard)
  @Get()
  async findUserDevices(@GetUser('studentId') studentId: any) {
    return this.userDeviceService.findById(studentId);
  }

  @HttpCode(HttpStatus.OK)
  @Delete('remove/:id')
  @UseGuards(JwtStudentAuthGuard)
  async deletUserDevice(
    @GetUser('studentId') studentId: any,
    @Param('id') userDeviceId: string,
  ) {
    return this.userDeviceService.delete(studentId, userDeviceId);
  }

  @HttpCode(HttpStatus.OK)
  @Post('check/')
  @UseGuards(JwtStudentAuthGuard)
  async verifyUserDevice(
    @GetUser('studentId')
    studentId: any,
    @Body('userDeviceDetails')
    userDeviceDetails: {
      deviceName: string | null;
      deviceType: string | null;
      deviceId: string | null | undefined;
    },
  ) {
    return this.userDeviceService.checkDevice(studentId, userDeviceDetails);
  }
}
