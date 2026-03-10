"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma = new client_1.PrismaClient();
async function main() {
    const adminEmail = 'admin@jwairia.com';
    const existingAdmin = await prisma.user.findUnique({
        where: { email: adminEmail },
    });
    if (existingAdmin) {
        console.log('Admin user already exists.');
        return;
    }
    const hashedPassword = await bcrypt_1.default.hash('admin123', 10);
    await prisma.user.create({
        data: {
            email: adminEmail,
            password: hashedPassword,
            name: 'Super Admin',
            role: 'ADMIN',
        },
    });
    console.log('Admin user created successfully:');
    console.log('Email: admin@jwairia.com');
    console.log('Password: admin123');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
