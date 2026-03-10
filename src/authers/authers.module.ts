import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auther } from './entities/auther.entity';
import { AuthersService } from './authers.service';
import { AuthersController } from './authers.controller';
import { TemplateService } from './template.service';

@Module({
  imports: [TypeOrmModule.forFeature([Auther])],
  providers: [AuthersService,  TemplateService,],
  controllers: [AuthersController],
  exports: [AuthersService], 
})
export class AuthersModule {}

