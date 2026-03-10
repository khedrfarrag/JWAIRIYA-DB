import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authMiddleware, adminMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const userController = new UserController();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management and retrieval
 */

/**
 * @swagger
 * /api/users/verified:
 *   get:
 *     summary: Get all verified users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of verified users
 */
router.get('/verified', authMiddleware, adminMiddleware, userController.getVerifiedUsers);

/**
 * @swagger
 * /api/users/unverified:
 *   get:
 *     summary: Get all unverified users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of unverified users
 */
router.get('/unverified', authMiddleware, adminMiddleware, userController.getUnverifiedUsers);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User details
 */
router.get('/:id', authMiddleware, userController.getUserById);

export default router;
