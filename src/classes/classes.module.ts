import { Module } from '@nestjs/common';
import { ClassesService } from './classes.service';
import { ClassesController } from './classes.controller';
import { Classe } from './entities/classe.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({

  imports: [TypeOrmModule.forFeature([Classe])],
  providers: [ClassesService],
  controllers: [ClassesController],
  exports: [ClassesService],
})
export class ClassesModule {}
