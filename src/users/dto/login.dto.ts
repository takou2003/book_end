// src/users/dto/login.dto.ts
import { IsOptional, IsString, IsEmail } from 'class-validator';

export class LoginDto {
  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEmail()
  mail?: string;

  @IsString()
  password: string;
}

