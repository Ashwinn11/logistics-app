import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.warn('⚠️  EMAIL_USER or EMAIL_PASS not set. Emails will not be sent.');
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const sendEmail = async (to, subject, text, html) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return;

  try {
    const info = await transporter.sendMail({
      from: `"Seaflow Logistics" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html
    });

    console.log('📧 Email sent:', info.messageId);
    return info;
  } catch (err) {
    console.error('❌ Email error:', err.message);
  }
};

export const sendWelcomeEmail = async (to, username, password) => {
  await sendEmail(
    to,
    'Welcome to Seaflow Logistics',
    `Your account is ready.\nUsername: ${username}\nPassword: ${password}`,
    `
      <h2>Welcome to Seaflow Logistics</h2>
      <p><b>Username:</b> ${username}</p>
      <p><b>Password:</b> ${password}</p>
      <p>Please log in and change your password.</p>
    `
  );
};

export const sendPasswordResetEmail = async (to, token) => {
  const link = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

  await sendEmail(
    to,
    'Password Reset',
    `Reset your password: ${link}`,
    `<a href="${link}">Reset Password</a>`
  );
};