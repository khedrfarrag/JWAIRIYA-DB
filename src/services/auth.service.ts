import bcrypt from 'bcrypt';
import { AuthRepository } from '../repositories/auth.repository';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt';

const authRepository = new AuthRepository();

export class AuthService {
  async register(data: any) {
    const existingUser = await authRepository.findByEmail(data.email);
    if (existingUser) throw new Error('User already exists');

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await authRepository.createUser({
      ...data,
      password: hashedPassword,
    });

    const accessToken = generateAccessToken({ id: user.id, role: user.role });
    const refreshToken = generateRefreshToken({ id: user.id });

    return { user, accessToken, refreshToken };
  }

  async login(data: any) {
    const user = await authRepository.findByEmail(data.email);
    if (!user) throw new Error('Invalid credentials');

    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) throw new Error('Invalid credentials');

    const accessToken = generateAccessToken({ id: user.id, role: user.role });
    const refreshToken = generateRefreshToken({ id: user.id });

    return { user, accessToken, refreshToken };
  }
}
