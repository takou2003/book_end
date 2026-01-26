// src/users/users.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { Tutor } from '../tutors/entities/tutor.entity';
import { Reqclass } from '../reqclass/entities/reqclass.entity';
import { Classe } from '../classes/entities/classe.entity';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [TypeOrmModule.forFeature([User, Tutor, Classe, Reqclass]), 
  MulterModule.register({
      dest: './temp',
    }),
    
    ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}

