"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const database_1 = __importDefault(require("../config/database"));
class UserRepository {
    async findMany(filters) {
        return database_1.default.user.findMany({
            where: filters,
            orderBy: { createdAt: 'desc' },
        });
    }
    async findById(id) {
        return database_1.default.user.findUnique({ where: { id } });
    }
    async update(id, data) {
        return database_1.default.user.update({
            where: { id },
            data,
        });
    }
    async delete(id) {
        return database_1.default.user.delete({ where: { id } });
    }
}
exports.UserRepository = UserRepository;
