import { Module } from '@nestjs/common';
import { Userprofil } from './userProfil.controller';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    MulterModule.register({
      dest: './profils',
    }),
  ],
  controllers: [Userprofil],
})
export class ProfilsModule {}
