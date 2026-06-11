import { Prisma } from '@prisma/client';

export type CategoryWithImage = Prisma.CategoryGetPayload<{
  select: { id: true; image: true };
}>;
