// src/tutors/dto/find-tutors.dto.ts
export class FindTutorsDto {
  ville?: string;
  classe?: string;
  subject?: string;
  minMark?: number;
  maxMark?: number;
  isActive?: boolean;
}
