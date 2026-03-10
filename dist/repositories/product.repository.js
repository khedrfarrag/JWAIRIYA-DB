"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRepository = void 0;
const database_1 = __importDefault(require("../config/database"));
class ProductRepository {
    async createProduct(data) {
        return database_1.default.product.create({
            data,
            include: {
                images: true,
                variants: true,
                category: true,
            },
        });
    }
    async findMany(filters = {}) {
        return database_1.default.product.findMany({
            where: {
                ...filters,
                isActive: true,
            },
            include: {
                images: true,
                category: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findById(id) {
        return database_1.default.product.findUnique({
            where: { id },
            include: {
                images: true,
                variants: true,
                category: true,
            },
        });
    }
    async findBySlug(slug) {
        return database_1.default.product.findUnique({
            where: { slug },
            include: {
                images: true,
                variants: true,
            },
        });
    }
    async updateProduct(id, data) {
        return database_1.default.product.update({
            where: { id },
            data,
            include: {
                images: true,
                variants: true,
            },
        });
    }
    async deleteProduct(id) {
        return database_1.default.product.delete({ where: { id } });
    }
    // Variant Specific
    async createVariants(variants) {
        return database_1.default.variant.createMany({
            data: variants,
        });
    }
    // Image Specific
    async addImages(images) {
        return database_1.default.productImage.createMany({
            data: images,
        });
    }
}
exports.ProductRepository = ProductRepository;
