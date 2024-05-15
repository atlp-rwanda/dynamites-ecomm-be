import { Request, Response } from 'express';
import UserModel from '../database/models/userModel';
import dbConnection from '../database';

const userRepository = dbConnection.getRepository(UserModel);

export const deactivateAccount = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.userId);
  const user = await userRepository.findOne({ where: { id: userId } });
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  user.status = 'inactive'; // Assuming 'status' is a field in your UserModel
  await userRepository.save(user);
  res.status(200).json({ message: 'User account deactivated successfully' });
};

export const activateAccount = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.userId);
  const user = await userRepository.findOne({ where: { id: userId } });
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  user.status = 'active'; // Assuming 'status' is a field in your UserModel
  await userRepository.save(user);
  res.status(200).json({ message: 'User account activated successfully' });
};
