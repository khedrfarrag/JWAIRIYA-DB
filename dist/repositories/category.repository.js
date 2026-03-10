"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryRepository = void 0;
const database_1 = __importDefault(require("../config/database"));
class CategoryRepository {
    async create(data) {
        return database_1.default.category.create({ data });
    }
    async findMany(filters = {}) {
        return database_1.default.category.findMany({
            where: filters,
            include: {
                children: {
                    include: {
                        children: true, // Support up to 3 levels in the tree
                    }
                },
            },
            orderBy: { name: 'asc' },
        });
    }
    async findAllFlat() {
        return database_1.default.category.findMany({
            orderBy: { name: 'asc' },
        });
    }
    async findById(id) {
        return database_1.default.category.findUnique({
            where: { id },
            include: {
                children: true,
                parent: true,
            },
        });
    }
    async findBySlug(slug) {
        return database_1.default.category.findUnique({ where: { slug } });
    }
    async update(id, data) {
        return database_1.default.category.update({
            where: { id },
            data,
        });
    }
    async delete(id) {
        return database_1.default.category.delete({ where: { id } });
    }
}
exports.CategoryRepository = CategoryRepository;
