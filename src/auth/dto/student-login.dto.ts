import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class StudentLoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  userDeviceDetails: {
    deviceName: string | null;
    deviceType: string | null;
    deviceId: string | null | undefined;
  };
}
