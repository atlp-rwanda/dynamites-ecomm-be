import mailgun from 'mailgun-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config()

const mg = mailgun({
  apiKey: process.env.MAILGUN_TOKEN || 'default_api_key', 
  domain: process.env.MAILGUN_DOMAIN || 'default_domain' 
});
export async function sendCode(to: string, subject: string, htmlTemplatePath: string, replacements: Record<string, string>) {
  const template = await fs.promises.readFile(path.resolve(__dirname, htmlTemplatePath), 'utf8');
  let html = template;
  for (const placeholder in replacements) {
    html = html.replace(new RegExp(`{{${placeholder}}}`, 'g'), replacements[placeholder]);
  }

  const mailOptions = {
    from: 'dynamitesecommerce@gmail.com',
    to,
    subject,
    html
  };

  // Send the email
  return new Promise((resolve, reject) => {
    mg.messages().send(mailOptions, (error, body) => {
      if (error) {
        reject(error);
      } else {
        resolve(body);
      }
    });
  });
}
