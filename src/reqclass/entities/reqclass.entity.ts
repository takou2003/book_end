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
import { Assclass } from '../../assclass/entities/assclass.entity';


@Entity('reqclass')
export class Reqclass {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column({ name: 'user_id', unique: false })
  userId: number;
  
  @Column({ name: 'classe_id', unique: false })
  classeId: number;
  
  @Column({ name: 'teacher_id', unique: false })
  teacherId: number;
  
  @Column({ 
    name: 'is_active', 
    type: 'boolean',
    default: true,
    nullable: false 
  })
  isActive: boolean;
  
  @Column({ 
    name: 'status', 
    length: 15, // Même longueur
    nullable: false 
  })
  status: string;
  
  @Column({ 
    name: 'notation', 
    type: 'float', // double precision dans PostgreSQL = float
    nullable: false 
  })
  notation: number;
  
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
  
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
  
  @ManyToOne(() => User, (user) => user.reqclasse)
  @JoinColumn({ name: 'user_id' })
  user: User;
  
  @ManyToOne(() => Tutor, (tutor) => tutor.reqclasse)
  @JoinColumn({ name: 'teacher_id' })
  tutor: Tutor;

  @ManyToOne(() => Classe, (classe) => classe.reqclasse)
  @JoinColumn({ name: 'classe_id' })
  classe: Classe;
}
