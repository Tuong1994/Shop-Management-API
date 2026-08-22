import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryDto } from 'src/common/dto/query.dto';
import { Bill } from '@prisma/client';
import { BillDto } from './bill.dto';
import responseMessage from 'src/common/message';
import utils from 'src/utils';

const { UPDATE_SUCCESS, REMOVE_SUCCESS, NOT_FOUND, NO_DATA_RESTORE, RESTORE_SUCCESS } = responseMessage;

@Injectable()
export class BillService {
  constructor(private prisma: PrismaService) {}

  private isNotDelete = { equals: false };

  async getBills(query: QueryDto) {
    const { sortBy } = query;
    const bills = await this.prisma.bill.findMany({
      where: { isDelete: this.isNotDelete },
      orderBy: [{ updatedAt: utils.getSortBy(sortBy) ?? 'desc' }],
    });
    return { totalItems: bills.length, items: bills };
  }

  async getBillsPaging(query: QueryDto) {
    const { page, limit, sortBy } = query;
    const bills = await this.prisma.bill.findMany({
      where: { isDelete: this.isNotDelete },
      orderBy: [{ updatedAt: utils.getSortBy(sortBy) ?? 'desc' }],
    });
    const collection = utils.paging<Bill>(bills, page, limit);
    return collection;
  }

  async getBill(query: QueryDto) {
    const { billId } = query;
    const bill = await this.prisma.bill.findUnique({ where: { id: billId, isDelete: this.isNotDelete } });
    if (!bill) throw new HttpException(NOT_FOUND, HttpStatus.NOT_FOUND);
    return bill;
  }

  async createBill(bill: BillDto) {
    const { type, cost, userId } = bill;
    const newBill = await this.prisma.bill.create({ data: { type, cost, userId, isDelete: false } });
    return newBill;
  }

  async updateBill(query: QueryDto, bill: BillDto) {
    const { billId } = query;
    const { type, cost, userId } = bill;
    await this.prisma.bill.update({ where: { id: billId }, data: { type, cost, userId } });
    throw new HttpException(UPDATE_SUCCESS, HttpStatus.OK);
  }

  async removeBills(query: QueryDto) {
    const { ids } = query;
    const listIds = ids.split(',');
    const bills = await this.prisma.bill.findMany({ where: { id: { in: listIds }, isDelete: this.isNotDelete } });
    if (bills && !bills.length) throw new HttpException(NOT_FOUND, HttpStatus.NOT_FOUND);
    await this.prisma.bill.updateMany({ where: { id: { in: listIds } }, data: { isDelete: true } });
    throw new HttpException(REMOVE_SUCCESS, HttpStatus.OK);
  }

  async removeBillsPermenant(query: QueryDto) {
    const { ids } = query;
    const listIds = ids.split(',');
    const bills = await this.prisma.bill.findMany({ where: { id: { in: listIds }, isDelete: this.isNotDelete } });
    if (bills && !bills.length) throw new HttpException(NOT_FOUND, HttpStatus.NOT_FOUND);
    await this.prisma.bill.deleteMany({ where: { id: { in: listIds } } });
    throw new HttpException(REMOVE_SUCCESS, HttpStatus.OK);
  }

  async restoreBills() {
    const bills = await this.prisma.bill.findMany({ where: { isDelete: { equals: true } } });
    if (bills && !bills.length) throw new HttpException(NO_DATA_RESTORE, HttpStatus.OK);
    await Promise.all(
      bills.map(async (bill) => {
        await this.prisma.bill.update({ where: { id: bill.id }, data: { isDelete: false } });
      }),
    );
    throw new HttpException(RESTORE_SUCCESS, HttpStatus.OK);
  }
}
