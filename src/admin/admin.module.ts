import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { Verification } from '../verifications/entities/verification.entity';
import { Tutor } from '../tutors/entities/tutor.entity';
import { User } from '../users/entities/user.entity';
import { Signal } from '../signal/entities/signal.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Verification, Tutor, User, Signal]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}

