import { IsInt, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateSignalDto {
  @IsInt()
  direction: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(250)
  motif: string;
}

