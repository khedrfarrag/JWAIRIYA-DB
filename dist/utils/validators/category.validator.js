"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCategorySchema = exports.createCategorySchema = void 0;
const zod_1 = require("zod");
exports.createCategorySchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'Name must be at least 2 characters'),
    description: zod_1.z.string().optional(),
    parentId: zod_1.z.string().uuid('Invalid parent category ID').optional().nullable(),
});
exports.updateCategorySchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'Name must be at least 2 characters').optional(),
    description: zod_1.z.string().optional(),
    parentId: zod_1.z.string().uuid('Invalid parent category ID').optional().nullable(),
});
