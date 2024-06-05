import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
  } from 'typeorm';
  
  @Entity()
  export default class Service {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ unique: true })
    name: string;
  
    @Column({ length: 250 })
    description: string;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  
    constructor(service: Partial<Service>) {
      Object.assign(this, service);
    }
  }
  