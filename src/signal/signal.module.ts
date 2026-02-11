import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SignalService } from './signal.service';
import { SignalController } from './signal.controller';
import { User } from '../users/entities/user.entity';
import { Signal } from './entities/signal.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Signal, User])
  ],
  providers: [SignalService],
  controllers: [SignalController],
  exports: [SignalService], // 👈 OBLIGATOIRE
})
export class SignalModule {}
