import { IsNotEmpty } from 'class-validator';
import { EBillType } from './bill.enum';

export class BillDto {
  @IsNotEmpty()
  type: EBillType;

  @IsNotEmpty()
  cost: number;

  @IsNotEmpty()
  userId: string;
}
