// src/users/users.controller.ts
import { Controller, Get, Post, Body, Param, Query,HttpCode, HttpStatus} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // 1. Routes spécifiques AVANT les routes avec paramètres
  @Get('sign_in/:email')
  async findAllWithLocalisation(
    @Param('email') email: string, 
    @Query('includeInactive') includeInactive?: string
  ): Promise<{
    success: boolean;
    count: number;
    data: User[];
    timestamp: string;
  }> {
    let users: User[];
    if (includeInactive === 'true') {
      users = await this.usersService.findAllWithLocalisationQueryBuilder(email);
    } else {
      users = await this.usersService.findAllWithLocalisation(email);
    } 
    return {
      success: true,
      count: users.length,
      data: users,
      timestamp: new Date().toISOString(),
    };
  }

  @Post('sign_up')
  @HttpCode(HttpStatus.CREATED)
  async createsimple(@Body() userData: any): Promise<{
    success: boolean;
    data: {
      user: any;
      localisation: any | null;
    };
    message: string;
  }> {
    const { user, localisation } = await this.usersService.createWithLocalisationTransactional(userData);
    
    return {
      success: true,
      data: {
        user: {
          id: user.id,
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
        localisation: localisation ? {
          id: localisation.id,
          addresse: localisation.addresse,
          latitude: localisation.latitude,
          longitude: localisation.longitude,
          pathImage: localisation.pathImage,
        } : null
      },
      message: localisation 
        ? 'User and localisation created successfully' 
        : 'User created successfully (no localisation provided)'
    };
  }
  @Post('sign_up_teacher')
  @HttpCode(HttpStatus.CREATED)
  async createteacher(@Body() userData: any): Promise<{
    success: boolean;
    data: {
      user: any;
      localisation: any | null;
    };
    message: string;
  }> {
    const { user, localisation } = await this.usersService.create_teacher(userData);
    
    return {
      success: true,
      data: {
        user: {
          id: user.id,
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
        localisation: localisation ? {
          id: localisation.id,
          addresse: localisation.addresse,
          latitude: localisation.latitude,
          longitude: localisation.longitude,
          pathImage: localisation.pathImage,
        } : null
      },
      message: localisation 
        ? 'User and localisation created successfully' 
        : 'User created successfully (no localisation provided)'
    };
  }
}
