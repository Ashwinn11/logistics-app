import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Warn once if email is not configured
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.warn('⚠️ EMAIL_USER or EMAIL_PASS missing. Emails are disabled.');
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Optional but VERY useful for debugging
transporter.verify((err, success) => {
  if (err) {
    console.error('❌ SMTP verification failed:', err.message);
  } else {
    console.log('✅ SMTP server is ready to send emails');
  }
});

/**
 * Generic send email function
 */
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
  } catch (error) {
    console.error('❌ Error sending email:', error.message);
  }
};

/**
 * Welcome email (⚠️ no passwords sent)
 */
export const sendWelcomeEmail = async (to, username) => {
  const loginLink = `${process.env.FRONTEND_URL}/login`;

  await sendEmail(
    to,
    'Welcome to Seaflow Logistics',
    `Hello ${username}, your account has been created. Please log in.`,
    `
      <div style="font-family: Arial, sans-serif;">
        <h2>Welcome to Seaflow Logistics</h2>
        <p>Your account has been created successfully.</p>
        <p><strong>Username:</strong> ${username}</p>
        <a href="${loginLink}">Login to your account</a>
      </div>
    `
  );
};

/**
 * Password reset email
 */
export const sendPasswordResetEmail = async (to, token) => {
  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

  await sendEmail(
    to,
    'Password Reset Request',
    `Reset your password using this link: ${resetLink}`,
    `
      <div style="font-family: Arial, sans-serif;">
        <h2>Password Reset</h2>
        <p>Click the button below to reset your password:</p>
        <a href="${resetLink}" style="background:#2563eb;color:#fff;padding:10px 16px;border-radius:4px;text-decoration:none;">
          Reset Password
        </a>
        <p style="font-size:12px;color:#666;">This link expires in 1 hour.</p>
      </div>
    `
  );
};
