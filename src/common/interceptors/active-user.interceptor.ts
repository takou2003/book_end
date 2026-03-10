// src/common/interceptors/active-user.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class ActiveUserInterceptor implements NestInterceptor {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const userFromToken = request.user;
    
    // Ignorer les routes publiques (pas de token)
    if (!userFromToken) {
      return next.handle();
    }

    const userId = userFromToken.sub || userFromToken.id;
    
    if (!userId) {
      throw new UnauthorizedException('Token invalide');
    }

    // Vérification rapide en base (seulement les champs nécessaires)
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['id', 'isActive'], // On ne prend que l'essentiel
    });

    if (!user) {
      throw new UnauthorizedException('Utilisateur introuvable');
    }

    if (!user.isActive) {
      throw new ForbiddenException({
        statusCode: 403,
        message: 'Votre compte a été désactivé. Veuillez contacter l\'administrateur.',
        error: 'ACCOUNT_DISABLED',
        timestamp: new Date().toISOString(),
      });
    }

    return next.handle();
  }
}
