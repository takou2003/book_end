import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Connection } from 'typeorm'; // Ajoutez cette importation

@Controller()
export class AppController {
  constructor(
  
  	private readonly appService: AppService,
  	private readonly connection: Connection
  	) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  
  @Get('health')
  async healthCheck() {
    try {
      // Test de la connexion à la base de données
      await this.connection.query('SELECT 1');
      return {
        status: 'OK',
        database: 'Connected',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: 'ERROR',
        database: 'Disconnected',
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }
  
}
