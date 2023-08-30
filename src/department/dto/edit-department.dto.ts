import { IsOptional, IsString } from 'class-validator';

export class EditDeptDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  school: string[];

  @IsString()
  @IsOptional()
  creator: string;
}
