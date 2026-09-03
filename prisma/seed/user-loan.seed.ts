import { UserLoan } from '@prisma/client';
import { ELoanStatus } from 'src/modules/loan/loan.enum';
import utils from 'src/utils';

const userLoans: UserLoan[] = [
  {
    id: 'UL_1',
    payment: 57.5,
    lateFee: 0,
    dueDate: utils.setDatePlus(15),
    userId: 'US_1',
    loanId: 'L_1',
    status: ELoanStatus.NOT_PAID,
    isDelete: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export default userLoans;
