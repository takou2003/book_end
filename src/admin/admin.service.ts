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
import { Signal } from '../signal/entities/signal.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Verification)
    private readonly verificationRepository: Repository<Verification>,

    @InjectRepository(Tutor)
    private readonly tutorRepository: Repository<Tutor>,
    
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    
    @InjectRepository(Signal)
    private readonly signalRepository: Repository<Signal>,
  ) {}

async getTutorIdFromUser(userId: number): Promise<number> {
  const user = await this.userRepository.findOne({
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

async confirmTeacher(
  verificationId: number,
  decision: 'accepted' | 'denied',
): Promise<{ success: boolean; message: string; data?: any }> {
  try {
    const verification = await this.verificationRepository.findOne({
      where: { id: verificationId },
      relations: ['tutor'],
    });

    if (!verification) {
      return {
        success: false,
        message: 'Vérification introuvable',
      };
    }

    if (verification.status !== 'pending') {
      return {
        success: false,
        message: 'Décision déjà prise',
      };
    }

    verification.status = decision;
    verification.updatedAt = new Date();

    if (decision === 'accepted') {
      verification.tutor.isActive = true;
      verification.tutor.description = verification.description;
      await this.tutorRepository.save(verification.tutor);
    }

    await this.verificationRepository.save(verification);

    return {
      success: true,
      message:
        decision === 'accepted'
          ? 'Enseignant confirmé avec succès'
          : 'Demande de certification refusée',
      data: {
        ...verification,
        userId: verification.tutor?.userId, // 🔥 IMPORTANT
      },
    };
  } catch (error) {
    return {
      success: false,
      message: "Erreur lors de la confirmation de l'enseignant",
    };
  }
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
        'v.description AS description',
        'v.status AS status',
        

      ])
      .orderBy('v.createdAt', 'DESC')
      .getRawMany();
      return verifies.map(verifie => ({
    ...verifie,
    viewdoc: `${process.env.URL}/verifications/view/${verifie.pathdocument}`,
    }));
  }


async countActiveUsersAndTutors(): Promise<{
  totalTutors: number;
  totalParents: number;
}> {
  const [totalTutors, totalParents] = await Promise.all([
    this.tutorRepository
      .createQueryBuilder('t')
      .where('t.isActive = true')
      .getCount(),

    this.userRepository
      .createQueryBuilder('u')
      .where('u.isActive = true')
      .andWhere('u.role = :role', { role: 0 }) // 0 = parent
      .getCount(),
  ]);

  return {
    totalTutors,
    totalParents,
  };
}
  
async getReportedUsersSummary() {
  const results = await this.signalRepository
    .createQueryBuilder('signal')
    .select('signal.direction', 'userId')
    .addSelect('COUNT(signal.id)', 'totalSignals')
    .addSelect('MAX(signal.createdAt)', 'lastSignalDate')
    .groupBy('signal.direction')
    .orderBy('"lastSignalDate"', 'DESC')
    .getRawMany();

  const enrichedResults = await Promise.all(
    results.map(async (item) => {
      const lastSignal = await this.signalRepository.findOne({
        where: { direction: item.userId },
        order: { createdAt: 'DESC' },
      });

      const user = await this.userRepository.findOne({
        where: { id: item.userId },
        select: ['id', 'username', 'mail', 'pathImage', 'isActive'],
      });

      return {
        userId: user?.id,
        username: user?.username,
        email: user?.mail,
        totalSignals: Number(item.totalSignals),
        lastSignalDate: item.lastSignalDate,
        lastMotif: lastSignal?.motif,
        status: user?.isActive,
        image: user?.pathImage
          ? `${process.env.URL}/profils/${user.pathImage}`
          : null,
      };
    }),
  );

  return enrichedResults;
}


async getSignalDetailsByUser(userId: number) {
  const signals = await this.signalRepository.find({
    where: { direction: userId },
    relations: ['author'], // auteur relation
    order: { createdAt: 'DESC' },
  });

  if (!signals.length) {
    throw new NotFoundException('Aucun signalement trouvé');
  }

  return signals.map((signal) => ({
    signalId: signal.id,
    auteurId: signal.auteur,
    auteurUsername: signal.author?.username,
    motif: signal.motif,
    createdAt: signal.createdAt,
  }));
}

async toggleUserStatus(userId: number) {
  const user = await this.userRepository.findOne({
    where: { id: userId },
  });

  if (!user) {
    throw new NotFoundException('Utilisateur introuvable');
  }

  // 🔁 Inverser l'état
  user.isActive = !user.isActive;

  await this.userRepository.save(user);

  return {
    userId: user.id,
    username: user.username,
    isActive: user.isActive,
    message: user.isActive
      ? 'Compte activé avec succès'
      : 'Compte désactivé avec succès',
  };
}


}

