import { Column, Entity, ManyToMany, PrimaryGeneratedColumn, OneToOne, JoinColumn, JoinTable } from "typeorm";
import Product from "./productEntity";
import UserModel from "./userModel";

@Entity()
export default class BuyerWishList {

    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => UserModel)
    @JoinColumn()
    user: UserModel;

    @ManyToMany(() => Product)
    @JoinTable()
    product: Product[];

    @Column({ type: 'timestamp' })  
    time: Date;

}
