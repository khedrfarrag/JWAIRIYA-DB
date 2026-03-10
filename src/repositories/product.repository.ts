import { Product, Variant, ProductImage } from '@prisma/client';
import prisma from '../config/database';

export class ProductRepository {
  async createProduct(data: any): Promise<Product> {
    return prisma.product.create({
      data,
      include: {
        images: true,
        variants: true,
        category: true,
      },
    });
  }

  async findMany(filters: any = {}): Promise<Product[]> {
    const { lowStock, ...restFilters } = filters;
    const where: any = { ...restFilters };

    if (lowStock === 'true' || lowStock === true) {
      where.variants = {
        some: {
          stock: { lte: 5 },
        },
      };
    }

    return prisma.product.findMany({
      where: {
        ...where,
        status: { not: 'ARCHIVED' },
      },
      include: {
        images: true,
        category: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string): Promise<Product | null> {
    return prisma.product.findUnique({
      where: { id },
      include: {
        images: true,
        variants: true,
        category: true,
      },
    });
  }

  async findBySlug(slug: string): Promise<Product | null> {
    return prisma.product.findUnique({
      where: { slug },
      include: {
        images: true,
        variants: true,
      },
    });
  }

  async updateProduct(id: string, data: any): Promise<Product> {
    return prisma.product.update({
      where: { id },
      data,
      include: {
        images: true,
        variants: true,
      },
    });
  }

  async deleteProduct(id: string): Promise<Product> {
    return prisma.product.update({
      where: { id },
      data: { status: 'ARCHIVED' },
    });
  }

  // Variant Specific
  async createVariants(variants: any[]) {
    return prisma.variant.createMany({
      data: variants,
    });
  }

  async findVariantById(id: string): Promise<Variant | null> {
    return prisma.variant.findUnique({ where: { id } });
  }

  async updateVariant(id: string, data: any): Promise<Variant> {
    return prisma.variant.update({
      where: { id },
      data,
    });
  }

  // Image Specific
  async addImages(images: any[]) {
    return prisma.productImage.createMany({
      data: images,
    });
  }

  async findRelated(productId: string, categoryId: string, tags: string[], limit: number = 4): Promise<Product[]> {
    return prisma.product.findMany({
      where: {
        id: { not: productId },
        OR: [
          { categoryId },
          {
            tags: {
              hasSome: tags,
            },
          },
        ],
        status: 'PUBLISHED',
      },
      include: {
        images: true,
        category: true,
      },
      take: limit,
      orderBy: [
        {
          createdAt: 'desc',
        },
      ],
    });
  }
}
