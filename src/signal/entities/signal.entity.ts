import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Index(['auteur', 'direction'], { unique: true }) // Anti doublon
@Entity('signaux')
export class Signal {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'auteur', type: 'int' })
  auteur: number;

  @Column({ name: 'direction', type: 'int' })
  direction: number;

  @Column({ length: 250 })
  motif: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

// 🔵 USER QUI SIGNALE
  @ManyToOne(() => User, (user) => user.sentSignals, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'auteur' })
  author: User;

  // 🔵 USER QUI EST SIGNALÉ
  @ManyToOne(() => User, (user) => user.receivedSignals, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'direction' })
  target: User;
}  


