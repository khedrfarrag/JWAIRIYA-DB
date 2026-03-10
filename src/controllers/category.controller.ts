import { Request, Response, NextFunction } from 'express';
import { CategoryService } from '../services/category.service';

const categoryService = new CategoryService();

export class CategoryController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await categoryService.createCategory(req.body);
      res.status(201).json({
        status: 'success',
        data: result,
      });
    } catch (error: any) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await categoryService.getAllCategories();
      res.status(200).json({
        status: 'success',
        data: result,
      });
    } catch (error: any) {
      next(error);
    }
  }

  async getAllFlat(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await categoryService.getAllFlatCategories();
      res.status(200).json({
        status: 'success',
        data: result,
      });
    } catch (error: any) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await categoryService.getCategoryById(req.params.id as string);
      res.status(200).json({
        status: 'success',
        data: result,
      });
    } catch (error: any) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await categoryService.updateCategory(req.params.id as string, req.body);
      res.status(200).json({
        status: 'success',
        data: result,
      });
    } catch (error: any) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await categoryService.deleteCategory(req.params.id as string);
      res.status(204).send();
    } catch (error: any) {
      next(error);
    }
  }
}
