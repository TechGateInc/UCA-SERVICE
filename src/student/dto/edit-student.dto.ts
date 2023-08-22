import { IsEmail, IsOptional, IsPhoneNumber, IsString } from 'class-validator';

export class EditStudentDto {
  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsOptional()
  otherName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsPhoneNumber()
  @IsOptional()
  phoneNo?: string;

  @IsString()
  @IsOptional()
  idNo?: string;
}
