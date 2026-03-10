import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  basePrice: z.preprocess((val) => Number(val), z.number().positive('Price must be positive')),
  categoryId: z.string().uuid('Invalid category ID'),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('PUBLISHED'),
  initialStock: z.preprocess((val) => (val === undefined || val === '' ? 0 : Number(val)), z.number().int().min(0).default(0)),
  lowStockThreshold: z.preprocess((val) => (val === undefined || val === '' ? 5 : Number(val)), z.number().int().min(0).default(5)),
  attributes: z.preprocess((val) => {
    if (typeof val === 'string' && val.trim() !== '') {
      try {
        return JSON.parse(val);
      } catch (e) {
        throw new Error('Invalid JSON format in attributes. Please check your syntax (quotes, brackets, etc.)');
      }
    }
    return val === '' || val === undefined ? undefined : val;
  }, z.object({
    colors: z.array(z.string()).optional(),
    sizes: z.array(z.string()).optional(),
    materials: z.array(z.string()).optional(),
  }).optional()),
  tags: z.array(z.string()).optional(),
});

export const updateProductSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().min(10).optional(),
  basePrice: z.number().positive().optional(),
  categoryId: z.string().uuid().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
  tags: z.array(z.string()).optional(),
});

export const updateVariantSchema = z.object({
  price: z.number().positive().optional(),
  stock: z.number().int().min(0).optional(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
