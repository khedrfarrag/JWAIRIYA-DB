import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';
import { validate } from '../middlewares/validation.middleware';
import { createProductSchema, updateProductSchema, updateVariantSchema } from '../utils/validators/product.validator';
import { authMiddleware, adminMiddleware } from '../middlewares/auth.middleware';
import { upload } from '../middlewares/upload.middleware';

const router = Router();
const productController = new ProductController();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product and Variant management
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of products
 */
router.get('/', productController.getAll);

/**
 * @swagger
 * /api/products/details/{slug}:
 *   get:
 *     summary: Get product by slug
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product details
 */
router.get('/details/:slug', productController.getBySlug);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product (Admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - basePrice
 *               - categoryId
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               basePrice:
 *                 type: number
 *               categoryId:
 *                 type: string
 *               initialStock:
 *                 type: number
 *                 description: Set initial stock for all variants (defaults to 0)
 *               lowStockThreshold:
 *                 type: number
 *                 description: Threshold for low stock alerts (defaults to 5)
 *               attributes:
 *                 type: string
 *                 description: JSON string of attributes
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of keywords for related products
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Product created
 */
router.post(
  '/',
  authMiddleware,
  adminMiddleware,
  upload.array('images', 5),
  validate(createProductSchema),
  productController.create
);

/**
 * @swagger
 * /api/products/{id}:
 *   patch:
 *     summary: Update a product (Admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               description: { type: string }
 *               basePrice: { type: number }
 *               categoryId: { type: string }
 *               isActive: { type: boolean }
 *     responses:
 *       200:
 *         description: Product updated
 */
router.patch('/:id', authMiddleware, adminMiddleware, validate(updateProductSchema), productController.update);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product (Admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Product deleted
 */
router.delete('/:id', authMiddleware, adminMiddleware, productController.delete);

/**
 * @swagger
 * /api/products/variants/{id}:
 *   patch:
 *     summary: Update a product variant (Admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Variant ID
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               price: { type: number }
 *               stock: { type: number }
 *     responses:
 *       200:
 *         description: Variant updated
 */
router.patch('/variants/:id', authMiddleware, adminMiddleware, validate(updateVariantSchema), productController.updateVariant);

/**
 * @swagger
 * /api/products/{id}/related:
 *   get:
 *     summary: Get related products
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of related products
 */
router.get('/:id/related', productController.getRelated);

export default router;
