// src/notations/entities/notations.entity.ts
import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  ManyToOne, // AJOUTEZ CE IMPORT
  JoinColumn ,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';
import { Tutor } from '../../tutors/entities/tutor.entity';
import { User } from '../../users/entities/user.entity';

@Entity('notations')
export class Notation { 
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column({ name: 'teacher_id' }) // Retirez 'unique: true' si un tuteur peut avoir plusieurs classes
  teacherId: number;
  
  @Column({ name: 'user_id' }) // Retirez 'unique: true' si une classe peut avoir plusieurs tuteurs
  userId: number;
  
  @Column({ name: 'mark', type: 'float'})
  mark: number;
  
  @Column({ name: 'commentaire', length: 250, nullable:true})
  commentaire?: string;
  
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Tutor, (tutor) => tutor.notatione)
  @JoinColumn({ name: 'teacher_id' })
  tutor: Tutor;

  @ManyToOne(() => User, (user) => user.notatione)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
