import { Router, Request, Response } from 'express';
import { createUser, allUsers } from './controller/user';
const route = Router();
route.post('/users', async (req: Request, res: Response) => {
  return res.status(201).json({ data: await createUser(req.body) });
});
route.get('/users', async (req: Request, res: Response) => {
  return res.status(200).json({ data: await allUsers() });
});
export default route;
