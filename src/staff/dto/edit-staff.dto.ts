import { IsArray, IsEmail, IsOptional, IsString } from 'class-validator';

export class EditStaffDto {
  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsString()
  @IsOptional()
  idNo?: string;

  @IsOptional()
  university: string;

  @IsArray()
  permissions: string[];
}
