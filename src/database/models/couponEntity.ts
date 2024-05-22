import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToMany,
    JoinTable
  } from 'typeorm';
  import Product from './productEntity';
  
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
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  
    constructor(coupon: Partial<Coupon>) {
      Object.assign(this, coupon);
    }
  }