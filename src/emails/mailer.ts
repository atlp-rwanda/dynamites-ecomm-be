import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

export async function sendCode(to: string, subject: string, htmlTemplatePath: string, replacements: Record<string, string>) {
  const template = await fs.promises.readFile(path.resolve(__dirname, htmlTemplatePath), 'utf8');

  let html = template;
  for (const placeholder in replacements) {
    html = html.replace(new RegExp(`{{${placeholder}}}`, 'g'), replacements[placeholder]);
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: "dynamitesecommerce@gmail.com",
    to,
    subject,
    html
  };

  // Send the email
  return transporter.sendMail(mailOptions);
}