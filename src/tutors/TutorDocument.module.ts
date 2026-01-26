import { Module } from '@nestjs/common';
import { DocumentsController } from './TutorDocument.controller';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    MulterModule.register({
      dest: './Documents',
    }),
  ],
  controllers: [DocumentsController],
})
export class DocumentsModule {}
