// src/tutors/entities/tutor.entity.ts
import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  OneToOne,
  OneToMany, // AJOUTEZ CE IMPORT
  JoinColumn 
} from 'typeorm';
@Entity('enseignements')
export class Enseignement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ 
    name: 'name', 
    length: 50, // Même longueur
    nullable: false 
  })
  name: string;
  
  @Column({ 
    name: 'section_id', 
    type: 'int',
    nullable: false 
  })
  sectionId: number;
  
}
