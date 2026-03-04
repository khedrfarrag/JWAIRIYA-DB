"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRepository = void 0;
const database_1 = __importDefault(require("../config/database"));
class AuthRepository {
    async createUser(data) {
        return database_1.default.user.create({ data });
    }
    async findByEmail(email) {
        return database_1.default.user.findUnique({ where: { email } });
    }
    async findById(id) {
        return database_1.default.user.findUnique({ where: { id } });
    }
}
exports.AuthRepository = AuthRepository;
