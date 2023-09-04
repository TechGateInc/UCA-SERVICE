import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { UserdeviceService } from './userdevice.service';
import { GetUser } from 'src/auth/decorator';
import { CreateUserDeviceDto } from './dto';

@Controller('userdevice')
export class UserdeviceController {
  constructor(private readonly userDeviceService: UserdeviceService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  createUserDevice(
    @GetUser('userId') userId: any,
    @Body() dto: CreateUserDeviceDto,
  ) {
    return this.userDeviceService.create(userId, dto);
  }

  @HttpCode(HttpStatus.OK)
  @Delete('delete/:id')
  deletUserDevice(
    @GetUser('userId') userId: any,
    @Param('id') userDeviceId: string,
  ) {
    return this.userDeviceService.delete(userId, userDeviceId);
  }
}
