import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken'

export async function authenticateUser (req:any, res: Response, next: NextFunction) {
    const header = req.header('Authorization');

    if (!header) {
        return res.status(401).send({msg: "Unauthorized"});
    }

    const token = header.split(" ")[1]
    

    try {
        const decoded:any = await jwt.verify(token, process.env.JWT_SECRET || "");

        req.user = decoded

        next();
    } catch (err:any) {
        console.log(err.message)
        return res.status(403).json({ msg: 'Invalid token' });
    }
}