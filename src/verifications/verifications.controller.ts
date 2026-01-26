// src/verifications/verifications.controller.ts
import {
  Controller,
  Get,
  Param,
  Post,
  Res,
  NotFoundException,
  BadRequestException,
  UseInterceptors,
  UploadedFile,
  ParseIntPipe,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FileInterceptor } from '@nestjs/platform-express';
import { existsSync, createWriteStream } from 'fs';
import { join } from 'path';
import type { Response } from 'express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { Verification } from './entities/verification.entity';
import { User } from '../users/entities/user.entity';
import { Tutor } from '../tutors/entities/tutor.entity';
@Controller('verifications')
export class VerificationsController {
  private readonly documentsDir = join(__dirname, '..', '..', 'Documents');

  constructor(
    @InjectRepository(Verification)
    private verificationRepository: Repository<Verification>,
  ) {}

  /**
   * Uploader un document de vérification pour un enseignant
   */
  @Post('upload/:teacherId')
  @UseInterceptors(
    FileInterceptor('document', {
      storage: diskStorage({
        destination: './temp/documents',
        filename: (req, file, callback) => {
          const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
          callback(null, uniqueName);
        },
      }),
      fileFilter: (req, file, callback) => {
        const allowedMimes = [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'text/plain',
          'application/vnd.ms-excel',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'image/jpeg',
          'image/png',
          'application/zip',
          'application/x-rar-compressed',
        ];
        
        if (allowedMimes.includes(file.mimetype)) {
          callback(null, true);
        } else {
          callback(new BadRequestException('Type de document non autorisé'), false);
        }
      },
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
      },
    }),
  )
  async uploadVerificationDocument(
    @Param('teacherId', ParseIntPipe) teacherId: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Aucun document uploadé');
    }

    try {
      // Vérifier que le dossier Documents existe
      if (!existsSync(this.documentsDir)) {
        const fs = require('fs');
        fs.mkdirSync(this.documentsDir, { recursive: true });
      }

      // Générer un nom de fichier final
      const originalName = file.originalname;
      const ext = path.extname(originalName);
      const uniqueId = uuidv4();
      
      // Format: verif_{teacher_id}_{timestamp}_{uuid}{ext}
      const timestamp = Date.now();
      const finalFilename = `verif_${teacherId}_${timestamp}_${uniqueId}${ext}`;
      const finalPath = join(this.documentsDir, finalFilename);

      // Sauvegarder le fichier
      if (file.buffer) {
        // Sauvegarder depuis le buffer
        await this.saveFile(file.buffer, finalPath);
      } else if (file.path && existsSync(file.path)) {
        // Copier depuis le fichier temporaire
        const fs = require('fs');
        fs.copyFileSync(file.path, finalPath);
        // Supprimer le fichier temporaire
        fs.unlinkSync(file.path);
      }

      // Créer l'entrée dans la table verifications
      const verification = this.verificationRepository.create({
        teacherId: teacherId,
        pathDocument: finalFilename,
      });

      await this.verificationRepository.save(verification);

      return {
        success: true,
        message: 'Document de vérification uploadé avec succès',
        verificationId: verification.id,
        teacherId: teacherId,
        filename: finalFilename,
        originalName: originalName,
        size: file.size,
        mimeType: file.mimetype,
        url: `/documents/${finalFilename}`,
        downloadUrl: `/verifications/download/${finalFilename}`,
        createdAt: verification.createdAt,
      };
    } catch (error) {
      console.error('Erreur upload document vérification:', error);
      throw new BadRequestException(`Erreur lors de l'upload: ${error.message}`);
    }
  }

  /**
   * Télécharger un document de vérification
   */
  @Get('download/:filename')
  async downloadVerificationDocument(
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    // Validation de sécurité
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      throw new BadRequestException('Nom de fichier invalide');
    }

    const filePath = join(this.documentsDir, filename);
    
    if (!existsSync(filePath)) {
      throw new NotFoundException(`Document ${filename} non trouvé`);
    }

    // Déterminer le type MIME
    const ext = path.extname(filename).toLowerCase();
    const mimeTypes: Record<string, string> = {
      '.pdf': 'application/pdf',
      '.doc': 'application/msword',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      '.txt': 'text/plain',
      '.xls': 'application/vnd.ms-excel',
      '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.zip': 'application/zip',
      '.rar': 'application/x-rar-compressed',
    };

    const contentType = mimeTypes[ext] || 'application/octet-stream';
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    return res.sendFile(filePath);
  }

  /**
   * Voir un document de vérification (inline)
   */
  @Get('view/:filename')
  async viewVerificationDocument(
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    // Validation de sécurité
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      throw new BadRequestException('Nom de fichier invalide');
    }

    const filePath = join(this.documentsDir, filename);
    
    if (!existsSync(filePath)) {
      throw new NotFoundException(`Document ${filename} non trouvé`);
    }

    // Déterminer le type MIME
    const ext = path.extname(filename).toLowerCase();
    const mimeTypes: Record<string, string> = {
      '.pdf': 'application/pdf',
      '.txt': 'text/plain',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
    };

    const contentType = mimeTypes[ext] || 'application/octet-stream';
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
    
    return res.sendFile(filePath);
  }

  /**
   * Récupérer toutes les vérifications d'un enseignant
   */
  @Get('teacher/:teacherId')
  async getTeacherVerifications(@Param('teacherId', ParseIntPipe) teacherId: number) {
    const verifications = await this.verificationRepository.find({
      where: { teacherId },
      order: { createdAt: 'DESC' },
    });

    return verifications.map(verif => ({
      id: verif.id,
      teacherId: verif.teacherId,
      pathDocument: verif.pathDocument,
      createdAt: verif.createdAt,
      updatedAt: verif.updatedAt,
      url: `/documents/${verif.pathDocument}`,
      downloadUrl: `/verifications/download/${verif.pathDocument}`,
      viewUrl: `/verifications/view/${verif.pathDocument}`,
    }));
  }

  /**
   * Récupérer toutes les vérifications
   */
  @Get()
