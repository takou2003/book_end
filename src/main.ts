import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { initFolders } from './scripts/init-folder';

async function bootstrap() {
    initFolders();
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
