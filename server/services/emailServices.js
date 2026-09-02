import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth:{
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

transporter.verify((error,success)=>{
  if (error) {
    console.error("SMTP connnection Failed",error);
    
  } else {
    console.error("✅ SMTP server is ready to send emails");
    
  }
});

const sendWelcomeEmail = async (email, name) => {
  const mailOptions = {
    from: `"HireAI" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Welcome to HireAI",
    text: `Hello ${name}, welcome to HireAI`,
  };
  const info = await transporter.sendMail(mailOptions);
  return info;
};


const sendVerificationEmail = async (email, name, token) => {
  // Use CLIENT_URL from environment variables, or fallback to localhost for local testing
  const baseUrl = process.env.CLIENT_URL || `http://localhost:${process.env.PORT || 5000}`;
  const verificationLink = `${baseUrl}/api/auth/verify?token=${token}`;

  const mailOptions = {
    from: `"HireAI" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Verify your HireAI Account",
    text: `Hello ${name}, \nWelcome to HireAI! Please verify your email address to activate your account by clicking the link below:\n\n${verificationLink}\n\nThis link will expire in 24 hours.`,
  };
  const info = await transporter.sendMail(mailOptions);
  return info;
};

const sendPasswordResetEmail = async (email, name, token) => {
  const baseUrl = process.env.CLIENT_URL || `http://localhost:${process.env.PORT || 5000}`;
  const resetLink = `${baseUrl}/api/auth/reset-password?token=${token}`;

  const mailOptions = {
    from: `"HireAI" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Reset your HireAI Password",
    text: `Hello ${name},
      We received a request to reset your HireAI password.

      Click the link below to reset your password:

      ${resetLink}

      This link will expire in 15 minutes.

      If you did not request a password reset, please ignore this email.

      Regards,
      HireAI Team`,
  };
  const info = await transporter.sendMail(mailOptions);
  return info;
};


export{
  sendWelcomeEmail,
  sendVerificationEmail,
  sendPasswordResetEmail,
};

export default transporter;