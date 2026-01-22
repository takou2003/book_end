import { Module } from '@nestjs/common';
import { ReqclassService } from './reqclass.service';
import { ReqclassController } from './reqclass.controller';

@Module({
  providers: [ReqclassService],
  controllers: [ReqclassController]
})
export class ReqclassModule {}
