import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AdminSignUpDto {
  @IsString()
  @IsNotEmpty()
  firstName?: string;

  @IsString()
  @IsNotEmpty()
  lastName?: string;

  @IsNotEmpty()
  @IsEmail()
  email?: string;

  @IsString()
  @IsNotEmpty()
  password?: string;
}
