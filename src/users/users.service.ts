// src/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Tutor } from '../tutors/entities/tutor.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    
    @InjectRepository(Tutor) // Ajoutez cette injection
    private tutorRepository: Repository<Tutor>,
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

  // Créer un utilisateur
  create(userData: Partial<User>): Promise<User> {
    const user = this.usersRepository.create(userData);
    return this.usersRepository.save(user);
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
}
