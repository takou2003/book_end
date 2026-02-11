// src/users/users.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { Tutor } from '../tutors/entities/tutor.entity';
import { Signal } from '../signal/entities/signal.entity';
import { Reqclass } from '../reqclass/entities/reqclass.entity';
import { Classe } from '../classes/entities/classe.entity';
import { Commentaire } from '../commentaires/entities/commentaires.entity';
import { Notation } from '../notations/entities/notations.entity';
import { MulterModule } from '@nestjs/platform-express';
import { SignalModule } from '../signal/signal.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Tutor, Classe, Reqclass, Commentaire, Notation, Signal]),
  SignalModule, // 👈 OBLIGATOIRE
  MulterModule.register({
      dest: './temp',
    }),
    
    ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}

