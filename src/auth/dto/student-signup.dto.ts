import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class StudentSignUpDto {
  @IsString()
  @IsNotEmpty()
  firstName?: string;

  @IsString()
  @IsNotEmpty()
  lastName?: string;

  @IsString()
  @IsOptional()
  otherName?: string;

  @IsNotEmpty()
  @IsEmail()
  email?: string;

  @IsString()
  @IsNotEmpty()
  password?: string;

  @IsString()
  @IsOptional()
  idNo?: string;
}
