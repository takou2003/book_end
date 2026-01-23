import { Module } from '@nestjs/common';
import { NotationsService } from './notations.service';
import { NotationsController } from './notations.controller';

@Module({
  providers: [NotationsService],
  controllers: [NotationsController]
})
export class NotationsModule {}
