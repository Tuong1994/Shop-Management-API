import { IsNotEmpty, IsOptional } from 'class-validator';
import { EProductDisplay, EProductType, EStorageStatus } from './product.enum';
import { ERecordStatus } from 'src/common/enum/base';

export class ProductDto {
  @IsNotEmpty()
  nameEn: string;

  @IsNotEmpty()
  nameVn: string;

  @IsOptional()
  descriptionEn: string;

  @IsOptional()
  descriptionVn: string;

  @IsOptional()
  unit: number;

  @IsOptional()
  display: EProductDisplay;

  @IsOptional()
  cost: number;

  @IsNotEmpty()
  price: number;

  @IsNotEmpty()
  status: ERecordStatus;

  @IsOptional()
  items: number;

  @IsOptional()
  boxes: number;

  @IsOptional()
  amount: number;

  @IsOptional()
  storageStatus: EStorageStatus;

  @IsNotEmpty()
  type: EProductType;

  @IsOptional()
  supplier: string;

  @IsOptional()
  categoryId: string;
}
