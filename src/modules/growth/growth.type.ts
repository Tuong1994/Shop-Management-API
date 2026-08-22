import { Prisma } from '@prisma/client';

export type GrowthWithPurchase = Prisma.GrowthGetPayload<{
  select: { id: true; purchases: true };
}>;
