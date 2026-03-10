"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryService = void 0;
const category_repository_1 = require("../repositories/category.repository");
const slugify_1 = __importDefault(require("slugify"));
const categoryRepository = new category_repository_1.CategoryRepository();
class CategoryService {
    async createCategory(data) {
        const slug = (0, slugify_1.default)(data.name, { lower: true });
        // Check if slug exists
        const existing = await categoryRepository.findBySlug(slug);
        if (existing)
            throw new Error('Category with this name/slug already exists');
        return categoryRepository.create({
            ...data,
            slug,
        });
    }
    async getAllCategories() {
        // Returns top-level categories with children tree
        return categoryRepository.findMany({ parentId: null });
    }
    async getAllFlatCategories() {
        // Returns all categories as a simple list (useful for dropdowns)
        return categoryRepository.findAllFlat();
    }
    async getCategoryById(id) {
        const category = await categoryRepository.findById(id);
        if (!category)
            throw new Error('Category not found');
        return category;
    }
    async updateCategory(id, data) {
        if (data.name) {
            data.slug = (0, slugify_1.default)(data.name, { lower: true });
        }
        return categoryRepository.update(id, data);
    }
    async deleteCategory(id) {
        // Check if it has children first 
        const category = await categoryRepository.findById(id);
        if (category && category.children && category.children.length > 0) {
            throw new Error('Cannot delete category with children');
        }
        return categoryRepository.delete(id);
    }
}
exports.CategoryService = CategoryService;
