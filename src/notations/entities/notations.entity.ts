// src/assclass/entities/assclass.entity.ts
import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  ManyToOne, // AJOUTEZ CE IMPORT
  JoinColumn 
} from 'typeorm';
import { Tutor } from '../../tutors/entities/tutor.entity';
import { User } from '../../users/entities/user.entity';

@Entity('notations')
export class Notation { // Assclass (sans 'e' à la fin)
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column({ name: 'teacher_id' }) // Retirez 'unique: true' si un tuteur peut avoir plusieurs classes
  teacherId: number;
  
  @Column({ name: 'user_id' }) // Retirez 'unique: true' si une classe peut avoir plusieurs tuteurs
  userId: number;
  
  @Column({ name: 'mark', type: 'float'})
  mark: number;

  @ManyToOne(() => Tutor, (tutor) => tutor.notatione)
  @JoinColumn({ name: 'teacher_id' })
  tutor: Tutor;

  @ManyToOne(() => User, (user) => user.notatione)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
