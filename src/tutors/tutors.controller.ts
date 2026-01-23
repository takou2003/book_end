// src/tutors/tutors.controller.ts
import { Controller, Get, Query, Param } from '@nestjs/common';
import { TutorsService } from './tutors.service';
import { Reqclass } from '../reqclass/entities/reqclass.entity'; // Chemin corrigé
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
