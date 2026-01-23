
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Section } from './entities/section.entity';

@Injectable()
export class SectionsService {
  constructor(
    @InjectRepository(Section)
    private sectionsRepository: Repository<Section>,

  ) {}
  
  findAll(): Promise<Section[]> {
    return this.sectionsRepository.find({
      order: { id: 'ASC' }
    });
  }
}
