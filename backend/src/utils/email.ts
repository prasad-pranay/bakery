import nodemailer from 'nodemailer';

// host: process.env.EMAIL_HOST || 'smtp.mailtrap.io',
// port: parseInt(process.env.EMAIL_PORT || '2525'),
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "thehuntclub2026@gmail.com",
    pass: "jhst bhhy guub hsat"
  }
});


export const sendEmail = async (to: string, subject: string, html: string) => {

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'noreply@bakery.com',
      to,
      subject,
      html
    });
  } catch (error) {
    console.error('Email sending failed:', error);
  }
};
