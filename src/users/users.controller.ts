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
@Post('comment')
async createComment(
  @Req() req,
  @Body() body: any,
) {
  try {
    const userId = req.user.id; // 🔐 depuis JWT
    const { teacher_id, texte } = body;

    if (!teacher_id || !texte) {
      return {
        success: false,
        message: 'Données manquantes',
        error: 'teacher_id et texte sont requis',
      };
    }

    const commentData: Partial<Commentaire> = {
      teacherId: Number(teacher_id),
      userId: Number(userId),
      texte,
    };

    const comment = await this.usersService.create_comment(commentData);

    return {
      success: true,
      data: comment,
      message: 'Commentaire créé avec succès',
    };
  } catch (error) {
    return {
      success: false,
      message: 'Erreur lors de la création du commentaire',
      error:
        process.env.NODE_ENV === 'development'
          ? error.message
          : undefined,
    };
  }
}

@UseGuards(JwtAuthGuard)
@Post('/rating')
async noteTutor(
  @Req() req,
  @Body() body: {
    teacher_id: number;
    mark: number;
    commentaire?: string;
  },
) {
  const userId = req.user.id;
  const { teacher_id, mark, commentaire } = body;

  if (!teacher_id || mark === undefined) {
    return {
      success: false,
      message: 'teacher_id et mark sont requis',
    };
  }

  return this.usersService.postNotation(
    userId,
    teacher_id,
    mark,
    commentaire,
  );
}


 @UseGuards(JwtAuthGuard)
 @Get('loadTutor')
  async available(@Req() req) {
    try {
      const tutors = await this.usersService.ville_tutor(req.user.ville);
      
      return {
        success: true,
        count: tutors.length, // Correction: 'tutors.length' pas 'filteredTutors'
        total_found: tutors.length,
        data: tutors // Correction: virgule au lieu de point-virgule
      };
    } catch (error) {
      return {
        success: false,
        message: 'Erreur lors de la recherche des tuteurs',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
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

@UseGuards(JwtAuthGuard)
@Post('Make_request')
async createrequest(
  @Req() req,
  @Body() body: { teacherId: number; classeId: number },
): Promise<{
  success: boolean;
  data?: Reqclass;
  message: string;
  error?: string;
}> {
  try {
    // 🔐 userId depuis le JWT
    const userId = req.user.id;

    if (!body.teacherId || !body.classeId) {
      return {
        success: false,
        message: 'Données manquantes',
        error: 'teacherId et classeId sont requis',
      };
    }

    const reqclassData: Partial<Reqclass> = {
      userId,
      teacherId: Number(body.teacherId),
      classeId: Number(body.classeId),
      isActive: true,
      status: 'pending',
    };

    const reqclass = await this.usersService.create_request(reqclassData);

    return {
      success: true,
      data: reqclass,
      message: 'Demande créée avec succès',
    };
  } catch (error) {
    console.error('Erreur lors de la création de la demande:', error);

    return {
      success: false,
      message: 'Erreur interne du serveur',
      error:
        process.env.NODE_ENV === 'development'
          ? error.message
          : undefined,
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
