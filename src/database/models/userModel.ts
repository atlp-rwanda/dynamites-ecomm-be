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

  @Column()
  password: string;

  @OneToOne(() => Role)
  @JoinColumn()
  userType: Role;

  constructor(user: Partial<UserModel>) {
    Object.assign(this, user);
  }
}
