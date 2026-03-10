import { UserRepository } from '../repositories/user.repository';

const userRepository = new UserRepository();

export class UserService {
  async getVerifiedUsers() {
    const users = await userRepository.findMany({ isVerified: true });
    return users.map(user => this.sanitizeUser(user));
  }

  async getUnverifiedUsers() {
    const users = await userRepository.findMany({ isVerified: false });
    return users.map(user => this.sanitizeUser(user));
  }

  async getUserById(id: string) {
    const user = await userRepository.findById(id);
    if (!user) throw new Error('User not found');
    return this.sanitizeUser(user);
  }

  private sanitizeUser(user: any) {
    const { password, otp, otpExpires, passwordResetToken, passwordResetExpires, ...safeUser } = user;
    return safeUser;
  }
}
