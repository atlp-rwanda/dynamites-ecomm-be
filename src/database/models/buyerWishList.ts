import { Column, Entity, ManyToMany, PrimaryGeneratedColumn, OneToOne, JoinColumn, JoinTable, ManyToOne } from "typeorm";
import Product from "./productEntity";
import UserModel from "./userModel";
import Category from "./categoryEntity";

@Entity()
export default class BuyerWishList {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => UserModel)
    user: UserModel;

    @ManyToMany(() => Product)
    @JoinTable()
    product: Product[];

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })  
    time: Date;

}
