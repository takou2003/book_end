// src/assclass/entities/assclass.entity.ts
import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  ManyToOne, // AJOUTEZ CE IMPORT
  JoinColumn 
} from 'typeorm';
import { Tutor } from '../../tutors/entities/tutor.entity';
import { Classe } from '../../classes/entities/classe.entity';

@Entity('assclass')
export class Assclass { // Assclass (sans 'e' à la fin)
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column({ name: 'teacher_id' }) // Retirez 'unique: true' si un tuteur peut avoir plusieurs classes
  teacherId: number;
  
  @Column({ name: 'classe_id' }) // Retirez 'unique: true' si une classe peut avoir plusieurs tuteurs
  classeId: number;

  @ManyToOne(() => Tutor, (tutor) => tutor.assclasse)
  @JoinColumn({ name: 'teacher_id' })
  tutor: Tutor;

  @ManyToOne(() => Classe, (classe) => classe.assclasse)
  @JoinColumn({ name: 'classe_id' })
  classe: Classe;
}
