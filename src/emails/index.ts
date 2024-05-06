import axios from 'axios';
import handlebars from 'handlebars';
import fs from 'fs';
type EmailType = 'confirm' | 'reset';
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

        const domain = process.env.MAILERSEND_DOMAIN
        const key = process.env.MAILERSEND_TOKEN
        const body = {
            'from': {
                'email': `info@${domain}`,
            },
            'to': [
                {
                    'email': recipient
                }
            ],
            'subject': 'Verification Email',
            'html': html
        }
        const mailersend = 'https://api.mailersend.com/v1/email'
        const response = await axios.post(mailersend, body, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${key}`
            }
        });
        return response
    } catch (error) {
        // console.error('Error sending email:', error);
        throw new Error('Error sending email');
    }
}

export default sendEmail;
