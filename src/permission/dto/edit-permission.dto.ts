import { IsOptional, IsString } from 'class-validator';

export class EditPermissionDto {
  @IsString()
  @IsOptional()
  name: string;
}
