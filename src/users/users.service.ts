// src/users/users.service.ts
import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import sharp from 'sharp';
import {  createWriteStream, existsSync, mkdirSync, unlinkSync, readFileSync } from 'fs';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { Tutor } from '../tutors/entities/tutor.entity';
import { Reqclass } from '../reqclass/entities/reqclass.entity';
import { Commentaire } from '../commentaires/entities/commentaires.entity'; // Chemin corrigé 
import { Notation } from '../notations/entities/notations.entity'; // Chemin corrigé
import { Classe } from '../classes/entities/classe.entity'; 
import { Notification } from '../notifications/entities/notifications.entity'; 
import { LoginDto } from './dto/login.dto';
import { BaseUserDto } from './dto/base-user.dto';
import { CreateParentDto } from './dto/create-parent.dto';
import { SearchTutorDto } from './dto/search-tutor.dto';
import { CreateTutorDto } from './dto/create-tutor.dto';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Expo } from 'expo-server-sdk';


@Injectable()
export class UsersService {
  private readonly profilesDir = join(process.cwd(), 'profils');
  private readonly tempDir = join(process.cwd(), 'temp');
  private readonly allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  private readonly maxFileSize = 5 * 1024 * 1024; // 5MB
  private expo: Expo;
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    
    @InjectRepository(Tutor) // Ajoutez cette injection
    private tutorRepository: Repository<Tutor>,
    
    @InjectRepository(Reqclass) 
    private reqclassRepository: Repository<Reqclass>,
    
    @InjectRepository(Classe)
    private classeRepository: Repository<Classe>,
       
    @InjectRepository(Commentaire) 
    private commentaireRepository: Repository<Commentaire>,
    
    @InjectRepository(Notation) 
    private notationRepository: Repository<Notation>,
    
    @InjectRepository(Notification) 
    private notificationRepository: Repository<Notification>,
  ) {this.expo = new Expo();}

  // Trouver tous les utilisateurs
  findAll(): Promise<User[]> {
    return this.usersRepository.find({
      order: { id: 'ASC' }
    });
  }
  
  findByEmail(mail: string) {
    return this.usersRepository.findOne({ where: { mail } });
  }
  
  findById(id: number) {
    return this.usersRepository.findOne({ where: { id } });
  }

  async updateRefreshToken(userId: number, token: string) {
    const hash = await bcrypt.hash(token, 10);
    await this.usersRepository.update(userId, {
      refreshToken: hash,
    });
  }

  async removeRefreshToken(userId: number) {
  await this.usersRepository.update(userId, {
    refreshToken: undefined,
  });
}

async updatePassword(
  userId: number,
  hashedPassword: string,
): Promise<void> {

  const result = await this.usersRepository.update(
    { id: userId },
    { password: hashedPassword },
  );

  if (result.affected === 0) {
    throw new NotFoundException('User not found');
  }
}

async getAdminUserId(): Promise<number> {
  const admin = await this.usersRepository.findOne({
    where: { fonction: 'admin' },
    select: ['id'],
  });

  if (!admin) {
    throw new BadRequestException('Aucun administrateur trouvé');
  }

  return admin.id;
}

async ville_tutor(ville: string): Promise<any[]> {
  const tutors = await this.tutorRepository
    .createQueryBuilder('t')
    .innerJoin('t.user', 'u')
    .innerJoin('t.assclasse', 'ac')
    .innerJoin('ac.classe', 'c')
    .where('u.ville = :ville', { ville })
    .andWhere('t.isActive = true')
    .groupBy('t.id')
    .addGroupBy('u.id')
    .orderBy('RANDOM()')
    .limit(5)
    .select([
      't.id AS teacher_id',
      'u.username AS name',
      'u.ville AS ville',
      'u.quartier AS quartier',
      'u.pathImage AS image',
      't.mark AS mark',
      't.description AS description',
      `
      JSON_AGG(
        JSON_BUILD_OBJECT(
          'classe_id', c.id,
          'classe', c.name,
          'price', ac.price
        )
      ) AS classes
      `
    ])
    .getRawMany();

  return tutors.map(tutor => ({
    ...tutor,
    imageUrl: `${process.env.URL}/profils/${tutor.image}`,
  }));
}

async sendNotification(
  userId: number,
  title: string,
  body: string,
): Promise<Notification> {
  const user = await this.usersRepository.findOne({
    where: { id: userId },
  });

  if (!user) {
    throw new NotFoundException('User not found');
  }

  // ✅ On sauvegarde TOUJOURS la notification
  const notification = await this.notificationRepository.save({
    title,
    body,
    deviceToken: user.deviceToken ?? null,
    userId,
    isRead: false,
  });

  // ✅ On tente l’envoi seulement si token valide
  if (user.deviceToken && Expo.isExpoPushToken(user.deviceToken)) {
    try {
      await this.expo.sendPushNotificationsAsync([
        {
          to: user.deviceToken,
          sound: 'default',
          title,
          body,
        },
      ]);
    } catch (error) {
      console.error('Erreur envoi notification Expo', error);
    }
  }

  return notification;
}

