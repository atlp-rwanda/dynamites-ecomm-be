import { Request, Response } from 'express';
import errorHandler from '../middlewares/errorHandler';
import dbConnection from '../database';
import Subscription from '../database/models/subscribe';
import { check, validationResult } from 'express-validator';

const subscribeRepository = dbConnection.getRepository(Subscription);
const userEmailRules = [
  check('email').isEmail().normalizeEmail().withMessage('Email is not valid'),
];
export const subscribe = [
  ...userEmailRules,
  errorHandler(async (req: Request, res: Response) => {
    const { email } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const alreadSubscribed = await subscribeRepository.findOneBy({
      email: req.body.email,
    });
    if (alreadSubscribed) {
      return res.status(400).json({ message: 'Email is already subscribed' });
    }

    const subscription = new Subscription();
    subscription.email = email;

    await subscribeRepository.save(subscription);
    res.status(201).json({ message: 'Subscribed successfully', subscription });
  }),
];

const userIdRules = [
  check('id').isInt({ min: 1 }).withMessage('ID is required'),
];

export const removeSubscriber = [
  ...userIdRules,
  errorHandler(async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const subscription = await subscribeRepository.findOne({
        where: { id },
      });

      if (!subscription) {
        return res.status(404).json({ message: 'Subscription not found' });
      }

      await subscribeRepository.remove(subscription);
      res.status(200).json({ message: 'Subscription removed successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error removing subscription', error });
    }
  }),
];
