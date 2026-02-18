// src/notifications/entities/notification.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150, name: 'title' })
  title: string;

  @Column({ length: 250 , name: 'body'})
  body: string;

  @Column({ length: 255, name: 'device_token' })
  deviceToken: string;

 // ✅ Colonne explicite
  @Column({ name: 'user_id' })
  userId: number;
  
  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;
  
  @Column({ name: 'is_read', default: false})
  isRead:boolean;

  // ✅ Relation
  @ManyToOne(() => User, (user) => user.notifications, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;
}

