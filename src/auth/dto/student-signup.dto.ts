import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

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

  @IsPhoneNumber()
  @IsOptional()
  phoneNo?: string;

  @IsString()
  @IsOptional()
  idNo?: string;
}
