import { Prisma } from "@prisma/client";

export type ProductWithImage = Prisma.ProductGetPayload<{
    select: {id: true, image: true}
}>