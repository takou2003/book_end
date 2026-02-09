import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Verification } from './entities/verification.entity';
import { Tutor } from '../tutors/entities/tutor.entity';
import { existsSync, mkdirSync, copyFileSync, unlinkSync } from 'fs';
import * as fs from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';

@Injectable()
export class VerificationsService {
  private readonly documentsDir = join(
    __dirname,
    '..',
    '..',
    'Documents',
  );

  constructor(
    @InjectRepository(Verification)
    private readonly verificationRepository: Repository<Verification>,
    
    @InjectRepository(Tutor)
    private tutorRepository: Repository<Tutor>,
  ) {}

  /* =========================================================
   * UPLOAD DOCUMENT (JWT → tutorId)
   * ========================================================= */
  async uploadDocument(
    teacherId: number,
    file: Express.Multer.File,
  ): Promise<Verification> {
    if (!file) {
      throw new BadRequestException('Aucun document fourni');
    }

    // 1️⃣ Vérifier / créer dossier
    if (!existsSync(this.documentsDir)) {
      mkdirSync(this.documentsDir, { recursive: true });
    }

    // 2️⃣ Nom du fichier
    const ext = path.extname(file.originalname);
    const filename = `verif_${teacherId}_${Date.now()}_${uuidv4()}${ext}`;
    const finalPath = join(this.documentsDir, filename);

    // 3️⃣ Sauvegarde fichier
    if (file.buffer) {
      await fs.writeFile(finalPath, file.buffer);
    } else if (file.path) {
      copyFileSync(file.path, finalPath);
      unlinkSync(file.path);
    } else {
      throw new BadRequestException('Fichier invalide');
    }

    // 4️⃣ Enregistrement DB
    const verification = this.verificationRepository.create({
      teacherId,
      pathDocument: filename,
    });

    return this.verificationRepository.save(verification);
  }

  /* =========================================================
   * GET ALL VERIFICATIONS (ADMIN)
   * ========================================================= */
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
      ])
      .orderBy('v.createdAt', 'DESC')
      .getRawMany();
      return verifies.map(verifie => ({
    ...verifie,
    viewdoc: `http://103.45.247.26:3000/verifications/view/${verifie.pathdocument}`,
    }));
  }

  /* =========================================================
   * GET VERIFICATIONS BY TEACHER
   * ========================================================= */
  async getVerificationsByTeacher(teacherId: number) {
    return this.verificationRepository.find({
      where: { teacherId },
      order: { createdAt: 'DESC' },
    });
  }

  /* =========================================================
   * GET ONE VERIFICATION
   * ========================================================= */
  async getVerificationById(id: number): Promise<Verification> {
    const verification = await this.verificationRepository.findOne({
      where: { id },
    });

    if (!verification) {
      throw new NotFoundException('Document de vérification introuvable');
    }

    return verification;
  }

  /* =========================================================
   * GET FILE PATH (DOWNLOAD / VIEW)
   * ========================================================= */
  async getFilePath(filename: string): Promise<string> {
    // Sécurité path traversal
    if (
      filename.includes('..') ||
      filename.includes('/') ||
      filename.includes('\\')
    ) {
      throw new BadRequestException('Nom de fichier invalide');
    }

    const filePath = join(this.documentsDir, filename);

    if (!existsSync(filePath)) {
      throw new NotFoundException('Fichier non trouvé');
    }

    return filePath;
  }

  /* =========================================================
   * DELETE VERIFICATION (OPTIONNEL ADMIN)
   * ========================================================= */
  async deleteVerification(id: number) {
    const verification = await this.getVerificationById(id);

    const filePath = join(
      this.documentsDir,
      verification.pathDocument,
    );

    if (existsSync(filePath)) {
      unlinkSync(filePath);
    }

    await this.verificationRepository.delete(id);

    return {
      success: true,
      message: 'Document supprimé avec succès',
    };
  }
  
  async confirmTeacher(
    verificationId: number,
    decision: 'accepted' | 'denied',
  ) {
    const verification = await this.verificationRepository.findOne({
      where: { id: verificationId },
    });

    if (!verification) {
      throw new NotFoundException('Vérification introuvable');
    }

    // Mise à jour du statut
    verification.status = decision;
    await this.verificationRepository.save(verification);

    // Si accepté → activer le tuteur
    if (decision === 'accepted') {
      await this.tutorRepository.update(
        { id: verification.teacherId },
        { isActive: true },
      );
    }

    return {
      verificationId: verification.id,
      status: verification.status,
    };
  }
}

