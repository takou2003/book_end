import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Enseignement } from './entities/enseignement.entity';

@Injectable()
export class EnseignementsService {
  constructor(
    @InjectRepository(Enseignement)
    private enseignementsRepository: Repository<Enseignement>,

  ) {}
  
  findAll(id: number): Promise<Enseignement[]> {
    return this.enseignementsRepository.find({
      where: {sectionId: id},
      order: { id: 'ASC' }
    });
  }

}
