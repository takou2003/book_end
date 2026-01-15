// src/tutors/entities/tutor.entity.ts
import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  OneToOne,
  JoinColumn 
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('teachers')
export class Tutor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ 
    name: 'mark', 
    type: 'float',
    default: 1.0,
    nullable: false 
  })
  mark: number;
  
  @Column({ name: 'user_id', unique: true })
  userId: number;
  
  @Column({ 
    name: 'is_active', 
    type: 'boolean',
    default: true,
    nullable: false 
  })
  isActive: boolean;

 // OPTION 2: Simplifiez la relation
  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' }) // Seulement cette ligne, pas besoin de referencedColumnName
  user: User;
}
