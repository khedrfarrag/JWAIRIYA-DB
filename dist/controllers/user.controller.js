"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const user_service_1 = require("../services/user.service");
const userService = new user_service_1.UserService();
class UserController {
    async getVerifiedUsers(req, res, next) {
        try {
            const users = await userService.getVerifiedUsers();
            res.status(200).json({
                status: 'success',
                results: users.length,
                data: { users },
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getUnverifiedUsers(req, res, next) {
        try {
            const users = await userService.getUnverifiedUsers();
            res.status(200).json({
                status: 'success',
                results: users.length,
                data: { users },
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getUserById(req, res, next) {
        try {
            const user = await userService.getUserById(req.params.id);
            res.status(200).json({
                status: 'success',
                data: { user },
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.UserController = UserController;
