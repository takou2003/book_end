// src/tutors/tutors.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { TutorsService } from './tutors.service';

@Controller('tutors')
export class TutorsController {
  constructor(private readonly tutorsService: TutorsService) {}
  
  @Get('filter')
  async findTutorsByVilleAndClasse(
    @Query('ville') ville: string,
    @Query('classe') classe: string
  ) {
    try {
      const tutors = await this.tutorsService.search_Tutor(ville, classe);
      
      return {
        success: true,
        count: tutors.length, // Correction: 'tutors.length' pas 'filteredTutors'
        total_found: tutors.length,
        data: tutors // Correction: virgule au lieu de point-virgule
      };
    } catch (error) {
      return {
        success: false,
        message: 'Erreur lors de la recherche des tuteurs',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      };
    }
  }
}
