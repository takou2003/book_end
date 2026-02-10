import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Verification } from '../verifications/entities/verification.entity';
import { Tutor } from '../tutors/entities/tutor.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Verification)
    private readonly verificationRepository: Repository<Verification>,

    @InjectRepository(Tutor)
    private readonly tutorRepository: Repository<Tutor>,
    
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async confirmTeacher(
    verificationId: number,
    decision: 'accepted' | 'denied',
  ) {
    const verification = await this.verificationRepository.findOne({
      where: { id: verificationId },
      relations: ['tutor'],
    });

    if (!verification) {
      throw new NotFoundException('Vérification introuvable');
    }

    if (verification.status !== 'pending') {
      throw new BadRequestException('Décision déjà prise');
    }

    verification.status = decision;
    verification.updatedAt = new Date();

    if (decision === 'accepted') {
      verification.tutor.isActive = true;
      verification.tutor.description = verification.description;
      await this.tutorRepository.save(verification.tutor);
    }
    
    await this.verificationRepository.save(verification);

    return verification;
  }
  
  async getAllVerifications() {
    const verifies = await this.verificationRepository
      .createQueryBuilder('v')
      .innerJoin('v.tutor', 't')
      .innerJoin('t.user', 'u')
      .select([
        'v.id AS id',
        'v.teacherId AS teacherId',
        'v.pathDocument AS pathdocument',
        'v.createdAt AS createdAt',
        'v.updatedAt AS updatedAt',
        'u.username AS username',
        'u.ville AS ville',
        't.isActive AS isActive',
        'v.status AS status'
      ])
      .orderBy('v.createdAt', 'DESC')
      .getRawMany();
      return verifies.map(verifie => ({
    ...verifie,
    viewdoc: `http://103.45.247.26:3000/verifications/view/${verifie.pathdocument}`,
    }));
  }
  async All_tutor_actif(): Promise<any[]> {
    const query = this.tutorRepository
     .createQueryBuilder('t')
     .innerJoin('t.user', 'u')
     .select([
       'u.username AS name',
       'u.ville AS ville',
       'u.quartier AS quartier',
       'u.phone AS phone',
       't.id AS teacher_id'
     ])
     .where('t.isActive = true');
    return query.getRawMany();
  }
  
  async All_tutor_Noactif(): Promise<any[]> {
    const query = this.tutorRepository
     .createQueryBuilder('t')
     .innerJoin('t.user', 'u')
     .select([
       'u.username AS name',
       'u.ville AS ville',
       'u.quartier AS quartier',
       'u.phone AS phone',
       't.id AS teacher_id'
     ])
     .where('t.isActive = false');
    return query.getRawMany();
  }
}

