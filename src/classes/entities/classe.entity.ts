// src/classes/entities/classe.entity.ts
import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  OneToMany // AJOUTEZ CE IMPORT
} from 'typeorm';
import { Assclass } from '../../assclass/entities/assclass.entity'; // Assclass (sans 'e')
import { Reqclass } from '../../reqclass/entities/reqclass.entity';
@Entity('classes')
export class Classe {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column({ 
    name: 'name', 
    length: 50,
    nullable: false 
  })
  name: string;
  
  @Column({ name: 'enseignement_id' }) // Retirez 'unique: true' si nécessaire
  enseignementId: number;
  
  @OneToMany(() => Assclass, (assclass) => assclass.classe)
  assclasse: Assclass[]; // Nom de propriété au singulier
  
  @OneToMany(() => Reqclass, (reqclass) => reqclass.classe)
  reqclasse: Reqclass[]; // Nom de propriété au singulier
}
