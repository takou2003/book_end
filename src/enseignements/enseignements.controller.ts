import { Controller, Get, Post, Body, Param, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { EnseignementsService } from './enseignements.service';

@Controller('enseignements')
export class EnseignementsController {
  constructor(private readonly enseignementsService: EnseignementsService) {}
  @Get(':id')
  async loadEnseignement(@Param('id') id: number){ 
    try {
      const requests = await this.enseignementsService.findAll(id);
      
      return {
        success: true,
        count: requests.length, // 
        total_found: requests.length,
        data: requests // 
      };
    } catch (error) {
      return {
        success: false,
        message: 'Erreur lors de la recherche des enseignements',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      };
    }
  }
}
