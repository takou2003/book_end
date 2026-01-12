// src/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

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

  // Trouver par email
  findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ 
      where: { email } 
    });
  }

  // Créer un utilisateur
  create(userData: Partial<User>): Promise<User> {
    const user = this.usersRepository.create(userData);
    return this.usersRepository.save(user);
  }
}
