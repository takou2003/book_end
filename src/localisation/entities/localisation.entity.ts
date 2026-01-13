// src/localisation/entities/localisation.entity.ts
import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  OneToOne,
  JoinColumn 
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('localisation')
export class Localisation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 250 })
  addresse: string;

  @Column({ type: 'float' })
  latitude: number;

  @Column({ name: 'path_image', length: 250, nullable: true })
  pathImage?: string;

  @Column({ type: 'float' })
  longitude: number;

  @Column({ name: 'user_id', unique: true })
  userId: number;

   // Correction: Supprimez 'referencedColumnName' ou utilisez 'id' comme référence
  @OneToOne(() => User, (user) => user.localisation, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' }) // Seulement le nom de la colonne, pas referencedColumnName
  user: User;
}
