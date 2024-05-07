import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import UserModel from './userModel';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => UserModel, (user) => user.userType, { cascade: ['update'] })
  users: UserModel[];

  @Column('simple-array')
  permissions: string[];
}
