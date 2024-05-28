import { Request, Response } from 'express';
import { Review } from '../database/models/reviewEntity';
import Product from '../database/models/productEntity';
import dbConnection from '../database';
import errorHandler from '../middlewares/errorHandler';
import UserModel from '../database/models/userModel';

const productRepository = dbConnection.getRepository(Product);
const reviewRepository = dbConnection.getRepository(Review);
 const userRepository = dbConnection.getRepository(UserModel);

export const createReview = errorHandler(async (req: Request, res: Response) => {
  const { content, rating, productId } = req.body;
  const userId = req.user!.id;

  const product = await productRepository.findOne({
    where:{
      id:productId
    }
  });
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  const user = await userRepository.findOne({
    where: {
      id: userId,
    },
    select: {
      id: true,
    },
  });

  const existingReview = await reviewRepository.findOne({
    where:{
      user:{
        id:userId
      },
      product:{
        id:productId
      }
    }
  })

  if(existingReview){
    return res.status(409).json({ message: 'you are already reviewed the product' });
  }

  const newReview  = new Review();
  newReview.content= content;
  newReview.rating=parseInt(rating) ;
  newReview.user = user!;
  newReview.product = product;

  const review = await reviewRepository.save(newReview);

  const reviews = await reviewRepository.find({
    where:{
      product:{
        id:productId
      }
    },
    relations:['user','product']  
  });
  let totalRating = 0;
  for (const review of reviews) {
    totalRating += review.rating;
  }
  product.averageRating = Number((totalRating / reviews.length).toPrecision(2));

  
  await productRepository.save(product);

  return res.status(201).json({ message: 'Review created successfully', review });
});


export const getReviews = errorHandler(async (req: Request, res: Response) => {
    const  reviews = await reviewRepository.find({
        select:{
          user:{
            firstName:true
          },
          product:{
            name:true
          }
        },
        relations:['user','product']
    })    
    return res.status(200).json({ reviews });
});