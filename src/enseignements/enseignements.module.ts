import { Module } from '@nestjs/common';
import { EnseignementsService } from './enseignements.service';
import { EnseignementsController } from './enseignements.controller';
import { Enseignement } from './entities/enseignement.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({

  imports: [TypeOrmModule.forFeature([Enseignement])],
  providers: [EnseignementsService],
  controllers: [EnseignementsController],
  exports: [EnseignementsService],
})
export class EnseignementsModule {}
