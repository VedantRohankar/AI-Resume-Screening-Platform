import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587;
const isSecure = port === 465;

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: port,
  secure: isSecure,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
  connectionTimeout: 4000, // 4s timeout prevents indefinite hanging
  greetingTimeout: 4000,
  socketTimeout: 5000,
  tls: {
    rejectUnauthorized: false,
  },
});

// Verify connection non-blockingly
transporter.verify((error, success) => {
  if (error) {
    console.warn("⚠️ SMTP server warning (emails will attempt background delivery):", error.message);
  } else {
    console.log("✅ SMTP server is ready to send emails");
  }
});

const sendWelcomeEmail = async (email, name) => {
  const mailOptions = {
    from: `"HireAI" <${process.env.SMTP_USER || 'no-reply@hireai.dev'}>`,
    to: email,
    subject: "Welcome to HireAI",
    text: `Hello ${name}, welcome to HireAI!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0b0f19; color: #f1f5f9; padding: 30px; border-radius: 12px; border: 1px solid #1e293b;">
        <h2 style="color: #6366f1; margin-bottom: 8px;">HireAI</h2>
        <h3 style="color: #ffffff; margin-top: 0;">Welcome aboard!</h3>
        <p style="color: #94a3b8; font-size: 14px; line-height: 1.6;">
          Hello <strong>${name}</strong>,<br/>
          Your HireAI account is now fully active. Start discovering matching candidates or exploring top tier tech roles now.
        </p>
      </div>
    `,
  };
  return transporter.sendMail(mailOptions);
};

const sendVerificationEmail = async (email, name, token) => {
  const rawBaseUrl = process.env.CLIENT_URL || `http://localhost:${process.env.PORT || 5000}`;
  const baseUrl = rawBaseUrl.replace(/\/+$/, '');
  const verificationLink = `${baseUrl}/api/auth/verify?token=${token}`;

  const mailOptions = {
    from: `"HireAI" <${process.env.SMTP_USER || 'no-reply@hireai.dev'}>`,
    to: email,
    subject: "Verify your HireAI Account",
    text: `Hello ${name},\n\nWelcome to HireAI! Please verify your email address by opening the link below:\n\n${verificationLink}\n\nThis link will expire in 24 hours.`,

    text: `Hello ${name}, \n\nWelcome to HireAI! Please verify your email address to activate your account by clicking the link below:\n\n${verificationLink}\n\nThis link will expire in 24 hours.`,

    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0b0f19; color: #f1f5f9; padding: 30px; border-radius: 12px; border: 1px solid #1e293b;">
        <h2 style="color: #6366f1; margin-bottom: 8px;">HireAI</h2>
        <h3 style="color: #ffffff; margin-top: 0;">Verify your account</h3>
        <p style="color: #94a3b8; font-size: 14px; line-height: 1.6;">
          Hello <strong>${name}</strong>,<br/>
          Welcome to HireAI! Please confirm your email address to activate your account and start using AI-powered candidate screening and matching.
        </p>
        <div style="margin: 30px 0;">
          <a href="${verificationLink}" style="background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px; display: inline-block;">
            Verify Email Address
          </a>
        </div>
        <p style="color: #64748b; font-size: 12px; margin-top: 25px;">
          Or copy and paste this link in your browser:<br/>
          <a href="${verificationLink}" style="color: #818cf8; word-break: break-all;">${verificationLink}</a>
        </p>
        <p style="color: #64748b; font-size: 12px;">This link will expire in 24 hours.</p>
      </div>
    `,
  };
  return transporter.sendMail(mailOptions);
};

const sendPasswordResetEmail = async (email, name, token) => {
  const rawBaseUrl = process.env.CLIENT_URL || `http://localhost:${process.env.PORT || 5000}`;
  const baseUrl = rawBaseUrl.replace(/\/+$/, '');
  const resetLink = `${baseUrl}/reset-password?token=${token}`;

  const mailOptions = {
    from: `"HireAI" <${process.env.SMTP_USER || 'no-reply@hireai.dev'}>`,
    to: email,
    subject: "Reset your HireAI Password",
    text: `Hello ${name},\n\nWe received a request to reset your HireAI password.\n\nClick the link below to reset your password:\n\n${resetLink}\n\nThis link will expire in 15 minutes.\n\nIf you did not request a password reset, please ignore this email.\n\nRegards,\nHireAI Team`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0b0f19; color: #f1f5f9; padding: 30px; border-radius: 12px; border: 1px solid #1e293b;">
        <h2 style="color: #6366f1; margin-bottom: 8px;">HireAI</h2>
        <h3 style="color: #ffffff; margin-top: 0;">Reset Your Password</h3>
        <p style="color: #94a3b8; font-size: 14px; line-height: 1.6;">
          Hello <strong>${name}</strong>,<br/>
          We received a request to reset your HireAI password. Click the button below to choose a new password:
        </p>
        <div style="margin: 30px 0;">
          <a href="${resetLink}" style="background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p style="color: #64748b; font-size: 12px; margin-top: 25px;">
          Or copy and paste this link in your browser:<br/>
          <a href="${resetLink}" style="color: #818cf8; word-break: break-all;">${resetLink}</a>
        </p>
        <p style="color: #64748b; font-size: 12px;">This link will expire in 15 minutes. If you did not request this, please ignore this email.</p>
      </div>
    `,
  };
  return transporter.sendMail(mailOptions);
};

export {
  sendWelcomeEmail,
  sendVerificationEmail,
  sendPasswordResetEmail,
};

export default transporter;