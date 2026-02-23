import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  username?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  ville?: string;
  
  @IsOptional()
  @IsString()
  @MinLength(2)
  deviceToken?: string;
}

