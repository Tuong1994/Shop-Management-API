import { ELang } from '../enum/base';
import { EGender, ERole } from 'src/modules/user/user.enum';

export class QueryDto {
  page?: string;
  limit?: string;
  keywords?: string;
  sortBy?: number;

  ids?: string;
  userId?: string;
  categoryId?: string;
  productId?: string;
  cartId?: string;
  cartItemId?: string;
  imageId?: string;
  cityId?: string;
  districtId?: string;
  wardId?: string;
  supplier?: string;

  cityCode?: number;
  districtCode?: number;
  unit?: number;
  display?: number;
  price?: number;
  status?: number;
  storageStatus?: number;

  admin?: boolean;

  role?: ERole;
  gender?: EGender;
  locale?: ELang;
}
