// src/tutors/tutors.service.ts
import { Injectable , BadRequestException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'; // AJOUTEZ
import { Repository } from 'typeorm'; // AJOUTEZ
import { Tutor } from './entities/tutor.entity';
import { User } from '../users/entities/user.entity';
import { Assclass } from '../assclass/entities/assclass.entity'; // Chemin corrigé
import { Verification } from '../verifications/entities/verification.entity'; // Chemin corrigé
import { Classe } from '../classes/entities/classe.entity'; // Chemin corrigé
import { Reqclass } from '../reqclass/entities/reqclass.entity'; // Chemin corrigé
import { Commentaire } from '../commentaires/entities/commentaires.entity'; // Chemin corrigé
import { Notation } from '../notations/entities/notations.entity'; // Chemin corrigé

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
    
    @InjectRepository(Commentaire) 
    private commentaireRepository: Repository<Commentaire>,
    
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
        't.description',
        'c.name AS class_name'
      ])
      .where('u.ville = :ville', { ville })
      .andWhere('c.id = :classeId', { classeId })
      .andWhere('t.isActive = true');

    return query.getRawMany();
  }
  
    // Méthode avec les JOINs corrects
  async classe_Tutor(teacherId: number): Promise<any[]> {
    const query = this.tutorRepository
      .createQueryBuilder('t')
      .innerJoin('t.assclasse', 'ac') // Correction: 'assclasse' pas 'asslasse'
      .innerJoin('ac.classe', 'c') // INNER JOIN classes
      .select([
        'c.name AS class_name',
        'c.id AS class_id'      
      ])
      .andWhere('t.id = :teacherId', { teacherId })
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
      'rc.id AS id_request',
      'u.username AS nom_parent',
      'ut.quartier AS quartier_user',
      't.id AS teacher_id',
      'ut.username AS nom_enseignant',
      'ut.phone AS user_phone',
      'c.name AS nom_classe',
      'rc.status AS statut_demande',
      'rc.updatedAt AS date'
    ])
    .where('t.id = :id', { id })
    .andWhere('rc.isActive = true');

  return query.getRawMany();
 }
 
   // voir les differentes requetes
  async ActiveRequest(id: number): Promise<any[]> {
  const status = 'accepted';
  const query = this.reqclassRepository
    .createQueryBuilder('rc')
    .innerJoin('rc.user', 'u') // INNER JOIN users pour l'utilisateur simple
    .innerJoin('rc.tutor', 't') // INNER JOIN teachers
    .innerJoin('t.user', 'ut') // INNER JOIN users pour l'enseignant (via teachers)
    .innerJoin('rc.classe', 'c') // INNER JOIN classes
    .select([
      'rc.id AS id_request',
      'u.username AS nom_parent',
      'u.id AS parent_id',
      'ut.quartier AS quartier_user',
      't.id AS teacher_id',
      'ut.username AS nom_enseignant',
      'ut.phone AS user_phone',
      'c.name AS nom_classe',
      'rc.status AS statut_demande',
      'rc.updatedAt AS date'
    ])
    .where('rc.status = :status', { status })
    .andWhere('rc.teacherId = :id', { id });

  return query.getRawMany();
 }
 async commentList(id: number): Promise<any[]> {
  const comments = await this.notationRepository
    .createQueryBuilder('nt')
    .innerJoin('nt.user', 'u') // INNER JOIN users pour l'utilisateur simple
    .innerJoin('nt.tutor', 't') // INNER JOIN teachers
    .innerJoin('t.user', 'ut') // INNER JOIN users pour l'enseignant (via teachers)
    .select([
      'u.username AS parent',
      'u.pathImage AS image',
      'nt.commentaire AS commentaire',
      'nt.updatedAt AS date',
      'nt.mark AS mark'
    ])
    .where('t.id = :id', { id })
    .getRawMany();
    return comments.map(comment => ({
    ...comment,
    imageUrl: `http://103.45.247.26:3000/profils/${comment.image}`,
    }));
 }
 create_comment(commentData: Partial<Commentaire>): Promise<Commentaire> {
    const comment = this.commentaireRepository.create(commentData);
    return this.commentaireRepository.save(comment);
  }
  
  create_assclass(assData: Partial<Assclass>): Promise<Assclass> {
    const assclass = this.assClassRepository.create(assData);
    return this.assClassRepository.save(assclass);
  }


async getTutorIdFromUser(userId: number): Promise<number> {
  const user = await this.usersRepository.findOne({
    where: { id: userId },
    relations: ['tutor'],
  });

  if (!user) {
    throw new BadRequestException('Utilisateur introuvable');
  }

  if (!user.tutor) {
    throw new BadRequestException('Utilisateur non tuteur');
  }

  return user.tutor.id;
}


async AcceptTeacher(id: number): Promise<{ success: boolean; message: string; data?: any }> {
  try {
    const result = await this.tutorRepository.update(
      { id: id },
      { 
        isActive: true,
      }
    );
    if (result.affected === 0) {
      return {
        success: false,
        message: 'tutor non trouvée'
      };
    }
    const updatedTutor = await this.tutorRepository.findOne({ where: { id } });
    return {
      success: true,
      message: 'Requête acceptée',
      data: updatedTutor
    };
  } catch (error) {
    return {
      success: false,
      message: 'Erreur lors de l\'acceptation'
    };
  }
}

  async TutorDetail(id: number): Promise<any[] | null>{
    const infos = await this.tutorRepository
    .createQueryBuilder('t')
    .innerJoin('t.user', 'u')
    .select([
    	'u.username AS tutor_name',
    	't.id AS teacher_id',
    	'u.ville AS ville',
    	'u.quartier AS quartier',
    	'u.pathImage AS image',
    	't.mark AS mark',
    	't.description AS description',
    	'u.id AS user_id'
    ])
    .where('t.id = :id', { id })
    .getRawMany();
    return infos.map(info => ({
    ...info,
    imageUrl: `http://103.45.247.26:3000/profils/${info.image}`,
    }));
 }
 
 async updateRequestStatus(
  id: number,
  status: 'accepted' | 'denied',
): Promise<{ success: boolean; message: string; data?: any }> {
  try {
    const result = await this.reqclassRepository.update(
      { id },
      {
        status,
        updatedAt: new Date(),
      },
    );

    if (result.affected === 0) {
      return {
        success: false,
        message: 'Requête non trouvée',
      };
    }

    const updatedRequest = await this.reqclassRepository.findOne({
      where: { id },
    });

    return {
      success: true,
      message:
        status === 'accepted'
          ? 'Requête acceptée'
          : 'Requête refusée',
      data: updatedRequest,
    };
  } catch (error) {
    return {
      success: false,
      message: 'Erreur lors de la mise à jour de la requête',
    };
  }
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
      'u.ville AS ville_parent',
      'u.quartier AS ville_quartier',
      'rc.status AS status' 
    ])
    .where('rc.id = :id', { id });

  return Request.getRawMany();
 }
  
}
