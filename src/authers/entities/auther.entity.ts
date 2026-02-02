import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('authers')
export class Auther {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 6, nullable: false, name:'code' })
  code: string;

  @Column({ length: 255, nullable: false, name:'identifiant'})
  identifiant: string;

  @Column({ type: 'timestamp', name: 'expires_at', nullable: false })
  expiresAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
  
  @Column({ default:false, name:'used'})
  used: boolean;
}

