import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

async function sendEmail(vendorEmail: string, message_title: string, messageContent: string) {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, 
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"The E-commerce Team" <${process.env.EMAIL_USER}>`,
      to: 'ericniyibizi1998@gmail.com',
      subject: 'Notification from Your Company',
      text: messageContent,
      html: `<p>${messageContent.replace(/\n/g, '<br>')}</p>`,
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    throw error
  }
}

export default sendEmail;

