// src/documents/documents.controller.ts
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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { existsSync, unlinkSync, createWriteStream } from 'fs';
import { join } from 'path';
import type { Response } from 'express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';

@Controller('documents')
export class DocumentsController {
  private readonly documentsDir = join(__dirname, '..', '..', 'Documents');

  /**
   * Lire/télécharger un document
   */
  @Get(':filename')
  async getDocument(@Param('filename') filename: string, @Res() res: Response) {
    // Validation de sécurité
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      throw new BadRequestException('Nom de fichier invalide');
    }

    const filePath = join(this.documentsDir, filename);
    
    // Vérifier si le fichier existe
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
      '.ppt': 'application/vnd.ms-powerpoint',
      '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.zip': 'application/zip',
      '.rar': 'application/x-rar-compressed',
    };

    const contentType = mimeTypes[ext] || 'application/octet-stream';
    res.setHeader('Content-Type', contentType);
    
    // Forcer le téléchargement pour certains types
    const forceDownload = ['.pdf', '.doc', '.docx', '.xls', '.xlsx'].includes(ext);
    if (forceDownload) {
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    }
    
    return res.sendFile(filePath);
  }

  /**
   * Uploader un document
   */
  @Post('upload')
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
  async uploadDocument(@UploadedFile() file: Express.Multer.File) {
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
      const timestamp = Date.now();
      const ext = path.extname(originalName);
      const nameWithoutExt = path.basename(originalName, ext);
      const finalFilename = `${nameWithoutExt}_${timestamp}${ext}`;
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

      return {
        success: true,
        message: 'Document uploadé avec succès',
        filename: finalFilename,
        originalName: originalName,
        size: file.size,
        mimeType: file.mimetype,
        url: `/documents/${finalFilename}`,
      };
    } catch (error) {
      console.error('Erreur upload document:', error);
      throw new BadRequestException(`Erreur lors de l'upload: ${error.message}`);
    }
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
