import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { Auth } from './auth.entity';

@Entity('auth_token')
export class AuthToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  authId: string;

  @Column()
  token: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  expiredAt: Date;

  @ManyToOne(() => Auth, (auth) => auth.tokens)
  @JoinColumn({ name: 'authId' })
  auth: Auth;

  constructor(partial: Partial<AuthToken>) {
    Object.assign(this, partial);
  }
}
