import { Request, Response } from 'express';
import sendEmail from '../emails/contact';

export const handleContact = async (req: Request, res: Response) => {
  const { name, email, phone, message } = req.body;

  if (!name || !email || !message) {
    return res
      .status(400)
      .json({ error: 'Name, email, and message are required' });
  }

  try {
    if (process.env.NODE_ENV !== 'test') {
      await sendEmail('contact', 'bentopride@gmail.com', {
        name,
        email,
        phone,
        message,
      });
    }
    res.status(200).json({ message: 'Feedback sent successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send feedback' });
  }
};
