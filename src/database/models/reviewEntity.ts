
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import  Product  from './productEntity';
import  User  from './userModel';

@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @Column()
  rating: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  user: User;

  @ManyToOne(() => Product, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  product: Product;
}
