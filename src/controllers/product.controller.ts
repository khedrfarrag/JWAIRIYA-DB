import { Request, Response, NextFunction } from 'express';
import { ProductService } from '../services/product.service';

const productService = new ProductService();

export class ProductController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await productService.createProduct(req.body, req.files as Express.Multer.File[]);
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
      const result = await productService.getProducts(req.query);
      res.status(200).json({
        status: 'success',
        data: result,
      });
    } catch (error: any) {
      next(error);
    }
  }

  async getBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await productService.getProductBySlug(req.params.slug as string);
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
      const result = await productService.updateProduct(req.params.id as string, req.body, req.files as Express.Multer.File[]);
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
      await productService.deleteProduct(req.params.id as string);
      res.status(204).send();
    } catch (error: any) {
      next(error);
    }
  }

  async updateVariant(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await productService.updateVariant(req.params.id as string, req.body);
      res.status(200).json({
        status: 'success',
        data: result,
      });
    } catch (error: any) {
      next(error);
    }
  }

  async getRelated(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await productService.getRelatedProducts(req.params.id as string);
      res.status(200).json({
        status: 'success',
        data: result,
      });
    } catch (error: any) {
      next(error);
    }
  }
}
