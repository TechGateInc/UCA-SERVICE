import { IsDate, IsNotEmpty, IsString } from 'class-validator';
import { Date } from 'mongoose';

export class CreateUserDeviceDto {
  @IsString()
  @IsNotEmpty()
  deviceName: string;

  @IsString()
  @IsNotEmpty()
  user: string;

  @IsString()
  @IsNotEmpty()
  deviceId: string;

  @IsDate()
  @IsNotEmpty()
  lastLogin: Date;
}
