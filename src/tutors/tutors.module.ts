// src/tutors/tutors.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TutorsService } from './tutors.service';
import { TutorsController } from './tutors.controller';
import { Tutor } from './entities/tutor.entity';
import { Assclass } from '../assclass/entities/assclass.entity';
import { Classe } from '../classes/entities/classe.entity';
import { Reqclass } from '../reqclass/entities/reqclass.entity'; // Chemin corrigé
import { User } from '../users/entities/user.entity';
import { Commentaire } from '../commentaires/entities/commentaires.entity'; // Chemin corrigé

@Module({
  imports: [
    TypeOrmModule.forFeature([Tutor, Assclass, Classe, Reqclass, User, Commentaire])
  ],
  controllers: [TutorsController],
  providers: [TutorsService],
})
export class TutorsModule {}
