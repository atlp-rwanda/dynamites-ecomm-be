import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Role } from './roleEntity';

@Entity()
export class UserModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column({ default: null })
  password: string;

  @OneToOne(() => Role)
  @JoinColumn()
  userType: Role;

  @Column({ default: false })
  isVerified: boolean;

  constructor(user: Partial<UserModel>) {
    Object.assign(this, user);
  }
}
