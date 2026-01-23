import { Controller, Get, Post, Body, Param, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { SectionsService } from './sections.service';
@Controller('sections')
export class SectionsController {
  constructor(private readonly sectionssService: SectionsService) {}
  @Get()
  async sectionLoading(){ 
    try {
      const requests = await this.sectionssService.findAll();
      
      return {
        success: true,
        count: requests.length, // 
        total_found: requests.length,
        data: requests // 
      };
    } catch (error) {
      return {
        success: false,
        message: 'Erreur lors de la recherche des requetes',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      };
    }
  }

}
