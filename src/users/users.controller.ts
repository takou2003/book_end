// src/users/users.controller.ts
import { Controller, Get, Post, Body, Param, Query, HttpCode, HttpStatus, UploadedFile,
  UseInterceptors,
  ParseIntPipe,
  BadRequestException, UseGuards, Req, Patch, Delete} from '@nestjs/common';
  import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { UsersService } from './users.service';
import { SignalService } from '../signal/signal.service';
import { TutorsService } from '../tutors/tutors.service';
import { CreateSignalDto } from '../signal/dto/create-signal.dto';
import { User } from './entities/user.entity';
import { Tutor } from '../tutors/entities/tutor.entity';
import { Reqclass } from '../reqclass/entities/reqclass.entity'; // Chemin corrigé
import { Classe } from '../classes/entities/classe.entity'; // Chemin corrigé
import { Commentaire } from '../commentaires/entities/commentaires.entity'; // Chemin corrigé
import { BaseUserDto } from './dto/base-user.dto';
import { CreateParentDto } from './dto/create-parent.dto';
import { CreateTutorDto } from './dto/create-tutor.dto';
import { CreateAdminDto } from './dto/create-admin.dto';
import { SearchTutorDto } from './dto/search-tutor.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
//import { LoginDto } from './dto/login.dto';


@Controller('users')
export class UsersController {
  constructor(
  
  private readonly usersService: UsersService,
  private readonly signalService: SignalService,
  private readonly tutorService: TutorsService,
  ) {}
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

@UseGuards(JwtAuthGuard)
@Get('notifications/grouped')
async getGroupedNotifications(@Req() req) {
  const userId = req.user.id;
  return this.usersService.getGroupedNotifications(userId);
}

@UseGuards(JwtAuthGuard)
@Get('notifications/by-title')
async getNotificationsByTitle(
  @Req() req,
  @Query('title') title: string,
) {
  if (!title) {
    throw new BadRequestException('Le paramètre title est requis');
  }
  const userId = req.user.id;
  return this.usersService.getNotificationsByTitle(userId, title);
}

@UseGuards(JwtAuthGuard)
@Patch('notifications/mark-all-read')
async markAllAsRead(
  @Req() req,
  @Query('title') title: string,
) {
  if (!title) {
    throw new BadRequestException('Le paramètre title est requis');
  }
  const userId = req.user.id;
  await this.usersService.markAllAsRead(userId, title);
  return {
    success: true,
    message: `Toutes les notifications "${title}" ont été marquées comme lues`,
  };
}
@UseGuards(JwtAuthGuard)
@Post('search/:classeId')
async findTutors(
  @Req() req,
  @Param('classeId') classeId: number,
) {
  try {
    if (!classeId) {
      throw new BadRequestException('classeId est requis');
    }

    const ville = req.user.ville;

    const tutors = await this.usersService.search_Tutor(
      ville,
      Number(classeId),
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
  @Patch('up_info')
  updateMe(
    @Req() req,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(req.user.id, dto);
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
@Post('register/admin')
async createAdmin(@Body() dto: CreateAdminDto) {
  return this.usersService.createAdmin(dto);
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
    
    const teacherOriginalId = await this.tutorService.getTutorIdFromUser(body.teacherId);
    const make_push = await this.usersService.sendNotification(teacherOriginalId, "Demandes", "vous avez une nouvelle demande d'enseignement");
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
@Post('signal-user')
async signalUser(
  @Req() req,
  @Body() dto: CreateSignalDto,
) {
  const userId = req.user.id;

  const signal = await this.signalService.createSignal(
    userId,
    dto,
  );
  const originalId = signal.direction;
  const make_push = await this.usersService.sendNotification(originalId, "Avertissements", "vous compte a ete signale");
  return {
    success: true,
    message: 'Compte signalé avec succès',
    data: {
      id: signal.id,
      direction: signal.direction,
      motif: signal.motif,
      createdAt: signal.createdAt,
    },
  };
}

 @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Req() req) {
    return req.user;
  }
}
