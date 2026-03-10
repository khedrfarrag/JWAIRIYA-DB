"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProductSchema = exports.createProductSchema = void 0;
const zod_1 = require("zod");
exports.createProductSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'Name must be at least 2 characters'),
    description: zod_1.z.string().min(10, 'Description must be at least 10 characters'),
    basePrice: zod_1.z.preprocess((val) => Number(val), zod_1.z.number().positive('Price must be positive')),
    categoryId: zod_1.z.string().uuid('Invalid category ID'),
    isActive: zod_1.z.preprocess((val) => val === 'true' || val === true, zod_1.z.boolean().optional()),
    attributes: zod_1.z.preprocess((val) => {
        if (typeof val === 'string')
            return JSON.parse(val);
        return val;
    }, zod_1.z.object({
        colors: zod_1.z.array(zod_1.z.string()).optional(),
        sizes: zod_1.z.array(zod_1.z.string()).optional(),
        materials: zod_1.z.array(zod_1.z.string()).optional(),
    }).optional()),
});
exports.updateProductSchema = zod_1.z.object({
    name: zod_1.z.string().min(2).optional(),
    description: zod_1.z.string().min(10).optional(),
    basePrice: zod_1.z.number().positive().optional(),
    categoryId: zod_1.z.string().uuid().optional(),
    isActive: zod_1.z.boolean().optional(),
});
