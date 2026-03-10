"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const user_repository_1 = require("../repositories/user.repository");
const userRepository = new user_repository_1.UserRepository();
class UserService {
    async getVerifiedUsers() {
        const users = await userRepository.findMany({ isVerified: true });
        return users.map(user => this.sanitizeUser(user));
    }
    async getUnverifiedUsers() {
        const users = await userRepository.findMany({ isVerified: false });
        return users.map(user => this.sanitizeUser(user));
    }
    async getUserById(id) {
        const user = await userRepository.findById(id);
        if (!user)
            throw new Error('User not found');
        return this.sanitizeUser(user);
    }
    sanitizeUser(user) {
        const { password, otp, otpExpires, passwordResetToken, passwordResetExpires, ...safeUser } = user;
        return safeUser;
    }
}
exports.UserService = UserService;
