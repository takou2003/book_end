import { Injectable , BadRequestException, NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'; // AJOUTEZ
import { Repository } from 'typeorm'; // AJOUTEZ
import { Signal } from './entities/signal.entity';
import { User } from '../users/entities/user.entity';
import { CreateSignalDto } from './dto/create-signal.dto';

@Injectable()
export class SignalService {
  constructor(
    @InjectRepository(Signal)
    private signalRepository: Repository<Signal>,
    
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    
  ) {}
  
  async createSignal(
  userId: number,
  dto: CreateSignalDto,
): Promise<Signal> {

  const { direction, motif } = dto;

  // ❌ Interdire auto-signalement
  if (userId === direction) {
    throw new BadRequestException(
      'Vous ne pouvez pas signaler votre propre compte',
    );
  }

  // ✅ Vérifier que la cible existe
  const targetUser = await this.usersRepository.findOne({
    where: { id: direction },
  });

  if (!targetUser) {
    throw new NotFoundException('Utilisateur introuvable');
  }

  // ❌ Vérifier doublon
  const existing = await this.signalRepository.findOne({
    where: {
      auteur: userId,
      direction,
    },
  });

  if (existing) {
    throw new BadRequestException(
      'Vous avez déjà signalé cet utilisateur',
    );
  }

  const signal = this.signalRepository.create({
    auteur: userId,
    direction,
    motif,
  });

  return this.signalRepository.save(signal);
}

}
