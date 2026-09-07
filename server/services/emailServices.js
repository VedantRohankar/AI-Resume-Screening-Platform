import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import dns from 'node:dns';

dotenv.config();

// Enforce IPv4-first globally in Node.js
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM = process.env.RESEND_FROM || 'HireAI <onboarding@resend.dev>';

/**
 * Sends email via Resend REST API over HTTPS (Port 443).
 * This completely bypasses Render/Cloud raw SMTP port blocks.
 */
const sendViaResend = async ({ to, subject, html, text }) => {
  if (!RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is not configured in environment variables');
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: RESEND_FROM,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      text,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || data.error?.message || 'Resend HTTP API request failed');
  }
  return data;
};

// Custom DNS lookup that explicitly forces family: 4 (IPv4) only for Nodemailer fallback
const ipv4Lookup = (hostname, options, callback) => {
  return dns.lookup(hostname, { family: 4 }, callback);
};

const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587;
const isSecure = port === 465;
const hasSmtpCredentials = Boolean(process.env.SMTP_USER && process.env.SMTP_PASSWORD);

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: port,
  secure: isSecure,
  auth: hasSmtpCredentials
    ? {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      }
    : undefined,
  lookup: ipv4Lookup,
  family: 4,
  connectionTimeout: 5000,
  greetingTimeout: 5000,
  socketTimeout: 6000,
  tls: {
    rejectUnauthorized: false,
  },
});

const sendWelcomeEmail = async (email, name) => {
  const mailOptions = {
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

  if (RESEND_API_KEY) {
    try {
      const resendResult = await sendViaResend(mailOptions);
      console.log("✅ Welcome email sent via Resend HTTPS API to:", email);
      return resendResult;
    } catch (resendError) {
      console.warn("⚠️ Resend notice:", resendError.message);
    }
  }

  if (hasSmtpCredentials) {
    try {
      return await transporter.sendMail({
        from: `"HireAI" <${process.env.SMTP_USER}>`,
        ...mailOptions,
      });
    } catch (smtpErr) {
      console.warn("⚠️ SMTP fallback notice:", smtpErr.message);
    }
  }
};

const sendVerificationEmail = async (email, name, token) => {
  const rawBaseUrl = process.env.CLIENT_URL || `http://localhost:${process.env.PORT || 5000}`;
  const baseUrl = rawBaseUrl.replace(/\/+$/, '');
  const verificationLink = `${baseUrl}/api/auth/verify?token=${token}`;

  // Always log the verification link to console for immediate 1-click testing
  console.log(`🔑 Verification Link for ${email}: ${verificationLink}`);

  const mailOptions = {
    to: email,
    subject: "Verify your HireAI Account",
    text: `Hello ${name},\n\nWelcome to HireAI! Please verify your email address by opening the link below:\n\n${verificationLink}\n\nThis link will expire in 24 hours.`,
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

  if (RESEND_API_KEY) {
    try {
      const resendResult = await sendViaResend(mailOptions);
      console.log("✅ Verification email sent successfully via Resend HTTPS API to:", email);
      return resendResult;
    } catch (resendError) {
      console.warn("⚠️ Resend delivery notice:", resendError.message);
    }
  }

  if (hasSmtpCredentials) {
    try {
      return await transporter.sendMail({
        from: `"HireAI" <${process.env.SMTP_USER}>`,
        ...mailOptions,
      });
    } catch (smtpErr) {
      console.warn("⚠️ SMTP fallback notice:", smtpErr.message);
    }
  }
};

const sendPasswordResetEmail = async (email, name, token) => {
  const rawBaseUrl = process.env.CLIENT_URL || `http://localhost:${process.env.PORT || 5000}`;
  const baseUrl = rawBaseUrl.replace(/\/+$/, '');
  const resetLink = `${baseUrl}/reset-password?token=${token}`;

  console.log(`🔑 Password Reset Link for ${email}: ${resetLink}`);

  const mailOptions = {
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

  if (RESEND_API_KEY) {
    try {
      const resendResult = await sendViaResend(mailOptions);
      console.log("✅ Password reset email sent via Resend HTTPS API to:", email);
      return resendResult;
    } catch (resendError) {
      console.warn("⚠️ Resend notice:", resendError.message);
    }
  }

  if (hasSmtpCredentials) {
    try {
      return await transporter.sendMail({
        from: `"HireAI" <${process.env.SMTP_USER}>`,
        ...mailOptions,
      });
    } catch (smtpErr) {
      console.warn("⚠️ SMTP fallback notice:", smtpErr.message);
    }
  }
};

export {
  sendWelcomeEmail,
  sendVerificationEmail,
  sendPasswordResetEmail,
};

export default transporter;