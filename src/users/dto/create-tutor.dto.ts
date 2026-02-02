// dto/create-tutor.dto.ts
import { BaseUserDto } from './base-user.dto';
import { IsBoolean, IsOptional, IsNumber } from 'class-validator';

export class CreateTutorDto extends BaseUserDto {
  @IsOptional()
  @IsNumber()
  mark?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

