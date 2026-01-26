import { Module } from '@nestjs/common';
import { VerificationsController } from './verifications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { Verification } from './entities/verification.entity';
@Module({
  imports: [
    MulterModule.register({
      dest: './Documents',
    }),
    TypeOrmModule.forFeature([Verification]),
  ],
  controllers: [VerificationsController],
})
export class VerificationsModule {}
