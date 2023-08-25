import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  courseabrev: string[];

  @IsString()
  @IsNotEmpty()
  department: string;

  @IsNumber()
  @IsNotEmpty()
  unit: number;
}
