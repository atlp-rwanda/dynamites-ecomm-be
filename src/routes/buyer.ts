import { Router } from 'express'
import {
    AddItemInWishList ,
    RemoveProductFromWishList,
    getAllWishList
} from '../controller/buyerWishList'
import { IsLoggedIn } from '../middlewares/isLoggedIn';


const BuyerWishListroute = Router()
BuyerWishListroute.post('/addItemToWishList',IsLoggedIn, AddItemInWishList);
BuyerWishListroute.delete('/removeToWishList',IsLoggedIn,RemoveProductFromWishList);
BuyerWishListroute.get('/getWishList',getAllWishList)


export default BuyerWishListroute