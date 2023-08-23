import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class CreateUniDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  action: string;

  @IsDate()
  @IsNotEmpty()
  timestamp: string;

  @IsString()
  @IsNotEmpty()
  data: string;
}
