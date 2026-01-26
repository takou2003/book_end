// src/verifications/entities/verification.entity.ts
import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  ManyToOne, // AJOUTEZ CE IMPORT
  JoinColumn,
  CreateDateColumn, 
  UpdateDateColumn 
} from 'typeorm';
import { Tutor } from '../../tutors/entities/tutor.entity';

@Entity('verifications')
export class Verification { // Assclass (sans 'e' à la fin)
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column({ name: 'teacher_id' }) // Retirez 'unique: true' si un tuteur peut avoir plusieurs classes
  teacherId: number;
  
  @Column({ 
    name: 'path_document', 
    length: 255, // Même longueur
    nullable: false 
  })
  pathDocument: string;
  
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
  
  @ManyToOne(() => Tutor, (tutor) => tutor.verificationed)
  @JoinColumn({ name: 'teacher_id' })
  tutor: Tutor;


}
