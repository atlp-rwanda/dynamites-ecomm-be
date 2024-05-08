// nodemailerConfig.ts
import nodemailer from 'nodemailer';

let transporter;

if (process.env.NODE_ENV === 'production') {

  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
} else {
  // Use Mailtrap for development
  transporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "your_mailtrap_username",
      pass: "your_mailtrap_password",
    },
  });
}

export default transporter;
