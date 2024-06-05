import { Entity,PrimaryGeneratedColumn,Column,ManyToOne,CreateDateColumn } from 'typeorm';
import User from './userModel';

@Entity()
export default class chat{
    @PrimaryGeneratedColumn()
    id:number;

    @ManyToOne(()=>User)
    user: User;

    @Column()
    message:string;

    @Column()
    response:string;

    @CreateDateColumn()
    createdAt:Date;
}