// src/reqclass/entities/reqclass.entity.ts
import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  OneToOne,
  OneToMany, // AJOUTEZ CE IMPORT
  ManyToOne,
  JoinColumn,
  CreateDateColumn, 
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Classe } from '../../classes/entities/classe.entity';
import { Tutor } from '../../tutors/entities/tutor.entity';


@Entity('commentaires')
export class Commentaire {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column({ name: 'teacher_id' })
  teacherId: number;
  
  @Column({ name: 'user_id' })
  userId: number;
  
  @Column({ 
    name: 'texte', 
    length: 250,
    nullable: false 
  })
  texte: string;
  
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
  
  
  @ManyToOne(() => User, (user) => user.commentaires)
  @JoinColumn({ name: 'user_id' })
  user: User;
  
  @ManyToOne(() => Tutor, (tutor) => tutor.commentaires)
  @JoinColumn({ name: 'teacher_id' })
  tutor: Tutor;

}
