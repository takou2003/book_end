import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Classe } from './entities/classe.entity';

@Injectable()
export class ClassesService {
  constructor(
    @InjectRepository(Classe)
    private classesRepository: Repository<Classe>,

  ) {}
  
  findAll(): Promise<Classe[]> {
    return this.classesRepository.find({
      order: { id: 'ASC' }
    });
  }	

}
