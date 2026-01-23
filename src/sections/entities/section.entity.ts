// src/tutors/entities/tutor.entity.ts
import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  OneToOne,
  OneToMany, // AJOUTEZ CE IMPORT
  JoinColumn 
} from 'typeorm';

@Entity('sections')
export class Section {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ 
    name: 'name', 
    length: 50, // Même longueur
    nullable: false 
  })
  name: string;
}
