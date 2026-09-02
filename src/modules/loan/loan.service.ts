import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryDto } from 'src/common/dto/query.dto';
import { LoanDto, UserLoanDto } from './loan.dto';
import { LoanHelper } from './loan.helper';
import { ELoanStatus } from './loan.enum';
import responseMessage from 'src/common/message';
import utils from 'src/utils';

const { UPDATE_SUCCESS, REMOVE_SUCCESS, NOT_FOUND, NO_DATA_RESTORE, RESTORE_SUCCESS } = responseMessage;

@Injectable()
export class LoanService {
  constructor(
    private prisma: PrismaService,
    private loanHelper: LoanHelper,
  ) {}

  private isNotDelete = { equals: false };

  async getLoans(query: QueryDto) {
    const { sortBy } = query;
    const loans = await this.prisma.loan.findMany({
      where: { isDelete: this.isNotDelete },
      orderBy: [{ updatedAt: utils.getSortBy(sortBy) ?? 'desc' }],
    });
    return { totalItems: loans.length, items: loans };
  }

  async getUserLoans(query: QueryDto) {
    const { sortBy } = query;
    const userLoans = await this.prisma.userLoan.findMany({
      where: { isDelete: this.isNotDelete },
      orderBy: [{ updatedAt: utils.getSortBy(sortBy) ?? 'desc' }],
    });
    return { totalItems: userLoans.length, items: userLoans };
  }

  async getLoan(query: QueryDto) {
    const { loanId } = query;
    const loan = await this.prisma.loan.findUnique({ where: { id: loanId } });
    return loan;
  }

  async createLoan(loan: LoanDto) {
    const { type, cost, interest, termLength } = loan;
    const { payment, totalReturn } = this.loanHelper.calculatePayment(loan);
    const newLoan = await this.prisma.loan.create({
      data: { type, cost, interest, termLength, payment, totalReturn, isDelete: false },
    });
    return newLoan;
  }

  async createUserLoan(userLoan: UserLoanDto) {
    const { userId, loanId, termLength } = userLoan;
    const loan = await this.prisma.loan.findUnique({ where: { id: loanId, isDelete: this.isNotDelete } });
    if (!loan) throw new HttpException(NOT_FOUND, HttpStatus.NOT_FOUND);
    const newUserLoan = await this.prisma.userLoan.create({
      data: {
        userId,
        loanId,
        lateFee: 0,
        status: ELoanStatus.NOT_PAID,
        payment: loan.payment,
        dueDate: utils.setDatePlus(termLength),
        isDelete: false,
      },
    });
    return newUserLoan;
  }

  async payLoan(query: QueryDto) {
    const { userLoanId } = query;
    await this.prisma.userLoan.update({ where: { id: userLoanId }, data: { status: ELoanStatus.PAID } });
    throw new HttpException(UPDATE_SUCCESS, HttpStatus.OK);
  }

  async updateLoan(query: QueryDto, loan: LoanDto) {
    const { loanId } = query;
    const { type, cost, interest, termLength } = loan;
    const { payment, totalReturn } = this.loanHelper.calculatePayment(loan);
    await this.prisma.loan.update({
      where: { id: loanId },
      data: { type, cost, interest, termLength, payment, totalReturn },
    });
    throw new HttpException(UPDATE_SUCCESS, HttpStatus.OK);
  }

  async removeLoans(query: QueryDto) {
    const { ids } = query;
    const listIds = ids.split(',');
    const loans = await this.prisma.loan.findMany({ where: { id: { in: listIds }, isDelete: this.isNotDelete } });
    if (loans && !loans.length) throw new HttpException(NOT_FOUND, HttpStatus.NOT_FOUND);
    await this.loanHelper.handleUpdateIsDeleteLoan(loans, true);
    throw new HttpException(REMOVE_SUCCESS, HttpStatus.OK);
  }

  async removeUserLoans(query: QueryDto) {
    const { ids } = query;
    const listIds = ids.split(',');
    const userLoans = await this.prisma.userLoan.findMany({
      where: { id: { in: listIds }, isDelete: this.isNotDelete },
    });
    if (userLoans && !userLoans.length) throw new HttpException(NOT_FOUND, HttpStatus.NOT_FOUND);
    await this.loanHelper.handleUpdateIsDeleteUserLoan(userLoans, true);
    throw new HttpException(REMOVE_SUCCESS, HttpStatus.OK);
  }

  async removeLoansPermenant(query: QueryDto) {
    const { ids } = query;
    const listIds = ids.split(',');
    const loans = await this.prisma.loan.findMany({ where: { id: { in: listIds }, isDelete: this.isNotDelete } });
    if (loans && !loans.length) throw new HttpException(NOT_FOUND, HttpStatus.NOT_FOUND);
    await this.prisma.loan.deleteMany({ where: { id: { in: listIds } } });
    throw new HttpException(REMOVE_SUCCESS, HttpStatus.OK);
  }

  async removeUserLoansPermenant(query: QueryDto) {
    const { ids } = query;
    const listIds = ids.split(',');
    const userLoans = await this.prisma.userLoan.findMany({
      where: { id: { in: listIds }, isDelete: this.isNotDelete },
    });
    if (userLoans && !userLoans.length) throw new HttpException(NOT_FOUND, HttpStatus.NOT_FOUND);
    await this.prisma.userLoan.deleteMany({ where: { id: { in: listIds } } });
    throw new HttpException(REMOVE_SUCCESS, HttpStatus.OK);
  }

  async restoreLoans() {
    const loans = await this.prisma.loan.findMany({ where: { isDelete: { equals: true } } });
    if (loans && !loans.length) throw new HttpException(NO_DATA_RESTORE, HttpStatus.OK);
    await this.loanHelper.handleUpdateIsDeleteLoan(loans, false);
    throw new HttpException(RESTORE_SUCCESS, HttpStatus.OK);
  }

  async restoreUserLoans() {
    const userLoans = await this.prisma.userLoan.findMany({ where: { isDelete: { equals: true } } });
    if (userLoans && !userLoans.length) throw new HttpException(NO_DATA_RESTORE, HttpStatus.OK);
    await this.loanHelper.handleUpdateIsDeleteUserLoan(userLoans, false);
    throw new HttpException(RESTORE_SUCCESS, HttpStatus.OK);
  }
}
