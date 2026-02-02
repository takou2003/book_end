import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auther } from './entities/auther.entity';
import { AuthersService } from './authers.service';
import { AuthersController } from './authers.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Auther])],
  providers: [AuthersService],
  controllers: [AuthersController],
})
export class AuthersModule {}

