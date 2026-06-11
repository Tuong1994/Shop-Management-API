import { Injectable } from '@nestjs/common';
import { Prisma, Ward } from '@prisma/client';
import { ELang } from 'src/common/enum/base';
import utils from 'src/utils';

@Injectable()
export class WardHelper {
  getSelectFields(locale: ELang): Prisma.WardSelect {
    return {
      id: true,
      nameEn: locale === ELang.EN,
      nameVn: locale === ELang.VN,
      code: true,
      districtCode: true,
      isDelete: true,
      createdAt: true,
      updatedAt: true,
    };
  }

  convertCollection(wards: Ward[], locale: ELang) {
    return wards.map((ward) => ({
      ...utils.convertRecordsName<Ward>(ward, locale),
    }));
  }
}
