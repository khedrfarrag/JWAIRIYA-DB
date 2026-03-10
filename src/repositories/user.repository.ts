import { User } from '@prisma/client';
import prisma from '../config/database';

export class UserRepository {
  async findMany(filters: any): Promise<User[]> {
    return prisma.user.findMany({
      where: filters,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  async update(id: string, data: any): Promise<User> {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<User> {
    return prisma.user.delete({ where: { id } });
  }
}
