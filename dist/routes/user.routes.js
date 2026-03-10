"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
const userController = new user_controller_1.UserController();
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
router.get('/verified', auth_middleware_1.authMiddleware, auth_middleware_1.adminMiddleware, userController.getVerifiedUsers);
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
router.get('/unverified', auth_middleware_1.authMiddleware, auth_middleware_1.adminMiddleware, userController.getUnverifiedUsers);
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
router.get('/:id', auth_middleware_1.authMiddleware, userController.getUserById);
exports.default = router;
