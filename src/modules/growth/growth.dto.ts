import { IsNotEmpty, IsNumber } from 'class-validator';

export class GrowthDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  cost: number;

  @IsNotEmpty()
  @IsNumber()
  order: number;
}

export class UserGrowthDto {
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  growthId: string;
}
