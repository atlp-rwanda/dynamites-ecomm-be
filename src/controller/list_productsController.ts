import { Request, Response } from 'express';
import Product from '../database/models/productEntity';
import dbConnection from '../database';
import errorHandler from '../middlewares/errorHandler';

const productRepository = dbConnection.getRepository(Product);


// get available product

const AvailableProducts =   errorHandler(async (req: Request, res: Response) => {
        let limit: number
        let page: number
  
        if(req.query.limit == undefined && req.query.page == undefined) 
          {
          limit=10
          page=1
          }
        else{
          limit=parseInt(req.query.limit as string)
          page=parseInt(req.query.page as string)
        }
        const [availableProducts, totalCount] = await productRepository.findAndCount({
            where:{isAvailable:true},
            take: limit,
            skip: (page - 1) * limit,
            select:{vendor:{firstName:true,lastName:true,picture:true}},
            relations: ['category','vendor'],
        });
  
        return res.status(200).json({
            status: 'success',
            message: 'Items retrieved successfully.',
            availableProducts,
            totalPages: Math.ceil(totalCount / limit),
            currentPage: page
        });
    }) 

    export default AvailableProducts