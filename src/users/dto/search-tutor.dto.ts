import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class SearchTutorDto {
  @IsString()
  @IsNotEmpty()
  ville: string;

  @IsNumber()
  classeId: number;
}

