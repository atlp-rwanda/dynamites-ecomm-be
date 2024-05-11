import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

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

  @Column()
  category: string;

  @Column()
  quanity: number;

  @Column()
  regularPrice: number;

  @Column()
  salesPrice: number;

  @Column('simple-array')
  tags: string[];

  @Column({ default: 'Simple' })
  type: 'Simple' | 'Grouped' | 'Variable';

  @CreateDateColumn({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  constructor(product: Partial<Product>) {
    Object.assign(this, product);
  }
}
