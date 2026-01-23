// src/tutors/entities/tutor.entity.ts
import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  OneToOne,
  OneToMany, // AJOUTEZ CE IMPORT
  JoinColumn 
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Assclass } from '../../assclass/entities/assclass.entity';
import { Reqclass } from '../../reqclass/entities/reqclass.entity';
import { Notation } from '../../notations/entities/notations.entity';

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

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
  
  @OneToMany(() => Assclass, (assclass) => assclass.tutor)
  assclasse: Assclass[]; // Notez le nom: assclasse (au singulier)
  
  @OneToMany(() => Reqclass, (reqclass) => reqclass.tutor)
  reqclasse: Reqclass[]; // Notez le nom: assclasse (au singulier)
  
  @OneToMany(() => Notation, (notation) => notation.tutor)
  notatione: Notation[]; // Notez le nom: assclasse (au singulier)
}
