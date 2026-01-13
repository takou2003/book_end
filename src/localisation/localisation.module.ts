import { Module } from '@nestjs/common';
import { LocalisationService } from './localisation.service';
import { LocalisationController } from './localisation.controller';

@Module({
  providers: [LocalisationService],
  controllers: [LocalisationController]
})
export class LocalisationModule {}
