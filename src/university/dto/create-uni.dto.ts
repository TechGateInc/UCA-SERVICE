import { IsArray, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUniDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsNotEmpty()
  @IsEmail()
  state: string;

  @IsString()
  @IsNotEmpty()
  domain: string;

  @IsString()
  @IsNotEmpty()
  webUrl: string;

  @IsString()
  @IsNotEmpty()
  creator: string;

  @IsArray()
  @IsNotEmpty()
  adminUsers: string[];
}
