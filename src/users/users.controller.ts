// src/users/users.controller.ts
import { Controller, Get, Post, Body, Param, Query, HttpCode, HttpStatus, UploadedFile,
  UseInterceptors,
  ParseIntPipe,
  BadRequestException} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { Tutor } from '../tutors/entities/tutor.entity';
import { Reqclass } from '../reqclass/entities/reqclass.entity'; // Chemin corrigé
import { Classe } from '../classes/entities/classe.entity'; // Chemin corrigé
import { Commentaire } from '../commentaires/entities/commentaires.entity'; // Chemin corrigé


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('SignIn/phone/:phone')
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
  
  @Get('RequestList/:id')
  async requestUser(@Param('id') id: number){ 
    try {
      const requests = await this.usersService.viewRequest(id);
      
      return {
        success: true,
        count: requests.length, // 
        total_found: requests.length,
        data: requests // 
      };
    } catch (error) {
      return {
        success: false,
        message: 'Erreur lors de la recherche des requetes',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      };
    }
  }
  @Get('ActiveTeacherList/:id')
  async Myteachers(@Param('id') id: number){ 
    try {
      const requests = await this.usersService.TutorsUser(id);
      
      return {
        success: true,
        count: requests.length, // 
        total_found: requests.length,
        data: requests // 
      };
    } catch (error) {
      return {
        success: false,
        message: 'Erreur lors de la recherche des tutors actifs',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      };
    }
  }
  @Get('RelationTeacher/:id')
  async ExchangeDetails(@Param('id') id: number){ 
    try {
      const requests = await this.usersService.RelationWithTutor(id);
      
      return {
        success: true,
        count: requests.length, // 
        total_found: requests.length,
        data: requests // 
      };
    } catch (error) {
      return {
        success: false,
        message: 'Erreur lors de la recherche des informations de mon tutors',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      };
    }
  }
  @Post('Save_User')
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
  @Post('Make_request')
	async createrequest(@Body() requestData: any): Promise<{
	  success: boolean;
	  data?: Reqclass;
	  message: string;
	  error?: string;
	}> {
	  try {
	    console.log('Données reçues:', requestData); // Pour déboguer
	    
	    // Vérifiez que les données sont présentes
	    if (!requestData.user_id || !requestData.teacher_id || !requestData.classe_id) {
	      return {
		success: false,
		message: 'Données manquantes',
		error: 'user_id, teacher_id et classe_id sont requis'
	      };
	    }

	    // Créez l'objet dans le format attendu par Reqclass
	    const reqclassData: Partial<Reqclass> = {
	      userId: Number(requestData.user_id), // Assurez-vous que c'est le bon nom
	      teacherId: Number(requestData.teacher_id), // Assurez-vous que c'est le bon nom
	      classeId: Number(requestData.classe_id), // Assurez-vous que c'est le bon nom
	      isActive: true
	    };
	    
	    // Appelez la méthode
	    const reqclass = await this.usersService.create_request(reqclassData);
	    
	    return {
	      success: true,
	      data: reqclass,
	      message: 'Demande créée avec succès'
	    };
	    
	  } catch (error) {
	    console.error('Erreur lors de la création de la demande:', error);
	    
	    return {
	      success: false,
	      message: 'Erreur interne du serveur',
	      error: process.env.NODE_ENV === 'development' ? error.message : undefined
	    };
	  }
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
  @Post(':id/upload-profile')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './temp',
        filename: (req, file, callback) => {
          const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
          callback(null, uniqueName);
        },
      }),
      fileFilter: (req, file, callback) => {
        const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (allowedMimes.includes(file.mimetype)) {
          callback(null, true);
        } else {
          callback(new BadRequestException('Type de fichier non autorisé'), false);
        }
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
  )
  async uploadProfileImage(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Aucun fichier uploadé');
    }

    return this.usersService.updateProfileImage(id, file);
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
