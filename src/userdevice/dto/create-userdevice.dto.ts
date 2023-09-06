import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDeviceDto {
  @IsString()
  @IsNotEmpty()
  deviceName: string;

  @IsString()
  @IsNotEmpty()
  deviceId: string;

  @IsString()
  @IsNotEmpty()
  deviceType: string;
}
