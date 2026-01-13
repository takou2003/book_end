// src/teachers/entities/teacher.entity.ts
import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  OneToOne,
  JoinColumn 
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('teachers')
export class Teacher {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column({ name: 'user_id', unique: true })
  userId: number;
  
  @Column({ type: 'float' })
  note: number;
  
   // Correction: Supprimez 'referencedColumnName' ou utilisez 'id' comme référence
  @OneToOne(() => User, (user) => user.teacher, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' }) // Seulement le nom de la colonne, pas referencedColumnName
  user: User;
}
