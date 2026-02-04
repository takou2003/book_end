import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail()
  mail: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;
}

