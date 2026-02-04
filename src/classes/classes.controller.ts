
import { Controller, Get, Post, Body, Param, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ClassesService } from './classes.service';
@Controller('classes')
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}
  @Get()
  async loadroom(){ 
    try {
      const requests = await this.classesService.findAll();
      
      return {
        success: true,
        count: requests.length, // 
        total_found: requests.length,
        data: requests // 
      };
    } catch (error) {
      return {
        success: false,
        message: 'Erreur lors de la recherche des classes',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      };
    }
  }
}
