import {
  Controller,
  Get,
  Param,
  Res,
  StreamableFile,
  Header,
  NotFoundException,
  BadRequestException,
  UseInterceptors,
  Post,
  UploadedFile,
  Delete,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { createReadStream, existsSync, unlinkSync } from 'fs';
import { join } from 'path';
import type { Response } from 'express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';


@Controller('profils')
export class Userprofil {
  private readonly profilesDir = join(__dirname, '..', '..', 'profils');
  
   /**
   * Récupérer une image de profil par son nom de fichier
   */
   
  @Get(':filename')
  async getProfileImage(@Param('filename') filename: string, @Res() res: Response) {
    // Validation de sécurité : empêcher les attaques par path traversal
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      throw new BadRequestException('Nom de fichier invalide');
    }

    const filePath = join(this.profilesDir, filename);
    
    // Vérifier si le fichier existe
    if (!existsSync(filePath)) {
      // Image par défaut si non trouvée
      const defaultImage = join(this.profilesDir, 'noPicture.jpg');
      if (existsSync(defaultImage)) {
        return res.sendFile(defaultImage);
      }
      throw new NotFoundException('Image non trouvée');
    }

    // Déterminer le type MIME en fonction de l'extension
    const ext = path.extname(filename).toLowerCase();
    const mimeTypes = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.svg': 'image/svg+xml',
    };

    const contentType = mimeTypes[ext] || 'application/octet-stream';
    res.setHeader('Content-Type', contentType);
    
    // Cache pour 7 jours
    res.setHeader('Cache-Control', 'public, max-age=604800');
    
    return res.sendFile(filePath);
  }
   
}
