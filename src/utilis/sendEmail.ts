import nodemailer from 'nodemailer';

const sendEmail = async (data: { email: string; subject: string; html: string }) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: data.email,
    subject: data.subject,
    html: data.html,
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;
