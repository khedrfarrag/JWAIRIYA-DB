"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const auth_repository_1 = require("../repositories/auth.repository");
const jwt_1 = require("../utils/jwt");
const authRepository = new auth_repository_1.AuthRepository();
class AuthService {
    async register(data) {
        const existingUser = await authRepository.findByEmail(data.email);
        if (existingUser)
            throw new Error('User already exists');
        const hashedPassword = await bcrypt_1.default.hash(data.password, 10);
        const user = await authRepository.createUser({
            ...data,
            password: hashedPassword,
        });
        const accessToken = (0, jwt_1.generateAccessToken)({ id: user.id, role: user.role });
        const refreshToken = (0, jwt_1.generateRefreshToken)({ id: user.id });
        return { user, accessToken, refreshToken };
    }
    async login(data) {
        const user = await authRepository.findByEmail(data.email);
        if (!user)
            throw new Error('Invalid credentials');
        const isMatch = await bcrypt_1.default.compare(data.password, user.password);
        if (!isMatch)
            throw new Error('Invalid credentials');
        const accessToken = (0, jwt_1.generateAccessToken)({ id: user.id, role: user.role });
        const refreshToken = (0, jwt_1.generateRefreshToken)({ id: user.id });
        return { user, accessToken, refreshToken };
    }
}
exports.AuthService = AuthService;
