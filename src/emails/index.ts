import axios from 'axios';
import handlebars from 'handlebars';
import fs from 'fs';
type EmailType = 'confirm' | 'reset' | 'confirmPassword';
type Data = {
  name: string;
  link: string;
};
/**
 * Sends an email of the specified type to the recipient using the provided data.
 *
 * @param emailType - The type of email to send. Must be either "confirm" or "reset".
 * @param recipient - The email address of the recipient.
 * @param data - The data to be used for generating the email content. A name and link are required.
 * @returns A Promise that resolves to the response from the email service.
 * @throws An error if there is an issue sending the email.
 */
async function sendEmail(emailType: EmailType, recipient: string, data: Data) {
  const templatePath = `./src/emails/templates/${emailType}.html`;
  try {
    // Read the Handlebars template file
    const templateFile = fs.readFileSync(templatePath, 'utf-8');

    // Compile the template
    const template = handlebars.compile(templateFile);

    // Generate the HTML content using the template and data
    const html = template(data);

    // Send the Email

        const domain = process.env.MAILGUN_DOMAIN
        const key = process.env.MAILGUN_TOKEN as string
        const body = {
            from: `Dynamites Account Team <info@${domain}>`,
            to: [recipient],
            subject: 'Verification Email',
            html: html
        }
        const mailgunResponse = await axios.post(`https://api.mailgun.net/v3/${domain}/messages`, body, {
            auth: {
                username: 'api',
                password: key
            },
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        })

        return mailgunResponse
    } catch (error) {
        throw new Error(`Error sending email: ${error}`);
    }
}

export default sendEmail;