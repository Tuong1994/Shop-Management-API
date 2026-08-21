import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GrowthHelper {
  constructor(private prisma: PrismaService) {}

  async checkOrderUnique(order: number) {
    const growth = await this.prisma.growth.findUnique({ where: { order } });
    if (growth) return true;
    return false;
  }
}
