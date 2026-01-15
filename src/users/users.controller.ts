// src/users/users.controller.ts
import { Controller, Get, Post, Body, Param, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('phone/:phone')
  async findByPhone(@Param('phone') phone: string): Promise<{
    success: boolean;
    found: boolean;
    data: User | null;
    timestamp: string;
  }> {
    const users = await this.usersService.findByPhone(phone);
    
    return {
      success: true,
      found: !!users,
      data: users,
      timestamp: new Date().toISOString(),
    };
  }

  @Post()
  async create(@Body() userData: any): Promise<{
    success: boolean;
    data: User;
    message: string;
  }> {
    const user = await this.usersService.create({
      username: userData.username,
      password: userData.password,
      ville: userData.ville,
      quartier: userData.quartier,
      latitude: userData.latitude,
      longitude: userData.longitude,
      role: userData.role || 0,
      phone: userData.phone,
    });
    
    return {
      success: true,
      data: user,
      message: 'User created successfully'
    };
  }
  
  @Post('Save_Tutor')
  @HttpCode(HttpStatus.CREATED)
  async createTutor(@Body() userData: any) {
    try {
      const result = await this.usersService.Create_Tutor(userData);
      
      return this.formatTutorResponse(result);
    } catch (error) {
      return this.formatErrorResponse(error, 'Erreur lors de la création du tutor');
    }
  }

  // Ajoutez ces méthodes manquantes
  private formatTutorResponse(result: { user: User; tutor: any; success: boolean }) {
    return {
      success: true,
      data: {
        user: {
          id: result.user.id,
          username: result.user.username,
          ville: result.user.ville,
          quartier: result.user.quartier,
          phone: result.user.phone,
          role: result.user.role,
        },
        tutor: {
          id: result.tutor.id,
          mark: result.tutor.mark,
          isActive: result.tutor.isActive,
          userId: result.tutor.userId,
        }
      },
      message: 'Tutor créé avec succès'
    };
  }

  private formatErrorResponse(error: any, message: string) {
    return {
      success: false,
      data: null,
      message: message,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    };
  }
}
