import { Module } from '@nestjs/common';
import { AssclassService } from './assclass.service';
import { AssclassController } from './assclass.controller';

@Module({
  providers: [AssclassService],
  controllers: [AssclassController]
})
export class AssclassModule {}