async getGroupedNotifications(userId: number) {
  return this.notificationRepository
    .createQueryBuilder('n')
    .select('n.title', 'title')
    .addSelect('MAX(n.createdAt)', 'lastDate')
    .addSelect(
      `(
        SELECT body FROM notifications n2
        WHERE n2.title = n.title
        AND n2.user_id = :userId
        ORDER BY n2.created_at DESC
        LIMIT 1
      )`,
      'lastBody',
    )
    .addSelect(
      `COUNT(CASE WHEN n.isRead = false THEN 1 END)`,
      'unreadCount',
    )
    .where('n.user_id = :userId', { userId })
    .groupBy('n.title')
    .orderBy('MAX(n.created_at)', 'DESC') // ← plus d'alias, directement l'expression
    .setParameter('userId', userId)       // ← paramètre explicite pour la sous-requête
    .getRawMany();
}

async getNotificationsByTitle(userId: number, title: string) {
  return this.notificationRepository.find({
    where: { userId, title },
    order: { createdAt: 'DESC' },
  });
}

async markAllAsRead(userId: number, title: string) {
  await this.notificationRepository.update(
    { userId, title, isRead: false },
    { isRead: true },
  );
}

async deleteNotification(
  userId: number,
  notificationId: number,
): Promise<void> {
  const result = await this.notificationRepository.delete({
    id: notificationId,
    userId: userId, // 🔥 sécurité
  });

  if (result.affected === 0) {
    throw new NotFoundException(
      'Notification introuvable ou non autorisée',
    );
  }
}

async deleteAllUserNotifications(userId: number): Promise<void> {
  await this.notificationRepository.delete({
    userId,
  });
}

async deleteNotificationsByTitle(
  userId: number,
  title: string,
): Promise<void> {
  const result = await this.notificationRepository.delete({
    userId,
    title,
  });

  if (result.affected === 0) {
    throw new NotFoundException(
      'Aucune notification trouvée avec ce titre',
    );
  }
}

