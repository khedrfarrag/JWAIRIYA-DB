"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
// In Prisma 7, the client can be initialized with the datasource URL from environment variables
const prisma = new client_1.PrismaClient();
exports.default = prisma;
