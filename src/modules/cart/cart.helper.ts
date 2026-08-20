import { Injectable } from '@nestjs/common';
import { ELang } from 'src/common/enum/base';

@Injectable()
export class CartHelper {
  getSelectFields(locale: ELang) {
    return {
      id: true,
      quantity: true,
      productId: true,
      product: {
        select: {
          id: true,
          nameEn: locale === ELang.EN,
          nameVn: locale === ELang.VN,
          image: true,
          totalPrice: true,
        },
      },
    };
  }
}
