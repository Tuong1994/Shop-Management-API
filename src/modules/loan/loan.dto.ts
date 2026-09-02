import { IsNotEmpty, IsNumber } from 'class-validator';
import { ELoanType } from './loan.enum';

export class LoanDto {
  @IsNotEmpty()
  @IsNumber()
  type: ELoanType;

  @IsNotEmpty()
  @IsNumber()
  cost: number;

  @IsNotEmpty()
  @IsNumber()
  interest: number;

  @IsNotEmpty()
  @IsNumber()
  termLength: number;
}

export class UserLoanDto {
  @IsNotEmpty()
  @IsNumber()
  termLength: number

  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  loanId: string;
}
