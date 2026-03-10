"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_controller_1 = require("../controllers/product.controller");
const validation_middleware_1 = require("../middlewares/validation.middleware");
const product_validator_1 = require("../utils/validators/product.validator");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const upload_middleware_1 = require("../middlewares/upload.middleware");
const router = (0, express_1.Router)();
const productController = new product_controller_1.ProductController();
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
 * /api/products/{slug}:
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
router.get('/:slug', productController.getBySlug);
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
 *             required: [name, description, basePrice, categoryId]
 *             properties:
 *               name: { type: string }
 *               description: { type: string }
 *               basePrice: { type: number }
 *               categoryId: { type: string }
 *               attributes:
 *                 type: string
 *                 description: JSON string of attributes {colors: [], sizes: [], materials: []}
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Product created
 */
router.post('/', auth_middleware_1.authMiddleware, auth_middleware_1.adminMiddleware, upload_middleware_1.upload.array('images', 5), (0, validation_middleware_1.validate)(product_validator_1.createProductSchema), productController.create);
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
router.patch('/:id', auth_middleware_1.authMiddleware, auth_middleware_1.adminMiddleware, (0, validation_middleware_1.validate)(product_validator_1.updateProductSchema), productController.update);
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
 *     responses:
 *       204:
 *         description: Product deleted
 */
router.delete('/:id', auth_middleware_1.authMiddleware, auth_middleware_1.adminMiddleware, productController.delete);
exports.default = router;
