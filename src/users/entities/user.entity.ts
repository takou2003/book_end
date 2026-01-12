// src/users/entities/user.entity.ts
import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn 
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'firstname', length: 100 })
  firstname: string;

  @Column({ name: 'lastname', length: 100 })
  lastname: string;

  @Column({ name: 'password', length: 25, nullable: true })
  password?: string;

  @Column({ name: 'phone', length: 10, nullable: true })
  phone?: string;

  @Column({ name: 'email', length: 255, unique: true, nullable: true })
  email?: string;

  @Column({ name: 'role', default: 1 })
  role: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;
}
