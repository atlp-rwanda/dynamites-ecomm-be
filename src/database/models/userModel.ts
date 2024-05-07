import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class UserModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ default: 'buyer' })
  userType: 'vendor' | 'buyer';

  @Column({ default: false })
  isVerified: boolean;

  constructor(user: Partial<UserModel>) {
    Object.assign(this, user);
  }
}
