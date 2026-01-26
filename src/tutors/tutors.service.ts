// src/tutors/tutors.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'; // AJOUTEZ
import { Repository } from 'typeorm'; // AJOUTEZ
import { Tutor } from './entities/tutor.entity';
import { User } from '../users/entities/user.entity';
import { Assclass } from '../assclass/entities/assclass.entity'; // Chemin corrigé
import { Verification } from '../verifications/entities/verification.entity'; // Chemin corrigé
import { Classe } from '../classes/entities/classe.entity'; // Chemin corrigé
import { Reqclass } from '../reqclass/entities/reqclass.entity'; // Chemin corrigé
import { Commentaire } from '../commentaires/entities/commentaires.entity'; // Chemin corrigé

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
    .where('t.id = :id', { id })
    .andWhere('rc.isActive = true');

  return query.getRawMany();
 }

 async commentList(id: number): Promise<any[]> {
  const query = this.commentaireRepository
    .createQueryBuilder('cm')
    .innerJoin('cm.user', 'u') // INNER JOIN users pour l'utilisateur simple
    .innerJoin('cm.tutor', 't') // INNER JOIN teachers
    .innerJoin('t.user', 'ut') // INNER JOIN users pour l'enseignant (via teachers)
    .select([
      'u.username AS parent',
      'cm.texte AS commentaire',
      'cm.createdAt AS date'
    ])
    .where('t.id = :id', { id });
  return query.getRawMany();
 }
 create_comment(commentData: Partial<Commentaire>): Promise<Commentaire> {
    const comment = this.commentaireRepository.create(commentData);
    return this.commentaireRepository.save(comment);
  }
  
  create_assclass(assData: Partial<Assclass>): Promise<Assclass> {
    const assclass = this.assClassRepository.create(assData);
    return this.assClassRepository.save(assclass);
  }
  
async notation(
  id: number, 
  notation1: number, 
  teacher_id: number
): Promise<{ success: boolean; message: string; data?: any; average?: number }> {
  try {
    // 1. Vérifier si la notation est valide (entre 0 et 5 ou 0 et 20 selon votre échelle)
    if (notation1 < 0 || notation1 > 5) { // Ajustez selon votre échelle de notation
      return {
        success: false,
        message: 'La notation doit être entre 0 et 5'
      };
    }

    // 2. Mettre à jour la notation de la reqclass spécifique
    const result = await this.reqclassRepository.update(
      { id: id },
      { 
        notation: notation1,
        updatedAt: new Date()
      }
    );

    if (result.affected === 0) {
      return {
        success: false,
        message: 'Requête non trouvée'
      };
    }

    // 3. Calculer la moyenne des notations pour ce teacher_id
    const averageResult = await this.calculateTeacherAverage(teacher_id);

    // 4. Mettre à jour le mark du tutor (dans la table teachers)
    await this.updateTutorMark(teacher_id, averageResult.average);

    // 5. Récupérer la reqclass mise à jour
    const updatedNote = await this.reqclassRepository.findOne({ 
      where: { id },
      relations: ['user', 'tutor', 'classe']
    });

    return {
      success: true,
      message: 'Note mise à jour et moyenne calculée',
      data: updatedNote,
      average: averageResult.average
    };
  } catch (error) {
    console.error('Erreur lors de la notation:', error);
    return {
      success: false,
      message: 'Erreur lors de la mise à jour de la notation'
    };
  }
}

/**
 * Calculer la moyenne des notations pour un teacher_id
 */
private async calculateTeacherAverage(teacher_id: number): Promise<{ 
  average: number; 
  total: number; 
  count: number 
}> {
  const query = this.reqclassRepository
    .createQueryBuilder('reqclass')
    .select('AVG(reqclass.notation)', 'average')
    .addSelect('SUM(reqclass.notation)', 'total')
    .addSelect('COUNT(reqclass.id)', 'count')
    .where('reqclass.teacher_id = :teacher_id', { teacher_id })
    .andWhere('reqclass.notation > 0') // Exclure les notations nulles si nécessaire
    .andWhere('reqclass.is_active = true'); // Seulement les requêtes actives

  const result = await query.getRawOne();

  return {
    average: parseFloat(result.average) || 0,
    total: parseFloat(result.total) || 0,
    count: parseInt(result.count) || 0
  };
}

/**
 * Mettre à jour le mark du tutor dans la table teachers
 */
private async updateTutorMark(teacher_id: number, average: number): Promise<void> {
  // Supposons que vous avez accès au repository teachers
  // Si ce n'est pas dans le même service, injectez TeachersRepository
  await this.tutorRepository.update(
    { id: teacher_id },
    { 
      mark: average, // Assurez-vous que la colonne s'appelle 'mark' dans teachers
    }
  );
}
  
 async Acceptrequest(id: number): Promise<{ success: boolean; message: string; data?: any }> {
  try {
    const result = await this.reqclassRepository.update(
      { id: id },
      { 
        status: 'accepted',
        updatedAt: new Date()
      }
    );
    if (result.affected === 0) {
      return {
        success: false,
        message: 'Requête non trouvée'
      };
    }
    const updatedRequest = await this.reqclassRepository.findOne({ where: { id } });
    return {
      success: true,
      message: 'Requête acceptée',
      data: updatedRequest
    };
  } catch (error) {
    return {
      success: false,
      message: 'Erreur lors de l\'acceptation'
    };
  }
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
async Deniedrequest(id: number): Promise<{ success: boolean; message: string; data?: any }> {
  try {
    const result = await this.reqclassRepository.update(
      { id: id },
      { 
        status: 'denied',
        updatedAt: new Date()
      }
    );
    if (result.affected === 0) {
      return {
        success: false,
        message: 'Requête non trouvée'
      };
    }
    const updatedRequest = await this.reqclassRepository.findOne({ where: { id } });
    return {
      success: true,
      message: 'Requête acceptée',
      data: updatedRequest
    };
  } catch (error) {
    return {
      success: false,
      message: 'Erreur lors de l\'acceptation'
    };
  }
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
      'u.ville AS ville_parent',
      'u.quartier AS ville_quartier',
      'rc.status AS status' 
    ])
    .where('rc.id = :id', { id });

  return Request.getRawMany();
 }
  
}
