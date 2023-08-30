import { IsOptional, IsNumber, IsString } from 'class-validator';

export class EditCourseDto {
  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  courseabrev: string[];

  @IsString()
  @IsOptional()
  department: string;

  @IsNumber()
  @IsOptional()
  unit: number;
}
