import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  ManyToOne,
} from 'typeorm';
import Product from './productEntity';
import UserModel from './userModel';

@Entity()
export default class Coupon {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  percentage: number;

  @Column()
  code: string;

  @Column('date')
  expirationDate: Date;

  @ManyToMany(() => Product)
  @JoinTable()
  applicableProducts: Product[];

  @Column({ length: 250 })
  description: string;

  @ManyToOne(() => UserModel, { onDelete: 'CASCADE' })
  vendor: UserModel;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  constructor(coupon: Partial<Coupon>) {
    Object.assign(this, coupon);
  }
}
