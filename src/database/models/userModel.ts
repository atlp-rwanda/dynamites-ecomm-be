import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { Role } from './roleEntity';


@Entity()
export default class UserModel {
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

  @ManyToOne(() => Role)
  userType: Role;

  @Column({ nullable: true })
  googleId: string;

  @Column({ nullable: true })
  facebookId: string;

  @Column({ nullable: true })
  picture: string;

  @Column({ nullable: true })
  provider: string;

  @Column({ default: false })
  isVerified: boolean;


  @Column({ nullable: true }) 
  twoFactorCode: number;

  constructor(user: Partial<UserModel>) {
    Object.assign(this, user);
  }
}