import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Role } from './roleEntity';
import { Order } from './orderEntity';
import dotenv from 'dotenv'
dotenv.config()

@Entity()
export default class UserModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @ManyToOne(() => Role)
  userType: Role;

  @OneToMany(() => Order, (order) => order.user, { cascade: true })
  orders: Order[];

  @Column({ nullable: true })
  googleId: string;

  @Column({ nullable: true })
  facebookId: string;

  @Column({ nullable: false, default: process.env.DEFAULT_PROFILE_URL })
  picture: string;

  @Column({ nullable: true })
  provider: string;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ default: 'active' })
  status: 'active' | 'inactive';

  @Column({ nullable: true })
  twoFactorCode: number;

  constructor(user: Partial<UserModel>) {
    Object.assign(this, user);
  }
}
