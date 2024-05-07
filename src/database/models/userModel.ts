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

  @Column({ nullable: true })
  password: string;

  @OneToOne(() => Role)
  @JoinColumn()
  userType: Role;
  
  @Column({ nullable: true })
  googleId: string;

  @Column({ default: null })
  facebookId: string;

  @Column({ default: null })
  picture: string;

  @Column({ default: null })
  provider: string;

  @Column({ default: false })
  isVerified: boolean;

  constructor(user: Partial<UserModel>) {
    Object.assign(this, user);
  }
}
