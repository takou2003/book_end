// src/users/users.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import sharp from 'sharp';
import {  createWriteStream, existsSync, mkdirSync, unlinkSync, readFileSync } from 'fs';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { User } from './entities/user.entity';
import { Tutor } from '../tutors/entities/tutor.entity';
import { Reqclass } from '../reqclass/entities/reqclass.entity'; 
import { Classe } from '../classes/entities/classe.entity'; 

@Injectable()
export class UsersService {
  private readonly profilesDir = join(process.cwd(), 'profils');
  private readonly tempDir = join(process.cwd(), 'temp');
  private readonly allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  private readonly maxFileSize = 5 * 1024 * 1024; // 5MB
  
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    
    @InjectRepository(Tutor) // Ajoutez cette injection
    private tutorRepository: Repository<Tutor>,
    
    @InjectRepository(Reqclass) 
    private reqclassRepository: Repository<Reqclass>,
    
    @InjectRepository(Classe)
    private classeRepository: Repository<Classe>,
  ) {}

  // Trouver tous les utilisateurs
  findAll(): Promise<User[]> {
    return this.usersRepository.find({
      order: { id: 'ASC' }
    });
  }

  // Trouver par téléphone
  findByPhone(phone: string): Promise<User | null> {
    return this.usersRepository.findOne({ 
      where: { phone } 
    });
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
      'ut.username AS nom_teacher',
      'u.role AS role_utilisateur',
      't.id AS teacher_id',
      'ut.phone AS phone_teacher',
      'c.name AS nom_classe',
      'rc.status AS status'
    ])
    .where('u.id = :id', { id });

  return query.getRawMany();
 }
 
 async TutorsUser(id: number): Promise<any[]> {
  const status = "accepted";
  const query = this.reqclassRepository
    .createQueryBuilder('rc')
    .innerJoin('rc.user', 'u') // INNER JOIN users pour l'utilisateur simple
    .innerJoin('rc.tutor', 't') // INNER JOIN teachers
    .innerJoin('t.user', 'ut') // INNER JOIN users pour l'enseignant (via teachers)
    .innerJoin('rc.classe', 'c') // INNER JOIN classes
    .select([
      'ut.username AS tutor_name',
      'ut.quartier AS quartier',
      'c.name AS class_name',
      'rc.status AS status',
      'rc.id AS relation_id'
    ])
    .where('u.id = :id', { id })
    .andWhere('rc.status = :status', { status });
    
  return query.getRawMany();
 }
 
 async RelationWithTutor(id: number): Promise<any[]> {
 const status = 'accepted';
  const query = this.reqclassRepository
    .createQueryBuilder('rc')
    .innerJoin('rc.user', 'u') // INNER JOIN users pour l'utilisateur simple
    .innerJoin('rc.tutor', 't') // INNER JOIN teachers
    .innerJoin('t.user', 'ut') // INNER JOIN users pour l'enseignant (via teachers)
    .innerJoin('rc.classe', 'c') // INNER JOIN classes
    .select([
      'ut.username AS tutor_name',
      'ut.quartier AS quartier',
      'c.name AS class_name',
      'ut.phone AS tutorPhone',
      'rc.updatedAt AS since',
      'rc.status AS status',
      'rc.teacherId AS teacherId'
    ])
    .where('rc.status = :status', { status })
    .andWhere('rc.userId = :id', { id });
    
  return query.getRawMany();
 }
  // Créer un utilisateur
  create(userData: Partial<User>): Promise<User> {
    const user = this.usersRepository.create(userData);
    return this.usersRepository.save(user);
  }
  create_request(reqclassData: Partial<Reqclass>): Promise<Reqclass> {
    const reqClass = this.reqclassRepository.create(reqclassData);
    return this.reqclassRepository.save(reqClass);
  }  
  async Create_Tutor(userData: any): Promise<{
    user: User;
    tutor: Tutor;
    success: boolean;
  }> {
    try {
      // Étape 1: Créer l'utilisateur
      const user = await this.create({
        username: userData.username,
        password: userData.password,
        ville: userData.ville,
        quartier: userData.quartier,
        latitude: userData.latitude,
        longitude: userData.longitude,
        role: userData.role || 1,
        phone: userData.phone,
      });
      
      // Étape 2: Créer le tutor avec l'ID de l'utilisateur
      const tutor = this.tutorRepository.create({
        mark: userData.mark || 1.0, // Note par défaut
        userId: user.id, // L'ID de l'utilisateur créé
        isActive: userData.isActive !== undefined ? userData.isActive : true,
      });
      
      const savedTutor = await this.tutorRepository.save(tutor);
      
      return {
        user,
        tutor: savedTutor,
        success: true,
      };

    } catch (error) {
      console.error('Erreur lors de la création du tutor:', error);
      throw error;
    }
  }
  
  /**
   * Mettre à jour l'image de profil d'un utilisateur
   */
 private ensureDirectoryExists(dirPath: string): void {
    if (!existsSync(dirPath)) {
      mkdirSync(dirPath, { recursive: true });
      console.log(`Dossier créé: ${dirPath}`);
    }
  }

  /**
   * Mettre à jour l'image de profil d'un utilisateur
   */
  async updateProfileImage(
    userId: number,
    file: Express.Multer.File,
  ): Promise<{ success: boolean; message: string; pathImage: string; url: string }> {
    console.log('=== DEBUG updateProfileImage ===');
    console.log('File received:', {
      originalname: file?.originalname,
      mimetype: file?.mimetype,
      size: file?.size,
      path: file?.path,
      bufferLength: file?.buffer?.length
    });

    try {
      // 1. Vérifier si l'utilisateur existe
      const user = await this.usersRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException(`Utilisateur avec l'ID ${userId} non trouvé`);
      }

      // 2. Valider le fichier
      this.validateFile(file);

      // 3. Générer un nom de fichier unique
      const newFilename = this.generateFilename(file.originalname);
      const finalPath = join(this.profilesDir, newFilename);
      
      console.log('New filename:', newFilename);
      console.log('Final path:', finalPath);

      // 4. Utiliser le fichier temporaire de multer ou créer un temporaire
      let tempFilePath: string;
      
      if (file.path && existsSync(file.path)) {
        // Utiliser le fichier temporaire créé par multer
        tempFilePath = file.path;
        console.log('Using multer temp file:', tempFilePath);
      } else if (file.buffer) {
        // Fallback: sauvegarder le buffer dans un fichier temporaire
        tempFilePath = join(this.tempDir, `temp_${newFilename}`);
        await this.saveBufferToFile(file.buffer, tempFilePath);
        console.log('Created temp file from buffer:', tempFilePath);
      } else {
        throw new BadRequestException('Impossible de lire le fichier uploadé');
      }

      // 5. Copier/traiter l'image vers le dossier final
      console.log('Copying/processing image...');
      await this.copyFile(tempFilePath, finalPath);

      // 6. Supprimer l'ancienne image si ce n'est pas l'image par défaut
      await this.deleteOldImage(user.pathImage);

      // 7. Mettre à jour le chemin dans la base de données
      user.pathImage = newFilename;
      await this.usersRepository.save(user);
      console.log('Database updated with new image:', newFilename);

      // 8. Supprimer le fichier temporaire
      this.deleteFile(tempFilePath);

      return {
        success: true,
        message: 'Image de profil mise à jour avec succès',
        pathImage: newFilename,
        url: `/profils/${newFilename}`,
      };
    } catch (error) {
      console.error('Error in updateProfileImage:', error);
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Erreur lors de la mise à jour de l'image: ${error.message}`);
    }
  }

  // ============ MÉTHODES AUXILIAIRES ============

  /**
   * Valider le fichier uploadé
   */
  private validateFile(file: Express.Multer.File): void {
    if (!file) {
      throw new BadRequestException('Aucun fichier fourni');
    }

    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `Type de fichier non autorisé. Types acceptés: ${this.allowedMimeTypes.join(', ')}`,
      );
    }

    if (file.size > this.maxFileSize) {
      throw new BadRequestException(
        `Fichier trop volumineux. Maximum: ${this.maxFileSize / 1024 / 1024}MB`,
      );
    }
  }

  /**
   * Générer un nom de fichier unique
   */
  private generateFilename(originalName: string): string {
    const ext = path.extname(originalName || 'image.jpg').toLowerCase();
    const uniqueId = uuidv4();
    return `profile_${uniqueId}${ext}`;
  }

  /**
   * Sauvegarder un buffer dans un fichier
   */
  private async saveBufferToFile(buffer: Buffer, filePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const fs = require('fs');
      const dir = path.dirname(filePath);
      
      // Créer le dossier si nécessaire
      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
      }
      
      fs.writeFile(filePath, buffer, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  /**
   * Copier un fichier (version simplifiée sans redimensionnement)
   */
  private async copyFile(sourcePath: string, destPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const fs = require('fs');
      
      // Créer le dossier de destination si nécessaire
      const destDir = path.dirname(destPath);
      if (!existsSync(destDir)) {
        mkdirSync(destDir, { recursive: true });
      }
      
      fs.copyFile(sourcePath, destPath, (err) => {
        if (err) {
          console.error('Error copying file:', err);
          reject(err);
        } else {
          console.log('File copied successfully to:', destPath);
          resolve();
        }
      });
    });
  }

  /**
   * Supprimer l'ancienne image si nécessaire
   */
  private async deleteOldImage(oldFilename: string): Promise<void> {
    if (oldFilename && oldFilename !== 'noPicture.jpg') {
      const oldPath = join(this.profilesDir, oldFilename);
      if (existsSync(oldPath)) {
        try {
          unlinkSync(oldPath);
          console.log('Old image deleted:', oldPath);
        } catch (error) {
          console.error('Error deleting old image:', error);
        }
      }
    }
  }

  /**
   * Supprimer un fichier
   */
  private deleteFile(filePath: string): void {
    try {
      if (existsSync(filePath)) {
        unlinkSync(filePath);
        console.log('Temp file deleted:', filePath);
      }
    } catch (error) {
      console.error(`Error deleting file ${filePath}:`, error);
    }
  }

  /**
   * Récupérer un utilisateur avec son URL d'image
   */
  async getUserWithImage(userId: number): Promise<any> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    
    if (!user) {
      throw new NotFoundException(`Utilisateur avec l'ID ${userId} non trouvé`);
    }

    // Vérifier si l'image existe physiquement
    const imagePath = join(this.profilesDir, user.pathImage);
    const finalImage = existsSync(imagePath) ? user.pathImage : 'noPicture.jpg';

    return {
      ...user,
      pathImage: finalImage,
      imageUrl: `/profils/${finalImage}`,
      fullImageUrl: `http://localhost:3000/profils/${finalImage}`,
    };
  }

  /**
   * Créer une image par défaut si elle n'existe pas
   */
  async createDefaultImageIfNotExists(): Promise<void> {
    const defaultImagePath = join(this.profilesDir, 'noPicture.jpg');
    
    if (!existsSync(defaultImagePath)) {
      try {
        // Créer une image simple
        const fs = require('fs');
        const { createCanvas } = require('canvas');
        
        const canvas = createCanvas(300, 300);
        const ctx = canvas.getContext('2d');
        
        // Fond gris
        ctx.fillStyle = '#cccccc';
        ctx.fillRect(0, 0, 300, 300);
        
        // Texte
        ctx.fillStyle = '#666666';
        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('No Picture', 150, 160);
        
        // Sauvegarder
        const buffer = canvas.toBuffer('image/jpeg');
        fs.writeFileSync(defaultImagePath, buffer);
        
        console.log('Default image created:', defaultImagePath);
      } catch (error) {
        console.error('Error creating default image:', error);
      }
    }
  }
}
