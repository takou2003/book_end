// dto/base-user.dto.ts
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class BaseUserDto {
  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsString()
  ville: string;

  @IsString()
  quartier: string;

  @IsOptional()
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @IsNumber()
  longitude?: number;

  @IsString()
  phone: string;
  
  @IsString()
  mail:string;
}

