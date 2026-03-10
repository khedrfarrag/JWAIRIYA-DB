import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';

const authService = new AuthService();

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.register(req.body);
      res.status(201).json({
        status: 'success',
        data: result,
      });
    } catch (error: any) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.login(req.body);
      res.status(200).json({
        status: 'success',
        data: result,
      });
    } catch (error: any) {
      next(error);
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) throw new Error('Refresh token is required');
      
      const result = await authService.refresh(refreshToken);
      res.status(200).json({
        status: 'success',
        data: result,
      });
    } catch (error: any) {
      next(error);
    }
  }

  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      await authService.forgotPassword(email);
      res.status(200).json({ status: 'success', message: 'If a user with that email exists, a reset link has been sent' });
    } catch (error: any) {
      next(error);
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      await authService.resetPassword(req.body);
      res.status(200).json({ status: 'success', message: 'Password reset successful' });
    } catch (error: any) {
      next(error);
    }
  }

  async verifyOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, otp } = req.body;
      await authService.verifyOtp(email, otp);
      res.status(200).json({ status: 'success', message: 'Email verified successfully' });
    } catch (error: any) {
      next(error);
    }
  }

  async resendOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      await authService.resendOtp(email);
      res.status(200).json({ status: 'success', message: 'OTP resent successfully' });
    } catch (error: any) {
      next(error);
    }
  }

  async googleAuth(req: Request, res: Response, next: NextFunction) {
    try {
      const { idToken } = req.body;
      const result = await authService.googleAuth(idToken);
      res.status(200).json({
        status: 'success',
        data: result,
      });
    } catch (error: any) {
      next(error);
    }
  }
}
