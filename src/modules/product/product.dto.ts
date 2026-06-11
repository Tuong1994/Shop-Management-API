import { IsNotEmpty } from 'class-validator';
import { EProductDisplay, EStorageStatus } from './product.enum';
import { ERecordStatus } from 'src/common/enum/base';

export class ProductDto {
  @IsNotEmpty()
  nameEn: string;

  @IsNotEmpty()
  nameVn: string;

  @IsNotEmpty()
  unit: number;

  @IsNotEmpty()
  display: EProductDisplay;

  @IsNotEmpty()
  cost: number;

  @IsNotEmpty()
  price: number;

  @IsNotEmpty()
  status: ERecordStatus;

  @IsNotEmpty()
  items: number;

  @IsNotEmpty()
  boxes: number;

  @IsNotEmpty()
  amount: number;

  @IsNotEmpty()
  storageStatus: EStorageStatus;

  @IsNotEmpty()
  supplier: string;

  @IsNotEmpty()
  categoryId: string;
}
