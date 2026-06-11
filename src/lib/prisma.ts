import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '@prisma/client';

// 2. Wrap the pool in the Prisma adapter
const adapter = new PrismaMariaDb({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'ProPhet@1994',
  database: 'shop-management',
  connectionLimit: 5
});

// 3. Pass the adapter to the Prisma Client
export const prisma = new PrismaClient({ adapter });

