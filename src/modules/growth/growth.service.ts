import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryDto } from 'src/common/dto/query.dto';
import { GrowthDto, UserGrowthDto } from './growth.dto';
import { GrowthHelper } from './growth.helper';
import { Growth } from '@prisma/client';
import responseMessage from 'src/common/message';
import utils from 'src/utils';

const { NOT_FOUND, CREATE_SUCCESS, UPDATE_SUCCESS, REMOVE_SUCCESS, NO_DATA_RESTORE, RESTORE_SUCCESS } = responseMessage;

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
      include: { purchases: true },
    });
    return { totalItems: growths.length, items: growths };
  }

  async getGrowth(query: QueryDto) {
    const { growthId, locale } = query;
    const growth = await this.prisma.growth.findUnique({
      where: { id: growthId, isDelete: this.isNotDelete },
      include: { purchases: true },
    });
    const convertGrowth = utils.convertRecordsName<Growth>(growth, locale)
    return convertGrowth;
  }

  async createGrowth(growth: GrowthDto) {
    const { nameEn, nameVn, cost, order } = growth;
    const isExist = await this.growthHelper.checkOrderUnique(order);
    if (isExist) throw new HttpException('Order number must be unique', HttpStatus.BAD_REQUEST);
    const newGrowth = await this.prisma.growth.create({ data: { nameEn, nameVn, cost, order, isDelete: false } });
    return newGrowth;
  }

  async purchaseGrowth(userGrowth: UserGrowthDto) {
    const { userId, growthId } = userGrowth;
    const growth = await this.prisma.growth.findUnique({
      where: { id: growthId, isDelete: this.isNotDelete },
      select: { purchases: true },
    });
    if (!growth) throw new HttpException(NOT_FOUND, HttpStatus.NOT_FOUND);
    const isPurchased = growth.purchases.find((purchase) => purchase.userId === userId);
    if (isPurchased) throw new HttpException("You're already purchased this section", HttpStatus.BAD_REQUEST);
    await this.prisma.userGrowth.create({ data: { userId, growthId, isDelete: false } });
    throw new HttpException(CREATE_SUCCESS, HttpStatus.CREATED);
  }

  async updateGrowth(query: QueryDto, growth: GrowthDto) {
    const { growthId } = query;
    const { nameEn, nameVn, cost, order } = growth;
    const isExist = await this.growthHelper.checkOrderUnique(order);
    if (isExist) throw new HttpException('Order number must be unique', HttpStatus.BAD_REQUEST);
    await this.prisma.growth.update({ where: { id: growthId }, data: { nameEn, nameVn, cost, order } });
    throw new HttpException(UPDATE_SUCCESS, HttpStatus.OK);
  }

  async removeGrowths(query: QueryDto) {
    const { ids } = query;
    const listIds = ids.split(',');
    const growths = await this.prisma.growth.findMany({
      where: { id: { in: listIds }, isDelete: this.isNotDelete },
      include: { purchases: true },
    });
    if (growths && !growths.length) throw new HttpException(NOT_FOUND, HttpStatus.NOT_FOUND);
    await this.growthHelper.handleUpdateIsDelete(growths, true);
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
    const growths = await this.prisma.growth.findMany({
      where: { isDelete: { equals: true } },
      include: { purchases: true },
    });
    if (growths && !growths.length) throw new HttpException(NO_DATA_RESTORE, HttpStatus.OK);
    await this.growthHelper.handleUpdateIsDelete(growths, false);
    throw new HttpException(RESTORE_SUCCESS, HttpStatus.OK);
  }
}
