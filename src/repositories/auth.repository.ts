import { PrismaClient, User, Role } from '@prisma/client';

const prisma = new PrismaClient();

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
}
