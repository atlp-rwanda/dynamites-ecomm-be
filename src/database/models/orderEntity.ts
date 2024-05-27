import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import UserModel from './userModel';
import { OrderDetails } from './orderDetailsEntity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserModel, { nullable: true })
  user: UserModel | null;

  @Column()
  totalAmount: number;

  @Column()
  status: string;

  @Column({ nullable: true })
  deliveryInfo: string;

  @Column({ nullable: true })
  paymentInfo: string;

  @Column()
  trackingNumber: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => OrderDetails, orderDetails => orderDetails.order, { cascade: true })
  orderDetails: OrderDetails[];
  
  @Column({ type: 'boolean', default: false, nullable: true })
  paid: boolean | null;
}
