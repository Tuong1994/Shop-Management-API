import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryDto } from 'src/common/dto/query.dto';
import { GrowthDto, UserGrowthDto } from './growth.dto';
import { GrowthHelper } from './growth.helper';
import responseMessage from 'src/common/message';

const { NOT_FOUND, UPDATE_SUCCESS, REMOVE_SUCCESS, NO_DATA_RESTORE, RESTORE_SUCCESS } = responseMessage;

@Injectable()
export class GrowthService {
  constructor(
    private prisma: PrismaService,
    private growthHelper: GrowthHelper,
  ) {}

  private isNotDelete = { equals: false };

  async getGrowths(query: QueryDto) {
    const {} = query;
    const growths = await this.prisma.growth.findMany({
      where: { isDelete: this.isNotDelete },
    });
    return { totalItems: growths.length, items: growths };
  }

  async getGrowth(query: QueryDto) {
    const { growthId } = query;
    const growth = await this.prisma.growth.findUnique({ where: { id: growthId, isDelete: this.isNotDelete } });
    if (!growth) throw new HttpException(NOT_FOUND, HttpStatus.NOT_FOUND);
    return growth;
  }

  async createGrowth(growth: GrowthDto) {
    const { name, cost, order } = growth;
    const isExist = await this.growthHelper.checkOrderUnique(order);
    if (isExist) throw new HttpException('Order number must be unique', HttpStatus.BAD_REQUEST);
    const newGrowth = await this.prisma.growth.create({ data: { name, cost, order, isDelete: false } });
    return newGrowth;
  }

  async createUserGrowth(userGrowth: UserGrowthDto) {
    const { userId, growthId } = userGrowth;
  }

  async updateGrowth(query: QueryDto, growth: GrowthDto) {
    const { growthId } = query;
    const { name, cost, order } = growth;
    const isExist = await this.growthHelper.checkOrderUnique(order);
    if (isExist) throw new HttpException('Order number must be unique', HttpStatus.BAD_REQUEST);
    await this.prisma.growth.update({ where: { id: growthId }, data: { name, cost, order } });
    throw new HttpException(UPDATE_SUCCESS, HttpStatus.OK);
  }

  async removeGrowths(query: QueryDto) {
    const { ids } = query;
    const listIds = ids.split(',');
    const growths = await this.prisma.growth.findMany({ where: { id: { in: listIds }, isDelete: this.isNotDelete } });
    if (growths && !growths.length) throw new HttpException(NOT_FOUND, HttpStatus.NOT_FOUND);
    await this.prisma.growth.updateMany({ where: { id: { in: listIds } }, data: { isDelete: true } });
    throw new HttpException(REMOVE_SUCCESS, HttpStatus.OK);
  }

  async removeGrowthsPermanent(query: QueryDto) {
    const { ids } = query;
    const listIds = ids.split(',');
    const growths = await this.prisma.growth.findMany({ where: { id: { in: listIds }, isDelete: this.isNotDelete } });
    if (growths && !growths.length) throw new HttpException(NOT_FOUND, HttpStatus.NOT_FOUND);
    await this.prisma.growth.deleteMany({ where: { id: { in: listIds } } });
    throw new HttpException(REMOVE_SUCCESS, HttpStatus.OK);
  }

  async restoreGrowths() {
    const growths = await this.prisma.growth.findMany({ where: { isDelete: { equals: true } } });
    if (growths && !growths.length) throw new HttpException(NO_DATA_RESTORE, HttpStatus.OK);
    await Promise.all(
      growths.map(async (growth) => {
        await this.prisma.growth.update({ where: { id: growth.id }, data: { isDelete: false } });
      }),
    );
    throw new HttpException(RESTORE_SUCCESS, HttpStatus.OK);
  }
}
