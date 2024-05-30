import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn} from 'typeorm';


@Entity()
export default class Notification_box {
  @PrimaryGeneratedColumn()
  notification_id: number;

  @Column()
  message_title:string;

  @Column()
  message_content: string;
  
  @Column()
  product_id: number;
  
  @Column()
  vendor_id: number;
  
  @Column()
  vendor_email:string;

  @Column({ default: false })
  isRead: boolean;

  @CreateDateColumn()
  createdAt: Date;
  
  @UpdateDateColumn()
  updatedAt:Date
}
