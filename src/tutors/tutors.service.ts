// src/tutors/tutors.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'; // AJOUTEZ
import { Repository } from 'typeorm'; // AJOUTEZ
import { Tutor } from './entities/tutor.entity';
import { Assclass } from '../assclass/entities/assclass.entity'; // Chemin corrigé
import { Classe } from '../classes/entities/classe.entity'; // Chemin corrigé

@Injectable()
export class TutorsService {
  constructor(
    @InjectRepository(Tutor)
    private tutorRepository: Repository<Tutor>,
    
    @InjectRepository(Assclass) // Assclass (pas AssClass)
    private assClassRepository: Repository<Assclass>,
    
    @InjectRepository(Classe)
    private classeRepository: Repository<Classe>,
  ) {}
  
  // Méthode avec les JOINs corrects
  async search_Tutor(ville: string, classeName: string): Promise<any[]> {
    const query = this.tutorRepository
      .createQueryBuilder('t')
      .innerJoin('t.user', 'u') // INNER JOIN users
      .innerJoin('t.assclasse', 'ac') // Correction: 'assclasse' pas 'asslasse'
      .innerJoin('ac.classe', 'c') // INNER JOIN classes
      .select([
        'u.id AS user_id',
        'u.username',
        'u.ville',
        'u.quartier',
        'u.latitude',
        'u.longitude',
        'u.phone',
        't.mark', // AJOUTEZ le mark
        't.isActive',
        'c.name AS class_name'
      ])
      .where('u.ville = :ville', { ville })
      .andWhere('c.name = :classeName', { classeName })
      .andWhere('t.isActive = true');

    return query.getRawMany();
  }
}
