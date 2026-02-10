// src/tutors/tutors.controller.ts
import { Controller, Get, Query, Param, BadRequestException, Post, Body, UseGuards, Req,
UseInterceptors,
UploadedFile,
} from '@nestjs/common';
import { TutorsService } from './tutors.service';
import { VerificationsService } from '../verifications/verifications.service';
import { Reqclass } from '../reqclass/entities/reqclass.entity'; // Chemin corrigé
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { Commentaire } from '../commentaires/entities/commentaires.entity'; // Chemin corrigé
import { Classe } from '../classes/entities/classe.entity'; // Chemin corrigé
import { User } from '../users/entities/user.entity';
import { Assclass } from '../assclass/entities/assclass.entity';
import { memoryStorage } from 'multer';
@Controller('tutors')
export class TutorsController {
  constructor(
  	private readonly tutorsService: TutorsService,
        private readonly verificationsService: VerificationsService,
  ) {}
  
@UseGuards(JwtAuthGuard)
@Post('verifications/upload')
@UseInterceptors(
  FileInterceptor('document', {
    storage: memoryStorage(),
    limits: {
      fileSize: 5 * 1024 * 1024, // 5 MB
    },
    fileFilter: (req, file, cb) => {
      if (file.mimetype !== 'application/pdf') {
        return cb(
          new BadRequestException('Seuls les fichiers PDF sont autorisés'),
          false,
        );
      }
      cb(null, true);
    },
  }),
)
async uploadVerification(
  @Req() req,
  @UploadedFile() file: Express.Multer.File,
  @Body('description') description: string,
) {
  if (!file) {
    throw new BadRequestException('Aucun document fourni');
  }

  if (!description || description.trim().length === 0) {
    throw new BadRequestException('La description est obligatoire');
  }

  const tutorId = await this.tutorsService.getTutorIdFromUser(req.user.id);

  const verification = await this.verificationsService.uploadDocument(
    tutorId,
    file,
    description.trim(),
  );

  return {
    success: true,
    message: 'Document envoyé pour vérification',
    data: {
      id: verification.id,
      filename: verification.pathDocument,
      description: verification.description,
      status: verification.status,
      createdAt: verification.createdAt,
    },
  };
}


@UseGuards(JwtAuthGuard)
@Get('RequestList')
async requestUser(@Req() req) {
  const tutorId = await this.tutorsService.getTutorIdFromUser(req.user.id);
  const requests = await this.tutorsService.viewRequest(tutorId);

  return {
    success: true,
    count: requests.length,
    total_found: requests.length,
    data: requests,
  };
}

@UseGuards(JwtAuthGuard)
@Get('ActiveRequestList')
async requestActiveUser(@Req() req) {
  const tutorId = await this.tutorsService.getTutorIdFromUser(req.user.id);
  const requests = await this.tutorsService.ActiveRequest(tutorId);

  return {
    success: true,
    count: requests.length,
    total_found: requests.length,
    data: requests,
  };
}
  
 @Get('tutorcomment/:id')
  async available(@Param('id') id: number) {
    try {
      const tutors = await this.tutorsService.commentList(id);
      
      return {
        success: true,
        count: tutors.length, // Correction: 'tutors.length' pas 'filteredTutors'
        total_found: tutors.length,
        data: tutors // Correction: virgule au lieu de point-virgule
      };
    } catch (error) {
      return {
        success: false,
        message: 'Erreur lors de la recherche des commentaires',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      };
    }
}

@UseGuards(JwtAuthGuard)
  @Get('my')
  async getMyVerifications(@Req() req) {
    const userId = req.user.id;

    // Récupération du tutorId depuis le user connecté
    const tutorId = await this.tutorsService.getTutorIdFromUser(userId);

    const verifications =
      await this.verificationsService.getVerificationsByTeacher(tutorId);

    return {
      success: true,
      count: verifications.length,
      data: verifications,
    };
  }
  
@Post('responseRequest/:id/:action')
async handleRequest(
  @Param('id') id: number,
  @Param('action') action: 'accept' | 'deny',
) {
  if (!['accept', 'deny'].includes(action)) {
    throw new BadRequestException('Action invalide');
  }

  const result = await this.tutorsService.updateRequestStatus(
    id,
    action === 'accept' ? 'accepted' : 'denied',
  );

  if (!result.success) {
    throw new BadRequestException(result.message);
  }

  return {
    message: result.message,
    data: result.data,
  };
}


@Get('tutorclass/:id')
  async classe_tutor(@Param('id') id: number) {
    try {
      const tutors = await this.tutorsService.classe_Tutor(id);
      
      return {
        success: true,
        count: tutors.length, // Correction: 'tutors.length' pas 'filteredTutors'
        total_found: tutors.length,
        data: tutors // Correction: virgule au lieu de point-virgule
      };
    } catch (error) {
      return {
        success: false,
        message: 'Erreur lors de la recherche des classes',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      };
    }
}

@Get('tutorInfo/:id')
	async tutorInfo(@Param('id') id: number) {
	  try {
	    const requests = await this.tutorsService.TutorDetail(id);
	    
	    // Vérifier si requests est null
	    if (!requests) {
	      return {
		success: false,
		message: 'Tuteur non trouvé',
		data: [],
		count: 0,
		total_found: 0
	      };
	    }
	    
	    return {
	      success: true,
	      count: requests.length,
	      total_found: requests.length,
	      data: requests
	    };
	  } catch (error) {
	    return {
	      success: false,
	      message: 'Erreur lors de la recherche des informations du tuteur',
	      data: [],
	      count: 0,
	      total_found: 0,
	      error: process.env.NODE_ENV === 'development' ? error.message : undefined
	    };
	  }
	}
@UseGuards(JwtAuthGuard)
@Post('AddTutorInclasse')
async createAssclass(
  @Req() req,
  @Query('classe_id') classeId: number,
): Promise<{
  success: boolean;
  data?: Assclass;
  message: string;
  error?: string;
}> {
  try {
    if (!classeId) {
      return {
        success: false,
        message: 'Données manquantes',
        error: 'classe_id est requis',
      };
    }

    // 🔐 tutorId depuis le JWT
    const tutorId = await this.tutorsService.getTutorIdFromUser(req.user.id);

    const assclassData: Partial<Assclass> = {
      teacherId: tutorId,
      classeId: Number(classeId),
    };

    const assclass = await this.tutorsService.create_assclass(assclassData);

    return {
      success: true,
      data: assclass,
      message: 'Association créée avec succès',
    };
  } catch (error) {
    return {
      success: false,
      message: 'Erreur lors de l’association',
      error:
        process.env.NODE_ENV === 'development'
          ? error.message
          : undefined,
    };
  }
}

   @Get('DetailRequest/:id')
   async RequestInfo(@Param('id') id: number) {
	  try {
	    const requests = await this.tutorsService.RequestDetail(id);
	    
	    // Vérifier si requests est null
	    if (!requests) {
	      return {
		success: false,
		message: 'Tuteur non trouvé',
		data: [],
		count: 0,
		total_found: 0
	      };
	    }
	    
	    return {
	      success: true,
	      count: requests.length,
	      total_found: requests.length,
	      data: requests
	    };
	  } catch (error) {
	    return {
	      success: false,
	      message: 'Erreur lors de la recherche des informations du users',
	      data: [],
	      count: 0,
	      total_found: 0,
	      error: process.env.NODE_ENV === 'development' ? error.message : undefined
	    };
	  }
	}

}
