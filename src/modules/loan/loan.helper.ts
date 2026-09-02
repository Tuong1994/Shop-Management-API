import { Injectable } from '@nestjs/common';
import { LoanDto } from './loan.dto';
import { Loan, UserLoan } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LoanHelper {
  constructor(private prisma: PrismaService) {}

  calculatePayment(loan: LoanDto) {
    const { cost, interest, termLength } = loan;
    const totalReturn = cost * (1 + interest);
    const payment = totalReturn / termLength;
    return { payment, totalReturn };
  }

  async handleUpdateIsDeleteLoan(loans: Loan[], isDelete: boolean) {
    await Promise.all(
      loans.map(async (loan) => await this.prisma.loan.update({ where: { id: loan.id }, data: { isDelete } })),
    );
  }

  async handleUpdateIsDeleteUserLoan(userLoans: UserLoan[], isDelete: boolean) {
    await Promise.all(
      userLoans.map(async (loan) => await this.prisma.userLoan.update({ where: { id: loan.id }, data: { isDelete } })),
    );
  }
}
