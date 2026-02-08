// src/verifications/verifications.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';

import { VerificationsController } from './verifications.controller';
import { VerificationsService } from './verifications.service';
import { Verification } from './entities/verification.entity';
import { Tutor } from '../tutors/entities/tutor.entity';

@Module({
  imports: [
    MulterModule.register({
      dest: './Documents',
    }),
    TypeOrmModule.forFeature([Verification, Tutor]),
  ],
  controllers: [VerificationsController],
  providers: [
    VerificationsService, // ⭐ OBLIGATOIRE
  ],
  exports: [
    VerificationsService, // ⭐ OBLIGATOIRE pour TutorsModule
  ],
})
export class VerificationsModule {}

