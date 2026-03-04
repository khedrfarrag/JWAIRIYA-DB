import { PrismaClient } from '@prisma/client';

// In Prisma 7, the client can be initialized with the datasource URL from environment variables
const prisma = new PrismaClient();

export default prisma;
