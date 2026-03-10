"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const auth_repository_1 = require("../repositories/auth.repository");
const jwt_1 = require("../utils/jwt");
const mail_service_1 = require("./mail.service");
const crypto_1 = require("../utils/crypto");
const google_auth_library_1 = require("google-auth-library");
const authRepository = new auth_repository_1.AuthRepository();
const mailService = new mail_service_1.MailService();
const googleClient = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID);
class AuthService {
    async googleAuth(idToken) {
        try {
            const ticket = await googleClient.verifyIdToken({
                idToken,
                audience: process.env.GOOGLE_CLIENT_ID,
            });
            const payload = ticket.getPayload();
            if (!payload || !payload.email)
                throw new Error('Invalid Google Token');
            const { email, name, sub: googleId } = payload;
            let user = await authRepository.findByEmail(email);
            if (user) {
                // If user exists but no googleId (normal register), link them
                if (!user.googleId) {
                    user = await authRepository.updateUser(user.id, {
                        googleId,
                        isVerified: true, // Link account automatically verifies if not already
                    });
                }
            }
            else {
                // Create new user via Google
                // We'll give them a random password since they use Google
                const randomPassword = await bcrypt_1.default.hash((0, crypto_1.generateRandomToken)(), 10);
                user = await authRepository.createUser({
                    email,
                    name: name || email.split('@')[0],
                    password: randomPassword,
                    googleId,
                    isVerified: true,
                });
            }
            const accessToken = (0, jwt_1.generateAccessToken)({ id: user.id, role: user.role });
            const refreshToken = (0, jwt_1.generateRefreshToken)({ id: user.id });
            return { user: this.sanitizeUser(user), accessToken, refreshToken };
        }
        catch (error) {
            console.error('Google Auth Error:', error);
            throw new Error('Authentication with Google failed');
        }
    }
    async register(data) {
        const existingUser = await authRepository.findByEmail(data.email);
        if (existingUser)
            throw new Error('User already exists');
        const hashedPassword = await bcrypt_1.default.hash(data.password, 10);
        const otp = (0, crypto_1.generateOTP)();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins
        const { confirmPassword, ...userData } = data;
        const user = await authRepository.createUser({
            ...userData,
            password: hashedPassword,
            otp,
            otpExpires,
        });
        await mailService.sendOTP(user.email, otp);
        const accessToken = (0, jwt_1.generateAccessToken)({ id: user.id, role: user.role });
        const refreshToken = (0, jwt_1.generateRefreshToken)({ id: user.id });
        return { user: this.sanitizeUser(user), accessToken, refreshToken };
    }
    async login(data) {
        const user = await authRepository.findByEmail(data.email);
        if (!user)
            throw new Error('Invalid credentials');
        const isMatch = await bcrypt_1.default.compare(data.password, user.password);
        if (!isMatch)
            throw new Error('Invalid credentials');
        if (!user.isVerified)
            throw new Error('Email not verified');
        const accessToken = (0, jwt_1.generateAccessToken)({ id: user.id, role: user.role });
        const refreshToken = (0, jwt_1.generateRefreshToken)({ id: user.id });
        return { user: this.sanitizeUser(user), accessToken, refreshToken };
    }
    sanitizeUser(user) {
        const { password, otp, otpExpires, passwordResetToken, passwordResetExpires, ...safeUser } = user;
        return safeUser;
    }
    async refresh(token) {
        try {
            const decoded = (0, jwt_1.verifyRefreshToken)(token);
            const user = await authRepository.findById(decoded.id);
            if (!user)
                throw new Error('User not found');
            const accessToken = (0, jwt_1.generateAccessToken)({ id: user.id, role: user.role });
            return { accessToken };
        }
        catch (error) {
            throw new Error('Invalid refresh token');
        }
    }
    async forgotPassword(email) {
        const user = await authRepository.findByEmail(email);
        if (!user)
            throw new Error('User not found');
        const token = (0, crypto_1.generateRandomToken)();
        const expires = new Date(Date.now() + 3600000); // 1 hour
        await authRepository.updateUser(user.id, {
            passwordResetToken: token,
            passwordResetExpires: expires,
        });
        await mailService.sendResetLink(email, token);
    }
    async resetPassword(data) {
        const { token, password } = data;
        const user = await authRepository.findByResetToken(token);
        if (!user)
            throw new Error('Invalid or expired reset token');
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        await authRepository.updateUser(user.id, {
            password: hashedPassword,
            passwordResetToken: null,
            passwordResetExpires: null,
        });
    }
    async verifyOtp(email, otp) {
        const user = await authRepository.findByEmail(email);
        if (!user)
            throw new Error('User not found');
        if (user.otp !== otp || (user.otpExpires && user.otpExpires < new Date())) {
            throw new Error('Invalid or expired OTP');
        }
        await authRepository.updateUser(user.id, {
            isVerified: true,
            otp: null,
            otpExpires: null,
        });
    }
    async resendOtp(email) {
        const user = await authRepository.findByEmail(email);
        if (!user)
            throw new Error('User not found');
        if (user.isVerified)
            throw new Error('Account is already verified');
        const otp = (0, crypto_1.generateOTP)();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
        await authRepository.updateUser(user.id, {
            otp,
            otpExpires,
        });
        await mailService.sendOTP(email, otp);
    }
}
exports.AuthService = AuthService;
