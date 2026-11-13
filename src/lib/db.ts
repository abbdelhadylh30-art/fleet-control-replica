import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// M5 (2026-09-21): query logging only in development — it is noisy and slow
// in production (every SQL statement serialized to the Vercel log drain).
// Sandbox adaptation: query logging off even in dev — this dev.log is the
// operator's console and full SQL traces drown out request/route lines.
export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['error', 'warn'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
