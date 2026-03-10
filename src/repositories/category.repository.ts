import { Category } from '@prisma/client';
import prisma from '../config/database';

export class CategoryRepository {
  async create(data: any): Promise<Category> {
    return prisma.category.create({ data });
  }

  async findMany(filters: any = {}): Promise<Category[]> {
    return prisma.category.findMany({
      where: {
        ...filters,
        status: { not: 'ARCHIVED' },
      },
      include: {
        children: {
          include: {
            children: true, // Support up to 3 levels in the tree
          }
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findAllFlat(): Promise<Category[]> {
    return prisma.category.findMany({
      where: { status: { not: 'ARCHIVED' } },
      orderBy: { name: 'asc' },
    });
  }

  async findById(id: string): Promise<Category | null> {
    return prisma.category.findUnique({
      where: { id },
      include: {
        children: true,
        parent: true,
      },
    });
  }

  async findBySlug(slug: string): Promise<Category | null> {
    return prisma.category.findUnique({ where: { slug } });
  }

  async update(id: string, data: any): Promise<Category> {
    return prisma.category.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Category> {
    return prisma.category.update({
      where: { id },
      data: { status: 'ARCHIVED' },
    });
  }
}
