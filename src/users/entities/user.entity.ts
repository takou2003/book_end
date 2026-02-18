// src/users/entities/user.entity.ts
import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  OneToMany  
} from 'typeorm';
import { Tutor } from '../../tutors/entities/tutor.entity';
import { Reqclass } from '../../reqclass/entities/reqclass.entity';
import { Notation } from '../../notations/entities/notations.entity';
import { Commentaire } from '../../commentaires/entities/commentaires.entity'; // Chemin corrigé
import { Signal } from '../../signal/entities/signal.entity';
import { RefreshToken } from '../../auth/entities/refresh-token.entity'; // Chemin corrigé
import { Notification } from '../../notifications/entities/notifications.entity'; // Chemin corrigé

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
    length: 255, // Même longueur
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
    nullable: false,
    default: 0.0  // ← AJOUTER CETTE LIGNE 
  })
  latitude: number;
  
  @Column({ 
    name: 'longitude', 
    type: 'float', // double precision dans PostgreSQL = float
    nullable: false,
    default: 0.0  // ← AJOUTER CETTE LIGNE 
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
  
  @Column({ 
    name: 'fonction', 
    length: 15, // Même longueur
    nullable: false 
  })
  fonction: string;
  
  @Column({ 
    name: 'path_image', 
    length: 50, // Même longueur
    nullable: false,
    default: 'noPicture.jpg',
  })
  pathImage: string;
  
  @Column({ 
    name: 'mail', 
    length: 250, // Même longueur
    nullable: true 
  })
  mail: string;
  
  @Column({ 
    name: 'refresh_token', 
    length: 250, // Même longueur
    nullable: true 
  })
  refreshToken: string;
  
   @Column({ 
    name: 'deviceToken', 
    length: 250, // Même longueur
    nullable: true 
  })
  deviceToken: string;
  
  @OneToOne(() => Tutor, (tutor) => tutor.user)
  tutor: Tutor; // Relation simple sans configuration de jointure;
  
  @OneToMany(() => Reqclass, (reqclass) => reqclass.classe)
  reqclasse: Reqclass[]; // Nom de propriété au singulier
  
  @OneToMany(() => RefreshToken, (rt) => rt.user)
  refreshTokens: RefreshToken[];
  
  @OneToMany(() => Notification, (notif) => notif.user)
  notifications: Notification[];

  @OneToMany(() => Commentaire, (commentaire) => commentaire.user)
  commentaires: Commentaire[]; // Notez le nom: assclasse (au singulier)
  
  @OneToMany(() => Notation, (notation) => notation.user)
  notatione: Notation[]; // Notez le nom: assclasse (au singulier)
  
  @OneToMany(() => Signal, (signal) => signal.author)
  sentSignals: Signal[];

  @OneToMany(() => Signal, (signal) => signal.target)
  receivedSignals: Signal[];

}
