import { Bill } from '@prisma/client';
import { EBillType } from 'src/modules/bill/bill.enum';

const bills: Bill[] = [
  {
    id: 'B_1',
    type: EBillType.BILL,
    cost: 60,
    isDelete: false,
    userId: 'US_1',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'B_2',
    type: EBillType.RENT,
    cost: 55,
    isDelete: false,
    userId: 'US_1',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export default bills;
