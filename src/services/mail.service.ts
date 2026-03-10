import nodemailer from 'nodemailer';

export class MailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: Number(process.env.SMTP_PORT) === 465, // Use SSL for port 465
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendMail(to: string, subject: string, html: string) {
    try {
      await this.transporter.sendMail({
        from: `"Jawairia Store" <${process.env.SMTP_USER}>`,
        to,
        subject,
        html,
      });
    } catch (error) {
      console.error('Mail Error:', error);
      throw new Error('Failed to send email');
    }
  }

  async sendOTP(to: string, otp: string) {
    const html = `
      <div style="font-family: Arial, sans-serif; text-align: center;">
        <h2>Verification Code</h2>
        <p>Your OTP for Jawairia Store is:</p>
        <h1 style="color: #4A90E2;">${otp}</h1>
        <p>This code will expire in 10 minutes.</p>
      </div>
    `;
    await this.sendMail(to, 'Verify your email', html);
  }

  async sendResetLink(to: string, token: string) {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const link = `${frontendUrl}/reset-password?token=${token}`;
    const html = `
      <div style="font-family: Arial, sans-serif; text-align: center;">
        <h2>Password Reset</h2>
        <p>Click the link below to reset your password:</p>
        <a href="${link}" style="display: inline-block; padding: 10px 20px; background-color: #4A90E2; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
        <p>If you didn't request this, please ignore this email.</p>
      </div>
    `;
    await this.sendMail(to, 'Reset your password', html);
  }
}
