import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import Product from './productEntity';

@Entity()
export default class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ length: 250 })
  description: string;

  @OneToMany(() => Product, (product) => product.category, {
    cascade: ['update'],
  })
  products: Product[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  constructor(category: Partial<Category>) {
    Object.assign(this, category);
  }
}