async search_Tutor(ville: string, classeId: number): Promise<any[]> {
  const tutors = await this.tutorRepository
    .createQueryBuilder('t')
    .innerJoin('t.user', 'u')
    .innerJoin('t.assclasse', 'ac')
    .innerJoin('ac.classe', 'c')
    .select([
      'u.id AS user_id',
      'u.pathImage AS image',
      'u.username AS username',
      'u.ville AS ville ',
      'u.quartier AS quartier',
      'u.phone AS phone',
      't.mark AS mark',
      't.isActive AS isActive',
      'c.name AS class_name',
      't.id AS teacher_id',
      'c.id AS classe_id',
      'ac.price AS price',
      't.description AS description',
    ])
    .where('u.ville = :ville', { ville })
    .andWhere('c.id = :classeId', { classeId })
    .andWhere('t.isActive = true')
    .getRawMany();
    return tutors.map(tutor => ({
    ...tutor,
    imageUrl: `${process.env.URL}/profils/${tutor.image}`,
  }));
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
      't.id AS teacher_id',
      'ut.phone AS phone_teacher',
      'c.name AS nom_classe',
      'ut.quartier AS quartier',
      'rc.status AS status',
      'rc.createdAt AS date',
      'ut.id AS id'
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
      'rc.id AS relation_id',
      't.id AS teacher_id',
      'ut.phone AS phone'
    ])
    .where('u.id = :id', { id })
    .andWhere('rc.status = :status', { status });
    
  return query.getRawMany();
 }
 
 async updateProfile(
  userId: number,
  dto: UpdateProfileDto,
) {
  const user = await this.usersRepository.findOne({
    where: { id: userId },
  });

  if (!user) {
    throw new NotFoundException('Utilisateur introuvable');
  }

  // 🔎 Vérifier unicité username
  if (dto.username && dto.username !== user.username) {
    const usernameExists = await this.usersRepository.findOne({
      where: { username: dto.username },
    });
    
    user.username = dto.username;
  }

  // ✅ Modifier ville
  if (dto.ville) {
    user.ville = dto.ville;
  }
  
  if(dto.deviceToken) {
    user.deviceToken = dto.deviceToken;
  }

  await this.usersRepository.save(user);

  return {
    success: true,
    message: 'Profil mis à jour avec succès',
    user: this.cleanUser(user),
  };
}

 
 create_comment(commentData: Partial<Commentaire>): Promise<Commentaire> {
    const comment = this.commentaireRepository.create(commentData);
    return this.commentaireRepository.save(comment);
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
 
 async findByPhoneOrMail(phone?: string, mail?: string): Promise<User | null> {
  return this.usersRepository.findOne({
    where: phone ? { phone } : { mail },
  });
}

async create(userData: Partial<User>): Promise<User> {
  if (!userData.password) {
    throw new BadRequestException('Mot de passe requis');
  }

  // 🔎 Vérification email
  if (userData.mail) {
    const emailExists = await this.usersRepository.findOne({
      where: { mail: userData.mail },
    });

    if (emailExists) {
      throw new ConflictException('Cet email est déjà utilisé');
    }
  }

  // 🔎 Vérification phone
  if (userData.phone) {
    const phoneExists = await this.usersRepository.findOne({
      where: { phone: userData.phone },
    });

    if (phoneExists) {
      throw new ConflictException('Ce numéro de téléphone est déjà utilisé');
    }
  }

  // 🔐 Hash mot de passe
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(userData.password, salt);

  const user = this.usersRepository.create({
    ...userData,
    password: hashedPassword,
  });

  return this.usersRepository.save(user);
}


  create_request(reqclassData: Partial<Reqclass>): Promise<Reqclass> {
  const reqClass = this.reqclassRepository.create({
    ...reqclassData,
    status: reqclassData.status ?? 'pending',
    notation: reqclassData.notation ?? 0,
  });

  return this.reqclassRepository.save(reqClass);
}
 
async createParent(dto: CreateParentDto) {
  const user = await this.create({
    ...dto,
    role: 0,
    fonction: 'parent',
    latitude: dto.latitude || 0.0,     // ← GARANTIR LA VALEUR
    longitude: dto.longitude || 0.0,   // ← GARANTIR LA VALEUR
  });

  return {
    success: true,
    user: this.cleanUser(user),
  };
}

async createAdmin(dto: CreateAdminDto) {
  const user = await this.create({
    ...dto,
    role: 2,
    fonction: 'admin',
    latitude: dto.latitude || 0.0,     // ← GARANTIR LA VALEUR
    longitude: dto.longitude || 0.0,   // ← GARANTIR LA VALEUR
  });

  return {
    success: true,
    user: this.cleanUser(user),
  };
}



async postNotation(
  userId: number,
  teacherId: number,
  mark: number,
  commentaire?: string,
): Promise<{ success: boolean; message: string; average?: number }> {

  if (mark < 0 || mark > 5) {
    return {
      success: false,
      message: 'La note doit être comprise entre 0 et 5',
    };
  }

  // 1. Vérifier si une notation existe déjà
  let notation = await this.notationRepository.findOne({
    where: {
      userId,
      teacherId,
    },
  });

  if (notation) {
    // UPDATE
    notation.mark = mark;
    notation.commentaire = commentaire;
    await this.notationRepository.save(notation);
  } else {
    // CREATE
    notation = this.notationRepository.create({
      userId,
      teacherId,
      mark,
      commentaire: commentaire,
    });
    await this.notationRepository.save(notation);
  }

  // 2. Recalculer la moyenne
  const { average } = await this.calculateTeacherAverage(teacherId);

  // 3. Mettre à jour le mark du tutor
  await this.tutorRepository.update(
    { id: teacherId },
    { mark: average },
  );

  return {
    success: true,
    message: 'Notation enregistrée avec succès',
    average,
  };
}

private async calculateTeacherAverage(teacherId: number): Promise<{
  average: number;
  count: number;
}> {
  const result = await this.notationRepository
    .createQueryBuilder('n')
    .select('AVG(n.mark)', 'average')
    .addSelect('COUNT(n.id)', 'count')
    .where('n.teacherId = :teacherId', { teacherId })
    .getRawOne();

  return {
    average: parseFloat(result.average) || 0,
    count: parseInt(result.count) || 0,
  };
}

// src/users/users.service.ts
async findByEmailWithPassword(email: string): Promise<User | null> {
  return this.usersRepository.findOne({
    where: { mail: email },
    select: ['id', 'mail', 'password', 'isActive'], // Seulement ce dont on a besoin
  });
}

async invalidateRefreshTokens(userId: number): Promise<void> {
  await this.usersRepository.update(
    { id: userId },
    { refreshToken: '' }
  );
}


async createTutor(dto: CreateTutorDto) {
  const user = await this.create({
    ...dto,
    role: 1,
    fonction: 'tutor',
    latitude: dto.latitude || 0.0,     // ← GARANTIR LA VALEUR
    longitude: dto.longitude || 0.0,   // ← GARANTIR LA VALEUR
  });

  const tutor = await this.tutorRepository.save(
    this.tutorRepository.create({
      userId: user.id,
      mark: dto.mark ?? 1.0,
      isActive: dto.isActive ?? false,
    }),
  );

  return {
    success: true,
    user: this.cleanUser(user),
    tutor,
  };
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
      fullImageUrl: `${process.env.URL}/profils/${finalImage}`,
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
  private cleanUser(user: User) {
  const {
    password,
    ...safeUser
  } = user;

  return {
    id: safeUser.id,
    username: safeUser.username,
    phone: safeUser.phone,
    mail: safeUser.mail,
    ville: safeUser.ville,
    quartier: safeUser.quartier,
    role: safeUser.role,
    fonction: safeUser.fonction,
    pathImage: safeUser.pathImage,
  };
}

async findMeWithRelations(id: number): Promise<User | null> {
  return this.usersRepository.findOne({
    where: { id },
    relations: ['tutor'],
  });
}

async deactivateAccount(userId: number) {
  await this.usersRepository.update(userId, { isActive: false });
}
}
