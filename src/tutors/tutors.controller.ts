// src/tutors/tutors.controller.ts
import { Controller, Get, Query, Param, BadRequestException, Post, Body } from '@nestjs/common';
import { TutorsService } from './tutors.service';
import { Reqclass } from '../reqclass/entities/reqclass.entity'; // Chemin corrigé
import { Commentaire } from '../commentaires/entities/commentaires.entity'; // Chemin corrigé
import { Classe } from '../classes/entities/classe.entity'; // Chemin corrigé
import { User } from '../users/entities/user.entity';
@Controller('tutors')
export class TutorsController {
  constructor(private readonly tutorsService: TutorsService) {}
  
  @Get('search/ville/:ville/id/:id')
  async findTutorsByVilleAndClasse(
    @Param('ville') ville: string,
    @Param('id') id: number
  ) {
    try {
      const tutors = await this.tutorsService.search_Tutor(ville, id);
      
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
  
  @Get('loadTutor/:ville')
  async available(
    @Param('ville') ville: string
  ) {
    try {
      const tutors = await this.tutorsService.ville_tutor(ville);
      
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
  
  @Get('RequestList/:id')
  async requestUser(@Param('id') id: number){ 
    try {
      const requests = await this.tutorsService.viewRequest(id);
      
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
  @Get('comment/:id')
  async commentUser(@Param('id') id: number){ 
    try {
      const requests = await this.tutorsService.commentList(id);
      
      return {
        success: true,
        count: requests.length, // 
        total_found: requests.length,
        data: requests // 
      };
    } catch (error) {
      return {
        success: false,
        message: 'Erreur lors de la recherche des commentaires',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      };
    }
  }
  
@Post('comment')
  async createcomment(@Body() requestData: any): Promise<{
    success: boolean;
    data?: Commentaire;
    message: string;
    error?: string;
  }> {
    try {
      console.log('Données reçues:', requestData); // Pour déboguer
      
      // Vérifiez que les données sont présentes
      if (!requestData.user_id || !requestData.teacher_id || !requestData.texte) {
        return {
          success: false,
          message: 'Données manquantes',
          error: 'user_id, teacher_id et texte sont requis'
        };
      }

      // Créez l'objet dans le format attendu par Commentaire
      const commentData: Partial<Commentaire> = {
        teacherId: Number(requestData.teacher_id), // Correction: teacher_id correspond à teacherId
        userId: Number(requestData.user_id),       // Correction: user_id correspond à userId
        texte: requestData.texte
      };
      
      // Appelez la méthode
      const comment = await this.tutorsService.create_comment(commentData);
      
      return {
        success: true,
        data: comment,
        message: 'Commentaire créé avec succès'
      };
      
    } catch (error) {
      console.error('Erreur lors de la création du commentaire:', error);
      
      return {
        success: false,
        message: 'Erreur interne du serveur',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      };
    }
  }
@Post('Requestconfirm/:id')
async confirmexchange(@Param('id') id: number) {
  const result = await this.tutorsService.Acceptrequest(id);
  
  if (!result.success) {
    throw new BadRequestException(result.message);
  }
  
  return {
    message: result.message,
    data: result.data
  };
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
