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
    from: `"HireAI"<${process.env.SMTP_USER}`,
    to: email,
    subject: "Welcome to HireAI",
    text: `Hello ${name}, welcome to HireAI`,
  };
  const info = await transporter.sendMail(mailOptions);
  return info;
};
export{
  sendWelcomeEmail,
};

export default transporter;