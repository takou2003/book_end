// src/users/entities/user.entity.ts
import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn,
  OneToOne,
  JoinColumn  
} from 'typeorm';
import { Tutor } from '../../tutors/entities/tutor.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ 
    name: 'username', 
    length: 50, // Même longueur que dans la table (50)
    nullable: false 
  })
  username: string;

  @Column({ 
    name: 'password', 
    length: 50, // Même longueur
    nullable: false 
  })
  password: string;

  @Column({ 
    name: 'ville', 
    length: 50, // Même longueur
    nullable: false 
  })
  ville: string;

  @Column({ 
    name: 'quartier', 
    length: 50, // Même longueur
    nullable: false 
  })
  quartier: string;

  @Column({ 
    name: 'latitude', 
    type: 'float', // double precision dans PostgreSQL = float
    nullable: false 
  })
  latitude: number;
  
  @Column({ 
    name: 'longitude', 
    type: 'float', // double precision dans PostgreSQL = float
    nullable: false 
  })
  longitude: number;

  @Column({ 
    name: 'role', 
    type: 'int',
    nullable: false 
  })
  role: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ 
    name: 'is_active', 
    type: 'boolean',
    default: true,
    nullable: false 
  })
  isActive: boolean;
  
  @Column({ 
    name: 'phone', 
    length: 15, // Même longueur
    nullable: false 
  })
  phone: string;
  
  @OneToOne(() => Tutor, (tutor) => tutor.user)
  tutor: Tutor; // Relation simple sans configuration de jointure;
}
