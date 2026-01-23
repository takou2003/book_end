// src/tutors/tutors.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'; // AJOUTEZ
import { Repository } from 'typeorm'; // AJOUTEZ
import { Tutor } from './entities/tutor.entity';
import { User } from '../users/entities/user.entity';
import { Assclass } from '../assclass/entities/assclass.entity'; // Chemin corrigé
import { Classe } from '../classes/entities/classe.entity'; // Chemin corrigé
import { Reqclass } from '../reqclass/entities/reqclass.entity'; // Chemin corrigé
import { Notation } from '../../notations/entities/notations.entity';


@Injectable()
export class TutorsService {
  constructor(
    @InjectRepository(Tutor)
    private tutorRepository: Repository<Tutor>,
    
    @InjectRepository(Assclass) // Assclass (pas AssClass)
    private assClassRepository: Repository<Assclass>,
    
    @InjectRepository(Classe)
    private classeRepository: Repository<Classe>,
    
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    
    @InjectRepository(Reqclass) 
    private reqclassRepository: Repository<Reqclass>,
    
    @InjectRepository(Notation) 
    private notationRepository: Repository<Notation>,
    
  ) {}
  
  // Méthode avec les JOINs corrects
  async search_Tutor(ville: string, classeId: number): Promise<any[]> {
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
      .andWhere('c.id = :classeId', { classeId })
      .andWhere('t.isActive = true');

    return query.getRawMany();
  }
  
  async ville_tutor(ville: string): Promise<any[]> {
    const query = this.tutorRepository
     .createQueryBuilder('t')
     .innerJoin('t.user', 'u')
     .innerJoin('t.assclasse', 'ac')
     .innerJoin('ac.classe', 'c')
     .select([
       'u.username AS name',
       'u.ville AS ville',
       'u.quartier AS quartier',
       'c.name AS classe',
       't.id AS teacher_id'
     ])
     .where('u.ville = :ville', { ville }) // Ajout d'un filtre par ville si nécessaire
     .andWhere('t.isActive = true')
     .limit(5);
    return query.getRawMany();
  }
  // voir les differentes requetes
  async viewRequest(id: number): Promise<any[]> {
  const query = this.reqclassRepository
    .createQueryBuilder('rc')
    .innerJoin('rc.user', 'u') // INNER JOIN users pour l'utilisateur simple
    .innerJoin('rc.tutor', 't') // INNER JOIN teachers
    .innerJoin('t.user', 'ut') // INNER JOIN users pour l'enseignant (via teachers)
    .innerJoin('rc.classe', 'c') // INNER JOIN classes
    .select([
      'u.username AS nom_parent',
      'ut.quartier AS quartier_user',
      't.id AS teacher_id',
      'ut.username AS nom_enseignant',
      'ut.phone AS user_phone',
      'c.name AS nom_classe',
      'rc.mark AS statut_demande'
    ])
    .where('t.id = :id', { id });

  return query.getRawMany();
 }
  async TutorDetail(id: number): Promise<any[] | null>{
    const request = this.tutorRepository
    .createQueryBuilder('t')
    .innerJoin('t.user', 'u')
    .select([
    	'u.username AS tutor_name',
    	't.id AS id',
    	'u.ville',
    	'u.quartier',
    	'u.phone'
    ])
    .where('t.id = :id', { id });
   return request.getRawMany();
 }
 
 async RequestDetail(id: number): Promise<any[] | null>{
    const Request = this.reqclassRepository
    .createQueryBuilder('rc')
    .innerJoin('rc.user', 'u') // INNER JOIN users pour l'utilisateur simple
    .innerJoin('rc.tutor', 't') // INNER JOIN teachers
    .innerJoin('t.user', 'ut') // INNER JOIN users pour l'enseignant (via teachers)
    .innerJoin('rc.classe', 'c') // INNER JOIN classes
    .select([
      'u.username AS nom_parent',
      'u.id AS parent_id',
      'u.phone AS phone_parent',
      'c.name AS nom_classe',
      'rc.mark AS statut_demande',
      'u.ville AS ville_parent',
      'u.quartier AS ville_quartier'
    ])
    .where('rc.id = :id', { id });

  return Request.getRawMany();
 }
  
}
