import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TutorsModule } from './tutors/tutors.module';
import { ClassesModule } from './classes/classes.module';
import { AssclassModule } from './assclass/assclass.module';

@Module({
  imports: [
  	// Configuration des variables d'environnement
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    
    // Configuration TypeORM
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get('DB_USERNAME', 'wilfried'),
        password: configService.get('DB_PASSWORD', ''),
        database: configService.get('DB_DATABASE', 'first_db'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get('DB_SYNCHRONIZE', 'true') === 'true',
        logging: false, // Affiche les requêtes SQL dans la console
        extra: {
          ssl: configService.get('NODE_ENV') === 'production' 
            ? { rejectUnauthorized: false } 
            : false,
        },
      }),
    }),
    UsersModule,
    TutorsModule,
    ClassesModule,
    AssclassModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
