import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import Category from './categoryEntity';
import UserModel from './userModel';

@Entity()
export default class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200 })
  name: string;

  @Column()
  image: string;

  @Column('simple-array')
  gallery: string[];

  @Column({ length: 250 })
  shortDesc: string;

  @Column()
  longDesc: string;

  @ManyToOne(() => Category)
  category: Category;

  @Column()
  quantity: number;

  @Column()
  regularPrice: number;

  @Column()
  salesPrice: number;

  @Column('simple-array')
  tags: string[];

  @Column({ default: 'Simple' })
  type: 'Simple' | 'Grouped' | 'Variable';

  @Column({ default: true })
  isAvailable: boolean;

  @ManyToOne(() => UserModel)
  vendor: UserModel;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  constructor(product: Partial<Product>) {
    Object.assign(this, product);
  }
}
