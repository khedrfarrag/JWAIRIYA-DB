import bcrypt from 'bcrypt';
import { AuthRepository } from '../repositories/auth.repository';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';
import prisma from '../config/database';
import { MailService } from './mail.service';
import { generateOTP, generateRandomToken } from '../utils/crypto';
import { OAuth2Client } from 'google-auth-library';

const authRepository = new AuthRepository();
const mailService = new MailService();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export class AuthService {
  async googleAuth(idToken: string) {
    try {
      const ticket = await googleClient.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      if (!payload || !payload.email) throw new Error('Invalid Google Token');

      const { email, name, sub: googleId } = payload;

      let user = await authRepository.findByEmail(email);

      if (user) {
        // If user exists but no googleId (normal register), link them
        if (!user.googleId) {
          user = await authRepository.updateUser(user.id, {
            googleId,
            isVerified: true, // Link account automatically verifies if not already
          });
        }
      } else {
        // Create new user via Google
        // We'll give them a random password since they use Google
        const randomPassword = await bcrypt.hash(generateRandomToken(), 10);
        user = await authRepository.createUser({
          email,
          name: name || email.split('@')[0],
          password: randomPassword,
          googleId,
          isVerified: true,
        });
      }

      const accessToken = generateAccessToken({ id: user.id, role: user.role });
      const refreshToken = generateRefreshToken({ id: user.id });

      return { user: this.sanitizeUser(user), accessToken, refreshToken };
    } catch (error) {
      console.error('Google Auth Error:', error);
      throw new Error('Authentication with Google failed');
    }
  }


  async register(data: any) {
    const existingUser = await authRepository.findByEmail(data.email);
    if (existingUser) throw new Error('User already exists');

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    const { confirmPassword, ...userData } = data;
    const user = await authRepository.createUser({
      ...userData,
      password: hashedPassword,
      otp,
      otpExpires,
    });

    await mailService.sendOTP(user.email, otp);

    const accessToken = generateAccessToken({ id: user.id, role: user.role });
    const refreshToken = generateRefreshToken({ id: user.id });

    return { user: this.sanitizeUser(user), accessToken, refreshToken };
  }

  async login(data: any) {
    const user = await authRepository.findByEmail(data.email);
    if (!user) throw new Error('Invalid credentials');

    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) throw new Error('Invalid credentials');

    if (!user.isVerified) throw new Error('Email not verified');

    const accessToken = generateAccessToken({ id: user.id, role: user.role });
    const refreshToken = generateRefreshToken({ id: user.id });

    return { user: this.sanitizeUser(user), accessToken, refreshToken };
  }

  private sanitizeUser(user: any) {
    const { password, otp, otpExpires, passwordResetToken, passwordResetExpires, ...safeUser } = user;
    return safeUser;
  }

  async refresh(token: string) {
    try {
      const decoded = verifyRefreshToken(token);
      
      const user = await authRepository.findById(decoded.id);
      if (!user) throw new Error('User not found');

      const accessToken = generateAccessToken({ id: user.id, role: user.role });
      
      return { accessToken };
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  async forgotPassword(email: string) {
    const user = await authRepository.findByEmail(email);
    if (!user) throw new Error('User not found');

    const token = generateRandomToken();
    const expires = new Date(Date.now() + 3600000); // 1 hour

    await authRepository.updateUser(user.id, {
      passwordResetToken: token,
      passwordResetExpires: expires,
    });

    await mailService.sendResetLink(email, token);
  }

  async resetPassword(data: any) {
    const { token, password } = data;
    const user = await authRepository.findByResetToken(token);

    if (!user) throw new Error('Invalid or expired reset token');

    const hashedPassword = await bcrypt.hash(password, 10);
    await authRepository.updateUser(user.id, {
      password: hashedPassword,
      passwordResetToken: null,
      passwordResetExpires: null,
    });
  }

  async verifyOtp(email: string, otp: string) {
    const user = await authRepository.findByEmail(email);
    if (!user) throw new Error('User not found');

    if (user.otp !== otp || (user.otpExpires && user.otpExpires < new Date())) {
      throw new Error('Invalid or expired OTP');
    }

    await authRepository.updateUser(user.id, {
      isVerified: true,
      otp: null,
      otpExpires: null,
    });
  }

  async resendOtp(email: string) {
    const user = await authRepository.findByEmail(email);
    if (!user) throw new Error('User not found');

    if (user.isVerified) throw new Error('Account is already verified');

    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    await authRepository.updateUser(user.id, {
      otp,
      otpExpires,
    });

    await mailService.sendOTP(email, otp);
  }
}
