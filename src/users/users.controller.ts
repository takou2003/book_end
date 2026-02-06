// src/users/users.controller.ts
import { Controller, Get, Post, Body, Param, Query, HttpCode, HttpStatus, UploadedFile,
  UseInterceptors,
  ParseIntPipe,
  BadRequestException, UseGuards, Req} from '@nestjs/common';
  import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
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
import { BaseUserDto } from './dto/base-user.dto';
import { CreateParentDto } from './dto/create-parent.dto';
import { CreateTutorDto } from './dto/create-tutor.dto';
import { SearchTutorDto } from './dto/search-tutor.dto';
//import { LoginDto } from './dto/login.dto';


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @UseGuards(JwtAuthGuard)  
  @Get('RequestList')
  async requestUser(@Req() req){ 
    try {
      const requests = await this.usersService.viewRequest(req.user.id);
      
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
@Post('search')
async findTutors(@Body() dto: SearchTutorDto) {
  try {
    const tutors = await this.usersService.search_Tutor(
      dto.ville,
      dto.classeId,
    );

    return {
      success: true,
      count: tutors.length,
      total_found: tutors.length,
      data: tutors,
    };
  } catch (error) {
    return {
      success: false,
      message: 'Erreur lors de la recherche des tuteurs',
      error:
        process.env.NODE_ENV === 'development'
          ? error.message
          : undefined,
    };
  }
}

  @UseGuards(JwtAuthGuard)
  @Get('ActiveTeacherList')
  async Myteachers(@Req() req){ 
    try {
      const requests = await this.usersService.TutorsUser(req.user.id);
      
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
@Post('register/parent')
async createParent(@Body() dto: CreateParentDto) {
  return this.usersService.createParent(dto);
}

@Post('register/tutor')
async createTutor(@Body() dto: CreateTutorDto) {
  return this.usersService.createTutor(dto);
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
	    if (!requestData.userId || !requestData.teacherId || !requestData.classeId) {
	      return {
		success: false,
		message: 'Données manquantes',
		error: 'userId, teacherId et classeId sont requis'
	      };
	    }

	    // Créez l'objet dans le format attendu par Reqclass
	    const reqclassData: Partial<Reqclass> = {
	      userId: Number(requestData.userId), // Assurez-vous que c'est le bon nom
	      teacherId: Number(requestData.teacherId), // Assurez-vous que c'est le bon nom
	      classeId: Number(requestData.classeId), // Assurez-vous que c'est le bon nom
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
		
@UseGuards(JwtAuthGuard)
@Post('upload-profile')
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
        callback(
          new BadRequestException('Type de fichier non autorisé'),
          false,
        );
      }
    },
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB
    },
  }),
)
async uploadProfileImage(
  @Req() req,
  @UploadedFile() file: Express.Multer.File,
) {
  if (!file) {
    throw new BadRequestException('Aucun fichier uploadé');
  }

  // 🔐 ID récupéré depuis le JWT
  const userId = req.user.id;

  return this.usersService.updateProfileImage(userId, file);
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
 @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Req() req) {
    return req.user;
  }
}
