import { PrismaClient } from '@prisma/client';

// PrismaClient es adjuntado al objeto global en entornos de desarrollo para prevenir
// múltiples instancias del cliente Prisma en hot-reloading
declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}
