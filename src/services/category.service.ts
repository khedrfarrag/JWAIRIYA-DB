import { CategoryRepository } from '../repositories/category.repository';
import slugify from 'slugify';

const categoryRepository = new CategoryRepository();

export class CategoryService {
  async createCategory(data: any) {
    const slug = slugify(data.name, { lower: true });
    
    // Check if slug exists
    const existing = await categoryRepository.findBySlug(slug);
    if (existing) throw new Error('Category with this name/slug already exists');

    return categoryRepository.create({
      ...data,
      slug,
    });
  }

  async getAllCategories() {
    // Returns top-level categories with children tree (excluding ARCHIVED)
    return categoryRepository.findMany({ 
      parentId: null,
      status: { not: 'ARCHIVED' } 
    });
  }

  async getAllFlatCategories() {
    // Returns all categories as a simple list (excluding ARCHIVED)
    return categoryRepository.findAllFlat();
  }

  async getCategoryById(id: string) {
    const category = await categoryRepository.findById(id);
    if (!category || category.status === 'ARCHIVED') throw new Error('Category not found');
    return category;
  }

  async updateCategory(id: string, data: any) {
    if (data.name) {
      data.slug = slugify(data.name, { lower: true });
    }
    return categoryRepository.update(id, data);
  }

  async deleteCategory(id: string) {
    // Check if it has children first 
    const category = await categoryRepository.findById(id) as any;
    if (category && category.children && category.children.filter((c: any) => c.status !== 'ARCHIVED').length > 0) {
      throw new Error('Cannot delete category with active children');
    }
    return categoryRepository.delete(id);
  }
}
