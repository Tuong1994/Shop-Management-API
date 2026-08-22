import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GrowthWithPurchase } from './growth.type';

@Injectable()
export class GrowthHelper {
  constructor(private prisma: PrismaService) {}

  async checkOrderUnique(order: number) {
    const growth = await this.prisma.growth.findUnique({ where: { order } });
    if (growth) return true;
    return false;
  }

  async handleUpdateIsDelete(growths: GrowthWithPurchase[], isDelete: boolean) {
    await Promise.all(
      growths.map(async (growth) => {
        await this.prisma.growth.update({ where: { id: growth.id }, data: { isDelete } });
        if (growth.purchases && growth.purchases.length > 0)
          await Promise.all(
            growth.purchases.map(async (purchase) => {
              await this.prisma.userGrowth.update({ where: { id: purchase.id }, data: { isDelete } });
            }),
          );
      }),
    );
  }
}
