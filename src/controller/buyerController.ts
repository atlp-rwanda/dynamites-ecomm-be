import { Request, Response } from "express";
import dbConnection from "../database";
import Product from "../database/models/productEntity";

const productRepository = dbConnection.getRepository(Product);

export class buyerController {
    static async getOneProduct(req: Request, res: Response) {
        try{
            const productId = parseInt(req.params.id)

            const product = await productRepository.findOne({
            where: { id: productId },
            relations: ['category'],
            });
          
            if(!product){
                return res.status(404).json({ msg: 'Product not found' });
            }
        
            return res.status(200).json({ msg: 'Product retrieved successfully', product });
        }catch(err:any){
            return res.status(500).json({msg: "Internal Server Error"})
        }  
    }
}