async getAllVerifications() {
  const query = this.verificationRepository
    .createQueryBuilder('v')
    .innerJoin('v.tutor', 't') // Jointure avec la table teachers
    .innerJoin('t.user', 'ut') // Jointure avec la table users via teachers
    .select([
      'v.teacherId AS teacherId',
      'v.pathDocument AS pathDocument',
      'v.createdAt AS createdAt',
      'ut.username AS username',
      'ut.ville AS ville',
      't.isActive AS isActive'
    ])
    .orderBy('v.createdAt', 'DESC');

  const result = await query.getRawMany();
  return result;
  // Formater les résultats
  /*return result.map(row => ({
    teacherId: row.teacherId,
    pathDocument: row.pathDocument,
    createdAt: row.createdAt,
    username: row.username,
    ville: row.ville
  }));*/
}

  /**
   * Récupérer une vérification spécifique par ID
   */
  @Get(':id')
  async getVerification(@Param('id', ParseIntPipe) id: number) {
    const verification = await this.verificationRepository.findOne({
      where: { id },
    });

    if (!verification) {
      throw new NotFoundException(`Vérification ${id} non trouvée`);
    }

    return {
      ...verification,
      url: `/documents/${verification.pathDocument}`,
      downloadUrl: `/verifications/download/${verification.pathDocument}`,
      viewUrl: `/verifications/view/${verification.pathDocument}`,
    };
  }

  /**
   * Sauvegarder un fichier
   */
  private async saveFile(buffer: Buffer, filePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const writeStream = createWriteStream(filePath);
      writeStream.write(buffer);
      writeStream.end();
      writeStream.on('finish', resolve);
      writeStream.on('error', reject);
    });
  }
}
