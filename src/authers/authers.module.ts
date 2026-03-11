import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auther } from './entities/auther.entity';
import { AuthersService } from './authers.service';
import { AuthersController } from './authers.controller';
import { TemplateService } from './template.service';
import { SmsModule } from '../sms/sms.module'; // 👈 Import

@Module({
  imports: [TypeOrmModule.forFeature([Auther]),  SmsModule, ],
  providers: [AuthersService,  TemplateService,],
  controllers: [AuthersController],
  exports: [AuthersService], 
})
export class AuthersModule {}

