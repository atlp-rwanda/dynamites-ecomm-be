import { Request, Response } from "express";
import dbConnection from "../database";
import Product from "../database/models/productEntity";
import errorHandler from '../middlewares/errorHandler'

const productRepository = dbConnection.getRepository(Product);

// export class buyerController {
//     static async getOneProduct(req: Request, res: Response) {
//         const productId = parseInt(req.params.id)

//         const product = await productRepository.findOne({
//         where: { id: productId },
//         relations: ['category'],
//         });
        
//         if(!product){
//             return res.status(404).json({ msg: 'Product not found' });
//         }
    
//         return res.status(200).json({ msg: 'Product retrieved successfully', product });
//     }
// }


export const getOneProduct = errorHandler(async (req: Request, res: Response) => {
    const productId = parseInt(req.params.id)

    const product = await productRepository.findOne({
    where: { id: productId },
    relations: ['category'],
    });
    
    if(!product){
        return res.status(404).json({ msg: 'Product not found' });
    }

    return res.status(200).json({ msg: 'Product retrieved successfully', product });
})