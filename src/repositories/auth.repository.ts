import { User, Role } from '@prisma/client';
import prisma from '../config/database';

export class AuthRepository {
  async createUser(data: any): Promise<User> {
    return prisma.user.create({ data });
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  async updateUser(id: string, data: any): Promise<User> {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  async findByResetToken(token: string): Promise<User | null> {
    return prisma.user.findFirst({
      where: {
        passwordResetToken: token,
        passwordResetExpires: { gt: new Date() },
      },
    });
  }
}
