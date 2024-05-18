import { Router } from 'express'
import {
    CreateWishList ,
    RemoveProductFromWishList
} from '../controller/buyerWishList'
import { IsLoggedIn } from '../middlewares/isLoggedIn';


const route = Router()
route.post('/addToWishList',IsLoggedIn, CreateWishList);
route.get('/removeToWishList',IsLoggedIn,RemoveProductFromWishList);