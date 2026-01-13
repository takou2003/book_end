// src/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Localisation } from '../localisation/entities/localisation.entity'; // <-- Ajoutez cet import
import { Teacher } from '../teachers/entities/teacher.entity'; // <-- Ajoutez cet import

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  // Trouver tous les utilisateurs
  findAll(): Promise<User[]> {
    return this.usersRepository.find({
      order: { id: 'ASC' }
    });
  }
  
  async findAllWithLocalisation(email: string): Promise<User[]> {
    return this.usersRepository.find({
      relations: ['localisation'], // C'est ici qu'on fait la jointure
      where: { email },
      // Vous pouvez aussi sélectionner des champs spécifiques
      select: {
        id: true,
        firstname: true,
        lastname: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
        createdAt: true,
        localisation: {
          id: true,
          addresse: true,
          latitude: true,
          longitude: true,
          pathImage: true
        }
      }
    });
  }
   // Alternative avec QueryBuilder
  async findAllWithLocalisationQueryBuilder(email: string): Promise<User[]> {
    try {
      const users = await this.usersRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.localisation', 'localisation')
        .where('user.email = :email', { email }) // <-- Correction ici
        .getMany();
      
      console.log('QueryBuilder result:', users.length); // Debug
      return users;
    } catch (error) {
      console.error('Error in QueryBuilder:', error);
      return [];
    }
  }

  
  async createWithLocalisationTransactional(userData: any): Promise<{
    user: User;
    localisation: Localisation | null;
  }> {
    return this.usersRepository.manager.transaction(async (transactionalEntityManager) => {
      // Étape 1: Créer l'utilisateur
      const user = transactionalEntityManager.create(User, {
        firstname: userData.firstname,
        lastname: userData.lastname,
        email: userData.email,
        password: userData.password,
        phone: userData.phone,
        role: userData.role || 1,
      });

      const savedUser = await transactionalEntityManager.save(user);
      
      // Étape 2: Créer la localisation
      let savedLocalisation: Localisation | null = null;
      
      if (userData.addresse || userData.latitude || userData.longitude) {
        const localisation = transactionalEntityManager.create(Localisation, {
          addresse: userData.addresse,
          latitude: userData.latitude,
          longitude: userData.longitude,
          pathImage: userData.pathImage,
          userId: savedUser.id,
        });
        
        savedLocalisation = await transactionalEntityManager.save(localisation);
      }
      
      return {
        user: savedUser,
        localisation: savedLocalisation,
      };
    });
  }
  async create_teacher(userData: any): Promise<{
    user: User;
    localisation: Localisation | null;
    
  }> {
    return this.usersRepository.manager.transaction(async (transactionalEntityManager) => {
      // Étape 1: Créer l'utilisateur
      const user = transactionalEntityManager.create(User, {
        firstname: userData.firstname,
        lastname: userData.lastname,
        email: userData.email,
        password: userData.password,
        phone: userData.phone,
        role: 2,
      });

      const savedUser = await transactionalEntityManager.save(user);
      
      // Étape 2: Créer la localisation
      let savedLocalisation: Localisation | null = null;
      
      if (userData.addresse || userData.latitude || userData.longitude) {
        const localisation = transactionalEntityManager.create(Localisation, {
          addresse: userData.addresse,
          latitude: userData.latitude,
          longitude: userData.longitude,
          pathImage: userData.pathImage,
          userId: savedUser.id,
        });
        
        savedLocalisation = await transactionalEntityManager.save(localisation);
      }
      
      const teacher = transactionalEntityManager.create(Teacher, {
      	 
      	 userId: savedUser.id,
      	 note: 1, 
      });
      let saved_teacher = await transactionalEntityManager.save(teacher);
      return {
        user: savedUser,
        localisation: savedLocalisation,
        teacher: saved_teacher,
      };
    });
  }

}
